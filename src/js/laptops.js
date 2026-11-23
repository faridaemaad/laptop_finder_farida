import { fetchLaptops } from "./api.js";
import { initTheme } from "./storage.js";
import { renderHeader, renderLaptopCard, showSkeletons, showMessage, setupFavoriteButtons } from "./ui.js";

initTheme();
renderHeader("laptops.html");

const grid = document.getElementById("grid");
const count = document.getElementById("count");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const maxPriceInput = document.getElementById("max-price");
const minRamSelect = document.getElementById("min-ram");
const sortSelect = document.getElementById("sort");

let allLaptops = [];

const sorters = {
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  "battery-asc": (a, b) => a.batteryHours - b.batteryHours,
  "battery-desc": (a, b) => b.batteryHours - a.batteryHours,
  "weight-asc": (a, b) => a.weightKg - b.weightKg,
  "weight-desc": (a, b) => b.weightKg - a.weightKg,
};

const applyFilters = () => {
  const text = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;
  const maxPrice = Number(maxPriceInput.value) || Infinity;
  const minRam = Number(minRamSelect.value);

  const filtered = allLaptops
    .filter((l) => l.name.toLowerCase().includes(text) || l.brand.toLowerCase().includes(text))
    .filter((l) => category === "all" || l.category === category)
    .filter((l) => l.price <= maxPrice)
    .filter((l) => l.ramGB >= minRam);

  const result = [...filtered];
  if (sorters[sortSelect.value]) {
    result.sort(sorters[sortSelect.value]);
  }

  count.textContent = result.length + " of " + allLaptops.length + " laptops";

  if (result.length === 0) {
    showMessage(grid, "No laptops match your search and filters.");
    return;
  }

grid.innerHTML = result.map((laptop) => renderLaptopCard(laptop)).join("");
};

async function init() {
  showSkeletons(grid, 6);
  const laptops = await fetchLaptops();

  if (!laptops) {
    count.textContent = "";
    showMessage(grid, "Could not load the laptops. Use Live Server and try again.");
    return;
  }

  allLaptops = laptops;
  applyFilters();
  setupFavoriteButtons(grid);
}

[searchInput, categorySelect, maxPriceInput, minRamSelect, sortSelect].forEach((control) => {
  control.addEventListener("input", applyFilters);
});

init();