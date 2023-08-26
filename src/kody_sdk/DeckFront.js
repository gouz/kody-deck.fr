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
    this.deckName();
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

  deckName() {
    const textarea_width =
      config.card.width -
      2 *
        (config.bracket.size +
          config.bracket.size / 2 +
          2 * config.text.block.size);
    const textarea_height = config.bracket.size * 2;
    this.mesh = makeHole(
      this.mesh,
      (this.width - textarea_width) / 2,
      this.height -
        config.bracket.size / 2 -
        config.deck.thickness -
        textarea_height,
      this.depth - config.deck.thickness / 2,
      textarea_width,
      config.bracket.size * 2,
      config.deck.thickness / 2
    );

    // text
    const Writer = MeshWriter(window.kody.scene, { scale: 1 });
    const text = new Writer(this.name.replace("_", " "), {
      "letter-height": 6,
      "letter-thickness": config.deck.thickness / 2,
      "font-family": "comic",
    });
    const textMesh = text.getMesh();
    textMesh.rotation.x = -Math.PI / 2;
    const bb = textMesh.getBoundingInfo().boundingBox.maximumWorld;

    this.mesh = addItem(
      this.mesh,
      textMesh,
      (this.width - Number(bb.x)) / 2,
      this.height -
        config.bracket.size / 2 -
        config.deck.thickness -
        textarea_height +
        (textarea_height - Number(bb.z)) / 2,
      this.depth - config.deck.thickness / 2
    );
  }
}
