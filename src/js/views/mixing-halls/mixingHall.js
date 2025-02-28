import { MachineStatus } from "../../enums/MachineStatus.js";
import { MachineService } from "../../services/MachineService.js";
import { renderMachine } from "./machine.js";

/**
 * @returns {template} The template with mixing hall
 */
export function renderMixingHallPanel(mixingHall) {
    const template = document.createElement("template");
    template.innerHTML = `
        <div class="w-full h-full">
            <header class="flex justify-end align-center mb-2">
                <button class="btn-dark" id="createMachineBtn">Nieuwe machine</button>
            </header>
            <div class="flex flex-wrap gap-4">
                ${renderMachines(mixingHall)}
            </div>
        </div>
    `;
    return template;
}

// services
const service = MachineService.getInstance();

// render all machines
function renderMachines(mixingHall) {
    const machines = service.getAllMachinesByMixingHall(mixingHall);
    if (machines.length === 0) {
        return `<p class="text-center text-gray-600 italic py-4 w-full">Er zijn nog geen machines in deze menghal</p>`;
    }

    let status = MachineStatus.EMPTY; // todo: get status from machine

    return machines
        .map((machine) => renderMachine(machine, status).outerHTML)
        .join("");
}
