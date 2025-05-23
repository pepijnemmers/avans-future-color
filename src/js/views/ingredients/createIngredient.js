import { Structure } from "../../enums/Structure.js";

/**
 * @returns {template} The template with the form to create an ingredient
 */
export function renderIngredientForm() {
    const template = document.createElement("template");
    template.innerHTML = `        
        <form data-action="createIngredient" class="min-w-[50%]">
            <h2>Nieuw ingrediënt</h2>
            <p>Vul de velden en klik op opslaan. Het ingrediënt komt in de lijst te staan.</p>
            <div class="form-group">
                <label for="hexColor">Kleur</label>
                <input type="color" id="hexColor" name="hexColor" value="#007a55" required />
                <p class="text-sm text-gray-500">Klik om een kleur te kiezen</p>
            </div>

            <div class="form-group">
                <label for="mixTime">Mengtijd</label>
                <input type="number" id="mixTime" name="mixTime" placeholder="Mengtijd in milliseconden (ms)" required />
            </div>

            <div class="form-group">
                <label for="mixSpeed">Mengsnelheid</label>
                <input type="number" id="mixSpeed" name="mixSpeed" placeholder="Snelheid in rotaties per minuut (rpm)" required />
            </div>

            <div class="form-group">
                <label for="structure">Structuur</label>
                <select id="structure" name="structure" required>
                    <option value="" selected disabled>Kies een structuur</option>
                    ${Object.values(Structure).map(
                        (s) => `<option value="${s}">${s}</option>`
                    )}
                </select>
            </div>

            <div class="text-end">
                <button type="submit" class="btn-primary">Opslaan</button>
            </div>
        </form>
    `;
    return template;
}
