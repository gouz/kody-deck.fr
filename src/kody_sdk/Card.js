import {
  Axis as BabylonAxis,
  Color3 as BabylonColor3,
  StandardMaterial as BabylonStandardMaterial,
} from "babylonjs";
import { MeshWriter } from "meshwriter";
import { config } from "./config.json";
import { addItem, makeBox, makeHole, removeItem } from "./utils";

export default class Card {
  constructor(name, code, color) {
    this.name = name;
    this.code = code;
    this.color = color;
    this.material = new BabylonStandardMaterial("std", this.scene);
    this.material.diffuseColor = BabylonColor3.FromHexString(color);
  }

  render() {
    this.generateBase();
    this.poleHoles();
    this.textAreas();
    this.codeHoles();
    this.cardText();
    this.kodyText();
    this.position();
    return this.mesh;
  }

  generateBase() {
    this.mesh = makeBox(
      config.card.width,
      config.card.height,
      config.card.depth
    );
    this.mesh.material = this.material;
  }

  position() {
    this.mesh.translate(BabylonAxis.X, -config.card.width / 2);
    this.mesh.translate(BabylonAxis.Y, -config.card.height / 2);
  }

  poleHoles() {
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
  }

  poleHole(x, y) {
    this.mesh = makeHole(
      this.mesh,
      config.bracket.size,
      config.bracket.size,
      config.card.depth,
      x,
      y,
      0
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
      textarea_width,
      config.bracket.size,
      config.card.depth / 2,
      (config.card.width - textarea_width) / 2,
      config.bracket.size / 2,
      0
    );
    // top
    this.mesh = makeHole(
      this.mesh,
      textarea_width,
      config.bracket.size * 2,
      config.card.depth / 2,
      (config.card.width - textarea_width) / 2,
      config.card.height - config.bracket.size / 2 - textarea_height,
      0
    );
  }

  codeHoles() {
    let y = 0;
    let x = 0;
    let codeMesh = makeBox(0.01, 0.01, config.card.depth);
    this.code.reverse().forEach((line) => {
      let cols = line.split("");
      x = 0;
      for (let b of cols) {
        if (b == " ")
          codeMesh = addItem(
            codeMesh,
            makeBox(
              config.code.hole.size,
              config.code.hole.size,
              config.card.depth
            ),
            x,
            y,
            0
          );
        x += config.code.hole.size + config.text.block.size;
      }
      y += config.code.hole.size + config.text.block.size;
    });

    this.mesh = removeItem(
      this.mesh,
      codeMesh,
      (config.card.width - x) / 2,
      (config.card.height - y) / 2 - config.bracket.size / 2,
      0
    );
  }

  kodyText() {
    let kody = config.kody.code;
    const kw = kody[0].length * config.text.block.size;
    const kh = kody.length * config.text.block.size;
    const kd = config.card.depth / 2;
    const kb = makeBox(kw, kh, kd);
    const kx = (config.card.width - kw) / 2;
    const ky = config.bracket.size / 2 + (config.bracket.size - kh) / 2;
    const kz = 0;
    this.mesh = addItem(this.mesh, kb, kx, ky, kz);
    let _y = 0;
    kody.forEach((row) => {
      let _x = 0;
      row.forEach((col) => {
        if (!col)
          this.mesh = makeHole(
            this.mesh,
            config.text.block.size,
            config.text.block.size,
            kd,
            kx + _x * config.text.block.size,
            ky + _y * config.text.block.size,
            kz
          );
        _x++;
      });
      _y++;
    });
  }

  cardText() {
    const textarea_height = config.bracket.size * 2;
    const Writer = MeshWriter(window.kody.scene, { scale: 1 });
    const text = new Writer(this.name.replace(/_/g, " "), {
      "letter-height": 9,
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
      0
    );
  }
}
