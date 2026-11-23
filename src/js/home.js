import { fetchLaptops } from "./api.js";
import { getFavorites, initTheme } from "./storage.js";
import { renderHeader, showMessage, statCard } from "./ui.js";

initTheme();
renderHeader("index.html");

const stats = document.getElementById("stats");

async function loadStats() {
  const laptops = await fetchLaptops();

  if (!laptops) {
    showMessage(stats, "Could not load the laptop data. Use Live Server.");
    return;
  }

  const lowest = laptops.reduce((min, laptop) => {
    if (laptop.price < min) return laptop.price;
    return min;
  }, laptops[0].price);

  const total = laptops.reduce((sum, laptop) => sum + laptop.price, 0);
  const average = Math.round(total / laptops.length);

  stats.innerHTML =
    statCard("Laptops", laptops.length) +
    statCard("Lowest price", "$" + lowest) +
    statCard("Average price", "$" + average) +
    statCard("Saved favorites", getFavorites().length);
}

loadStats();