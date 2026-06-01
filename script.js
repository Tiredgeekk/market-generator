let shops = [];

fetch("shops.json")
  .then(res => res.json())
  .then(data => {
    shops = data;
    generateMarket();
  });

function getWeight(rarity) {
  switch (rarity) {
    case "Common": return 10;
    case "Uncommon": return 6;
    case "Rare": return 3;
    case "Legendary": return 1;
    case "Mythic": return 0.3;
    default: return 5;
  }
}

function weightedPick() {
  const pool = [];

  for (const shop of shops) {
    const weight = getWeight(shop.rarity);
    for (let i = 0; i < weight * 10; i++) {
      pool.push(shop);
    }
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

function generateMarket() {
  const selected = new Set();

  while (selected.size < 11) {
    selected.add(weightedPick());
  }

  render([...selected]);
}

function render(market) {
  const container = document.getElementById("market");
  container.innerHTML = "";

  market.forEach(shop => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${shop.name}</h3>
      <div class="rarity">${shop.rarity} • ${shop.type}</div>
      <p><b>Owner:</b> ${shop.owner}</p>
      <p><b>Quirk:</b> ${shop.quirk}</p>
      <p><b>Sells:</b> ${shop.sells.join(", ")}</p>
    `;

    container.appendChild(card);
  });
}
