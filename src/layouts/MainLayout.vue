<template>
    <q-layout view="hHh lpr fFf">
        <q-header :class="darkMode == true ? 'bg-grey-10' : 'bg-white'" style="z-index:10">
            <q-toolbar class="no-padding" rounded-borders>
                <q-input autofocus filled placeholder="Ask your question"
                    style="min-width: 800px; max-width: 800px;opacity100;" @keydown.enter="handleUserInput"
                    v-model="userInput">
                    <template v-slot:loading>
                        <q-spinner-comment color="deep-orange" />
                    </template>

                    <template v-slot:append>
                        <q-btn @click="handleUserInput" round dense flat icon="send" color="deep-orange" />
                        <q-btn @click="() => { showSettings = true }" round dense flat icon="settings"
                            color="deep-orange" />
                    </template>
                </q-input>
            </q-toolbar>

            <q-dialog v-model="showSettings" position="top">
                <AppSettings />
            </q-dialog>
        </q-header>

        <q-page-container style="z-index:-1√">
            <q-page>
                <q-list>
                    <div v-for="message in conversation" :key="message.id">
                        <q-item>
                            <q-item-section avatar top>
                                <q-icon rounded :name="message.role == 'user' ? 'account_box' : 'computer'"
                                    :color="message.role == 'user' ? 'deep-orange' : 'primary'" />
                            </q-item-section>
                            <q-item-section top>
                                <div class="markdown-body">
                                    <q-spinner-dots v-if="loading && message.role == 'computer'" color="primary"
                                        size="2em" />
                                    <q-item-label v-else>
                                        <VueShowdown :markdown="message.content" flavor="github"
                                            :options="{ emoji: true, tables: true, tasklists: true }" />
                                    </q-item-label>
                                </div>
                            </q-item-section>
                        </q-item>
                    </div>
                </q-list>

                <!-- place QPageScroller at end of page -->
                <q-page-scroller reverse position="bottom" :scroll-offset="20" :offset="[20, 20]">
                    <q-btn round dense icon="south" color="deep-orange" />
                </q-page-scroller>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useSettingsStore } from 'src/stores/settings-store.js';
import { useConversationsStore } from 'src/stores/conversations-store.js';
import { storeToRefs } from 'pinia';
import { VueShowdown } from 'vue-showdown';
import AppSettings from "src/components/AppSettings.vue";

export default defineComponent({
    name: "MainLayout",

    components: {
        VueShowdown,
        AppSettings,
    },

    setup() {
        const userInput = ref('')
        const conversationId = ref('');
        const conversation = ref([]);
        const conversationView = ref(null);
        const loading = ref(false);
        const store = useConversationsStore();

        const settingsStore = useSettingsStore();
        const { darkMode, apiKey, model, maxTokens, choices, temperature } = storeToRefs(settingsStore);

        // watch(userInput, () => {
        //     console.log("message changed")
        //     conversation.value.push({ role: "user", content: userInput.value });
        //     handleUserInput();
        // });

        async function handleUserInput() {

            // Store question in conversation
            let message = { role: "user", content: userInput.value };
            userInput.value = ''

            // Add the question to the conversation list
            conversation.value.unshift(message);

            // Store the question
            store.addMessage(conversationId, message);

            try {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + process.env.OPENAI_API_KEY || apiKey,
                    },
                    body: JSON.stringify({
                        model: model.value,
                        messages: [{
                            ...{ role: "system", content: "You are a helpful assistant. You respond like you were giving examples of how to format text in markdown format using GitHub flavor." },
                            ...message
                        }],
                        max_tokens: maxTokens.value,
                        temperature: temperature.value,
                        stream: false,
                        n: choices.value,
                        stop: ["\nUSER: ", "\nAI: "]
                    }),
                };

                loading.value = true;
                message = { role: "computer", content: '<q-spinner-dots color="primary" size="2em" />' };
                conversation.value.unshift(message);

                const response = await fetch("https://api.openai.com/v1/chat/completions", requestOptions);
                const jsonResponse = await response.json();

                // Format the response as HTML markup
                message = jsonResponse.choices[0].message;
                conversationId.value = jsonResponse.id;

                loading.value = false;
                conversation.value.shift();
                // Add the response to the conversation list
                conversation.value.unshift(message);

                // Store the response
                store.addMessage(conversationId, message);

            } catch (error) {
                console.error(error);
            }
        }

        return {
            userInput,
            handleUserInput,
            conversation,
            conversationView,
            loading,
            showSettings: ref(false),
            darkMode
        };
    },
});
</script>
