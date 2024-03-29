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

export const DeckItem = (deck, card, i) => `
<li>
  <h3>${card.name}</h3>
  <button id="${deck.name}_${
  card.name
}_generate" onclick="window.kody.generateCard('${deck.name}', '${
  card.name
}', '${card.color}', ${deck.cards.length - i})">${svgGenerate}</button>
  <button id="${deck.name}_${card.name}_show" onclick="window.kody.show('${
  deck.name
}', '${card.name}')" style="display: none;">${svgShow}</button>
  <button id="${deck.name}_${card.name}_hide" onclick="window.kody.hide('${
  deck.name
}', '${card.name}')" style="display: none;">${svgHide}</button>
  <button id="${deck.name}_${
  card.name
}_download" onclick="window.kody.download('${deck.name}', '${
  card.name
}')" style="display: none;">${svgDownload}</button>
</li>
`;

export const DeckItemBack = (deck) => `<li>
<h3>Deck Back</h3>
<button id="${deck.name}___BACK___generate" onclick="window.kody.generateBack('${deck.name}', ${deck.cards.length})">${svgGenerate}</button>
<button id="${deck.name}___BACK___show" onclick="window.kody.show('${deck.name}', '__BACK__')" style="display: none;">${svgShow}</button>
<button id="${deck.name}___BACK___hide" onclick="window.kody.hide('${deck.name}', '__BACK__')" style="display: none;">${svgHide}</button>
<button id="${deck.name}___BACK___download" onclick="window.kody.download('${deck.name}', '__BACK__')" style="display: none;">${svgDownload}</button>
</li>`;

export const DeckItemFront = (deck) => `<li>
<h3>Deck Front</h3>
<button id="${deck.name}___FRONT___generate" onclick="window.kody.generateFront('${deck.name}', ${deck.cards.length})">${svgGenerate}</button>
<button id="${deck.name}___FRONT___show" onclick="window.kody.show('${deck.name}', '__FRONT__')" style="display: none;">${svgShow}</button>
<button id="${deck.name}___FRONT___hide" onclick="window.kody.hide('${deck.name}', '__FRONT__')" style="display: none;">${svgHide}</button>
<button id="${deck.name}___FRONT___download" onclick="window.kody.download('${deck.name}', '__FRONT__')" style="display: none;">${svgDownload}</button>
</li>`;
