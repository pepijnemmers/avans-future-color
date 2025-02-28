import { Ingredient } from "../../models/Ingredient.js";
import { ColorService } from "../../services/ColorService.js";
import { PaintBucketService } from "../../services/PaintBucketService.js";

/**
 * @returns {template} The template with the paint bucket panel
 */
export function renderBucketPanel() {
    const template = document.createElement("template");
    template.innerHTML = `
        <div class="card grow-0">
            <header class="flex justify-between align-center">
                <h2>Verfpotten</h2>
                <button class="btn-dark" id="createBucketBtn">Aanmaken</button>
            </header>
            <p>
                Sleep een pot (met een mix) naar een mengmachine om deze te
                mengen.
            </p>
            <div class="flex gap-2 flex-wrap">
                ${renderPaintBuckets()}
            </div>
        </div>
    `;
    return template;
}

// services
const service = PaintBucketService.getInstance();
const colorService = ColorService.getInstance();

// render all paint buckets
function renderPaintBuckets() {
    const paintBuckets = service.getAllPaintBuckets();
    if (paintBuckets.length === 0) {
        return `<p class="text-center text-gray-600 italic py-8 mx-auto">Er zijn nog geen verfpotten</p>`;
    }

    return paintBuckets
        .map((bucket) => renderBucket(bucket).outerHTML)
        .join("");
}

// render a single bucket
function renderBucket(bucket) {
    const bucketElement = document.createElement("div");
    bucketElement.classList.add("paint-bucket", "py-2", "px-4", "grow");
    if (bucket.ingredients.length > 1) {
        bucketElement.classList.add("mixable");
    }
    bucketElement.dataset.id = bucket.id;
    bucketElement.dataset.draggableType = "bucket";

    let color = "#787878";
    if (bucket.ingredients.length == 1) {
        color = bucket.ingredients[0].hexColor;
    } else if (bucket.ingredients.length > 1) {
        color = null;
    }

    let label =
        bucket.ingredients.length == 0
            ? "Leeg"
            : bucket.ingredients.length == 1
            ? colorService.colorToSelectedFormat(bucket.ingredients[0].hexColor)
            : `Mix (${bucket.ingredients.length})`;

    bucketElement.innerHTML = `
        <div class="flex flex-col items-center">
            <div 
                class="flex flex-col items-center"
                draggable="${bucket.ingredients.length > 1 ? "true" : "false"}"
            >
                ${color ? bucketIcon(color) : bucketIconGradient()}
                <p class="text-center font-medium !mb-0 mt-2">${label}</p>
            </div>
            <p class="text-sm mb-2 text-gray-500" title="Mengsnelheid">
                ${bucket.mixSpeed > 0 ? bucket.mixSpeed : "-"} rpm
            </p>
            <form data-action="deleteBucket">
                <input type="hidden" name="id" value="${bucket.id}" />
                <button type="submit" class="!cursor-pointer [all:unset]">
                    <img src="/src/assets/images/delete.svg" alt="Verwijder" height="18" width="18" />
                </button>
            </form>
        </div>
    `;
    return bucketElement;
}

// Icon
function bucketIcon(color) {
    return `
        <svg style="color: ${color}" width="36" height="50" viewBox="0 0 36 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.9996 15.5172C26.9667 15.5172 34.3446 12.4966 35.3014 8.61484C35.3709 8.90359 35.413 9.19314 35.413 9.4827V8.47665H35.332C35.3804 8.23961 35.413 8.00094 35.413 7.75853C35.413 3.47306 27.6176 0 18.0004 0C8.38427 0 0.58783 3.47306 0.58783 7.75869C0.58783 8.0011 0.620273 8.24074 0.668853 8.47681H0.58783V9.48286C0.58783 9.19331 0.630124 8.90375 0.699597 8.615C1.65506 12.4966 9.03246 15.5172 17.9996 15.5172ZM33.2098 6.38261C33.5211 6.88433 33.7041 7.40589 33.7041 7.94729C33.7041 8.1258 33.674 8.30171 33.6388 8.47762C33.5157 9.08633 33.178 9.66886 32.6652 10.2174C30.4127 12.6208 24.7045 14.332 17.9994 14.332C12.0181 14.332 6.81934 12.9725 4.16697 10.9718C3.16818 10.2182 2.54106 9.37345 2.35897 8.47681C2.32415 8.30171 2.2934 8.1258 2.2934 7.94647C2.2934 7.24217 2.58403 6.56746 3.10211 5.93356C5.17747 3.39583 11.0569 1.56224 17.9992 1.56224C25.343 1.56208 31.4911 3.6145 33.2098 6.38261Z" fill="currentColor"/>
            <path d="M17.9995 50C27.0723 50 34.5168 46.9077 35.3313 42.9595H35.4123V42.2413V29.1646C28.9192 34.8229 16.4397 29.6135 10.0638 24.5104C9.8676 24.5441 9.66393 24.5689 9.44328 24.5689C5.3775 24.5689 5.3775 18.5344 9.44328 18.5344C12.0833 18.5344 12.9971 21.073 12.2091 22.8578C18.1845 27.4245 31.4367 33.3252 35.4124 24.8661V9.48273C35.4124 13.7682 27.616 16.3793 17.9997 16.3793C8.38335 16.3793 0.586914 13.7684 0.586914 9.48289V42.2415V42.9596H0.667767C1.48225 46.9079 8.92674 50 17.9995 50Z" fill="currentColor"/>
        </svg>
    `;
}

function bucketIconGradient() {
    return `
        <svg
            width="36"
            height="50"
            viewBox="0 0 36 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M17.9996 15.5172C26.9667 15.5172 34.3446 12.4966 35.3014 8.61484C35.3709 8.90359 35.413 9.19314 35.413 9.4827V8.47665H35.332C35.3804 8.23961 35.413 8.00094 35.413 7.75853C35.413 3.47306 27.6176 0 18.0004 0C8.38427 0 0.58783 3.47306 0.58783 7.75869C0.58783 8.0011 0.620273 8.24074 0.668853 8.47681H0.58783V9.48286C0.58783 9.19331 0.630124 8.90375 0.699597 8.615C1.65506 12.4966 9.03246 15.5172 17.9996 15.5172ZM33.2098 6.38261C33.5211 6.88433 33.7041 7.40589 33.7041 7.94729C33.7041 8.1258 33.674 8.30171 33.6388 8.47762C33.5157 9.08633 33.178 9.66886 32.6652 10.2174C30.4127 12.6208 24.7045 14.332 17.9994 14.332C12.0181 14.332 6.81934 12.9725 4.16697 10.9718C3.16818 10.2182 2.54106 9.37345 2.35897 8.47681C2.32415 8.30171 2.2934 8.1258 2.2934 7.94647C2.2934 7.24217 2.58403 6.56746 3.10211 5.93356C5.17747 3.39583 11.0569 1.56224 17.9992 1.56224C25.343 1.56208 31.4911 3.6145 33.2098 6.38261Z"
                fill="url(#paint0_linear_21_327)"
            />
            <path
                d="M2.7439 7.94726C2.7439 8.12577 2.77379 8.30168 2.81507 8.47759C2.95537 9.06728 3.32822 9.63517 3.89555 10.1671C6.20396 12.3321 11.7289 13.9018 17.9993 13.9018C24.2697 13.9018 29.7951 12.333 32.103 10.1671C32.6703 9.63517 33.0423 9.06728 33.1829 8.47759C33.2252 8.30249 33.2551 8.12561 33.2551 7.94726C33.2551 7.09484 32.7564 6.28031 31.8866 5.53878C29.2724 4.30951 24.3848 3.71576 18.2739 3.71576C12.4385 3.71576 7.3089 4.25537 4.31986 5.37344C3.32312 6.15789 2.7439 7.03127 2.7439 7.94726ZM7.4842 7.14996C9.90862 7.83865 28.1204 8.56896 26.6024 7.14996C25.085 5.73095 23.9461 5.18468 23.9461 5.18468C23.9461 5.18468 32.9791 5.94735 32.1998 8.47678C31.9448 9.30611 30.6403 10.3242 27.6139 11.5681C27.6139 11.5681 28.8787 10.8992 29.0686 9.74377C29.1389 9.31911 26.0411 8.79755 22.2431 8.47678C18.2544 8.13959 13.4968 8.02513 10.8019 8.47678C9.09074 8.7639 8.20985 9.27652 8.89727 10.1088C8.89727 10.1088 6.38877 10.0486 4.76592 9.37927C4.76592 9.37927 4.25532 9.00972 3.97437 8.47678C3.40924 7.40342 3.7831 5.66364 11.1731 4.92081C11.1731 4.92081 5.05927 6.46126 7.4842 7.14996Z"
                fill="url(#paint1_linear_21_327)"
            />
            <path
                d="M17.9995 50C27.0723 50 34.5168 46.9077 35.3313 42.9595H35.4123V42.2413V29.1646C28.9192 34.8229 16.4397 29.6135 10.0638 24.5104C9.8676 24.5441 9.66393 24.5689 9.44328 24.5689C5.3775 24.5689 5.3775 18.5344 9.44328 18.5344C12.0833 18.5344 12.9971 21.073 12.2091 22.8578C18.1845 27.4245 31.4367 33.3252 35.4124 24.8661V9.48273C35.4124 13.7682 27.616 16.3793 17.9997 16.3793C8.38335 16.3793 0.586914 13.7684 0.586914 9.48289V42.2415V42.9596H0.667767C1.48225 46.9079 8.92674 50 17.9995 50Z"
                fill="url(#paint2_linear_21_327)"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_21_327"
                    x1="0.58783"
                    y1="7.75861"
                    x2="35.413"
                    y2="7.75861"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stop-color="#FF0000" />
                    <stop offset="0.25" stop-color="#DCA100" />
                    <stop offset="0.5" stop-color="#009E18" />
                    <stop offset="0.75" stop-color="#003DAF" />
                    <stop offset="1" stop-color="#F200FF" />
                </linearGradient>
                <linearGradient
                    id="paint1_linear_21_327"
                    x1="2.7439"
                    y1="8.80877"
                    x2="33.2551"
                    y2="8.80877"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stop-color="#FF0000" />
                    <stop offset="0.25" stop-color="#DCA100" />
                    <stop offset="0.5" stop-color="#009E18" />
                    <stop offset="0.75" stop-color="#003DAF" />
                    <stop offset="1" stop-color="#F200FF" />
                </linearGradient>
                <linearGradient
                    id="paint2_linear_21_327"
                    x1="0.586914"
                    y1="29.7414"
                    x2="35.4124"
                    y2="29.7414"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stop-color="#FF0000" />
                    <stop offset="0.25" stop-color="#DCA100" />
                    <stop offset="0.5" stop-color="#009E18" />
                    <stop offset="0.75" stop-color="#003DAF" />
                    <stop offset="1" stop-color="#F200FF" />
                </linearGradient>
            </defs>
        </svg>
    `;
}
