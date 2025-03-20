import { Ingredient } from "../../models/Ingredient.js";
import { ColorService } from "../../services/ColorService.js";
import { PaintBucketService } from "../../services/PaintBucketService.js";
import { bucketIcon } from "./bucketIcon.js";

/**
 * @returns {template} The template with the paint bucket panel
 */
export function renderBucketPanel() {
    const template = document.createElement("template");
    template.innerHTML = `
        <div class="card grow-0">
            <header class="flex justify-between align-center">
                <h2>Verfpotten</h2>
                <button class="btn-dark" id="createBucketBtn">Aanmaken</button>
            </header>
            <p>
                Sleep een pot (met een mix) naar een mengmachine om deze te
                mengen.
            </p>
            <div class="flex gap-2 flex-wrap">
                ${renderPaintBuckets()}
            </div>
        </div>
    `;
    return template;
}

// services
const service = PaintBucketService.getInstance();
const colorService = ColorService.getInstance();

// render all paint buckets
function renderPaintBuckets() {
    const paintBuckets = service.getAllPaintBuckets();
    if (paintBuckets.length === 0) {
        return `<p class="text-center text-gray-600 italic py-8 mx-auto">Er zijn nog geen verfpotten</p>`;
    }

    return paintBuckets
        .map((bucket) => renderBucket(bucket).outerHTML)
        .join("");
}

// render a single bucket
function renderBucket(bucket) {
    const bucketElement = document.createElement("div");
    bucketElement.classList.add("paint-bucket", "py-2", "px-4", "grow");
    if (bucket.ingredients.length > 1) {
        bucketElement.classList.add("mixable");
    }
    bucketElement.dataset.id = bucket.id;
    bucketElement.dataset.draggableType = "bucket";

    let color = "#787878";
    if (bucket.ingredients.length == 1) {
        color = bucket.ingredients[0].hexColor;
    } else if (bucket.ingredients.length > 1) {
        color = null;
    }

    let label =
        bucket.ingredients.length == 0
            ? "Leeg"
            : bucket.ingredients.length == 1
            ? colorService.colorToSelectedFormat(bucket.ingredients[0].hexColor)
            : `Mix (${bucket.ingredients.length})`;

    bucketElement.innerHTML = `
        <div class="flex flex-col items-center">
            <div 
                class="flex flex-col items-center"
                draggable="${bucket.ingredients.length > 0 ? "true" : "false"}"
            >
                ${color ? bucketIcon(color, false) : bucketIcon(null, true)}
                <p class="text-center font-medium !mb-0 mt-2">${label}</p>
            </div>
            <p class="text-sm mb-2 text-gray-500" title="Mengsnelheid">
                ${bucket.mixSpeed > 0 ? bucket.mixSpeed : "-"} rpm
            </p>
            <form data-action="deleteBucket">
                <input type="hidden" name="id" value="${bucket.id}" />
                <button type="submit" class="!cursor-pointer [all:unset]">
                    <img src="/src/assets/images/delete.svg" alt="Verwijder" height="18" width="18" />
                </button>
            </form>
        </div>
    `;
    return bucketElement;
}
