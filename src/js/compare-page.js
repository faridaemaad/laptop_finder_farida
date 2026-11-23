import { fetchLaptops } from "./api.js";
import { getFavorites, getCompare, saveCompare, toggleCompare, initTheme } from "./storage.js";
import { renderHeader, showMessage } from "./ui.js";
import { compareRows, getBestValue } from "./compare.js";
initTheme();
renderHeader("compare.html");
const picker = document.getElementById("picker");
const tableWrap = document.getElementById("table-wrap");
const msg = document.getElementById("compare-msg");
let allLaptops = [];
const renderTable = (laptops) => {
  if (laptops.length < 2) {
    tableWrap.innerHTML = `<p class="p-6 text-center text-muted">Select at least 2 laptops to compare.</p>`;
    return;
  }

  const head = laptops.map((l) => `<th class="p-3 text-left">${l.name}</th>`).join("");

  const body = compareRows
    .map((row) => {
      const best = getBestValue(laptops, row.key, row.best);

      const cells = laptops
        .map((l) => {
          const isBest = best !== null && l[row.key] === best;
          const style = isBest ? "bg-best font-bold" : "";
          return `<td class="p-3 ${style}">${l[row.key]}</td>`;
        })
        .join("");

      return `
        <tr class="border-t border-line">
          <th class="p-3 text-left text-muted">${row.label}</th>
          ${cells}
        </tr>
      `;
    })
    .join("");

  tableWrap.innerHTML = `
    <table class="w-full min-w-max text-sm">
      <thead>
        <tr>
          <th class="p-3 text-left text-muted">Spec</th>
          ${head}
        </tr>
      </thead>
      <tbody>${body}</tbody>
    </table>
  `;
};

const render = () => {
  const favIds = getFavorites();
  const favLaptops = allLaptops.filter((l) => favIds.includes(l.id));

  if (favLaptops.length === 0) {
    picker.innerHTML = "";
    showMessage(tableWrap, "You have no favorites yet. Save some laptops first.");
    return;
  }

  const selected = getCompare().filter((id) => favIds.includes(id));
  saveCompare(selected);

  picker.innerHTML = favLaptops
    .map((l) => `
      <label class="flex items-center gap-2 rounded-lg border border-line bg-card p-3 text-sm">
        <input type="checkbox" data-id="${l.id}" class="text-accent" ${selected.includes(l.id) ? "checked" : ""} />
        <span>${l.name}</span>
      </label>
    `)
    .join("");

  renderTable(favLaptops.filter((l) => selected.includes(l.id)));
};

picker.addEventListener("change", (event) => {
  const result = toggleCompare(Number(event.target.dataset.id));
  msg.textContent = result === "full" ? "You can compare up to 4 laptops only." : "";
  render();
});

async function init() {
  const laptops = await fetchLaptops();

  if (!laptops) {
    showMessage(tableWrap, "Could not load the laptop data. Use Live Server.");
    return;
  }

  allLaptops = laptops;
  render();
}

init();