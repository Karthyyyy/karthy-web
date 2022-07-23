<template>
    <div v-if="state.allowRegistrations == 'true'">
        <div class="account-register-toggle">
            <span class="toggle-line" @click="toggleShowAccountRegister">Or <span class="text-highlight">create an account</span></span>
        </div>
        <AccountRegister v-if="state.showAccountRegister" />
    </div>
</template>

<script setup lang="ts">
import AccountRegister from "~components/AccountRegister.vue";
import { reactive } from 'vue';

const state = reactive({
    allowRegistrations: import.meta.env.VITE_ALLOW_REGISTRATION,
    showAccountRegister: false
})

const toggleShowAccountRegister = () => {
    state.showAccountRegister = !state.showAccountRegister;
}
</script>

<style scoped lang="scss">
@import '~styles/variables';

.account-register-toggle {
    position: relative;
    text-transform: uppercase;
    font-size: 0.8em;
    margin: 0 auto 1rem;
    text-align: center;
    border-radius: 12px;
    padding: 0.4rem 0.8rem;
    cursor: pointer;

    &:hover {
        background: $grey-2;

        & .toggle-line {
            background: $grey-2;
        }
    }


    &:after {
        position: absolute;
        left: 0;
        top: 50%;
        height: 1px;
        background: $grey-3;
        content: "";
        width: 100%;
        display: block;
        z-index: 1;
    }
}

.toggle-line {
    position: relative;
    background: $dark-grey;
    color: $grey-7;
    border-radius: 6px;
    padding: 0.4rem 0.8rem;
    z-index: 15;
}

.text-highlight {
    color: $main-blue;
}
</style>