<template>
    <div class="main-menu-item" @click="changePage" :title="props.description">
        <div class="main-menu-item-icon">
            <font-awesome-icon :icon="props.icon" />
        </div>
        <div class="main-menu-item-description" v-if="props.iconOnly === false">
            {{ props.description }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, shallowRef } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useStore } from 'vuex';
import AccountLogin from '~components/AccountLogin.vue';
import AccountRegisterWithToggle from '~components/AccountRegisterWithToggle.vue';
import AccountUseIntegrations from '~components/AccountUseIntegrations.vue';
const router = useRouter();
const store = useStore();

type MenuItemProps = {
    name: string,
    icon: Array<string>,
    description: string,
    iconOnly: Boolean,
    clickFunction: string | null
}
const props = defineProps<MenuItemProps>();

const changePage = () => {
    if (props.name) {
        router.push({
            name: props.name
        })
    } else {
        switch(props.clickFunction) {
            case "doSignout":
                doSignout();
                break;
            case "showSignIn":
                showSignIn();
                break;
        }
        props.clickFunction;
    }
}

const doSignout = () => {
    axios.get('/sanctum/csrf-cookie').then((response: any) => {
        axios.post('/api/logout')
            .then((response: any) => {
                if (response.data.success) {
                    //router.push({name: "Home"})
                    store.commit('setAuthData', response.data.authData);
                }
            }).catch((error: any) => {
                console.error(error);
            });
    })
}

const showSignIn = () => {
    const accountLogin = shallowRef(AccountLogin);
    const accountRegisterWithToggle = shallowRef(AccountRegisterWithToggle);
    const accountUseIntegrations = shallowRef(AccountUseIntegrations);
    
    store.commit('showModal', {
        accountLogin: accountLogin,
        accountUseIntegrations: accountUseIntegrations,
        accountRegisterWithToggle: accountRegisterWithToggle
    });
}
</script>

<style scoped lang="scss">
@import '~styles/_variables';

.main-menu-item {
    display: flex;
    font-size: 1.1rem;
    padding: 0 0.6rem;
    font-weight: bold;
    cursor: pointer;

    &:hover {
        color: $secondary-purple;
        transform: scale(1.1);
        transition-duration: 0.1s;
    }
}

.main-menu-item-icon {
    padding: 0 0.2rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.main-menu-item-description {
    padding: 0 0.2rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
</style>