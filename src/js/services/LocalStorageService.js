export class StorageService {
    /**
     * Save data to local storage
     * @param {string} key
     * @param {*} data object data to save, will be stringified to JSON
     */
    saveToLocalStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    /**
     * Get data from local storage
     * @param {string} key
     * @returns {*} object data from local storage, will be parsed to JSON
     */
    loadFromLocalStorage(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    }
}
