<template>
    <div class="q-pa-md full-width">

        <div class="q-gutter-y-md q-pb-xs rounded" v-for="message in conversation" :key="message.id">
            <q-list>
                <q-item>
                    <q-item-section avatar>
                        <q-avatar :icon="message.role == 'user' ? 'account_box' : 'computer'" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>{{ message.content }}</q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>
        </div>

        <div class="q-gutter--md q-pt-md">
            <q-input @keydown.enter="sendInput" outlined type="text" v-model="input" label="Type something...">
                <template v-slot:append>
                    <q-btn @click="sendInput" round dense flat icon="send" />
                </template>
            </q-input>
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
import { createPinia } from "pinia";

const pinia = createPinia();

export default {
    name: "ConversationBot",

    setup() {
        const input = ref("");
        let completionId = null;
        const conversation = ref([]);//pinia.state.conversation[completionId] || [];

        async function sendInput() {
            // Store question in conversation
            let message = { role: "user", content: input.value };
            conversation.value.push(message);

            try {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
                    },
                    body: JSON.stringify({
                        model: "gpt-3.5-turbo",
                        messages: [{ role: "user", content: input.value }],
                        max_tokens: 2048,
                        temperature: 0.5,
                        stream: false,
                        n: 1,
                        stop: ["\nUSER: ", "\nAI: "]
                    }),
                };

                const response = await fetch("https://api.openai.com/v1/chat/completions", requestOptions);
                const jsonResponse = await response.json();

                // Format the response as HTML markup
                const message = jsonResponse.choices[0].message;
                //message.content = message.content.trim();//.replace(/(\r\n|\n|\r)/gm, "<br>");

                completionId = jsonResponse.id;

                // Store the response in conversation
                conversation.value.push(message);

                input.value = "";

                // Store conversation in pinia state
                pinia.state.conversation[completionId] = conversation;
            } catch (error) {
                console.error(error);
            }
        }

        return { input, conversation, sendInput };
    },
};
</script>
