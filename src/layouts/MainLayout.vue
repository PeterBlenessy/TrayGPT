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

                <q-expansion-item v-model="expanded" icon="tune" color="deep-orange" label="Application settings"
                    caption="">

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

                <q-expansion-item v-model="expanded" icon="tune" color="deep-orange" label="OpenAI settings" caption="">
                    <q-item>
                        <q-item-section avatar>
                            <q-icon name="api" color="deep-orange" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>OpenAI API Key</q-item-label>
                            <q-item-label caption>Set your OpenAI API Key</q-item-label>
                        </q-item-section>
                        <q-item-section avatar>
                            <q-btn icon="edit" flat dense round clickable />
                        </q-item-section>
                    </q-item>

                    <q-separator spaced inset="item" />

                    <q-item>
                        <q-item-section avatar>
                            <q-icon name="thermostat" color="deep-orange" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Temperature</q-item-label>
                            <q-slider v-model="mic" :min="0" :max="50" label color="deep-orange" />
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
            darkMode
        };
    },
});
</script>
