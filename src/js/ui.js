import { isFavorite, toggleFavorite, getTheme, applyTheme } from "./storage.js";
export function renderLaptopCard(laptop, removeMode = false) {
  const saved = isFavorite(laptop.id);
  const label = removeMode ? "✕ Remove" : saved ? "♥ Saved" : "♡ Save";
  return `
    <article class="laptop-card">
      <div class="flex h-44 w-full items-center justify-center overflow-hidden rounded-lg bg-white p-3">
  <img src="${laptop.image}" alt="${laptop.name}" class="max-h-full max-w-full object-contain">
</div>
      <p class="mt-3 text-sm text-muted">${laptop.brand} · ${laptop.category}</p>
      <h3 class="text-lg font-bold">${laptop.name}</h3>
      <p class="text-2xl font-bold text-accent">$${laptop.price}</p>
      <ul class="mt-2 space-y-1 text-sm text-muted">
        <li>${laptop.cpu}</li>
        <li>${laptop.ramGB} GB RAM · ${laptop.storageGB} GB storage</li>
        <li>${laptop.batteryHours} h battery · ${laptop.weightKg} kg</li>
      </ul>
      <div class="mt-4 flex gap-2">
        <a href="details.html?id=${laptop.id}" class="btn-action flex-1 text-center">Details</a>
        <button data-id="${laptop.id}" class="fav-btn btn-action">${label}</button>
      </div>
    </article>`;
}
export const statCard = (label, value) => `
  <div class="laptop-card">
    <p class="text-sm text-muted">${label}</p>
    <p class="mt-2 text-2xl font-bold text-accent">${value}</p>
  </div>
`;

export const renderSkeleton = () => `
  <div class="laptop-card animate-pulse">
    <div class="h-44 rounded-lg bg-line"></div>
    <div class="mt-3 h-4 w-1/3 rounded bg-line"></div>
    <div class="mt-2 h-6 w-2/3 rounded bg-line"></div>
    <div class="mt-2 h-8 w-1/3 rounded bg-line"></div>
    <div class="mt-3 h-4 w-full rounded bg-line"></div>
    <div class="mt-2 h-4 w-full rounded bg-line"></div>
    <div class="mt-4 h-10 w-full rounded bg-line"></div>
  </div>`;

export const showSkeletons = (container, count = 6) => {
  container.innerHTML = Array.from({ length: count }, renderSkeleton).join("");
};

export const showMessage = (container, text) => {
  container.innerHTML = `<p class="col-span-full rounded-xl border border-line bg-card p-6 text-center">${text}</p>`;
};

export function setupFavoriteButtons(container, onChange) {
  container.addEventListener("click", (event) => {
    const button = event.target.closest(".fav-btn");
    if (!button) return;
    const id = Number(button.dataset.id);
    const saved = toggleFavorite(id);
    button.textContent = saved ? "♥ Saved" : "♡ Save";
    if (onChange) onChange(id, saved);
  });
}
export function renderHeader(activePage) {
  const links = [
    { href: "index.html", label: "Home" },
    { href: "laptops.html", label: "Laptops" },
    { href: "favorites.html", label: "Favorites" },
    { href: "compare.html", label: "Compare" },
  ];

  const linksHtml = links
    .map((link) => {
      const style = link.href === activePage ? "font-bold text-accent" : "text-ink";
      return `<a href="${link.href}" class="${style} transition hover:text-accent">${link.label}</a>`;
    })
    .join("");

  document.getElementById("site-header").innerHTML = `
    <div class="mx-auto flex max-w-6xl items-center justify-between p-4">
      <a href="index.html" class="text-xl font-bold text-accent">Laptop Finder</a>
      <nav class="hidden items-center gap-6 md:flex">${linksHtml}</nav>
      <div class="flex items-center gap-2">
        <button id="theme-btn" class="btn-action"></button>
        <button id="menu-btn" class="btn-action md:hidden">Menu</button>
      </div>
    </div>
    <nav id="mobile-menu" class="hidden border-t border-line p-4 md:hidden">
      <div class="flex flex-col gap-3">${linksHtml}</div>
    </nav>`;

  const themeButton = document.getElementById("theme-btn");
  const showThemeName = () => {
    themeButton.textContent = getTheme() === "performance" ? "⚡ Performance" : "🔋 Battery Saver";
  };
  showThemeName();

  themeButton.addEventListener("click", () => {
    applyTheme(getTheme() === "performance" ? "battery" : "performance");
    showThemeName();
  });

  document.getElementById("menu-btn").addEventListener("click", () => {
    document.getElementById("mobile-menu").classList.toggle("hidden");
  });
}