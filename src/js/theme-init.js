// Apply the saved theme before the page is drawn, to avoid a flash of the wrong theme
if (localStorage.getItem("theme") === "performance") {
  document.documentElement.setAttribute("data-theme", "performance");
}