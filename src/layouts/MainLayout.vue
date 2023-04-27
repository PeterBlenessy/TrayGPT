<template>
    <q-layout view="hHh lpr fFf">
        <q-header :class="darkMode == true ? 'bg-grey-10' : 'bg-white'">
            <q-toolbar class="no-padding" rounded-borders>
                <q-input autofocus filled placeholder="Ask your question" style="min-width: 100%; max-width: 100%;"
                    color="deep-orange" @keydown.enter="handleUserInput" v-model="userInput">
                    <template v-slot:loading>
                        <q-spinner-comment color="deep-orange" />
                    </template>

                    <template v-slot:append>
                        <q-btn @click="handleUserInput" round dense flat icon="send" color="deep-orange" />
                        <q-btn @click="() => { showSettings = true }" round dense flat icon="settings"
                            color="deep-orange" />
                    </template>
                </q-input>
                <q-dialog v-model="showSettings" position="top" transition-show="slide-down">
                    <AppSettings />
                </q-dialog>
            </q-toolbar>
        </q-header>

        <q-page-container>
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
                                        <q-markdown :show-copy="message.role == 'user' ? false : true"
                                            copy-icon="content_copy" no-line-numbers :src="message.content"
                                            :plugins="mdPlugins" />
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
import { defineComponent, ref, onMounted, watch } from 'vue';
import { useSettingsStore } from 'src/stores/settings-store.js';
import { useConversationsStore } from 'src/stores/conversations-store.js';
import { storeToRefs } from 'pinia';
import AppSettings from "src/components/AppSettings.vue";
import { useQuasar } from 'quasar';
import markdownItMermaid from '@datatraccorporation/markdown-it-mermaid'

export default defineComponent({
    name: "MainLayout",

    components: {
        AppSettings,
    },

    setup() {
        const $q = useQuasar();
        const userInput = ref('')
        const conversationId = ref('');
        const conversation = ref([]);
        const conversationView = ref(null);
        const loading = ref(false);
        const store = useConversationsStore();

        const settingsStore = useSettingsStore();
        const { darkMode, apiKey, model, maxTokens, choices, temperature } = storeToRefs(settingsStore);

        // watch(userInput, () => {
        //     conversation.value.push({ role: "user", content: userInput.value });
        //     handleUserInput();
        // });

        // Sets Quasar dark mode plugin value based on stored mode.
        function setDarkMode() {
            $q.dark.set(darkMode.value)
        }
        // Make sure to set the stored dark mode for app
        onMounted(() => setDarkMode());
        // Watch runtime changes to dark mode
        watch(darkMode, () => setDarkMode());

        async function handleUserInput() {

            // Store question in conversation
            let message = { role: "user", content: userInput.value };
            userInput.value = ''

            // Add the question to the conversation list
            conversation.value.unshift(message);

            // Store the question
            store.addMessage(conversationId, message);

            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + apiKey.value || process.env.OPENAI_API_KEY,
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

            fetch("https://api.openai.com/v1/chat/completions", requestOptions)
                .then(response => {
                    if (!response.ok) throw new Error(response.status)

                    return response.json()
                })
                .then(jsonResponse => {
                    // Format the response as HTML markup
                    message = jsonResponse.choices[0].message;
                    conversationId.value = jsonResponse.id;
                    conversation.value.shift();
                    // Add the response to the conversation list
                    conversation.value.unshift(message);
                    // Store the response
                    store.addMessage(conversationId, message);
                })
                .catch(error => {
                    console.log(error)

                    const apiErrors = {
                        '401': { message: 'Invalid Authentication.', solution: 'Ensure the API key used is correct.' },
                        '429': { message: 'Rate limit reached for requests, or the engine may be overloaded.', solution: 'Please retry your requests after a brief wait.' },
                        '500': { message: 'The server had an error while processing your request.', solution: 'Retry your request after a brief wait and contact us if the issue persists.' },
                    }

                    $q.notify({
                        type: 'negative',
                        position: 'top',
                        html: true,
                        message: apiErrors[error.message].message + '</br>' + apiErrors[error.message].solution
                    })
                })
                .finally(() => {
                    loading.value = false;
                })
        }

        return {
            userInput,
            handleUserInput,
            conversation,
            conversationView,
            loading,
            showSettings: ref(false),
            darkMode,
            mdPlugins: [markdownItMermaid]
        };
    },
});
</script>
<style lang="sass">
.q-markdown__copy
  position: absolute
  top: 0px
  right: 0px
  color: $deep-orange

</style>
