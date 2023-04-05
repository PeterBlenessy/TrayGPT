<template>
    <div class="column q-pa-md full-width">

        <div v-for="message in conversation" :key="message.id">
            <q-list>
                <q-item>
                    <q-item-section top avatar>
                        <q-icon rounded :name="message.role == 'user' ? 'account_box' : 'computer'"
                            :color="message.role == 'user' ? 'deep-orange' : 'primary'" />
                    </q-item-section>
                    <q-item-section top>
                        <q-item-label>{{ message.content }}</q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>
        </div>

        <div style="position: sticky; bottom: 35px" class="bg-white">
            <q-input @keydown.enter="sendInput" :loading="loadingState" label-slot outlined type="text" v-model="input">

                <template v-slot:prepend>
                    <q-icon name="account_box" color="deep-orange" />
                </template>
                <template v-slot:label>
                    <span>Ask your </span>
                    <span class="text-weight-bold text-deep-orange">question</span>
                </template>
                <template v-slot:loading>
                    <q-spinner-comment color="deep-orange" />
                </template>

                <template v-slot:append>
                    <q-btn @click="sendInput" round dense flat icon="send" color="deep-orange" />
                </template>
            </q-input>
        </div>

        <!-- place QPageScroller at end of page -->
        <q-page-scroller reverse position="bottom" :scroll-offset="25" :offset="[0, 100]">
            <q-btn fab icon="keyboard_arrow_down" color="deep-orange" />
        </q-page-scroller>
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
