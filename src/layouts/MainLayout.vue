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
            </q-list>

            <AppSettings />
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>

    </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import LeftDrawer from "src/components/LeftDrawer.vue";
import AppSettings from "src/components/AppSettings.vue";

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
        AppSettings,
    },

    setup() {
        const leftDrawerOpen = ref(false);

        return {
            drawerLinks: linksList,
            leftDrawerOpen,
            toggleLeftDrawer() {
                leftDrawerOpen.value = !leftDrawerOpen.value;
            }
        };
    },
});
</script>
