import { fetchLaptops } from "./api.js";
import { getFavorites, clearFavorites, initTheme } from "./storage.js";
import { renderHeader, renderLaptopCard, showSkeletons, showMessage, setupFavoriteButtons, statCard } from "./ui.js";

initTheme();
renderHeader("favorites.html");

const grid = document.getElementById("grid");
const statsBox = document.getElementById("fav-stats");

let allLaptops = [];

const render = () => {
  const ids = getFavorites();
  const saved = allLaptops.filter((l) => ids.includes(l.id));

  const total = saved.reduce((sum, l) => sum + l.price, 0);
  const average = saved.length > 0 ? Math.round(total / saved.length) : 0;

  statsBox.innerHTML =
    statCard("Saved laptops", saved.length) +
    statCard("Total price", "$" + total) +
    statCard("Average price", "$" + average);

  if (saved.length === 0) {
    showMessage(grid, "No favorites yet. Browse the catalogue and tap Save.");
    return;
  }

grid.innerHTML = saved.map((laptop) => renderLaptopCard(laptop, true)).join("");
};

async function init() {
  showSkeletons(grid, 3);
  const laptops = await fetchLaptops();

  if (!laptops) {
    showMessage(grid, "Could not load the laptop data. Use Live Server.");
    return;
  }

  allLaptops = laptops;
  render();
  setupFavoriteButtons(grid, render);
}

document.getElementById("clear-btn").addEventListener("click", () => {
  clearFavorites();
  render();
});

init();