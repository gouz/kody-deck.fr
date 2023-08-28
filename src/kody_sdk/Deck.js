import { config } from "./config.json";
import {
  StandardMaterial as BabylonStandardMaterial,
  Color3 as BabylonColor3,
  Axis as BabylonAxis,
} from "babylonjs";
import { makeBox, makeHole } from "./utils";

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
    this.mesh = makeBox(this.width, this.height, this.depth);
    this.mesh.material = this.material;
  }

  position() {
    this.mesh.translate(BabylonAxis.X, -this.width / 2);
    this.mesh.translate(BabylonAxis.Y, -this.height / 2);
  }

  mainHole(width, height, depth, x, y, z) {
    this.mesh = makeHole(this.mesh, width, height, depth, x, y, z);
  }

  codeHole() {
    const code_hole_width =
      config.code.hole.size * config.code.nb.x + config.code.nb.x;
    const code_hole_height =
      config.code.hole.size * config.code.nb.y + config.code.nb.y;
    this.mesh = makeHole(
      this.mesh,
      code_hole_width,
      code_hole_height,
      this.depth,
      (this.width - code_hole_width) / 2,
      config.deck.thickness +
        config.deck.thickness +
        config.bracket.size / 2 +
        config.bracket.size / 2 +
        config.bracket.size,
      0
    );
  }
}
