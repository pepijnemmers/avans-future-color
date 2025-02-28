/**
 * @returns {template} The template with the form to create an machine
 */
export function renderMachineForm() {
    const template = document.createElement("template");
    template.innerHTML = `
        <form data-action="createMachine" class="min-w-[50%]">
            <h2>Nieuwe machine</h2>
            <p>Vul de velden en klik op opslaan. De machine is zichtbaar in de menghal.</p>

            <div class="form-group">
                <label for="mixSpeed">Mengsnelheid</label>
                <input type="number" id="mixSpeed" name="mixSpeed" placeholder="Snelheid in rotaties per minuut (rpm)" required />
            </div>

            <div class="form-group">
                <label for="mixingHall">Menghal</label>
                <select id="mixingHall" name="mixingHall" required>
                    <option value="" selected disabled>Kies een menghal</option>
                    <option value="1">Menghal 1</option>
                    <option value="2">Menghal 2</option>
                </select>
            </div>

            <div class="text-end">
                <button type="submit" class="btn-primary">Opslaan</button>
            </div>
        </form>
    `;
    return template;
}
