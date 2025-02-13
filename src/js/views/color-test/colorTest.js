/**
 * @returns {template} The template with the color test page
 */
export function renderColorTestPanel() {
    const template = document.createElement("template");
    template.innerHTML = `
        <h1>Kleuren test</h1>
    `;
    return template;
}
