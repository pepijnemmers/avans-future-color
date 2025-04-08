import { Machine } from "../../models/Machine.js";
import { MachineStatus } from "../../enums/MachineStatus.js";
import { bucketIcon } from "../paint-buckets/bucketIcon.js";
import { MachineService } from "../../services/MachineService.js";

let machineStatus;

/**
 * Render a single machine element
 * @param {Machine} machine
 * @param {MachineService} machineService
 * @returns {HTMLElement} The machine element
 */
export function renderMachine(machine, machineService) {
    checkMachineStatus(machine, machineService);
    machineStatus = machine.bucket ? MachineStatus.MIXING : MachineStatus.EMPTY;

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
                            machineStatus !== MachineStatus.EMPTY
                                ? "!cursor-not-allowed !grayscale !opacity-75"
                                : "!cursor-pointer"
                        }" ${
        machineStatus !== MachineStatus.EMPTY ? "disabled" : ""
    }>
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
                <div class="flex justify-between items-center" id="machineStatus">
                    <p class="text-gray-600">Status</p>
                    ${
                        machineStatus === MachineStatus.EMPTY
                            ? "<p class='text-emerald-700 font-bold text-xl'>Vrij</p>"
                            : "<progress id='machineProgressBar-" +
                              machine.id +
                              "' value='0' max='100' class='w-[50%] h-5 rounded-full'></progress>"
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

/**
 * Check the status of the machine and update the progress bar or save the new mix
 * @param {Machine} machine
 * @param {MachineService} machineService
 * @returns {MachineStatus | void} The status of the machine
 */
function checkMachineStatus(machine, machineService) {
    if (!machine.bucket) return;

    // shakestart, duration and endtime
    let shakeDurationMs = 0;
    machine.bucket.ingredients.forEach((ingredient) => {
        const mixTime = parseInt(ingredient.mixTime);
        if (shakeDurationMs < mixTime) {
            shakeDurationMs = mixTime;
        }
    });

    // update progress or save new bucket when done
    let intervalId;
    const refreshForm = document.getElementById("refreshForm");
    const submitEvent = new Event("submit", {
        bubbles: true,
        cancelable: true,
    });

    // todo: machines doesnt refresh well, probably because of the interval doesnt clear/end
    // !update, machine refreshes well, but the resetMachineAndSaveNewMix function runs 8 times atleast
    const updateProgress = () => {
        console.log("update progress");
        if (!machine.bucket) {
            clearInterval(intervalId);
            return;
        }

        const progress =
            ((Date.now() - machine.shakeStart) / shakeDurationMs) * 100;
        let progressBar = document.getElementById(
            "machineProgressBar-" + machine.id
        );
        if (progressBar) progressBar.value = progress;

        if (machine.shakeStart + shakeDurationMs < Date.now()) {
            if (!machineService) {
                console.error("MachineService not set");
                return;
            }

            machineService.resetMachineAndSaveNewMix(machine, shakeDurationMs);
            machineStatus = MachineStatus.EMPTY;
            clearInterval(intervalId);

            console.log("refreshForm");
            refreshForm.dispatchEvent(submitEvent);
        }
    };

    // Run instantly then every second
    updateProgress();
    intervalId = setInterval(updateProgress, 1000);
}
