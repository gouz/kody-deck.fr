import Deck from "./Deck";
import { config } from "./config.json";
import { addItem, makeBox, makeHole } from "./utils";
import { MeshBuilder as BabylonMeshBuilder } from "babylonjs";

export default class DeckBack extends Deck {
  constructor(nbCards, color) {
    super(nbCards, color);
    this.bracket_size =
      config.bracket.size -
      2 * (config.print.tolerance.xy + config.print.tolerance.xy);
  }

  render() {
    this.generateBaseMesh("back");
    this.mainHole();
    this.corner();
    this.codeHole();
    this.brackets();
    this.kodyTextArea();
    this.kodyText();
    this.position();
    return this.mesh;
  }

  mainHole() {
    super.mainHole(
      this.width - 4 * config.deck.thickness,
      this.height - 4 * config.deck.thickness,
      this.depth - config.deck.thickness,
      2 * config.deck.thickness,
      2 * config.deck.thickness,
      0
    );
  }

  corner() {
    const w = config.deck.corner * config.deck.thickness;
    // vertical center hole
    this.mesh = makeHole(
      this.mesh,
      this.width - 2 * w,
      this.height,
      this.depth - config.deck.thickness,
      w,
      0,
      0
    );
    // bottom left
    this.mesh = makeHole(
      this.mesh,
      w,
      config.deck.thickness,
      this.depth,
      0,
      0,
      0
    );
    // bottom right
    this.mesh = makeHole(
      this.mesh,
      w,
      config.deck.thickness,
      this.depth,
      this.width - w,
      0,
      0
    );
    // top left
    this.mesh = makeHole(
      this.mesh,
      w,
      config.deck.thickness,
      this.depth,
      0,
      this.height - config.deck.thickness,
      0
    );
    // top right
    this.mesh = makeHole(
      this.mesh,
      w,
      config.deck.thickness,
      this.depth,
      this.width - w,
      this.height - config.deck.thickness,
      0
    );
    // horizontal center hole
    this.mesh = makeHole(
      this.mesh,
      this.width,
      this.height - 2 * w,
      this.depth - config.deck.thickness,
      0,
      w,
      0
    );
    // bottom left
    this.mesh = makeHole(
      this.mesh,
      config.deck.thickness,
      w,
      this.depth,
      0,
      0,
      0
    );
    // bottom right
    this.mesh = makeHole(
      this.mesh,
      config.deck.thickness,
      w,
      this.depth,
      this.width - config.deck.thickness,
      0,
      0
    );
    // top left
    this.mesh = makeHole(
      this.mesh,
      config.deck.thickness,
      w,
      this.depth,
      0,
      this.height - w,
      0
    );
    // top right
    this.mesh = makeHole(
      this.mesh,
      config.deck.thickness,
      w,
      this.depth,
      this.width - config.deck.thickness,
      this.height - w,
      0
    );
  }

  brackets() {
    // bottom left
    this.pole(
      2 * config.deck.thickness +
        config.print.tolerance.xy +
        config.print.tolerance.xy +
        config.print.tolerance.xy +
        config.bracket.size / 2,
      2 * config.deck.thickness +
        config.print.tolerance.xy +
        config.print.tolerance.xy +
        config.print.tolerance.xy +
        config.bracket.size / 2
    );
    // bottom right
    this.pole(
      this.width -
        (2 * config.deck.thickness +
          config.print.tolerance.xy +
          config.bracket.size +
          config.bracket.size / 2),
      2 * config.deck.thickness +
        config.print.tolerance.xy +
        config.print.tolerance.xy +
        config.print.tolerance.xy +
        config.bracket.size / 2
    );
    // top left
    this.pole(
      2 * config.deck.thickness +
        config.print.tolerance.xy +
        config.print.tolerance.xy +
        config.print.tolerance.xy +
        config.bracket.size / 2,
      this.height -
        (2 * config.deck.thickness +
          config.print.tolerance.xy +
          config.bracket.size * 2) -
        config.bracket.size / 2
    );
    // top right
    this.pole(
      this.width -
        (2 * config.deck.thickness +
          config.print.tolerance.xy +
          config.bracket.size +
          config.bracket.size / 2),
      this.height -
        (2 * config.deck.thickness +
          config.print.tolerance.xy +
          config.bracket.size) -
        config.text.block.size * 3
    );
  }

  pole(x, y) {
    const pole = makeBox(
      this.bracket_size,
      this.bracket_size,
      this.depth - config.deck.thickness
    );
    this.mesh = addItem(this.mesh, pole, x, y, 0);
  }

  kodyTextArea() {
    const textarea_width =
      config.card.width -
      2 *
        (config.bracket.size +
          config.bracket.size / 2 +
          2 * config.text.block.size);
    const textarea_height = this.bracket_size;
    this.mesh = makeHole(
      this.mesh,
      textarea_width,
      textarea_height,
      config.deck.thickness / 2,
      (this.width - textarea_width) / 2,
      2 * config.deck.thickness +
        config.bracket.size / 2 +
        config.print.tolerance.xy,
      this.depth - config.deck.thickness
    );
  }

  kodyText() {
    const kody = config.kody.code.reverse();
    const kw = kody[0].length * config.text.block.size;
    const kh = kody.length * config.text.block.size;
    const kd = config.deck.thickness / 2;
    let kb = makeBox(kw, kh, kd);
    const kx = (this.width - kw) / 2;
    const ky =
      2 * config.deck.thickness +
      config.bracket.size / 2 +
      config.print.tolerance.xy +
      config.text.block.size / 2;
    const kz = this.depth - config.deck.thickness;
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
}
