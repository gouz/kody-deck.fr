import { DeckItem, DeckItemFront, DeckItemBack } from "./DeckItem";

const DeckComponent = (deck) => `
    <div class="deck">
      <h2>${deck.name}</h2>
      <ul>
        ${DeckItemBack(deck)}
        ${Object.values(deck.cards)
          .map((card, i) => {
            window.kody.codes[`${deck.name}__${card.name}`] = card.code;
            return DeckItem(deck, card, i);
          })
          .join("")}
          ${DeckItemFront(deck)}
      </ul>
    </div>
    `;

export default DeckComponent;
