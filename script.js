let shops = [];
let currentMarket = [];

/* LOAD SHOPS */
fetch("shops.json")
  .then(res => res.json())
  .then(data => {
    shops = data;
  });

/* RARITY WEIGHTS */
function getWeight(rarity) {
  switch (rarity) {
    case "Common": return 10;
    case "Uncommon": return 6;
    case "Rare": return 3;
    case "Legendary": return 1;
    case "Mythic": return 0.5;
    default: return 5;
  }
}

/* PICK ONE SHOP */
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

/* GENERATE MARKET */
function generateMarket() {
  const selected = new Set();

  while (selected.size < 11) {
    selected.add(weightedPick());
  }

  currentMarket = [...selected];
  render(currentMarket);
}

/* RENDER */
function render(market) {
  const container = document.getElementById("market");
  container.innerHTML = "";

  market.forEach(shop => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.rarity = shop.rarity;

    card.innerHTML = `
      <h3>${shop.name}</h3>
      <p><b>${shop.type}</b></p>
      <p>${shop.owner}</p>
    `;

    card.onclick = () => openShop(shop);

    container.appendChild(card);
  });
}

/* SHOP MODAL */
function openShop(shop) {
  const modal = document.createElement("div");
  modal.className = "modal";

  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };

  modal.innerHTML = `
    <div class="modal-content">
      <h2>${shop.name}</h2>
      <p><b>Owner:</b> ${shop.owner}</p>
      <p><b>Type:</b> ${shop.type}</p>
      <p><b>Rarity:</b> ${shop.rarity}</p>
      <p><b>Quirk:</b> ${shop.quirk}</p>

      <hr/>

      <h3>Inventory</h3>
      <ul>
        ${shop.sells.map(i => `<li>${i}</li>`).join("")}
      </ul>

      <button onclick="this.closest('.modal').remove()">Close</button>
    </div>
  `;

  document.body.appendChild(modal);
}

/* PRINT */
function printMarket() {
  if (!currentMarket.length) {
    alert("Generate a market first!");
    return;
  }

  const win = window.open("", "_blank");

  win.document.write(`
    <html>
    <head>
      <title>Market Sheet</title>
      <style>
        body { font-family: Georgia; padding: 20px; }
        h1 { text-align: center; }

        .shop {
          border: 2px solid #333;
          padding: 10px;
          margin-bottom: 10px;
          page-break-inside: avoid;
        }
      </style>
    </head>
    <body>

    <h1>🧾 Market Sheet</h1>

    ${currentMarket.map(s => `
      <div class="shop">
        <h3>${s.name}</h3>
        <p>${s.type} • ${s.rarity}</p>
        <p><b>Owner:</b> ${s.owner}</p>
        <p><b>Quirk:</b> ${s.quirk}</p>
        <p><b>Items:</b> ${s.sells.join(", ")}</p>
      </div>
    `).join("")}

    </body>
    </html>
  `);

  win.document.close();
  win.print();
}
