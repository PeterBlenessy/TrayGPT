<template>
    <div class="q-pa-md full-width">

        <div v-for="message in conversation" :key="message.id">
            <q-list>
                <q-item>
                    <q-item-section top avatar>
                        <q-avatar :icon="message.role == 'user' ? 'account_box' : 'computer'" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>{{ message.content }}</q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>
        </div>

        <div style="position: sticky; bottom: 10px" class="bg-white">
            <q-input @keydown.enter="sendInput" :loading="loadingState" outlined type="text" v-model="input"
                label="Type your question...">
                <template v-slot:prepend>
                    <q-icon name="account_box" />
                </template>
                <template v-slot:append>
                    <q-btn @click="sendInput" round dense flat icon="send" />
                </template>
            </q-input>
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
import { useConversationsStore } from "src/stores/conversations-store.js";

export default {
    name: "ConversationBot",

    setup() {
        const input = ref("");
        const loadingState = ref(false)
        const conversationId = ref("");
        const conversation = ref([]);

        const store = useConversationsStore();

        async function sendInput() {

            // Store question in conversation
            let message = { role: "user", content: input.value };

            // Add the question to the conversation list
            conversation.value.push(message);

            // Store the question
            store.addMessage(conversationId, message);
            input.value = "";

            try {
                loadingState.value = true;
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
                    },
                    body: JSON.stringify({
                        model: "gpt-3.5-turbo",
                        messages: [message],
                        max_tokens: 2048,
                        temperature: 0.5,
                        stream: false,
                        n: 1,
                        stop: ["\nUSER: ", "\nAI: "]
                    }),
                };

                const response = await fetch("https://api.openai.com/v1/chat/completions", requestOptions);
                const jsonResponse = await response.json();

                loadingState.value = false;

                // Format the response as HTML markup
                message = jsonResponse.choices[0].message;
                conversationId.value = jsonResponse.id;

                // Add the response to the conversation list
                conversation.value.push(message);

                // Store the response
                store.addMessage(conversationId, message);
            } catch (error) {
                console.error(error);
            }
        }

        return { input, conversation, sendInput, loadingState };
    },
};
</script>
