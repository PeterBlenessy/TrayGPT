import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', () => {
    const darkMode = ref("");

    function toggleDarkMode() {
        darkMode.value = !darkMode.value;
    }

    return {
        darkMode,
        toggleDarkMode
    }
})
