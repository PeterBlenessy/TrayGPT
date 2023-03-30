<template>
    <div class="q-gutter-md">
    <div v-html="conversation"></div>
        <q-input outlined type="text" v-model="input" label="Type something..." >
            <template v-slot:append>
                <q-btn @click="sendInput" round dense flat icon="send" />
            </template>
        </q-input>
    </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "ConversationBot",

  setup() {
    const input = ref("");
    const conversation = ref("");

    async function sendInput() {
      try {
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "user",
                content: input.value
            }],
            max_tokens: 2048,
            temperature: 0.5,
            stream: false,
            n: 1,
            stop: "\n",
          }),
        };

        const response = await fetch(
          "https://api.openai.com/v1/chat/completions",
          requestOptions
        );
        const result = await response.json();

        // Format the response as HTML markup
        const formattedResponse = result.choices[0].message.content.trim();//.replace(/(\r\n|\n|\r)/gm, "<br>");

        conversation.value += "<p>" + formattedResponse + "</p>";
        input.value = "";
      } catch (error) {
        console.error(error);
      }
    }

    return { input, conversation, sendInput };
  },
};
</script>
