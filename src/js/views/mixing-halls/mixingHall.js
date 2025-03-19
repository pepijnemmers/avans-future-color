import { MachineStatus } from "../../enums/MachineStatus.js";
import { MachineService } from "../../services/MachineService.js";
import { renderMachine } from "./machine.js";

/**
 * @returns {template} The template with mixing hall
 */
export function renderMixingHallPanel(mixingHall) {
    let machines = machineService.getAllMachinesByMixingHall(mixingHall);
    renderMachines(mixingHall, machines);

    const template = document.createElement("template");
    template.innerHTML = `
        <div class="w-full h-full">
            <header class="flex justify-end align-center mb-2">
                <button class="btn-dark" id="createMachineBtn">Nieuwe machine</button>
            </header>
            <div class="flex flex-wrap gap-4" id="mixingHall">
                ${
                    machines.length > 0
                        ? machines
                              .map(
                                  (machine) => renderMachine(machine, machineService).outerHTML
                              )
                              .join("")
                        : '<p class="text-center text-gray-600 italic py-4 w-full">Er zijn nog geen machines in deze menghal</p>'
                }
            </div>
        </div>
    `;
    return template;
}

// services
const machineService = MachineService.getInstance();

// render all machines
function renderMachines(mixingHall, machines) {
    let mixingHallElement = document.getElementById("mixingHall");

    setInterval(() => {
        mixingHallElement ??= document.getElementById("mixingHall");
        if (!mixingHallElement) return;

        // check if a machine has changed
        const newMachines = machineService.getAllMachinesByMixingHall(mixingHall);
        if (!_.isEqual(machines, newMachines)) {
            mixingHallElement.innerHTML = machines
                .map((machine) => renderMachine(machine, machineService).outerHTML)
                .join("");
            machines = newMachines;
        }
    }, 1000);
}
