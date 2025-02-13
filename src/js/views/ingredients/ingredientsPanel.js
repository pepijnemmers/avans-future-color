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
            <div id="ingredients">
                <p class="text-center text-gray-600 italic py-4">Er zijn nog geen ingrediënten</p>
            </div>
        </div>
    `;
    return template;
}
