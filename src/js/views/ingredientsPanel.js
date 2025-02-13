/**
 * Renders the ingredient panel
 * @returns {string} HTML for the ingredient panel
 */
export function renderIngredientPanel() {
    return `
        <div class="card grow">
            <header class="flex justify-between align-center mb-2">
                <h2>Ingrediënten</h2>
                <button class="btn-dark">Aanmaken</button>
            </header>
            <p>
                Sleep de ingrediënten naar een pot door de kwast te
                verslepen.
            </p>
            <div id="ingredients">
                <!-- Ingredients will be loaded here dynamically -->
            </div>
        </div>
    `;
}
