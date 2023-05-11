import { defineStore } from 'pinia'

// The conversations store is an array of conversation objects.
// Each conversation object has an id and an array of messages.
// A message is an objects with a role and content, e.g., { role: "user", content: "Hello"}
// The role is either "user" or "assistant", or optionally "system".
// The "system" message is used to set the behavior of the assistant.
//      e.g., { role: "system", content: "You are a helpful assistant." }

export const useConversationsStore = defineStore('conversations', {

    state: () => {
        return {
            conversations: [],
        }
    },

    actions: {
        clearMessages(conversationId, message) {
            this.conversations = [];
        }
    }
})
