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
                    <q-input v-model="openaiKey" label="OpenAI API Key" placeholder="OpenAI API Key" dense />
                    <q-tooltip max-width="300px"></q-tooltip>
                </q-item-section>
            </q-item>

            <q-item>
                <q-item-section avatar>
                    <q-icon name="box" color="deep-orange" />
                </q-item-section>
                <q-item-section>
                    <q-select v-model="aiModel" :options="aiModelOptions" label="AI model" dense options-dense />
                    <q-tooltip max-width="300px">ID of the model to use.</q-tooltip>
                </q-item-section>
            </q-item>

            <q-item>
                <q-item-section avatar>
                    <q-icon name="box" color="deep-orange" />
                </q-item-section>
                <q-item-section>
                    <q-input v-model="maxTokens" label="Max tokens" placeholder="Max tokens" dense />
                    <q-slider v-model="maxTokens" :min="16" :max="4096" :step="16" :markers="0.5" label
                        color="deep-orange" />
                    <q-tooltip max-width="300px">The maximum number of tokens to generate in the chat completion. The total
                        length of
                        input tokens and generated tokens is limited by the model's context length.</q-tooltip>
                </q-item-section>
            </q-item>

            <q-item>
                <q-item-section avatar>
                    <q-icon name="alt_route" color="deep-orange" />
                </q-item-section>
                <q-item-section>
                    <q-input v-model="choices" label="Number of choices" placeholder="Number of choices" dense />
                    <q-tooltip max-width="300px">Number of chat completion choices to generate for each input
                        message.</q-tooltip>
                </q-item-section>
            </q-item>

            <q-item>
                <q-item-section avatar>
                    <q-icon name="thermostat" color="deep-orange" />
                </q-item-section>
                <q-item-section>
                    <q-tooltip max-width="300px">Temperature is a measure of the randomness in the text. Lower values will
                        result in
                        more predictable text, while higher values will result in more surprising text.</q-tooltip>
                    <q-slider v-model="temperature" :min="0" :max="2" :step="0.1" :markers="0.5" label
                        color="deep-orange" />
                </q-item-section>
            </q-item>
        </q-expansion-item>
    </q-list>
</template>

<script>
import { defineComponent, onMounted, ref, watch } from "vue";
import { useQuasar } from 'quasar';

export default defineComponent({
    name: "AppSettings",

    setup() {
        const $q = useQuasar();
        const darkMode = ref(false);

        function setDarkMode() {
            $q.dark.set(darkMode.value)
        }

        const toggleDarkMode = () => { $q.dark.set(darkMode.value); }

        onMounted(setDarkMode);
        watch(darkMode, () => { toggleDarkMode() });

        return {
            darkMode,
            openaiKey: ref(''),
            aiModel: ref(''),
            aiModelOptions: ref(['gpt-3.5-turbo', 'gpt-4.0']),
            maxTokens: ref(512),
            choices: ref(1),
            temperature: ref(0)
        };
    },

});
</script>
