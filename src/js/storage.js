const FAV_KEY = "favorites";
const THEME_KEY = "theme";

export function getFavorites() {
  const saved = localStorage.getItem(FAV_KEY);
  if (saved === null) return [];
  return JSON.parse(saved);
}

export function saveFavorites(ids) {
  localStorage.setItem(FAV_KEY, JSON.stringify(ids));
}

export function isFavorite(id) {
  return getFavorites().includes(id);
}

export function toggleFavorite(id) {
  const ids = getFavorites();
  if (ids.includes(id)) {
    saveFavorites(ids.filter((x) => x !== id));
    return false;
  }
  ids.push(id);
  saveFavorites(ids);
  return true;
}

export const clearFavorites = () => saveFavorites([]);

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || "battery";
}
// Apply the selected theme by setting or removing data-theme="performance" on <html> and saving to localStorage
export function applyTheme(theme) {
  if (theme === "performance") {
    document.documentElement.setAttribute("data-theme", "performance");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
  localStorage.setItem(THEME_KEY, theme);
}

export const initTheme = () => applyTheme(getTheme());
export function getCompare() {
  const saved = localStorage.getItem("compare");
  if (saved === null) return [];
  return JSON.parse(saved);
}

export function saveCompare(ids) {
  localStorage.setItem("compare", JSON.stringify(ids));
}

export function toggleCompare(id) {
  const ids = getCompare();
  if (ids.includes(id)) {
    saveCompare(ids.filter((x) => x !== id));
    return "removed";
  }
  if (ids.length >= 4) {
    return "full";
  }
  ids.push(id);
  saveCompare(ids);
  return "added";
}