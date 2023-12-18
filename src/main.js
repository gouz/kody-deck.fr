import Card from "./kody_sdk/Card";
import DeckBack from "./kody_sdk/DeckBack";
import DeckFront from "./kody_sdk/DeckFront";
import Scene from "./kody_sdk/Scene";
import "./style.css";
import { CreateSTL } from "./kody_sdk/utils";
import { config } from "./kody_sdk/config.json";
import DeckComponent from "./components/Deck";

const canvasID = "scene";

window.kody = {
  codes: {},
  meshes: {},
  generateBack: (deckname, nbCards) => {
    window.kody.meshes[`${deckname}____BACK__`] = new DeckBack(
      nbCards,
      "#CCCCCC"
    ).render();
    document.getElementById(`${deckname}___BACK___generate`).style.display =
      "none";
    document.getElementById(`${deckname}___BACK___hide`).style.display =
      "inline";
    document.getElementById(`${deckname}___BACK___download`).style.display =
      "inline";
  },
  generateFront: (deckname, nbCards) => {
    window.kody.meshes[`${deckname}____FRONT__`] = new DeckFront(
      nbCards,
      "#CCCCCC",
      deckname
    ).render();
    document.getElementById(`${deckname}___FRONT___generate`).style.display =
      "none";
    document.getElementById(`${deckname}___FRONT___hide`).style.display =
      "inline";
    document.getElementById(`${deckname}___FRONT___download`).style.display =
      "inline";
  },
  generateCard: (deckname, cardname, color, pos) => {
    document.getElementById(`${deckname}_${cardname}_generate`).innerHTML =
      svgLoading;
    setTimeout(async () => {
      window.kody.meshes[`${deckname}__${cardname}`] = await new Card(
        cardname,
        window.kody.codes[`${deckname}__${cardname}`],
        color
      ).render();
      window.kody.meshes[`${deckname}__${cardname}`].position.z =
        pos * config.card.depth;
      document.getElementById(
        `${deckname}_${cardname}_generate`
      ).style.display = "none";
      document.getElementById(`${deckname}_${cardname}_hide`).style.display =
        "inline";
      document.getElementById(
        `${deckname}_${cardname}_download`
      ).style.display = "inline";
    }, 50);
  },
  download: (deckname, name) => {
    CreateSTL(
      window.kody.meshes[`${deckname}__${name}`],
      true,
      `${deckname}__${name}`,
      false,
      false,
      false,
      true,
      true
    );
  },
  show: (deckname, name) => {
    window.kody.meshes[`${deckname}__${name}`].setEnabled(true);
    document.getElementById(`${deckname}_${name}_show`).style.display = "none";
    document.getElementById(`${deckname}_${name}_hide`).style.display =
      "inline";
  },
  hide: (deckname, name) => {
    window.kody.meshes[`${deckname}__${name}`].setEnabled(false);
    document.getElementById(`${deckname}_${name}_show`).style.display =
      "inline";
    document.getElementById(`${deckname}_${name}_hide`).style.display = "none";
  },
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

const svgLoading = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24">
<path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"></path>
</svg>`;

window.kody.launch = () => {
  prepareApp();
  window.kody.scene = new Scene(canvasID);

  // load decks
  fetch("decks.json")
    .then((response) => response.json())
    .then((decks) => {
      const decklist = [];
      Object.values(decks.decks).forEach((deck) =>
        decklist.push(DeckComponent(deck))
      );
      window.kody.$decks.innerHTML = decklist.join("");
    });
};
