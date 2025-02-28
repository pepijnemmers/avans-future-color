/**
 * @returns {template} The template with mixing hall 1
 */
export function renderMixingHallOnePanel() {
    const template = document.createElement("template");
    template.innerHTML = `
        <div class="w-full h-full">
            <header class="flex justify-end align-center mb-2">
                <button class="btn-dark" id="createMachineBtn">Nieuwe machine</button>
            </header>
            <div class="flex flex-wrap justify-between gap-4">
                <div class="mix-machine">machine 1</div>
                <div class="mix-machine">machine 2</div>
                <div class="mix-machine">machine 3</div>
                <div class="mix-machine">machine 4</div>
            </div>
        </div>
    `;
    return template;
}
