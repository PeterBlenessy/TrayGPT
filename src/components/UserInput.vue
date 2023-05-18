<template>
    <q-input dense autofocus autogrow :placeholder="$t('questionInput.placeholder')" style="min-width: 85%; max-width: 85%;"
        color="deep-orange" @keydown.enter.prevent="handleUserInput" v-model="question">
        <template v-slot:before>
            <q-icon name="account_box" color="deep-orange" style="padding: 5px" />
        </template>
        <template v-slot:after>
            <q-btn @click="handleUserInput" round dense flat icon="send" color="deep-orange">
                <q-tooltip transition-show="scale" transition-hide="scale">
                    {{ $t('questionInput.tooltip.send') }}
                </q-tooltip>
            </q-btn>
        </template>
    </q-input>
</template>

<script>
import { ref } from 'vue'
import { useConversationsStore } from 'src/stores/conversations-store.js'
import { storeToRefs } from 'pinia'

export default {
    name: 'UserInput',
    setup() {
        const conversationsStore = useConversationsStore()
        const { userInput, loading } = storeToRefs(conversationsStore)
        const question = ref('')

        function handleUserInput() {
            userInput.value = question.value
            question.value = ''
        }
        return {
            question,
            handleUserInput,
            loading
        }
    }
}
</script>
