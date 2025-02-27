import { renderBucketPanel } from "./views/paint-buckets/paintBucketPanel.js";
import { renderWeatherPanel } from "./views/weather/weatherPanel.js";
import { renderIngredientPanel } from "./views/ingredients/ingredientsPanel.js";
import { renderIngredientForm } from "./views/ingredients/createIngredient.js";
import { renderHomePanel } from "./views/homePanel.js";
import { renderMixingHallOnePanel } from "./views/mixing-halls/mixingHallOne.js";
import { renderMixingHallTwoPanel } from "./views/mixing-halls/mixingHallTwo.js";
import { renderColorTestPanel } from "./views/color-test/colorTest.js";
import { IngredientService } from "./services/IngredientService.js";
import { StorageService } from "./services/LocalStorageService.js";

//** VARIABLES **/
const navItems = [
    {
        btnId: "navHome",
        panel: renderHomePanel,
        pageTitle: "Home",
    },
    {
        btnId: "navMixHall1",
        panel: renderMixingHallOnePanel,
        pageTitle: "Menghal 1",
    },
    {
        btnId: "navMixHall2",
        panel: renderMixingHallTwoPanel,
        pageTitle: "Menghal 2",
    },
    {
        btnId: "navColorTest",
        panel: renderColorTestPanel,
        pageTitle: "Kleuren test",
    },
];
const pageTitleElement = document.getElementById("pageTitle");

//** SERVICES **/
const storageService = new StorageService();
const ingredientService = IngredientService.getInstance();

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
function refreshApp(pageName) {
    const ni = navItems.find(
        (item) => item.pageTitle.toLowerCase() === pageName.toLowerCase()
    );
    if (ni) {
        updatePage(ni.btnId, ni.panel, ni.pageTitle);
    } else {
        console.error("Page not found");
    }
}

function updatePage(clickedBtnId, panel, pageTitle) {
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

    // update page title
    pageTitleElement.innerHTML = pageTitle ?? "";

    // refresh columns
    refreshColumns();
}

function refreshColumns() {
    // clear columns and app
    leftColumn.innerHTML = "";
    rightColumn.innerHTML = "";

    // fill columns
    leftColumn.appendChild(page);
    leftColumn.appendChild(renderBucketPanel().content.cloneNode(true));

    rightColumn.appendChild(renderWeatherPanel().content.cloneNode(true));
    rightColumn.appendChild(renderIngredientPanel().content.cloneNode(true));

    // fill app
    app.appendChild(leftColumn);
    app.appendChild(rightColumn);
}

navItems.forEach(({ btnId, panel, pageTitle }) => {
    document
        .getElementById(btnId)
        .addEventListener("click", () => updatePage(btnId, panel, pageTitle));
});

// Navigation in subpanels
document
    .getElementById("createIngredientBtn")
    ?.addEventListener("click", () => {
        updatePage(null, renderIngredientForm, "Ingrediënt aanmaken");
    });

//** EVENT LISTENERS **/
// Color format
const colorFormat = document.getElementById("colorFormat");
colorFormat.value = storageService.loadFromLocalStorage("colorFormat") || "hex";
storageService.saveToLocalStorage("colorFormat", colorFormat.value);

colorFormat.addEventListener("change", (e) => {
    storageService.saveToLocalStorage("colorFormat", e.target.value);
    refreshApp("home");
});

//** FORM SUBMISSIONS **/
document.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!e.target || !e.target.dataset.action) {
        console.error("Form or action not found");
        return;
    }

    const formData = new FormData(e.target);

    switch (e.target.dataset.action) {
        case "createIngredient":
            addIngredient(formData);
            break;
        case "deleteIngredient":
            deleteIngredient(formData);
            break;
        default:
            console.error("Form not found");
            break;
    }
});

// Ingredients
function addIngredient(formData) {
    ingredientService.addIngredient(
        formData.get("hexColor"),
        formData.get("mixTime"),
        formData.get("mixSpeed"),
        formData.get("structure")
    );
    refreshApp("home");
}
function deleteIngredient(formData) {
    ingredientService.removeIngredient(formData.get("id"));
    refreshApp("home");
}
