<template>
    <q-layout view="hHh lpr fFf">
        <q-header :class="darkHeader == true ? 'bg-grey-10' : 'bg-white'">
            <q-toolbar class="no-padding" rounded-borders>
                <q-input autofocus filled :placeholder="$t('questionInput.placeholder')"
                    style="min-width: 100%; max-width: 100%;" color="deep-orange" @keydown.enter="handleUserInput"
                    v-model="userInput">
                    <template v-slot:loading>
                        <q-spinner-comment color="deep-orange" />
                    </template>

                    <template v-slot:append>
                        <q-btn @click="handleUserInput" round dense flat icon="send" color="deep-orange">
                            <q-tooltip transition-show="scale" transition-hide="scale">
                                {{ $t('questionInput.tooltip.send') }}
                            </q-tooltip>
                        </q-btn>
                        <q-btn @click="restoreLastConversation" round dense flat icon="restore" color="deep-orange">
                            <q-tooltip transition-show="scale" transition-hide="scale">
                                {{ $t('questionInput.tooltip.restore') }}
                            </q-tooltip>
                        </q-btn>
                        <q-btn @click="clearConversation" round dense flat icon="clear_all" color="deep-orange">
                            <q-tooltip transition-show="scale" transition-hide="scale">
                                {{ $t('questionInput.tooltip.clear') }}
                            </q-tooltip>
                        </q-btn>
                        <q-btn @click="() => { showSettings = true }" round dense flat icon="tune" color="deep-orange">
                            <q-tooltip transition-show="scale" transition-hide="scale">
                                {{ $t('questionInput.tooltip.settings') }}
                            </q-tooltip>
                        </q-btn>

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
                                <q-item-label v-if="loading && message.role == 'computer' && message.content !== ''">
                                    <q-skeleton type="text" width="100%" />
                                    <q-skeleton type="text" width="75%" />
                                </q-item-label>
                                <q-item-label v-else>
                                    <q-markdown :show-copy=true copy-icon="content_copy" no-line-numbers
                                        :src="message.content" :plugins="mdPlugins" />
                                </q-item-label>
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
import { defineComponent, ref, onMounted, watch, onUpdated } from 'vue';
import { useSettingsStore } from 'src/stores/settings-store.js';
import { useConversationsStore } from 'src/stores/conversations-store.js';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import AppSettings from "src/components/AppSettings.vue";
import markdownItMermaid from '@datatraccorporation/markdown-it-mermaid'
import { useI18n } from 'vue-i18n';

export default defineComponent({
    name: "MainLayout",

    components: {
        AppSettings,
    },

    setup() {
        const $q = useQuasar();
        const { t } = useI18n();

        const userInput = ref('')
        const conversationView = ref(null);
        const conversationId = ref('');
        const conversation = ref([]);
        const loading = ref(false);
        const darkHeader = ref(true);

        const conversationsStore = useConversationsStore();
        const { conversations } = storeToRefs(conversationsStore);

        const settingsStore = useSettingsStore();
        const { darkMode, storeConversations, useConversationMode, apiKey, model, maxTokens, choices, temperature } = storeToRefs(settingsStore);

        // Sets Quasar dark mode plugin value based on stored mode.
        function setDarkMode() {
            $q.dark.set(darkMode.value)
            darkHeader.value = $q.dark.isActive ? true : false
        }
        // When app starts, set the stored dark mode for app
        onMounted(() => setDarkMode());
        // Watch runtime changes to dark mode
        watch(darkMode, () => setDarkMode());

        // Load conversation from store
        function restoreLastConversation() {
            if (storeConversations && conversations.value.length > 0) {
                conversation.value = conversation.value.concat(conversations.value);
            }
        }
        // Clear conversation, both in ui and in store
        function clearConversation() {
            conversation.value = [];
            conversations.value = [];
        }

        //Handle user input
        async function handleUserInput() {

            // Store question in conversation
            let message = { role: "user", content: userInput.value };
            userInput.value = ''

            // Add the question to the conversation list
            conversation.value.unshift(message);

            // Store the question
            if (storeConversations.value) conversations.value.unshift(message);

            let messages = !useConversationMode.value ? [message] : conversations.value;
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + apiKey.value || process.env.OPENAI_API_KEY,
                },
                body: JSON.stringify({
                    model: model.value,
                    messages: [
                        { role: "system", content: "You are a helpful assistant. You respond like you were giving examples of how to format text in markdown format using GitHub flavor." },
                        ...messages.reverse()
                    ],
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
                    // Extract the message from the response
                    message = jsonResponse.choices[0].message;
                    conversationId.value = jsonResponse.id;
                    conversation.value.shift();
                    // Add the response to the conversation list
                    conversation.value.unshift(message);
                    // Store the response
                    if (storeConversations.value) conversations.value.unshift(message);
                })
                .catch(error => {
                    let errorMessage = ''

                    if (error.response) {
                        errorMessage = error.response.status + '< /br>' + error.response.data
                    } else {
                        const path = 'apiErrors.' + error.message;
                        errorMessage = t(path + '.message') + '</br>' + t(path + '.solution')
                    }

                    $q.notify({
                        type: 'negative',
                        position: 'top',
                        html: true,
                        message: errorMessage
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
            restoreLastConversation,
            clearConversation,
            darkHeader,
            mdPlugins: [markdownItMermaid]
        };
    },
});
</script>
<style lang="sass">
.q-markdown
    padding-right: 45px 

.q-markdown__copy
    position: absolute
    top: 0px
    right: 0px
    color: $deep-orange !important
    fill: $deep-orange
</style>
