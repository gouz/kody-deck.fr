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
  generateBack: (deckname, nbCards) =>
    (window.kody.meshes[`${deckname}____BACK__`] = new DeckBack(
      nbCards,
      "#CCCCCC"
    ).render()),
  generateFront: (deckname, nbCards) =>
    (window.kody.meshes[`${deckname}____FRONT__`] = new DeckFront(
      nbCards,
      "#CCCCCC",
      deckname
    ).render()),
  generateCard: (deckname, cardname, color, pos) => {
    window.kody.meshes[`${deckname}__${cardname}`] = new Card(
      cardname,
      window.kody.codes[`${deckname}__${cardname}`],
      color,
      pos
    ).render();
  },
  download: (deckname, name) => {
    let output = "solid exportedMesh\r\n";
    const vertices = window.kody.meshes[`${deckname}__${name}`].getVerticesData(
      BabylonVertexBuffer.PositionKind
    );
    const indices = window.kody.meshes[`${deckname}__${name}`].getIndices();
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
  },
  show: (deckname, name) =>
    window.kody.meshes[`${deckname}__${name}`].setEnabled(true),
  hide: (deckname, name) =>
    window.kody.meshes[`${deckname}__${name}`].setEnabled(false),
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

const svgGenerate = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24">
<path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
</svg>
`;

const svgDownload = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24">
<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
</svg>
`;

const svgShow = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24">
<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
</svg>
`;

const svgHide = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24">
<path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
</svg>`;

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
        })">${svgGenerate}</button>
              <button onclick="window.kody.show('${
                deck.name
              }', '__BACK__')">${svgShow}</button>
              <button onclick="window.kody.hide('${
                deck.name
              }', '__BACK__')">${svgHide}</button>
              <button onclick="window.kody.download('${
                deck.name
              }', '__BACK__')">${svgDownload}</button>
            </li>
            ${Object.values(deck.cards)
              .map((card, i) => {
                window.kody.codes[`${deck.name}__${card.name}`] = card.code;
                return `
                  <li>
                    <h3>${card.name}</h3>
                    <button onclick="window.kody.generateCard('${deck.name}', '${card.name}', '${card.color}', ${i})">${svgGenerate}</button>
                    <button onclick="window.kody.show('${deck.name}', '${card.name}')">${svgShow}</button>
                    <button onclick="window.kody.hide('${deck.name}', '${card.name}')">${svgHide}</button>
                    <button onclick="window.kody.download('${deck.name}', '${card.name}')">${svgDownload}</button>
                  </li>
                  `;
              })
              .join("")}
              <li>
              <h3>Deck Front</h3>
              <button onclick="window.kody.generateFront('${deck.name}', ${
          deck.cards.length
        })">${svgGenerate}</button>
              <button onclick="window.kody.show('${
                deck.name
              }', '__FRONT__')">${svgShow}</button>
              <button onclick="window.kody.hide('${
                deck.name
              }', '__FRONT__')">${svgHide}</button>
              <button onclick="window.kody.download('${
                deck.name
              }', '__FRONT__')">${svgDownload}</button>
            </li>
          </ul>
        </div>
        `);
      });
      window.kody.$decks.innerHTML = decklist.join("");
    });
};
