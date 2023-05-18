<template>
    <q-layout view="hHh lpr fFf">
        <q-header :class="darkHeader == true ? 'bg-grey-10' : 'bg-white'">
            <q-toolbar rounded-borders>

                <UserInput />

                <q-btn @click="restoreLastConversation" round dense flat icon="restore" color="deep-orange">
                    <q-tooltip transition-show="scale" transition-hide="scale">
                        {{ $t('questionInput.tooltip.restore') }}
                    </q-tooltip>
                </q-btn>
                <q-btn @click="clearChatMessages" round dense flat icon="clear_all" color="deep-orange">
                    <q-tooltip transition-show="scale" transition-hide="scale">
                        {{ $t('questionInput.tooltip.clear') }}
                    </q-tooltip>
                </q-btn>
                <q-btn @click="() => { showSettings = true }" round dense flat icon="tune" color="deep-orange">
                    <q-tooltip transition-show="scale" transition-hide="scale">
                        {{ $t('questionInput.tooltip.settings') }}
                    </q-tooltip>
                </q-btn>

                <q-dialog v-model="showSettings" position="top" transition-show="slide-down">
                    <AppSettings />
                </q-dialog>
            </q-toolbar>
        </q-header>

        <q-page-container>
            <q-page>

                <ChatMessages />

                <!-- place QPageScroller at end of page -->
                <q-page-scroller reverse position="bottom" :scroll-offset="20" :offset="[20, 20]">
                    <q-btn round dense icon="south" color="deep-orange" />
                </q-page-scroller>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from 'vue'
import { useSettingsStore } from 'src/stores/settings-store.js'
import { useConversationsStore } from 'src/stores/conversations-store.js'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import AppSettings from "src/components/AppSettings.vue"
import UserInput from "src/components/UserInput.vue"
import ChatMessages from "src/components/ChatMessages.vue"

export default defineComponent({
    name: "MainLayout",

    components: {
        AppSettings,
        UserInput,
        ChatMessages,
    },

    setup() {
        const $q = useQuasar()

        const darkHeader = ref(true)

        const conversationsStore = useConversationsStore()
        const { chatMessages, conversations } = storeToRefs(conversationsStore)

        const settingsStore = useSettingsStore()
        const { darkMode } = storeToRefs(settingsStore)

        // Sets Quasar dark mode plugin value based on stored mode.
        function setDarkMode() {
            $q.dark.set(darkMode.value)
            darkHeader.value = $q.dark.isActive ? true : false
        }
        // When app starts, set the stored dark mode for app
        onMounted(() => setDarkMode())
        // Watch runtime changes to dark mode
        watch(darkMode, () => setDarkMode())

        // Load conversation from store
        function restoreLastConversation() {
            if (conversations.value.length > 0) {
                messages.value = [...conversations.value]
            }
        }
        // Clear conversation, both in ui and in store
        function clearChatMessages() {
            chatMessages.value = []
        }

        return {
            showSettings: ref(false),
            restoreLastConversation,
            clearChatMessages,
            darkHeader
        }
    },
})
</script>