import { renderBucketPanel } from "./views/paintBucketPanel.js";
import { renderWeatherPanel } from "./views/weatherPanel.js";
import { renderIngredientPanel } from "./views/ingredientsPanel.js";
import { renderHomePanel } from "./views/home.js";

const app = document.getElementById("app");
renderApp();

function renderApp() {
    // create columns
    const leftColumn = document.createElement("div");
    leftColumn.className = "basis-2/3 space-y-4 flex flex-col";

    const rightColumn = document.createElement("div");
    rightColumn.className = "basis-1/3 space-y-4 flex flex-col";

    // create page panel
    const page = document.createElement("div");
    page.className = "card grow grid place-items-center";
    page.innerHTML = renderHomePanel();

    // fill columns
    leftColumn.innerHTML = page.outerHTML;
    leftColumn.innerHTML += renderBucketPanel();

    rightColumn.innerHTML = renderWeatherPanel();
    rightColumn.innerHTML += renderIngredientPanel();

    // fill app
    app.appendChild(leftColumn);
    app.appendChild(rightColumn);
}
