import Card from "./kody_sdk/Card";
import DeckBack from "./kody_sdk/DeckBack";
import DeckFront from "./kody_sdk/DeckFront";
import Scene from "./kody_sdk/Scene";
import "./style.css";

window.kody = {};
window.kody.launch = () => {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("id", "canvas");
  canvas.classList.add("full");
  const $app = document.getElementById("app");
  $app.classList.add("loaded");
  $app.innerHTML = "";
  $app.appendChild(canvas);
  window.kody.scene = new Scene("canvas");

  // add DeckBack
  new DeckBack(8, "#CCCCCC").render();
  // add DeckFront
  // new DeckFront(8, "#CCCCCC", "gouz").render();
  new Card(
    "Pirate",
    [
      "          ",
      "          ",
      "          ",
      "          ",
      " X      X ",
      " X      X ",
      "          ",
      "          ",
      "          ",
      "          ",
    ],
    "#ff7a42",
    0
  ).render();
};

window.kody.launch();
