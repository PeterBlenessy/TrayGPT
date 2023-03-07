import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
    state: () => ({
        counter: 0,
        darkMode: true,
    }),
    getters: {
        getCount: (state) => state.counter,
        isDarkMode: (state) => state.darkMode,
    },
    actions: {
        increment() {
            this.counter++;
        },
        toggleDarkMode() {
            this.darkMode = !this.darkMode;
        }
    },
});
