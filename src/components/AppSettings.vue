<template>
    <q-list>

        <q-expansion-item :duration="100" icon="tune" color="deep-orange" label="Application settings">

            <q-item>
                <q-item-section avatar>
                    <q-icon name="dark_mode" color="deep-orange" />
                </q-item-section>
                <q-item-section>
                    <q-item-label>Dark mode</q-item-label>
                    <q-item-label caption>Toggle dark/light mode</q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-toggle v-model="darkMode" flat dense round color="deep-orange" />
                </q-item-section>
            </q-item>
        </q-expansion-item>

        <q-separator />

        <q-expansion-item :duration="100" icon="tune" color="deep-orange" label="OpenAI settings" caption="">
            <q-item>
                <q-item-section avatar>
                    <q-icon name="key" color="deep-orange" />
                </q-item-section>
                <q-item-section>
                    <q-input v-model="apiKey" label="OpenAI API Key" placeholder="OpenAI API Key" dense />
                </q-item-section>
            </q-item>

            <q-item>
                <q-item-section avatar>
                    <q-icon name="model_training" color="deep-orange" />
                </q-item-section>
                <q-item-section>
                    <q-item-label caption>AI model</q-item-label>
                    <q-select v-model="model" :options="modelOptions" dense options-dense />
                </q-item-section>
            </q-item>

            <q-item>
                <q-item-section avatar>
                    <q-icon name="short_text" color="deep-orange" />
                </q-item-section>
                <q-item-section>
                    <q-item-label caption>Max tokens ({{ maxTokens }})</q-item-label>
                    <q-slider v-model="maxTokens" :min="64" :max="4096" :step="16" :markers="1024" label
                        color="deep-orange" />
                    <q-tooltip max-width="300px">The maximum number of tokens to generate in the chat
                        completion.</q-tooltip>
                </q-item-section>
            </q-item>


            <q-item>
                <q-item-section avatar>
                    <q-icon name="alt_route" color="deep-orange" />
                </q-item-section>
                <q-item-section>
                    <q-item-label caption>Number of choices ({{ choices }})</q-item-label>
                    <q-slider v-model="choices" snap :min="1" :max="4" :step="1" :markers="1" label color="deep-orange" />
                    <q-tooltip max-width="300px">Number of chat completion choices to generate for each input message.
                    </q-tooltip>
                </q-item-section>
            </q-item>

            <q-item>
                <q-item-section avatar>
                    <q-icon name="thermostat" color="deep-orange" />
                </q-item-section>
                <q-item-section>
                    <q-item-label caption>Temperature ({{ temperature }})</q-item-label>
                    <q-slider v-model="temperature" :min="0" :max="2" :step="0.1" :markers="0.5" label
                        color="deep-orange" />
                    <q-tooltip max-width="300px">Temperature is a measure of the randomness in the text. Lower values will
                        result in more predictable text, while higher values will result in more surprising text.
                    </q-tooltip>

                </q-item-section>
            </q-item>
        </q-expansion-item>
    </q-list>
</template>

<script>
import { defineComponent, watch } from "vue";
import { useSettingsStore } from 'src/stores/settings-store.js'
import { useQuasar } from 'quasar';
import { storeToRefs } from "pinia";

export default defineComponent({
    name: "AppSettings",

    setup() {
        const $q = useQuasar();
        const settingsStore = useSettingsStore();

        const { darkMode, apiKey, model, modelOptions, maxTokens, choices, temperature } = storeToRefs(settingsStore);

        watch(darkMode, () => $q.dark.set(darkMode.value));

        return {
            darkMode,
            apiKey,
            model,
            modelOptions,
            maxTokens,
            choices,
            temperature
        };
    },

});
</script>
