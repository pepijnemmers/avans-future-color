/**
 * Renders panel with paint buckets
 * Paint buckets will be rendered in the div with id paint-buckets
 * @returns {string} HTML for the paint buckets panel
 */
export function renderBucketPanel() {
    return `
        <div class="card grow-0">
            <header class="flex justify-between align-center">
                <h2>Verfpotten</h2>
                <button class="btn-dark">Aanmaken</button>
            </header>
            <p>
                Sleep een pot (met een mix) naar een mengmachine om deze te
                mengen.
            </p>
            <div id="paint-buckets">
                <p class="text-center text-gray-600 italic py-4">Er zijn nog geen verfpotten</p>
            </div> 
        </div>
    `;
}
