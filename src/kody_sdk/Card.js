import {
  Axis as BabylonAxis,
  Color3 as BabylonColor3,
  MeshBuilder as BabylonMeshBuilder,
  StandardMaterial as BabylonStandardMaterial,
} from "babylonjs";
import { MeshWriter } from "meshwriter";
import { config } from "./config.json";
import { addItem, makeHole, removeItem } from "./utils";

export default class Card {
  constructor(name, code, color, pos) {
    this.name = name;
    this.code = code;
    this.color = color;
    this.pos = pos;
    this.material = new BabylonStandardMaterial("std", this.scene);
    this.material.diffuseColor = BabylonColor3.FromHexString(color);
  }

  render() {
    this.generateBase();
    // bottom left
    this.poleHole(config.bracket.size / 2, config.bracket.size / 2);
    // bottom right
    this.poleHole(
      config.card.width - config.bracket.size / 2 - config.bracket.size,
      config.bracket.size / 2
    );
    // top left
    this.poleHole(
      config.bracket.size / 2,
      config.card.height - config.bracket.size * 2 - config.bracket.size / 2
    );
    // top right
    this.poleHole(
      config.card.width - config.bracket.size / 2 - config.bracket.size,
      config.card.height - 3 * config.text.block.size - config.bracket.size
    );
    this.textAreas();
    this.codeHoles();
    this.cardText();
    this.kodyText();
    this.position();
  }

  generateBase() {
    this.mesh = BabylonMeshBuilder.CreateBox("card", {
      width: config.card.width,
      height: config.card.height,
      depth: config.card.depth,
    });
    this.mesh.position.x = config.card.width / 2;
    this.mesh.position.y = config.card.height / 2;
    this.mesh.position.z = config.card.depth / 2;
  }

  position() {
    this.mesh.material = this.material;
    this.mesh.translate(BabylonAxis.X, -config.card.width / 2);
    this.mesh.translate(BabylonAxis.Y, -config.card.height / 2);
    this.mesh.translate(
      BabylonAxis.Z,
      2 + this.pos * (config.card.depth + config.print.tolerance.z)
    );
  }

  poleHole(x, y) {
    this.mesh = makeHole(
      this.mesh,
      x,
      y,
      0,
      config.bracket.size,
      config.bracket.size,
      config.card.depth
    );
  }

  textAreas() {
    const textarea_width =
      config.card.width -
      2 *
        (config.bracket.size +
          config.bracket.size / 2 +
          2 * config.text.block.size);
    const textarea_height = config.bracket.size * 2;
    // bottom
    this.mesh = makeHole(
      this.mesh,
      (config.card.width - textarea_width) / 2,
      config.bracket.size / 2,
      config.card.depth / 2,
      textarea_width,
      config.bracket.size,
      config.card.depth / 2
    );
    // top
    this.mesh = makeHole(
      this.mesh,
      (config.card.width - textarea_width) / 2,
      config.card.height - config.bracket.size / 2 - textarea_height,
      config.card.depth / 2,
      textarea_width,
      config.bracket.size * 2,
      config.card.depth / 2
    );
  }

  codeHoles() {
    let y = 0;
    let codeMesh = BabylonMeshBuilder.CreateBox("chole");
    let maxX = 0;
    this.code.forEach((line) => {
      let cols = line.split("");
      let x = 0;
      for (let b of cols) {
        if (b == " ")
          codeMesh = addItem(
            codeMesh,
            BabylonMeshBuilder.CreateBox("hole", {
              width: config.code.hole.size,
              height: config.code.hole.size,
              depth: config.card.depth,
            }),
            x,
            y,
            0
          );
        x += config.code.hole.size + config.text.block.size;
        if (maxX < x) maxX = x;
      }
      y -= config.code.hole.size + config.text.block.size;
    });

    codeMesh.position.x = (config.card.width - maxX + config.bracket.size) / 2;
    codeMesh.position.y = (config.card.height - y) / 2 - config.bracket.size;
    codeMesh.position.z = config.card.depth / 2;

    this.mesh = removeItem(this.mesh, codeMesh);
  }

  kodyText() {
    let kody = config.kody.code;
    let kw = kody[0].length;
    let kh = kody.length;
    let kz = config.card.depth / 2;
    let kb = BabylonMeshBuilder.CreateBox("k", {
      width: kw,
      height: kh,
      depth: kz,
    });
    kb.position.x = kw / 2;
    kb.position.y = kh / 2;
    kb.position.z = kz / 2;
    let _y = 0;
    kody.forEach((row) => {
      let _x = 0;
      row.forEach((col) => {
        if (!col)
          kb = makeHole(
            kb,
            _x,
            kh - _y - config.text.block.size,
            0,
            config.text.block.size,
            config.text.block.size,
            kz
          );
        _x++;
      });
      _y++;
    });
    this.mesh = addItem(
      this.mesh,
      kb,
      (config.card.width - kw) / 2,
      config.bracket.size / 2 + (config.bracket.size - kh) / 2,
      config.card.depth / 2
    );
  }

  cardText() {
    const textarea_height = config.bracket.size * 2;
    const Writer = MeshWriter(window.kody.scene, { scale: 1 });
    const text = new Writer(this.name.replace(/_/g, " "), {
      "letter-height": 5,
      "letter-thickness": config.card.depth / 2,
      "font-family": "comic",
    });
    const textMesh = text.getMesh();
    const bb = textMesh.getBoundingInfo().boundingBox.maximumWorld;
    textMesh.rotation.x = -Math.PI / 2;
    this.mesh = addItem(
      this.mesh,
      textMesh,
      (config.card.width - Number(bb.x)) / 2,
      config.card.height -
        config.bracket.size / 2 -
        textarea_height +
        (textarea_height - Number(bb.z)) / 2,
      config.card.depth / 2
    );
  }
}
