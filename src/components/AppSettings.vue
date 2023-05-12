<template>
    <q-card style="width: 350px;">
        <q-list>

            <q-item>
                <q-item-section avatar>
                    <q-icon name="dark_mode" color="deep-orange" />
                </q-item-section>
                <q-item-section>
                    <q-item-label>{{ $t('settings.darkMode.label') }}</q-item-label>
                    <q-item-label caption>{{ $t('settings.darkMode.caption') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-toggle v-model="darkMode" toggle-indeterminate indeterminate-value='auto' flat dense round
                        color="deep-orange" />
                </q-item-section>
            </q-item>

            <q-separator />

            <!-- Add option to store conversations -->
            <q-item>
                <q-item-section avatar>
                    <q-icon name="save" color="deep-orange" />
                </q-item-section>
                <q-item-section>
                    <q-item-label>{{ $t('settings.storeConversations.label') }}</q-item-label>
                    <q-item-label caption>{{ $t('settings.storeConversations.caption') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-toggle v-model="storeConversations" flat dense round color="deep-orange" />
                </q-item-section>
            </q-item>

            <!-- Add option to store conversations -->
            <q-item>
                <q-item-section avatar>
                    <q-icon name="chat" color="deep-orange" />
                </q-item-section>
                <q-item-section>
                    <q-item-label>{{ $t('settings.useConversationMode.label') }}</q-item-label>
                    <q-item-label caption>{{ $t('settings.useConversationMode.caption') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-toggle v-model="useConversationMode" flat dense round color="deep-orange" />
                </q-item-section>
            </q-item>

            <q-separator />

            <q-item>
                <q-item-section avatar>
                    <q-icon name="key" color="deep-orange" />
                </q-item-section>
                <q-item-section>
                    <q-input :model-value="apiKey" @change="val => { apiKey = val }"
                        :label="$t('settings.openAI.apiKey.label')" :placeholder="$t('settings.openAI.apiKey.placeholder')"
                        dense />
                    <q-tooltip max-width="300px" transition-show="scale" transition-hide="scale">
                        {{ $t('settings.openAI.apiKey.tooltip') }}
                    </q-tooltip>
                </q-item-section>
            </q-item>

            <q-item>
                <q-item-section avatar>
                    <q-icon name="model_training" color="deep-orange" />
                </q-item-section>
                <q-item-section>
                    <q-item-label caption>{{ $t('settings.openAI.model.label') }}</q-item-label>
                    <q-select v-model="model" :options="modelOptions" dense options-dense />
                    <q-tooltip max-width="300px" transition-show="scale" transition-hide="scale">
                        {{ $t('settings.openAI.model.tooltip') }}
                    </q-tooltip>
                </q-item-section>
            </q-item>

            <q-item>
                <q-item-section avatar>
                    <q-icon name="short_text" color="deep-orange" />
                </q-item-section>
                <q-item-section>
                    <q-item-label caption>{{ $t('settings.openAI.maxTokens.label') }} ({{ maxTokens }})</q-item-label>
                    <q-slider :model-value="maxTokens" @change="val => { maxTokens = val }" :min="64" :max="4096" :step="16"
                        :markers="1024" label color="deep-orange" />
                    <q-tooltip max-width="300px" transition-show="scale" transition-hide="scale">
                        {{ $t('settings.openAI.maxTokens.tooltip') }}
                    </q-tooltip>
                </q-item-section>
            </q-item>

            <q-item>
                <q-item-section avatar>
                    <q-icon name="alt_route" color="deep-orange" />
                </q-item-section>
                <q-item-section>
                    <q-item-label caption>{{ $t('settings.openAI.choices.label') }} ({{ choices }})</q-item-label>
                    <q-slider :model-value="choices" @change="val => { choices = val }" snap :min="1" :max="4" :step="1"
                        :markers="1" label color="deep-orange" />
                    <q-tooltip max-width="300px" transition-show="scale" transition-hide="scale">
                        {{ $t('settings.openAI.choices.tooltip') }}
                    </q-tooltip>
                </q-item-section>
            </q-item>

            <q-item>
                <q-item-section avatar>
                    <q-icon name="thermostat" color="deep-orange" />
                </q-item-section>
                <q-item-section>
                    <q-item-label caption>{{ $t('settings.openAI.temperature.label') }} ({{ temperature }})</q-item-label>
                    <q-slider :model-value="temperature" @change="val => { temperature = val }" :min="0" :max="2"
                        :step="0.1" :markers="0.5" label color="deep-orange" />
                    <q-tooltip max-width="300px" transition-show="scale" transition-hide="scale">
                        {{ $t('settings.openAI.temperature.tooltip') }}
                    </q-tooltip>

                </q-item-section>
            </q-item>
        </q-list>
    </q-card>
</template>

<script>
import { defineComponent } from "vue";
import { useSettingsStore } from 'src/stores/settings-store.js'
import { storeToRefs } from "pinia";

export default defineComponent({
    name: "AppSettings",

    setup() {
        const settingsStore = useSettingsStore();
        const { darkMode, storeConversations, useConversationMode, apiKey, model, modelOptions, maxTokens, choices, temperature } = storeToRefs(settingsStore);

        return {
            darkMode,
            storeConversations,
            useConversationMode,
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
