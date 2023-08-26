import Deck from "./Deck";
import { config } from "./config.json";
import { addItem, makeHole } from "./utils";
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
    this.kodyTextArea();
    this.kodyText();
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
    this.position();
  }

  mainHole() {
    super.mainHole(
      2 * config.deck.thickness,
      2 * config.deck.thickness,
      config.deck.thickness,
      this.width - 4 * config.deck.thickness,
      this.height - 4 * config.deck.thickness,
      this.depth - config.deck.thickness
    );
  }

  corner() {
    // top & bottom
    const w = config.deck.corner * config.deck.thickness;
    this.mesh = makeHole(
      this.mesh,
      w,
      0,
      config.deck.thickness,
      this.width - 2 * w,
      this.height,
      this.depth - config.deck.thickness
    );
    this.mesh = makeHole(
      this.mesh,
      0,
      0,
      0,
      w,
      config.deck.thickness,
      this.depth
    );
    this.mesh = makeHole(
      this.mesh,
      this.width - w,
      0,
      0,
      w,
      config.deck.thickness,
      this.depth
    );
    this.mesh = makeHole(
      this.mesh,
      0,
      this.height - config.deck.thickness,
      0,
      w,
      config.deck.thickness,
      this.depth
    );
    this.mesh = makeHole(
      this.mesh,
      this.width - w,
      this.height - config.deck.thickness,
      0,
      w,
      config.deck.thickness,
      this.depth
    );
    // left & right
    this.mesh = makeHole(
      this.mesh,
      0,
      w,
      config.deck.thickness,
      this.width,
      this.height - 2 * w,
      this.depth - config.deck.thickness
    );
    this.mesh = makeHole(
      this.mesh,
      0,
      0,
      0,
      config.deck.thickness,
      w,
      this.depth
    );
    this.mesh = makeHole(
      this.mesh,
      this.width - config.deck.thickness,
      0,
      0,
      config.deck.thickness,
      w,
      this.depth
    );
    this.mesh = makeHole(
      this.mesh,
      0,
      this.height - w,
      0,
      config.deck.thickness,
      w,
      this.depth
    );
    this.mesh = makeHole(
      this.mesh,
      this.width - config.deck.thickness,
      this.height - w,
      0,
      config.deck.thickness,
      w,
      this.depth
    );
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
      (this.width - textarea_width) / 2,
      2 * config.deck.thickness +
        config.bracket.size / 2 +
        config.print.tolerance.xy,
      config.deck.thickness / 2,
      textarea_width,
      textarea_height,
      config.deck.thickness / 2
    );
  }

  kodyText() {
    const kody = config.kody.code;
    const kw = kody[0].length * config.text.block.size;
    const kh = kody.length * config.text.block.size;
    const kz = config.deck.thickness / 2;
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
    const bb = kb.getBoundingInfo().boundingBox.maximumWorld;
    this.mesh = addItem(
      this.mesh,
      kb,
      (this.width - Number(bb.x)) / 2,
      2 * config.deck.thickness +
        config.bracket.size / 2 +
        config.print.tolerance.xy +
        Number(bb.z),
      config.deck.thickness / 2
    );
  }

  pole(x, y) {
    const pole = BabylonMeshBuilder.CreateBox("pole", {
      width: this.bracket_size,
      height: this.bracket_size,
      depth: this.depth - config.deck.thickness,
    });
    pole.position.x = this.bracket_size / 2;
    pole.position.y = this.bracket_size / 2;
    pole.position.z = (this.depth - config.deck.thickness) / 2;
    this.mesh = addItem(this.mesh, pole, x, y, config.deck.thickness);
  }
}
