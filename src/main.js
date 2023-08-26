import {
  VertexBuffer as BabylonVertexBuffer,
  Vector3 as BabylonVector3,
} from "babylonjs";

import Card from "./kody_sdk/Card";
import DeckBack from "./kody_sdk/DeckBack";
import DeckFront from "./kody_sdk/DeckFront";
import Scene from "./kody_sdk/Scene";
import "./style.css";

const canvasID = "scene";

window.kody = {
  codes: {},
  meshes: {},
};

const prepareApp = () => {
  const $app = document.getElementById("app");
  $app.classList.add("loaded");
  $app.innerHTML = `
  <div id="decks"></div>
  <div id="app-scene">
    <canvas id="${canvasID}" class="full"></canvas>
  </div>
  `;
  window.kody.$decks = document.getElementById("decks");
};

window.kody.generateBack = (deckname, nbCards) =>
  (window.kody.meshes[`${deckname}____BACK__`] = new DeckBack(
    nbCards,
    "#CCCCCC"
  ).render());

window.kody.generateFront = (deckname, nbCards) =>
  (window.kody.meshes[`${deckname}____FRONT__`] = new DeckFront(
    nbCards,
    "#CCCCCC",
    deckname
  ).render());

window.kody.generateCard = (deckname, cardname, color, pos) => {
  window.kody.meshes[`${deckname}__${cardname}`] = new Card(
    cardname,
    window.kody.codes[`${deckname}__${cardname}`],
    color,
    pos
  ).render();
};

window.kody.download = (deckname, name) => {
  let output = "solid exportedMesh\r\n";
  let vertices = window.kody.meshes[`${deckname}__${name}`].getVerticesData(
    BabylonVertexBuffer.PositionKind
  );
  let indices = window.kody.meshes[`${deckname}__${name}`].getIndices();

  for (let i = 0; i < indices.length; i += 3) {
    const id = [indices[i] * 3, indices[i + 1] * 3, indices[i + 2] * 3];
    let v = [
      new BabylonVector3(
        vertices[id[0]],
        vertices[id[0] + 1],
        vertices[id[0] + 2]
      ),
      new BabylonVector3(
        vertices[id[1]],
        vertices[id[1] + 1],
        vertices[id[1] + 2]
      ),
      new BabylonVector3(
        vertices[id[2]],
        vertices[id[2] + 1],
        vertices[id[2] + 2]
      ),
    ];
    const p1p2 = v[0].subtract(v[1]);
    const p3p2 = v[2].subtract(v[1]);
    const n = BabylonVector3.Cross(p1p2, p3p2).normalize();

    output += `facet normal ${n.x} ${n.y} ${n.z}\r\n`;
    output += `\touter loop\r\n`;
    output += `\t\tvertex ${v[0].x} ${v[0].y} ${v[0].z}\r\n`;
    output += `\t\tvertex ${v[1].x} ${v[1].y} ${v[1].z}\r\n`;
    output += `\t\tvertex ${v[2].x} ${v[2].y} ${v[2].z}\r\n`;
    output += `\tendloop\r\n`;
    output += `endfacet\r\n`;
  }
  output += `endsolid exportedMesh`;
  const a = document.createElement("a");
  const blob = new Blob([output], { type: "application/octet-stream" });
  a.href = window.URL.createObjectURL(blob);
  a.download = `${deckname}__${name}.stl`;
  a.click();
};

window.kody.launch = () => {
  prepareApp();
  window.kody.scene = new Scene(canvasID);

  // load decks
  fetch("decks.json")
    .then((response) => response.json())
    .then((decks) => {
      const decklist = [];
      Object.values(decks.decks).forEach((deck) => {
        decklist.push(`
        <div class="deck">
          <h2>${deck.name}</h2>
          <ul>
            <li>
              <h3>Deck Back</h3>
              <button onclick="window.kody.generateBack('${deck.name}', ${
          deck.cards.length
        })">Generate</button>
              <button onclick="window.kody.download('${
                deck.name
              }', '__BACK__')">Download</button>
            </li>
            ${Object.values(deck.cards)
              .map((card, i) => {
                window.kody.codes[`${deck.name}__${card.name}`] = card.code;
                return `
                  <li>
                    <h3>${card.name}</h3>
                    <button onclick="window.kody.generateCard('${deck.name}', '${card.name}', '${card.color}', ${i})">Generate</button>
                    <button onclick="window.kody.download('${deck.name}', '${card.name}')">Download</button>
                  </li>
                  `;
              })
              .join("")}
              <li>
              <h3>Deck Front</h3>
              <button onclick="window.kody.generateFront('${deck.name}', ${
          deck.cards.length
        })">Generate</button>
              <button onclick="window.kody.download('${
                deck.name
              }', '__FRONT__')">Download</button>
            </li>
          </ul>
        </div>
        `);
      });
      window.kody.$decks.innerHTML = decklist.join("");
    });
};
