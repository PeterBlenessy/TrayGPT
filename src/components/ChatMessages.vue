<template>
    <q-list>
        <q-item v-if="loading">
            <q-item-section avatar top>
                <q-icon rounded name="computer" color="primary" />
            </q-item-section>
            <q-item-section top>
                <q-item-label>
                    <q-skeleton type="text" width="100%" />
                    <q-skeleton type="text" width="75%" />
                </q-item-label>
            </q-item-section>
        </q-item>

        <div v-for="message in chatMessages" :key="message.content">
            <q-item>
                <q-item-section avatar top>
                    <q-icon rounded :name="message.role == 'user' ? 'account_box' : 'computer'"
                        :color="message.role == 'user' ? 'deep-orange' : 'primary'" />
                </q-item-section>
                <q-item-section top>
                    <q-item-label>
                        <q-markdown :show-copy=true copy-icon="content_copy" :src="message.content" :plugins="mdPlugins" />
                    </q-item-label>
                </q-item-section>
            </q-item>
        </div>
    </q-list>
</template>

<script>
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from 'src/stores/settings-store.js'
import { useConversationsStore } from 'src/stores/conversations-store.js'
import { useI18n } from 'vue-i18n'
import markdownItMermaid from '@datatraccorporation/markdown-it-mermaid'

export default {
    name: 'ChatMessages',
    setup() {
        const $q = useQuasar()
        const { t } = useI18n()

        const conversationsStore = useConversationsStore()
        const { chatMessages, systemMessage, userInput, loading } = storeToRefs(conversationsStore)

        const settingsStore = useSettingsStore()
        const { useConversationMode, apiKey, model, maxTokens, choices, temperature } = storeToRefs(settingsStore)

        const conversationView = ref(null)

        watch(userInput, () => {
            if (userInput.value != '') {
                handleUserInput()
            }
        })

        //Handle user input
        async function handleUserInput() {

            // Store question in conversation
            let message = { "role": "user", "content": userInput.value }
            userInput.value = ''

            // Add the question to the chat
            chatMessages.value.unshift(message)

            // In the chatMessages array, the last message is first, while OpenAI is expecting it to be last.
            // This is due to the presentation chosen, i.e. last messaeg on top in the UI.
            // With plain assignment, using reverse() to get to the right order, affects the original too.
            // To clone the array of message objects, we have a couple of options.
            // Read more: https://gomakethings.com/the-best-way-to-clone-an-array-or-object-with-vanilla-js/
            // The spread operator is chosen for its performance, i.e [...chatMessages.value]
            let messages = !useConversationMode.value ? [message] : [...chatMessages.value]
            const requestOptions = {
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + apiKey.value || process.env.OPENAI_API_KEY,
                },
                "body": JSON.stringify({
                    "model": model.value,
                    "messages": [
                        { "role": "system", "content": systemMessage.value },
                        ...messages.reverse()
                    ],
                    "max_tokens": maxTokens.value,
                    "temperature": temperature.value,
                    "stream": false,
                    "n": choices.value,
                    "stop": ["\nUSER: ", "\nAI: "]
                }),
            }

            loading.value = true
            fetch("https://api.openai.com/v1/chat/completions", requestOptions)
                .then(response => {
                    if (!response.ok) throw new Error(response.status)

                    return response.json()
                })
                .then(jsonResponse => {
                    // Extract the message from the response
                    message = jsonResponse.choices[0].message
                    // Add the response to the chat messages
                    chatMessages.value.unshift(message)
                })
                .catch(error => {
                    let errorMessage = ''

                    if (error.response) {
                        errorMessage = error.response.status + '< /br>' + error.response.data
                    } else {
                        const path = 'apiErrors.' + error.message

                        // Check if error message is defined in i18n language files
                        if ((path + '.message') == t(path + '.message')) {
                            errorMessage = "Unknown error occured: " + error.message
                            console.log(errorMessage)
                        } else {
                            errorMessage = t(path + '.message') + '</br>' + t(path + '.solution')
                        }
                    }

                    $q.notify({
                        type: 'negative',
                        position: 'top',
                        html: true,
                        progress: true,
                        message: errorMessage,
                        actions: [{
                            icon: 'close',
                            color: 'white',
                            handler: () => { /* ... */ }
                        }]
                    })
                })
                .finally(() => {
                    loading.value = false
                })
        }

        return {
            loading,
            chatMessages,
            conversationView,
            mdPlugins: [markdownItMermaid]
        }
    }
}
</script>
<style lang="sass">
// Markdown div styling
.q-markdown
    padding-right: 45px 

// Copy-to-clipboard notification
.text-amber
    color: $deep-orange !important

// Copy-to-clipboard icon
.q-markdown__copy
    position: absolute
    top: 0px
    right: 0px
    color: $deep-orange !important
</style>
