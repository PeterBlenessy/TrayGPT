<template>
    <div ref="conversationView" class="chat-container flex-grow q-mb-md">
        <q-list v-for="message in conversation" :key="message.id">
            <q-item>
                <q-item-section avatar>
                    <q-icon rounded :name="message.role == 'user' ? 'account_box' : 'computer'"
                        :color="message.role == 'user' ? 'deep-orange' : 'primary'" />
                </q-item-section>
                <q-item-section>
                    <q-spinner-dots v-if="loading && message.role == 'computer'" color="primary" size="2em" />
                    <q-item-label v-else>
                        <VueShowdown :markdown="message.content" flavor="github" :options="{ emoji: true }" />
                    </q-item-label>
                </q-item-section>
                <q-item-section side top>
                    <q-btn v-if="message.role == 'user'" flat round dense icon="edit_note" size="10px" />
                </q-item-section>
            </q-item>
            <q-separator />
        </q-list>
    </div>

    <q-input @keydown.enter="handleUserInput" label-slot outlined type="text" v-model="userInput"
        style="min-width: 100%; max-width: 100%;" class="absolute-bottom bg-white">
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
            <q-btn @click="handleUserInput" round dense flat icon="send" color="deep-orange" />
        </template>
    </q-input>

    <!-- place QPageScroller at end of page -->
    <q-page-scroller reverse position="bottom" :scroll-offset="20" :offset="[20, 20]">
        <q-btn round dense icon="south" color="deep-orange" />
    </q-page-scroller>
</template>

<script>
import { ref, watch } from 'vue';
import { useConversationsStore } from 'src/stores/conversations-store.js';
//import { useUserInputStore } from 'src/stores/user-input-store.js';
//import { storeToRefs } from 'pinia';
import { VueShowdown } from 'vue-showdown';

export default {
    name: "ConversationBot",
    components: {
        VueShowdown
    },

    setup() {
        const userInput = ref('')
        const conversationId = ref("");
        const conversation = ref([]);
        const conversationView = ref(null);
        const loading = ref(false);
        const store = useConversationsStore();

        // watch(userInput, () => {
        //     console.log("message changed")
        //     //            conversation.value.push({ role: "user", content: userInput.value });
        //     handleUserInput();
        // });

        async function handleUserInput() {

            // Store question in conversation
            let message = { role: "user", content: userInput.value };
            userInput.value = ''

            // Add the question to the conversation list
            conversation.value.push(message);

            // Store the question
            store.addMessage(conversationId, message);

            try {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
                    },
                    body: JSON.stringify({
                        model: "gpt-4.0",
                        messages: [{
                            ...{ role: "system", content: "You are a helpful assistant. You respond like you were giving examples of how to format text in markdown format using GitHub flavor." },
                            ...message
                        }],
                        max_tokens: 2048,
                        temperature: 0.5,
                        stream: false,
                        n: 1,
                        stop: ["\nUSER: ", "\nAI: "]
                    }),
                };

                loading.value = true;
                message = { role: "computer", content: '<q-spinner-dots color="primary" size="2em" />' };
                conversation.value.push(message);


                const response = await fetch("https://api.openai.com/v1/chat/completions", requestOptions);
                const jsonResponse = await response.json();

                // Format the response as HTML markup
                message = jsonResponse.choices[0].message;
                conversationId.value = jsonResponse.id;

                loading.value = false;
                conversation.value.pop();
                // Add the response to the conversation list
                conversation.value.push(message);

                // Store the response
                store.addMessage(conversationId, message);

                // Scroll to the bottom of the conversation
                scrollToBottom();

            } catch (error) {
                console.error(error);
            }
        }
        function scrollToBottom() {
            conversationView.value.scrollTop = conversationView.value.scrollHeight
        }

        return {
            userInput,
            handleUserInput,
            conversation,
            conversationView,
            loading
        };
    },
};
</script>
