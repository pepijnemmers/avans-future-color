import { ColorService } from "../../services/ColorService.js";

/**
 * @returns {template} The template with the color test page
 */
export function renderColorTestPanel() {
    const gridItems = service.getColorGridItems();
    console.log(gridItems);

    const template = document.createElement("template");
    template.innerHTML = renderGrid(gridItems);
    return template;
}

// Service
const service = ColorService.getInstance();

// Render grid
function renderGrid(gridItems) {
    // Get colors in correct format
    const gridItemsWithColorFormat = [];
    gridItems.forEach((item) => {
        if (item) {
            const color = service.colorToSelectedFormat(item);
            gridItemsWithColorFormat.push(color);
        } else {
            gridItemsWithColorFormat.push(null);
        }
    });

    // Create the grid container
    const tiles = document.createElement("div");
    tiles.classList.add(
        "tiles",
        "grid",
        "grid-cols-3",
        "grid-rows-3",
        "border",
        "border-gray-200"
    );

    // Create the grid items
    for (let i = 0; i < 9; i++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        if (!gridItems[i]) {
            tile.innerHTML = `
                <div class="color-grid-tile" data-id="${i}">
                    <div class="dropzone">Drag & drop een verfpot</div>
                </div>
            `;
        } else {
            tile.innerHTML = `
                <div class="color-grid-tile">
                    <div class="absolute inset-0" style="background-color: ${gridItems[i]}">
                        <div class="mx-auto w-fit font-bold p-1 bg-white rounded-b-md">${gridItemsWithColorFormat[i]}</div>

                        <form data-action="triadicModal" class="absolute top-[50%] translate-y-[-50%] w-fit font-bold p-1 bg-white rounded-e-md flex">
                            <input type="hidden" name="color" value="${gridItems[i]}">	
                            <button type="submit" class="min-w-5 min-h-5 cursor-pointer">
                                <img src="/src/assets/images/triadic.svg" alt="triadic" width="21" height="21">
                            </button>
                        </form>

                        <form data-action="deleteColorFromTestGrid" class="absolute top-full left-[50%] translate-y-[-100%] translate-x-[-50%] w-fit font-bold p-1 bg-white rounded-t-md flex">
                            <input type="hidden" name="gridItem" value="${i}">	
                            <button type="submit" class="min-w-5 min-h-5 cursor-pointer">
                                <img src="/src/assets/images/delete.svg" alt="triadic" width="21" height="21">
                            </button>
                        </form>
                    </div>
                </div>
            `;
        }
        tiles.appendChild(tile);
    }

    return tiles.outerHTML;
}
