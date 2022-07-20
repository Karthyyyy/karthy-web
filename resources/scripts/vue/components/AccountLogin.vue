<template>
    <div class="account-login-container">

        <div class="alert alert-danger" role="alert" v-if="state.error !== null">
            {{ state.error }}
        </div>

        <div class="login-form-container">
            <form @submit.prevent="doSubmit">
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

    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import axios from 'axios'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
const router = useRouter();
const store = useStore();

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
                email: state.email,
                password: state.password
            }).then(response => {
                if (response.data.success) {
                    //router.push({name: 'Home'});
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
.login-form-container {
    margin-bottom: 1rem;
}
</style>