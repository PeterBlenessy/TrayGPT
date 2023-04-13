<template>
    <q-layout view="hHh Lpr lFf">
        <q-header elevated>
            <q-toolbar>
                <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
                <q-toolbar-title> TrayGPT </q-toolbar-title>
                <q-btn flat round dense icon="whatshot" />
            </q-toolbar>
        </q-header>

        <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
            <q-list>
                <q-btn color="deep-orange" icon="add_box" label="New conversation" class="full-width" />
                <q-item-label header>Conversations</q-item-label>

                <LeftDrawer v-for="link in drawerLinks" :key="link.title" v-bind="link" />

                <q-separator />

                <q-expansion-item duration="100" icon="tune" color="deep-orange" label="Application settings">

                    <q-item>
                        <q-item-section avatar>
                            <q-icon name="dark_mode" color="deep-orange" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Dark mode</q-item-label>
                            <q-item-label caption>Toggle dark/light mode</q-item-label>
                        </q-item-section>
                        <q-item-section avatar>
                            <q-toggle v-model="darkMode" flat dense round color="deep-orange" />
                        </q-item-section>
                    </q-item>
                </q-expansion-item>

                <q-separator />

                <q-expansion-item duration="100" icon="tune" color="deep-orange" label="OpenAI settings" caption="">
                    <q-item dense>
                        <q-item-section avatar>
                            <q-icon name="key" color="deep-orange" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>OpenAI API Key</q-item-label>
                            <q-tooltip></q-tooltip>
                            <q-item-label caption>Set your OpenAI API Key</q-item-label>
                        </q-item-section>
                        <q-item-section avatar>
                            <q-btn icon="edit" flat dense round clickable />
                        </q-item-section>
                    </q-item>

                    <q-separator spaced inset="item" />

                    <q-item>
                        <q-item-section avatar>
                            <q-icon name="box" color="deep-orange" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Model</q-item-label>
                            <q-tooltip>ID of the model to use.</q-tooltip>
                        </q-item-section>
                    </q-item>
                    <q-separator spaced inset="item" />

                    <q-item dense>
                        <q-item-section avatar>
                            <q-icon name="box" color="deep-orange" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Max tokens</q-item-label>
                            <q-tooltip>The maximum number of tokens to generate in the chat completion. The total length of
                                input tokens and generated tokens is limited by the model's context length.</q-tooltip>
                        </q-item-section>
                    </q-item>
                    <q-separator spaced inset="item" />

                    <q-item dense>
                        <q-item-section avatar>
                            <q-icon name="box" color="deep-orange" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Number of responses</q-item-label>
                            <q-tooltip>How many chat completion choices to generate for each input message.</q-tooltip>
                        </q-item-section>
                    </q-item>
                    <q-separator spaced inset="item" />

                    <q-item>
                        <q-item-section avatar>
                            <q-icon name="thermostat" color="deep-orange" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Temperature</q-item-label>
                            <q-tooltip>Temperature is a measure of the randomness in the text. Lower values will result in
                                more predictable text, while higher values will result in more surprising text.</q-tooltip>
                            <q-slider v-model="temperature" :min="0" :max="2" step="0.1" :markers="0.5" label
                                color="deep-orange" />
                        </q-item-section>
                    </q-item>
                </q-expansion-item>
            </q-list>
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>

    </q-layout>
</template>

<script>
import { defineComponent, onMounted, ref, watch } from "vue";
import LeftDrawer from "src/components/LeftDrawer.vue";
import { useQuasar } from 'quasar';

const linksList = [
    {
        title: "Github",
        caption: "github.com/TrayGPT",
        icon: "code",
        link: "https://github.com/PeterBlenessy/TrayGPT",
    }
];

export default defineComponent({
    name: "MainLayout",

    components: {
        LeftDrawer,
    },

    setup() {
        const leftDrawerOpen = ref(false);
        const $q = useQuasar();
        const darkMode = ref(false);
        function setDarkMode() {
            $q.dark.set(darkMode.value)
        }

        const toggleDarkMode = () => { $q.dark.set(darkMode.value); }

        onMounted(setDarkMode);
        watch(darkMode, () => { toggleDarkMode() });

        return {
            drawerLinks: linksList,
            leftDrawerOpen,
            toggleLeftDrawer() {
                leftDrawerOpen.value = !leftDrawerOpen.value;
            },
            darkMode,
            temperature: ref(0)
        };
    },
});
</script>
