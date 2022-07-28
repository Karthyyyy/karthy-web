<template>
    <router-view v-if="route.meta.standalone"></router-view>
    <div v-else class="outer-container">
        <AppModal :isShowing="store.state.showModal" />
        <div class="main-menu-container" :class="{ blurred: store.state.showModal === true }">
            <MenuMain />
        </div>
        <div class="main-body-container" :class="{ blurred: store.state.showModal === true }">
            <!--<MenuSide></MenuSide>-->
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup lang="ts">
import MenuMain from '~layouts/MenuMain.vue';
import AppModal from '~components/AppModal.vue';
import axios from 'axios';
import { onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
const store = useStore();
const route = useRoute();

const checkAuth = () => {
    //@ts-ignore
    store.commit('setCSRF', window.Laravel.csrfToken);
    store.dispatch('setAuth');
}

onBeforeMount(() => {
  checkAuth();
});
</script>

<style scoped lang="scss">

.outer-container {
    display: flex;
    flex-direction: column;
}
</style>