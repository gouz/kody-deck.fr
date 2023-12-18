import {
  MeshBuilder as BabylonMeshBuilder,
  CSG as BabylonCSG,
  Vector3 as BabylonVector3,
  InstancedMesh as BabylonInstancedMesh,
  VertexBuffer as BabylonVertexBuffer,
  Mesh as BabylonMesh,
} from "babylonjs";

const _merge = (mesh1, mesh2, type) => {
  const CSG1 = BabylonCSG.FromMesh(mesh1);
  const CSG2 = BabylonCSG.FromMesh(mesh2);
  let pipeCSG;
  if ("sub" == type) pipeCSG = CSG1.subtract(CSG2);
  else if ("add" == type) pipeCSG = CSG1.union(CSG2);
  const mesh = pipeCSG.toMesh("merged", mesh1.material, window.kody.scene);
  mesh1.dispose();
  mesh2.dispose();
  window.kody.scene.removeMesh(mesh1);
  window.kody.scene.removeMesh(mesh2);
  return mesh;
};

export const makeBox = (width, height, depth) => {
  const mesh = BabylonMeshBuilder.CreateBox("box", {
    width,
    height,
    depth,
  });
  mesh.position.x = width / 2;
  mesh.position.y = height / 2;
  mesh.position.z = depth / 2;
  return mesh;
};

export const makeHole = (mesh, width, height, depth, x, y, z) => {
  const hole = makeBox(width, height, depth);
  hole.position.x += x;
  hole.position.y += y;
  hole.position.z += z;
  return _merge(mesh, hole, "sub");
};

export const addItem = (mesh, item, x, y, z) => {
  item.position.x += x;
  item.position.y += y;
  item.position.z += z;
  return _merge(mesh, item, "add");
};

export const removeItem = (mesh, item, x, y, z) => {
  item.position.x += x;
  item.position.y += y;
  item.position.z += z;
  return _merge(mesh, item, "sub");
};

// https://github.com/BabylonJS/Babylon.js/blob/master/packages/dev/serializers/src/stl/stlSerializer.ts
export const CreateSTL = (
  mesh,
  download = true,
  fileName = "stlmesh",
  binary = false,
  isLittleEndian = true,
  doNotBakeTransform = false,
  supportInstancedMeshes = false,
  exportIndividualMeshes = false
) => {
  //Binary support adapted from https://gist.github.com/paulkaplan/6d5f0ab2c7e8fdc68a61
  const getFaceData = function (indices, vertices, i) {
    const id = [indices[i] * 3, indices[i + 1] * 3, indices[i + 2] * 3];
    const v = [
      new BabylonVector3(
        vertices[id[0]],
        vertices[id[0] + 2],
        vertices[id[0] + 1]
      ),
      new BabylonVector3(
        vertices[id[1]],
        vertices[id[1] + 2],
        vertices[id[1] + 1]
      ),
      new BabylonVector3(
        vertices[id[2]],
        vertices[id[2] + 2],
        vertices[id[2] + 1]
      ),
    ];
    const p1p2 = v[0].subtract(v[1]);
    const p3p2 = v[2].subtract(v[1]);
    const n = BabylonVector3.Cross(p3p2, p1p2).normalize();

    return { v, n };
  };

  const writeVector = function (dataview, offset, vector, isLittleEndian) {
    offset = writeFloat(dataview, offset, vector.x, isLittleEndian);
    offset = writeFloat(dataview, offset, vector.y, isLittleEndian);
    return writeFloat(dataview, offset, vector.z, isLittleEndian);
  };

  const writeFloat = function (dataview, offset, value, isLittleEndian) {
    dataview.setFloat32(offset, value, isLittleEndian);
    return offset + 4;
  };

  const getVerticesData = function (mesh) {
    if (supportInstancedMeshes) {
      let sourceMesh = mesh;
      if (mesh instanceof BabylonInstancedMesh) {
        sourceMesh = mesh.sourceMesh;
      }
      const data = sourceMesh.getVerticesData(
        BabylonVertexBuffer.PositionKind,
        true,
        true
      );
      if (!data) return [];
      const temp = BabylonVector3.Zero();
      let index;
      for (index = 0; index < data.length; index += 3) {
        BabylonVector3.TransformCoordinatesFromFloatsToRef(
          data[index],
          data[index + 1],
          data[index + 2],
          mesh.computeWorldMatrix(true),
          temp
        ).toArray(data, index);
      }
      return data;
    } else {
      return mesh.getVerticesData(BabylonVertexBuffer.PositionKind) || [];
    }
  };

  if (supportInstancedMeshes) {
    doNotBakeTransform = true;
  }

  let data = "";

  let faceCount = 0;
  let offset = 0;

  if (binary) {
    const indices = mesh.getIndices();
    faceCount += indices ? indices.length / 3 : 0;

    const bufferSize = 84 + 50 * faceCount;
    const buffer = new ArrayBuffer(bufferSize);
    data = new DataView(buffer);

    offset += 80;
    data.setUint32(offset, faceCount, isLittleEndian);
    offset += 4;
  } else {
    if (!exportIndividualMeshes) {
      data = "solid stlmesh\r\n";
    }
  }

  if (!binary && exportIndividualMeshes) {
    data += `solid ${mesh.name}\r\n`;
  }
  if (!doNotBakeTransform && mesh instanceof BabylonMesh) {
    mesh.bakeCurrentTransformIntoVertices();
  }
  const vertices = getVerticesData(mesh);
  const indices = mesh.getIndices() || [];

  for (let i = 0; i < indices.length; i += 3) {
    const fd = getFaceData(indices, vertices, i);

    if (binary) {
      offset = writeVector(data, offset, fd.n, isLittleEndian);
      offset = writeVector(data, offset, fd.v[0], isLittleEndian);
      offset = writeVector(data, offset, fd.v[1], isLittleEndian);
      offset = writeVector(data, offset, fd.v[2], isLittleEndian);
      offset += 2;
    } else {
      data += `\tfacet normal ${fd.n.x} ${fd.n.y} ${fd.n.z}\r\n`;
      data += "\t\touter loop\r\n";
      data += `\t\t\tvertex ${fd.v[0].x} ${fd.v[0].y} ${fd.v[0].z}\r\n`;
      data += `\t\t\tvertex ${fd.v[1].x} ${fd.v[1].y} ${fd.v[1].z}\r\n`;
      data += `\t\t\tvertex ${fd.v[2].x} ${fd.v[2].y} ${fd.v[2].z}\r\n`;
      data += "\t\tendloop\r\n";
      data += "\tendfacet\r\n";
    }
  }
  if (!binary && exportIndividualMeshes) {
    data += `endsolid ${mesh.name}\r\n`;
  }

  if (!binary && !exportIndividualMeshes) {
    data += "endsolid stlmesh";
  }

  if (download) {
    const a = document.createElement("a");
    const blob = new Blob([data], { type: "application/octet-stream" });
    a.href = window.URL.createObjectURL(blob);
    a.download = fileName + ".stl";
    a.click();
  }

  return data;
};
