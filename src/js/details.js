import { fetchLaptops } from "./api.js";
import { initTheme, isFavorite, toggleFavorite, getCompare, toggleCompare } from "./storage.js";
import { renderHeader, showMessage } from "./ui.js";

initTheme();
renderHeader("laptops.html");

const rawId = new URLSearchParams(location.search).get("id");
const id = rawId ? Number(rawId) : null;
const detail = document.getElementById("detail");

const renderDetail = (l) => {
  const specs = [
    ["Brand", l.brand],
    ["Category", l.category],
    ["CPU", l.cpu],
    ["RAM", l.ramGB + " GB"],
    ["Storage", l.storageGB + " GB"],
    ["Battery", l.batteryHours + " hours"],
    ["Weight", l.weightKg + " kg"],
    ["Screen", l.screenInches + " inches"],
    ["Price", "$" + l.price],
  ];

  const rows = specs
    .map(([label, value]) => `
      <tr class="border-t border-line">
        <th class="p-3 text-left text-muted">${label}</th>
        <td class="p-3">${value}</td>
      </tr>
    `)
    .join("");

  detail.innerHTML = `
    <div class="grid gap-6 md:grid-cols-2">
      <img src="${l.image}" alt="${l.name}" class="h-72 w-full rounded-xl bg-white object-contain p-4" />
      <div>
        <h1 class="text-2xl font-bold">${l.name}</h1>
        <p class="mt-2 text-2xl font-bold text-accent">$${l.price}</p>
        <div class="prose prose-lg mt-4 max-w-none [--tw-prose-body:var(--color-muted)]">
  <p>${l.description}</p>
</div>
        <div class="mt-4 flex flex-wrap gap-3">
          <button id="fav-btn" class="btn-action"></button>
          <button id="compare-btn" class="btn-action"></button>
        </div>
        <p id="detail-msg" class="mt-3 text-sm text-muted"></p>
      </div>
    </div>
    <div class="mt-6 overflow-x-auto rounded-xl border border-line bg-card">
      <table class="w-full text-sm">${rows}</table>
    </div>
  `;
};

async function init() {
  const laptops = await fetchLaptops();

  if (!laptops) {
    showMessage(detail, "Could not load the laptop data. Use Live Server.");
    return;
  }

  const laptop = laptops.find((l) => l.id === id);

  if (!laptop) {
    showMessage(detail, "Laptop not found. Go back and choose one from the catalogue.");
    return;
  }

  renderDetail(laptop);

  const favBtn = document.getElementById("fav-btn");
  const compareBtn = document.getElementById("compare-btn");
  const msg = document.getElementById("detail-msg");

  const updateButtons = () => {
    favBtn.textContent = isFavorite(laptop.id) ? "♥ Saved" : "♡ Save to favorites";
    compareBtn.textContent = getCompare().includes(laptop.id) ? "✓ In comparison" : "+ Add to comparison";
  };

  favBtn.addEventListener("click", () => {
    toggleFavorite(laptop.id);
    updateButtons();
  });

  compareBtn.addEventListener("click", () => {
    const result = toggleCompare(laptop.id);
    // Only save to favorites if the comparison accepted the laptop
    if (result === "added" && !isFavorite(laptop.id)) {
      toggleFavorite(laptop.id);
    }
    msg.textContent = result === "full" ? "You can compare up to 4 laptops only." : "";
    updateButtons();
  });

  updateButtons();
}

init();