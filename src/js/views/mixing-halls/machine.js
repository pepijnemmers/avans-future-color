import { Machine } from "../../models/Machine.js";
import { MachineStatus } from "../../enums/MachineStatus.js";
import { bucketIcon } from "../paint-buckets/bucketIcon.js";

/**
 * Render a single machine element
 * @param {Machine} machine
 * @returns {HTMLElement} The machine element
 */
export function renderMachine(machine) {
    const status = machine.bucket ? MachineStatus.MIXING : MachineStatus.EMPTY;
    const machineElement = document.createElement("div");
    machineElement.classList.add("mix-machine");
    machineElement.dataset.id = machine.id;

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

            ${
                !machine.bucket
                    ? `
                        <div
                            class="flex justify-between items-center dropzone"
                            data-id="${machine.id}"
                        >
                            <p class="text-center text-gray-600 italic py-8 px-4 !mb-0 max-w-[230px]">
                                Drag & drop een verf pot om te mengen
                            </p>
                        </div>
                    `
                    : `
                        <div class="relative bg-gray-100 rounded-md min-w-[230px] min-h-[112px] flex justify-center items-center 
                            [&_svg]:h-[85px] [&_svg]:w-auto [&_svg]:animate-paintshake [&_svg]:drop-shadow-lg" >
                            ${bucketIcon(null, true)}
                        </div>
                    `
            }
            
            <div class="border-t border-gray-200 mt-4 pt-4 **:!mb-0">
                <div class="flex justify-between items-center">
                    <p class="text-gray-600">Status</p>
                    ${
                        status === MachineStatus.EMPTY
                            ? "<p class='text-emerald-700 font-bold text-xl'>Vrij</p>"
                            : "<p class='text-red-700 font-bold text-xl'>Bezig</p>"
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

// function getProgressPercentage(machine) {
//     let shakeDurationMs = 0;
//     if (machine.bucket) {
//         machine.bucket.ingredients.forEach((ingredient) => {
//             if (shakeDurationMs < ingredient.mixTime) {
//                 shakeDurationMs = ingredient.mixTime;
//             }
//         });
//     }
//     const shakeDurationInSecs = Math.round(shakeDurationMs / 1000);
//     const totalShakingNow = Date.now() - machine.shakeStart;
//     const shakingInSecs = Math.round(totalShakingNow / 1000);

//     console.log("shakedur", shakeDurationInSecs);
//     console.log("shakingInSecs", shakingInSecs);
//     console.log("now-start", Date.now() - machine.shakeStart);

//     return ((Date.now() - machine.shakeStart) / shakeDurationInSecs) * 100;
// }
