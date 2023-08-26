import {
  MeshBuilder as BabylonMeshBuilder,
  CSG as BabylonCSG,
} from "babylonjs";

const _merge = (mesh1, mesh2, type) => {
  const CSG1 = BabylonCSG.FromMesh(mesh1);
  const CSG2 = BabylonCSG.FromMesh(mesh2);
  let pipeCSG;
  if ("sub" == type) pipeCSG = CSG1.subtract(CSG2);
  else if ("add" == type) pipeCSG = CSG1.union(CSG2);
  const mesh = pipeCSG.toMesh("card", null, window.kody.scene);
  mesh1.dispose();
  mesh2.dispose();
  window.kody.scene.removeMesh(mesh1);
  window.kody.scene.removeMesh(mesh2);
  return mesh;
};

export const makeHole = (mesh, x, y, z, width, height, depth) => {
  const hole = BabylonMeshBuilder.CreateBox("hole", {
    width,
    height,
    depth,
  });
  hole.position.x = width / 2 + x;
  hole.position.y = height / 2 + y;
  hole.position.z = depth / 2 + z;
  return _merge(mesh, hole, "sub");
};

export const addItem = (mesh, item, x, y, z) => {
  item.position.x += x;
  item.position.y += y;
  item.position.z += z;
  return _merge(mesh, item, "add");
};
