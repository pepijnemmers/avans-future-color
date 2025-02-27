import { IngredientService } from "../../services/IngredientService.js";
import { ColorService } from "../../services/ColorService.js";

/**
 * @returns {template} The template with the ingredient panel
 */
export function renderIngredientPanel() {
    const template = document.createElement("template");
    template.innerHTML = `
        <div class="card grow">
            <header class="flex justify-between align-center mb-2">
                <h2>Ingrediënten</h2>
                <button class="btn-dark" id="createIngredientBtn">Aanmaken</button>
            </header>
            <p>
                Sleep de ingrediënten naar een pot door de kwast te
                verslepen.
            </p>
            <div>
                ${renderIngredients()}
            </div>
        </div>
    `;
    return template;
}

// services
const service = IngredientService.getInstance();
const colorService = ColorService.getInstance();

// render all ingredients
function renderIngredients() {
    const ingredients = service.getAllIngredients();
    if (ingredients.length === 0) {
        return `<p class="text-center text-gray-600 italic py-4">Er zijn nog geen ingrediënten</p>`;
    }

    return ingredients
        .map((ingredient) => renderIngredient(ingredient).outerHTML)
        .join("");
}

// render a single ingredient
function renderIngredient(ingredient) {
    const ingredientElement = document.createElement("div");
    ingredientElement.classList.add("ingredient");
    ingredientElement.dataset.id = ingredient.id;

    const icons = {
        glad: gladIcon,
        korrel: korrelIcon,
        "grove korrel": groveKorrelIcon,
        slijmerig: slijmerigIcon,
    };
    const image =
        icons[ingredient.structure.toLowerCase()]?.(ingredient.hexColor) ||
        null;
    const color = colorService.colorToSelectedFormat(ingredient.hexColor);

    ingredientElement.innerHTML = `
        <div class="card flex justify-between items-center">
            <div class="flex gap-4">
                <div draggable="true">${image ?? ""}</div>
                <div>
                    <h3>
                        ${color} • ${ingredient.structure}
                    </h3>
                    <p class="text-sm !mb-0">
                       <span class="text-gray-500">Mengtijd:</span> 
                       ${ingredient.mixTime} ms
                    </p>
                    <p class="text-sm !mb-0">
                       <span class="text-gray-500">Mengsnelheid:</span> 
                       ${ingredient.mixSpeed} rpm
                    </p>
                </div>
            </div>
            <div>
                <form data-action="deleteIngredient">
                    <input type="hidden" name="id" value="${ingredient.id}" />
                    <button type="submit" class="!cursor-pointer [all:unset]">
                        <img src="/src/assets/images/delete.svg" alt="Verwijder" />
                    </button>
                </form>
            </div>
        </div>
    `;
    return ingredientElement;
}

// ICONS
function gladIcon(hexColor) {
    return `
        <svg width="50" height="50" viewBox="0 0 50 50" style="color: ${hexColor}" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.0301 14.7625C14.6201 16.1709 13.9365 19.212 15.3892 22.5734C16.9334 26.144 16.0712 27.7797 14.8277 29.1606C13.639 30.4773 3.50879 39.2297 1.50372 41.2347C-0.501242 43.2412 -0.501242 46.4913 1.50372 48.4963C3.50869 50.5012 6.75886 50.5012 8.76383 48.4963C10.7688 46.4913 19.4433 36.6235 20.8381 35.1724C22.1259 33.8327 23.8562 33.0667 27.4252 34.6109C30.7883 36.0635 33.8278 35.3784 35.2361 33.9685L37.1587 32.049L17.9496 12.8414L16.0301 14.7625ZM6.48269 46.2137C5.73807 46.9583 4.52958 46.9583 3.78496 46.2137C3.04033 45.469 3.04033 44.2621 3.78496 43.5175C4.52958 42.7729 5.73807 42.7729 6.48269 43.5175C7.22732 44.2621 7.22732 45.469 6.48269 46.2137Z" fill="currentColor"/>
            <path d="M48.8682 15.5895L40.0364 6.75624C39.7022 6.42207 39.1804 6.35947 38.7775 6.60673L34.2121 9.38386L36.9267 4.72999C37.1616 4.32716 37.096 3.81603 36.7664 3.48644L34.2824 1.00218C33.5851 0.304826 32.6223 -0.0567926 31.6396 0.00726946C30.6554 0.0713315 29.7475 0.556582 29.1478 1.33783L20.5114 12.5866L37.2853 29.3605L48.534 20.724C49.3137 20.1243 49.7989 19.2149 49.8646 18.2322C49.9287 17.2482 49.5655 16.2853 48.8682 15.5895Z" fill="currentColor"/>
        </svg>
    `;
}

function korrelIcon(hexColor) {
    return `
        <svg width="39" height="50" viewBox="0 0 39 50" style="color: ${hexColor}" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M38.0212 0.473666C36.7335 -0.568131 34.7788 0.164779 32.8309 2.12093C31.0625 3.85687 21.8165 13.1082 17.0626 18.7619C13.7135 22.3625 11.1747 25.7955 10.7883 28.1783C10.5437 29.685 10.8755 30.9276 11.4595 31.3993L13.34 32.9205C13.924 33.3929 15.209 33.4567 16.631 32.9026C18.8803 32.0256 21.705 28.8247 24.5249 24.7961C29.0578 18.9644 36.1689 7.98606 37.4961 5.89339C39.002 3.57972 39.3089 1.51488 38.0212 0.473666Z" fill="currentColor"/>
            <path d="M8.99616 31.4644C6.6944 31.0738 4.25544 31.9029 2.68298 33.8472C-1.08724 38.5091 -0.669561 46.3156 2.59928 50C2.59928 50 2.90192 49.5282 3.9777 48.6348C6.96041 46.1535 10.5637 45.3327 13.0636 42.2412C14.636 40.2962 14.9353 37.7374 14.0722 35.5694L8.99616 31.4644Z" fill="currentColor"/>
        </svg>
    `;
}

function groveKorrelIcon(hexColor) {
    return `
        <svg width="50" height="50" viewBox="0 0 50 50" style="color: ${hexColor}" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M49.3315 0.640546C48.1371 -0.553204 46.0754 -0.0200989 43.8911 1.75519C41.9105 3.326 31.5388 11.7171 26.1113 16.9402C22.3282 20.2323 19.3843 23.4414 18.7366 25.816L24.1552 31.2354C26.5305 30.5883 29.7396 27.6445 33.0318 23.8607C38.2554 18.4331 46.6466 8.06145 48.2168 6.08156C49.992 3.8967 50.5259 1.83566 49.3315 0.640546Z" fill="currentColor"/>
            <path d="M14.7571 29.6735L20.3265 35.2436L23.1122 32.4578L17.5421 26.8878L14.7571 29.6735Z" fill="currentColor"/>
            <path d="M0.471387 39.4596C-0.157129 40.0889 -0.157129 41.1081 0.471387 41.7373L8.2626 49.5285C8.8919 50.1571 9.91104 50.1571 10.5397 49.5285L14.8497 45.2178L4.78154 35.1502L0.471387 39.4596Z" fill="currentColor"/>
            <path d="M13.686 30.744C12.0798 32.3508 10.3119 29.619 6.93779 32.9938L5.91992 34.011L15.9883 44.08L17.0068 43.0621C20.3802 39.6881 17.649 37.9202 19.2561 36.314L13.686 30.744Z" fill="currentColor"/>
        </svg>
    `;
}

function slijmerigIcon(hexColor) {
    return ` 
        <svg width="41" height="50" viewBox="0 0 41 50" style="color: ${hexColor}" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32.2299 6.97861H31.5244C31.2724 5.00262 30.5416 3.42684 29.3824 2.25125C27.8705 0.750497 25.6781 0.00012207 22.8558 0.00012207H8.79455C3.12471 0.00012207 0 3.10167 0 8.72949C0 11.5309 0.755978 13.707 2.26794 15.2077C3.77989 16.7085 5.97221 17.4589 8.79455 17.4589H22.8558C27.8957 17.4589 30.9196 14.9826 31.5244 10.4804H32.2299C37.4966 10.4804 37.4966 11.1807 37.4966 15.708V20.3603C37.4966 24.8876 37.4966 25.5879 32.2299 25.5879H22.8558C15.3212 25.5879 14.2376 29.1397 14.0864 32.5914C11.8185 32.7415 9.37414 33.792 9.37414 37.794V44.7725C9.37414 49.0997 12.2469 50.0001 14.6408 50.0001H16.9844C19.3783 50.0001 22.251 49.0997 22.251 44.7725V37.794C22.251 33.842 19.8571 32.7415 17.5892 32.5914C17.7152 30.0652 18.4459 29.0647 22.8306 29.0647H32.2047C40.3945 29.0647 40.9993 25.763 40.9993 20.3353V15.708C41.0245 10.2803 40.4197 6.97861 32.2299 6.97861Z" fill="currentColor"/>
        </svg>
    `;
}
