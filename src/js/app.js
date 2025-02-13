import { renderBucketPanel } from "./views/paint-buckets/paintBucketPanel.js";
import { renderWeatherPanel } from "./views/weather/weatherPanel.js";
import { renderIngredientPanel } from "./views/ingredients/ingredientsPanel.js";
import { renderIngredientForm } from "./views/ingredients/createIngredient.js";
import { renderHomePanel } from "./views/homePanel.js";
import { renderMixingHallOnePanel } from "./views/mixing-halls/mixingHallOne.js";
import { renderMixingHallTwoPanel } from "./views/mixing-halls/mixingHallTwo.js";
import { renderColorTestPanel } from "./views/color-test/colorTest.js";

//** VARIABLES **/
let colorFormat = "hex"; // hex | rgb | hsl

//** SERVICES **/
// const ingredientService = new IngredientService();

//** RENDER APP **/
const app = document.getElementById("app");

// create columns
const leftColumn = document.createElement("div");
leftColumn.className = "basis-2/3 space-y-4 flex flex-col";

const rightColumn = document.createElement("div");
rightColumn.className = "basis-1/3 space-y-4 flex flex-col";

// create page panel
const page = document.createElement("div");
page.className = "card grow grid place-items-center";

page.appendChild(renderHomePanel().content.cloneNode(true));

// fill columns
leftColumn.appendChild(page);
leftColumn.appendChild(renderBucketPanel().content.cloneNode(true));

rightColumn.appendChild(renderWeatherPanel().content.cloneNode(true));
rightColumn.appendChild(renderIngredientPanel().content.cloneNode(true));

// fill app
app.appendChild(leftColumn);
app.appendChild(rightColumn);

//** NAVIGATION **/
const navItems = [
    { btnId: "navHome", panel: renderHomePanel },
    { btnId: "navMixHall1", panel: renderMixingHallOnePanel },
    { btnId: "navMixHall2", panel: renderMixingHallTwoPanel },
    { btnId: "navColorTest", panel: renderColorTestPanel },
];

function updatePage(clickedBtnId, panel) {
    // clear and render new panel
    page.innerHTML = "";
    page.appendChild(panel().content.cloneNode(true));

    // set menu item active
    navItems.forEach(({ btnId }) => {
        document.getElementById(btnId).className = "btn-transparent";
    });
    if (clickedBtnId) {
        document.getElementById(clickedBtnId).className = "btn-light";
    }
}

navItems.forEach(({ btnId, panel }) => {
    document
        .getElementById(btnId)
        .addEventListener("click", () => updatePage(btnId, panel));
});

// Navigation in subpanels
document
    .getElementById("createIngredientBtn")
    ?.addEventListener("click", () => {
        updatePage(null, renderIngredientForm);
    });

//** EVENT LISTENERS **/
document.getElementById("colorFormat").addEventListener("change", (e) => {
    colorFormat = e.target.value;
});
