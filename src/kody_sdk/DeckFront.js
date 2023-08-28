import Deck from "./Deck";
import { config } from "./config.json";
import { addItem, makeHole } from "./utils";
import { MeshWriter } from "meshwriter";

export default class DeckFront extends Deck {
  constructor(nbCards, color, name) {
    super(nbCards, color);
    this.name = name;
    this.depth = this.depth + config.deck.thickness;
  }

  render() {
    this.generateBaseMesh("front");
    this.mainHole();
    this.corner();
    this.codeHole();
    this.kodyHole();
    this.position();
    return this.mesh;
  }

  mainHole() {
    super.mainHole(
      config.deck.thickness,
      config.deck.thickness,
      0,
      this.width - 2 * config.deck.thickness,
      this.height - 2 * config.deck.thickness,
      this.depth - config.deck.thickness
    );
  }

  corner() {
    let w = config.deck.corner * config.deck.thickness;
    this.mesh = makeHole(
      this.mesh,
      w,
      0,
      0,
      this.width - w * 2,
      this.height,
      this.depth - config.deck.thickness
    );
    this.mesh = makeHole(
      this.mesh,
      0,
      w,
      0,
      this.width,
      this.height - w * 2,
      this.depth - config.deck.thickness
    );
  }

  kodyHole() {
    const textarea_width =
      config.card.width -
      2 *
        (config.bracket.size +
          config.bracket.size / 2 +
          2 * config.text.block.size);
    this.mesh = makeHole(
      this.mesh,
      (this.width - textarea_width) / 2,
      2 * config.deck.thickness +
        config.bracket.size / 2 +
        config.print.tolerance.xy,
      this.depth - config.deck.thickness,
      textarea_width,
      config.bracket.size -
        2 * (config.print.tolerance.xy + config.print.tolerance.xy),
      config.deck.thickness
    );
  }
}
