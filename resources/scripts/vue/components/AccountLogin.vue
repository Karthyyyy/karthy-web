<template>
    <div class="account-login-container">

        <div class="alert alert-danger" role="alert" v-if="state.error !== null">
            {{ state.error }}
        </div>

        <div class="login-form-container">
            <form @submit.prevent="doSubmit" class="login-form">
                <div>
                    <label for="email">E-Mail Address</label>

                    <input id="email" type="email" class="form-control" v-model="state.email"
                            autofocus autocomplete="off">
                </div>

                <div>
                    <label for="password">Password</label>

                    <input id="password" type="password" class="form-control" v-model="state.password"
                            required autocomplete="off">
                </div>

                <div>
                    <button type="submit">
                        Login
                    </button>
                </div>
            </form>
        </div>

        <div v-if="allowRegistrations == 'false'" class="alert alert-danger disabled-registrations-msg">
            Account creation is currently disabled while things are being worked on! If you are a creator wishing to test things out please <a href="https://discord.gg/karthy">join my Discord</a> and drop Karthy a message!
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import axios from 'axios'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
const router = useRouter();
const store = useStore();

const allowRegistrations = import.meta.env.VITE_ALLOW_REGISTRATION;

const state = reactive({
    email: "",
    password: "",
    error: null,
    success: null
});

const doSubmit = (event: Event) => {
    if (state.password.length > 0) {
        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post('/api/login', {
                email: state.email.toLowerCase(),
                password: state.password
            }).then(response => {
                if (response.data.success) {
                    router.push({name: 'AccountDashboard'});
                    store.commit('setAuthData', response.data.authData);
                    store.commit('closeModal');
                } else {
                    state.error = response.data.message;
                }
            }).catch(function (error) {
                console.error(error.response);
            });
        })
    }
}
</script>

<style scoped lang="scss">
@import '~styles/_variables';
.login-form {
    > div {
        margin-bottom: 1rem;
    }
}
.login-form-container {
    margin-bottom: 1rem;
}
.disabled-registrations-msg {
    width: 100%;
    color: $pastel-red;

    a {
        text-decoration: underline;

        &:hover {
            text-decoration: none;
        }
    }
}
</style>