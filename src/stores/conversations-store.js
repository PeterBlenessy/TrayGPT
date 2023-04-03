import { ref } from "vue";
import { defineStore } from 'pinia'

export const useConversationsStore = defineStore('conversations', () => {

    // The conversations store is an array of conversation objects.
    // Each conversation object has an id and an array of messages.
    // A message is an objects with a role and content, e.g., { role: "user", content: "Hello"}
    // The role is either "user" or "assistant", or optionally "system".
    // The "system" message is used to set the behavior of the assistant.
    //      e.g., { role: "system", content: "You are a helpful assistant." }
    const conversations = ref(new Map());

    // Get all conversations
    function getConversations() {
        return conversations;
    }
    // Get a specific conversation
    function getConversation(id) {
        return conversations.value.get(id);
    }

    // Add a new conversation
    function addConversation(id, messages) {
        conversations.value.set(id, messages);
    }

    // Add a message to a specific conversation
    function addMessage(id, message) {
        conversations.value.has(id) || conversations.value.set(id, []);
        conversations.value.get(id).push(message);
    }

    // Remove a specific conversation
    function removeConversation(id) {
        conversations.value.delete(id);
    }

    return {
        getConversations,
        getConversation,
        addConversation,
        addMessage,
        removeConversation
    }
})
