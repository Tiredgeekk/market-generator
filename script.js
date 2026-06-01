let currentMarket = [];
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

  currentMarket = [...selected];

  render(currentMarket);
}

function render(market) {
  const container = document.getElementById("market");
  container.innerHTML = "";

  market.forEach(shop => {
    const card = document.createElement("div");
    card.className = "card";

    card.onclick = () => openShop(shop);

    card.innerHTML = `
      <h3>${shop.name}</h3>
      <div class="rarity">${shop.rarity} • ${shop.type}</div>
      <p><b>Owner:</b> ${shop.owner}</p>
      <p><b>Quirk:</b> ${shop.quirk}</p>
    `;

    container.appendChild(card);
  });
}

/* -------------------- SHOP MODAL -------------------- */

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

      <h3>📦 Inventory</h3>
      <ul>
        ${shop.sells.map(item => `<li>${item}</li>`).join("")}
      </ul>

      <button onclick="this.closest('.modal').remove()">Close</button>
    </div>
  `;

  document.body.appendChild(modal);
}
function printMarket() {
  if (!currentMarket.length) return;

  const printWindow = window.open("", "_blank");

  printWindow.document.write(`
    <html>
    <head>
      <title>Market Sheet</title>
      <style>
        body {
          font-family: Georgia, serif;
          padding: 20px;
        }

        h1 {
          text-align: center;
        }

        .shop {
          border: 2px solid #333;
          padding: 12px;
          margin-bottom: 12px;
          page-break-inside: avoid;
        }

        .name {
          font-size: 18px;
          font-weight: bold;
        }

        .meta {
          font-size: 12px;
          opacity: 0.8;
        }

        ul {
          margin: 6px 0 0 20px;
        }
      </style>
    </head>
    <body>

      <h1>🧾 Market Sheet</h1>

      ${currentMarket.map(shop => `
        <div class="shop">
          <div class="name">${shop.name}</div>
          <div class="meta">${shop.rarity} • ${shop.type}</div>
          <p><b>Owner:</b> ${shop.owner}</p>
          <p><b>Quirk:</b> ${shop.quirk}</p>
          <p><b>Sells:</b></p>
          <ul>
            ${shop.sells.map(item => `<li>${item}</li>`).join("")}
          </ul>
        </div>
      `).join("")}

    </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}
