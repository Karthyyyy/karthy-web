<template>
    <nav class="main-nav">
        <div class="main-nav-logo">
            <AnimationSquigglyText :onHover="true" class="logo-animation">karthy.tv</AnimationSquigglyText>
        </div>
        <div class="main-nav-menu main-nav-menu-main">
            <MenuMainItem v-for="(item, itemid) in state.items" v-bind="item"></MenuMainItem>
        </div>
        <div class="main-nav-menu main-nav-footer">
            <MenuMainItem v-for="(item, itemid) in state.accountItems" v-bind="item"></MenuMainItem>
        </div>
    </nav>
</template>

<script setup lang="ts">
import AnimationSquigglyText from "~components/AnimationSquigglyText.vue";
import MenuMainItem from "~components/MenuMainItem.vue";
import { reactive, watch, onMounted } from 'vue';
import { useStore } from 'vuex'
const store = useStore();

const state = reactive({
    items: {
        home: {
            name: "Home",
            icon: ["fas", "home"],
            description: "Dashboard",
            iconOnly: false,
            clickFunction: null
        },
        bot: {
            name: "Coding",
            icon: ["fas", "robot"],
            description: "Bot",
            iconOnly: false,
            clickFunction: null
        },
        streamTools: {
            name: "Coding",
            icon: ["fas", "toolbox"],
            description: "Stream Tools",
            iconOnly: false,
            clickFunction: null
        },
        analytics: {
            name: "Coding",
            icon: ["fas", "chart-line"],
            description: "Analytics",
            iconOnly: false,
            clickFunction: null
        },
        streamGames: {
            name: "GamesOnStream",
            icon: ["fas", "gamepad"],
            description: "Stream Games",
            iconOnly: false,
            clickFunction: null
        }
    },
    accountItems: {}
});

const setAccountItems = () => {
    if (store.state.authData.isLoggedin === true) {
        state.accountItems = {
            account: {
                name: "AccountDashboard",
                icon: ["fas", "user"],
                description: store.state.authData.user.username,
                iconOnly: false,
                clickFunction: null
            },
            signout: {
                icon: ["fas", "sign-out"],
                description: "Sign Out",
                iconOnly: true,
                clickFunction: "doSignout"
            }
        }
    } else {
        state.accountItems = {
            signin: {
                icon: ["fas", "sign-in"],
                description: "Sign In",
                iconOnly: false,
                clickFunction: "showSignIn"
            }
        }
    }
}

onMounted(() => {
    setAccountItems();
});
watch(() => store.getters.getAuthData, () => {
    setAccountItems();
})
</script>

<style scoped lang="scss">
@import '~styles/_variables';

.main-nav {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: $grey-1;
    color: $main-blue;
    font-family: Amatic SC;
    letter-spacing: 2px;
}

.main-nav-logo {
    font-size: 1.8rem;
    padding: 0.5rem 1.4rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
}

.logo-animation:hover {
    display: inline-block;
    cursor: pointer;
    color: $secondary-purple;
    transition-duration: 0.1s;
    transition-property: transform;
}

.main-nav-menu-main {
    color: $main-blue-8;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.main-nav-footer {
    padding: 0 1rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
</style>