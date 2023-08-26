import { config } from "./config.json";
import {
  StandardMaterial as BabylonStandardMaterial,
  Color3 as BabylonColor3,
  MeshBuilder as BabylonMeshBuilder,
  Axis as BabylonAxis,
} from "babylonjs";
import { makeHole } from "./utils";

export default class Deck {
  constructor(nbCards, color) {
    this.offset = 2 * 2 * (config.deck.thickness + config.print.tolerance.xy);
    this.width = config.card.width + this.offset;
    this.height = config.card.height + this.offset;
    this.cardDepth = config.card.depth;
    this.nbCards = nbCards;
    this.depth =
      (this.cardDepth + config.print.tolerance.z) * this.nbCards +
      config.deck.thickness;
    this.material = new BabylonStandardMaterial("std");
    this.material.diffuseColor = BabylonColor3.FromHexString(color);
  }

  generateBaseMesh(name) {
    this.mesh = BabylonMeshBuilder.CreateBox(name, {
      width: this.width,
      height: this.height,
      depth: this.depth,
    });
    this.mesh.position.x = this.width / 2;
    this.mesh.position.y = this.height / 2;
    this.mesh.position.z = this.depth / 2;
  }

  position() {
    this.mesh.material = this.material;
    this.mesh.translate(BabylonAxis.X, -this.width / 2);
    this.mesh.translate(BabylonAxis.Y, -this.height / 2);
  }

  mainHole(x, y, z, width, height, depth) {
    this.mesh = makeHole(this.mesh, x, y, z, width, height, depth);
  }

  codeHole() {
    const code_hole_width =
      config.code.hole.size * config.code.nb.x + config.code.nb.x;
    const code_hole_height =
      config.code.hole.size * config.code.nb.y + config.code.nb.y;
    this.mesh = makeHole(
      this.mesh,
      (this.width - code_hole_width) / 2,
      config.deck.thickness +
        config.deck.thickness +
        config.bracket.size / 2 +
        config.bracket.size / 2 +
        config.bracket.size,
      0,
      code_hole_width,
      code_hole_height,
      this.depth
    );
  }
}
