import { IngredientService } from "../../services/IngredientService.js";

/**
 * @returns {template} The template with the ingredient panel
 */
export function renderIngredientPanel() {
    const template = document.createElement("template");
    template.innerHTML = `
        <div class="card grow">
            <header class="flex justify-between align-center mb-2">
                <h2>Ingrediënten</h2>
                <button class="btn-dark" id="createIngredientBtn">Aanmaken</button>
            </header>
            <p>
                Sleep de ingrediënten naar een pot door de kwast te
                verslepen.
            </p>
            <div>
                ${renderIngredients()}
            </div>
        </div>
    `;
    return template;
}

const service = IngredientService.getInstance();

function renderIngredients() {
    const ingredients = service.getAllIngredients();
    if (ingredients.length === 0) {
        return `<p class="text-center text-gray-600 italic py-4">Er zijn nog geen ingrediënten</p>`;
    }

    return ingredients
        .map((ingredient) => renderIngredient(ingredient).outerHTML)
        .join("");
}

function renderIngredient(ingredient) {
    const ingredientElement = document.createElement("div");
    ingredientElement.classList.add("ingredient");
    // todo make ui for ingredient
    ingredientElement.innerHTML = `
        <div class="card">
            id: ${ingredient.id} <br>
            color: ${ingredient.hexColor}<br>
            mixtime: ${ingredient.mixTime}<br>
            speed: ${ingredient.mixSpeed}<br>
            structure: ${ingredient.structure}<br>
        </div>
    `;
    return ingredientElement;
}
