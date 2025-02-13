/**
 * @returns {template} The template with the form to create an ingredient
 */
export function renderIngredientForm() {
    const template = document.createElement("template");
    template.innerHTML = `
        <h1>Ingrediënt aanmaken</h1>
    `;
    return template;
}
