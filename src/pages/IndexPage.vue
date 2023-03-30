<template>
  <q-page class="flex flex-center">
    <ConversationBot />
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import ConversationBot from "src/components/ConversationBot.vue";

export default defineComponent({
  name: "IndexPage",
  components: {
    ConversationBot,
  },
});
</script>
