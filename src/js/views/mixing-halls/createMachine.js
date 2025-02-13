/**
 * @returns {template} The template with the form to create an machine
 */
export function renderMachineForm() {
    const template = document.createElement("template");
    template.innerHTML = `
        <h1>Mengmachine toevoegen</h1>
    `;
    return template;
}
