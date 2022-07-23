<template>
    <div class="account-register-container">

        <div class="alert alert-danger" role="alert" v-if="state.error !== null">
            {{ state.error }}
        </div>

        <div class="register-form-container">
            <form @submit.prevent="doSubmit" class="register-form">
                <div>
                    <label for="username">Display Name</label>

                    <input id="username" type="text" class="form-control" v-model="state.username" required
                            autofocus autocomplete="off">
                </div>

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
                    <button type="submit" class="btn btn-primary">
                        Create Account
                    </button>
                </div>
            </form>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import axios from 'axios'

const state = reactive({
    username: "",
    email: "",
    password: "",
    error: null,
    success: null
});

const doSubmit = (event: Event) => {
    if (state.password.length > 0) {
        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post('api/register', {
                username: state.username,
                email: state.email.toLowerCase(),
                password: state.password
            }).then(response => {
                if (response.data.success) {
                    state.success = response.data;
                } else {
                    state.error = response.data.message;
                }
            }).catch(function (error) {
                console.error(error.response);
            });
        });
    }
}
</script>

<style scoped lang="scss">
@import '~styles/variables';

.register-form {
    & > div {
        margin-bottom: 1rem;
    }
}
</style>