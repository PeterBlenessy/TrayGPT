import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {

    state: () => {
        return {
            // Application settings
            darkMode: false,

            // OpenAI settings
            apiKey: '',
            modelOptions: ['gpt-3.5-turbo', 'gpt-4'],
            model: 'gpt-4',
            maxTokens: 512,
            choices: 1,
            temperature: 0.2
        }
    },

    actions: {
        // Application settings
        setDarkMode(darkMode) {
            this.darkMode.value = darkMode;
        },

        // OpenAI API settings
        setApiKey(apiKey) {
            this.apiKey = apiKey;
        },

        setModel(model) {
            this.model = model;
        },

        setMaxTokens(maxTokens) {
            this.maxTokens = maxTokens;
        },

        setChoices(choices) {
            this.choices = choices;
        },

        setTemperature(temperature) {
            this.temperature = temperature;
        }
    }
})