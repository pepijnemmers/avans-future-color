import { MachineService } from "../../services/MachineService.js";
import { WeatherService } from "../../services/WeatherService.js";
import { renderMachine } from "./machine.js";

/**
 * @returns {template} The template with mixing hall
 */
export function renderMixingHallPanel(mixingHall) {
    let machines = machineService.getAllMachinesByMixingHall(mixingHall);
    const weatherIsAbove35degrees = weatherService.isAbove35degrees();

    const template = document.createElement("template");
    template.innerHTML = `
        <div class="w-full h-full">
            <header class="flex justify-end align-center mb-2">
                <button class="btn-dark" id="createMachineBtn">Nieuwe machine</button>
            </header>
            <div id="mixingHall" class="flex flex-wrap gap-4 ${
                weatherIsAbove35degrees ? "onlyOneEnabled" : ""
            }">
                ${
                    machines.length > 0
                        ? machines
                              .map(
                                  (machine, index) =>
                                      renderMachine(
                                          machine,
                                          machineService,
                                          weatherIsAbove35degrees && index !== 0
                                              ? true
                                              : false
                                      ).outerHTML
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
const weatherService = WeatherService.getInstance();
