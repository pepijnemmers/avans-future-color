/**
 * @returns {template} The template with the welcome/home panel
 */
export function renderHomePanel() {
    const template = document.createElement("template");
    template.innerHTML = `
        <div class="flex space-x-4">
            <img src="/src/assets/images/logo-icon.png" alt="Logo" />
            <img src="/src/assets/images/logo.svg" alt="Logo" />
        </div>
    `;
    return template;
}
