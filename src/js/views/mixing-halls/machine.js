import { Machine } from "../../models/Machine.js";
import { MachineStatus } from "../../enums/MachineStatus.js";

/**
 * @param {Machine} machine
 * @returns {HTMLElement} The machine element
 */
export function renderMachine(machine, status) {
    status ??= MachineStatus.EMPTY;

    const machineElement = document.createElement("div");
    machineElement.classList.add("mix-machine");

    machineElement.innerHTML = `
        <div class="card">
            <div class="flex justify-between items-center pb-2 mb-4 border-b border-gray-200">
                <h3>Machine</h3>
                <form data-action="deleteMachine" class="flex align-center">
                    <input type="hidden" name="id" value="${machine.id}" />
                    <button type="submit" 
                        class="[all:unset] ${
                            status !== MachineStatus.EMPTY
                                ? "!cursor-not-allowed !grayscale !opacity-75"
                                : "!cursor-pointer"
                        }" ${status !== MachineStatus.EMPTY ? "disabled" : ""}>
                        <img src="/src/assets/images/delete.svg" alt="Verwijder" height="18" width="18" />
                    </button>
                </form>
            </div>

            <div class="flex justify-between items-center dropzone" 
                data-id="${machine.id}">
                <p class="text-center text-gray-600 italic py-8 px-4 !mb-0 max-w-[230px]">
                    Drag & drop een verf pot om te mengen
                </p>
            </div>
            
            <div class="border-t border-gray-200 mt-4 pt-4 **:!mb-0">
                <div class="flex justify-between items-center">
                    <p class="text-gray-600">Status</p>
                    ${
                        status === MachineStatus.EMPTY
                            ? "<p class='text-emerald-700 font-bold text-xl'>Vrij</p>"
                            : `<progress
                                    value="${65}" 
                                    max="100" 
                                    class="[&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg   [&::-webkit-progress-bar]:bg-gray-300 [&::-webkit-progress-value]:bg-emerald-700 [&::-moz-progress-bar]:bg-gray-300"
                                ></progress>`
                    }
                </div>
                <div class="flex justify-between items-center">
                    <p class="text-gray-600">Mengsnelheid</p>
                    <p class="font-bold text-xl">${machine.mixSpeed} rpm</p>
                </div>
            </div>
        </div>
    `;
    return machineElement;
}
