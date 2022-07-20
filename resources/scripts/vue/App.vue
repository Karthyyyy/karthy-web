<template>
    <router-view v-if="route.meta.standalone"></router-view>
    <div v-else>
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
  axios.get('/sanctum/csrf-cookie').then((response: any) => {
        axios.post('/api/checkauth')
            .then((response: any) => {
                if (response.data.success) {
                    store.commit('setAuthData', response.data.authData);
                }
            })
            .catch((error: any) => {
                console.error(error);
            });
    })
}

onBeforeMount(() => {
  checkAuth();
});
</script>

<style scoped lang="scss">

</style>