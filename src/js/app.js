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
import { PaintBucketService } from "./services/PaintBucketService.js";
import { renderMachineForm } from "./views/mixing-halls/createMachine.js";
import { MachineService } from "./services/MachineService.js";
import { ColorService } from "./services/ColorService.js";

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
const paintBucketService = PaintBucketService.getInstance();
const machineService = MachineService.getInstance();
const colorService = ColorService.getInstance();

//** RENDER APP **/
const app = document.getElementById("app");

// create columns
const leftColumn = document.createElement("div");
leftColumn.className = "basis-2/3 space-y-4 flex flex-col";

const rightColumn = document.createElement("div");
rightColumn.className = "basis-1/3 space-y-4 flex flex-col";

// create page panel
const page = document.createElement("div");
page.className = "card grow flex flex-col justify-center items-center";

page.appendChild(renderHomePanel().content.cloneNode(true));

// fill columns and app
refreshColumns();

//** NAVIGATION **/
function refreshApp(pageName) {
    if (!pageName) pageName = pageTitleElement.innerHTML.toLowerCase();

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

    // add event listeners
    document
        .getElementById("createIngredientBtn")
        ?.addEventListener("click", () =>
            updatePage(null, renderIngredientForm, "Ingrediënt aanmaken")
        );
    document
        .getElementById("createBucketBtn")
        ?.addEventListener("click", () => addPaintBucket());
    document
        .getElementById("createMachineBtn")
        ?.addEventListener("click", () =>
            updatePage(null, renderMachineForm, "Mengmachine aanmaken")
        );

    updateDnD();
}

navItems.forEach(({ btnId, panel, pageTitle }) => {
    document
        .getElementById(btnId)
        .addEventListener("click", () => updatePage(btnId, panel, pageTitle));
});

//** MODAL **/
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
const modalClose = document.getElementById("modalClose");
modalClose.addEventListener("click", () => modal.close());

function createModal(content, opener, isOpen) {
    modalContent.innerHTML = content;

    if (opener) opener.addEventListener("click", () => modal.showModal());
    if (isOpen) modal.showModal();
}

//** COLOR FORMAT **/
const colorFormat = document.getElementById("colorFormat");
const colorFormatFromStorage =
    storageService.loadFromLocalStorage("colorFormat");
colorFormat.value = /^[a-zA-Z]{3}$/.test(colorFormatFromStorage)
    ? colorFormatFromStorage
    : "hex";
storageService.saveToLocalStorage("colorFormat", colorFormat.value);

colorFormat.addEventListener("change", (e) => {
    storageService.saveToLocalStorage("colorFormat", e.target.value);
    refreshApp(null);
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
        case "refresh":
            refreshApp(null);
            break;
        case "createIngredient":
            addIngredient(formData);
            break;
        case "deleteIngredient":
            deleteIngredient(formData);
            break;
        case "deleteBucket":
            deletePaintBucket(formData);
            break;
        case "createMachine":
            addMachine(formData);
            break;
        case "deleteMachine":
            deleteMachine(formData);
            break;
        case "updateColorGrid":
            updateColorGrid(formData);
            break;
        case "triadicModal":
            colorTestTriadic(formData);
            break;
        case "deleteColorFromTestGrid":
            deleteColorFromTestGrid(formData);
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
    refreshApp();
}

// Paint buckets
function addPaintBucket(formData) {
    paintBucketService.addPaintBucket(formData?.get("ingredients") ?? []);
    refreshApp();
}
function deletePaintBucket(formData) {
    paintBucketService.removePaintBucket(formData.get("id"));
    refreshApp();
}
function addIngredientToBucket(bucketId, ingredientId) {
    const bucket = paintBucketService.getPainBucketById(bucketId);
    const ingredient = ingredientService.getIngredientById(ingredientId);

    if (!bucket || !ingredient) return;
    if (bucket.ingredients.find((i) => i.id == ingredient.id)) return;
    if (bucket.mixSpeed !== 0 && bucket.mixSpeed !== ingredient.mixSpeed) {
        alert("Mix snelheid komt niet overeen");
        return;
    }

    paintBucketService.addIngredientToPaintBucket(bucket, ingredient);
    refreshApp();
}

// Machines
function addMachine(formData) {
    machineService.addMachine(
        formData.get("mixSpeed"),
        formData.get("mixingHall")
    );
    refreshApp(`Menghal ${formData.get("mixingHall")}`);
}
function deleteMachine(formData) {
    machineService.removeMachine(formData.get("id"));
    refreshApp();
}
function addBucketToMachine(bucketId, machineId) {
    const added = machineService.addBucketToMachine(bucketId, machineId);
    if (!added) {
        alert(
            "Deze bucket kan niet worden toegevoegd aan deze machine. Mogelijk is de mix snelheid niet gelijk of wordt de machine al gebruikt."
        );
    } else {
        paintBucketService.removePaintBucket(bucketId);
    }
    refreshApp();
}

// Color test
function updateColorGrid(formData) {
    const rows = formData.get("rows");
    const columns = formData.get("columns");

    colorService.saveColorGridSize(rows, columns);
    refreshApp("Kleuren test");
}

function colorTestTriadic(formData) {
    const hexStartColor = formData.get("color");
    const triadicColors = colorService.getTriadicColors(hexStartColor);

    let content =
        "<h2>Triadic color scheme</h2><p>Verander evt. rechtboven in het scherm de kleurformat</p>";
    triadicColors.forEach((color) => {
        content += `
            <div class="flex items-center gap-4 mb-2">
                <div class="w-12 h-8" style="background-color: ${color}"></div> 
                <p class="font-bold !m-0">${colorService.colorToSelectedFormat(
                    color
                )}</p>
            </div>
        `;
    });
    createModal(content, null, true);
}

function deleteColorFromTestGrid(formData) {
    const gridItem = formData.get("gridItem");
    colorService.removeColorFromColorGrid(gridItem);
    refreshApp("Kleuren test");
}

/** DRAG AND DROP **/
function updateDnD() {
    // global function
    function addDragAndDropListeners(draggable, dropzone) {
        draggable.addEventListener("dragstart", () => {
            draggable.classList.add("dragging");
            dropzone.forEach((dz) => dz.classList.add("dropzone"));
        });

        draggable.addEventListener("dragend", () => {
            draggable.classList.remove("dragging");
            dropzone.forEach((dz) => dz.classList.remove("dropzone"));
        });
    }

    // ingredient to bucket drag and drop
    function addBucketListeners(bucket) {
        bucket.addEventListener("dragover", (e) => {
            e.preventDefault();
            bucket.classList.add("dragover");
        });
        bucket.addEventListener("dragleave", () =>
            bucket.classList.remove("dragover")
        );

        bucket.addEventListener("drop", (e) => {
            e.preventDefault();

            const draggable = document.querySelector(".dragging");
            if (draggable.dataset.draggableType !== "ingredient") {
                alert("Je kan alleen ingrediënten toevoegen");
                return;
            }

            const ingredientId = draggable.dataset.id;
            const bucketId = bucket.dataset.id;
            addIngredientToBucket(bucketId, ingredientId);
        });
    }

    // bucket to machine drag and drop
    function addMachineListeners(machine) {
        machine.addEventListener("dragover", (e) => {
            e.preventDefault();
            machine.classList.add("dragover");
        });
        machine.addEventListener("dragleave", () =>
            machine.classList.remove("dragover")
        );

        machine.addEventListener("drop", (e) => {
            e.preventDefault();
            machine.classList.remove("dragover");

            const draggable = document.querySelector(".dragging");
            if (
                !draggable ||
                !draggable.classList.contains("mixable") ||
                draggable.dataset.draggableType !== "bucket"
            ) {
                alert(
                    "Je kan alleen verf potten met meerdere ingredienten toevoegen"
                );
                return;
            }

            const bucketId = draggable.dataset.id;
            const machineId = machine.dataset.id;
            addBucketToMachine(bucketId, machineId);
        });
    }

    // bucket to color test drag and drop
    function addColorTestListeners(gridItem) {
        gridItem.addEventListener("dragover", (e) => {
            e.preventDefault();
            gridItem.classList.add("dragover");
        });
        gridItem.addEventListener("dragleave", () =>
            gridItem.classList.remove("dragover")
        );

        gridItem.addEventListener("drop", (e) => {
            e.preventDefault();

            const draggable = document.querySelector(".dragging");
            if (
                draggable.dataset.draggableType !== "bucket" ||
                draggable.classList.contains("mixable")
            ) {
                alert("Je kan alleen verf potten toevoegen met 1 kleur");
                gridItem.classList.remove("dragover");
                return;
            }

            const bucketId = draggable.dataset.id;
            const colorGridId = gridItem.dataset.id;
            colorService.addBucketToColorGrid(bucketId, colorGridId);
            refreshApp("Kleuren test");
        });
    }

    const ingredients = document.querySelectorAll(".ingredient");
    const buckets = document.querySelectorAll(".paint-bucket");
    ingredients.forEach((ingredient) =>
        addDragAndDropListeners(ingredient, buckets)
    );
    buckets.forEach(addBucketListeners);

    const mixableBuckets = document.querySelectorAll(".paint-bucket.mixable");
    const machines = document.querySelectorAll(".mix-machine");
    const colorGridItems = document.querySelectorAll(".color-grid-tile");

    mixableBuckets.forEach((bucket) =>
        addDragAndDropListeners(bucket, machines)
    );
    machines.forEach(addMachineListeners);
    colorGridItems.forEach(addColorTestListeners);
    buckets.forEach((bucket) => {
        addDragAndDropListeners(bucket, colorGridItems);
    });
}
