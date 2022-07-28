<template>
    <div>
        <h2>Account Integrations</h2>
        <div class="content-section">
            {{ twitchError }}
            <a :href="`https://id.twitch.tv/oauth2/authorize?response_type=code&force_verify=true&client_id=${TWITCH_CLIENT_ID}&redirect_uri=${APP_URL}/account&scope=user%3Aread%3Aemail&state=${store.state.csrf}`" 
                class="twitch button" target="_top" v-if="!store.state.authData.twitch?.id">
                <font-awesome-icon :icon="['fa-brands', 'twitch']" class="fa-2x" />
                Connect with Twitch
            </a>
            <div class="button-container" v-else>
                <button class="twitch disabled">
                    <font-awesome-icon :icon="['fa-brands', 'twitch']" class="fa-2x" />
                    Twitch Connected: {{ store.state.authData.twitch.twitch_display_name }}
                </button>
                <button class="revoke-access danger" @click="revokeTwitch()">Revoke Access</button>
            </div>
            
            <a href="#" class="button youtube disabled">
                <font-awesome-icon :icon="['fa-brands', 'youtube']" class="fa-2x" />
                Connect with Youtube
            </a>
            <a href="#" class="button discord disabled">
                <font-awesome-icon :icon="['fa-brands', 'discord']" class="fa-2x" />
                Connect with Discord
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { onMounted, watch, ref } from 'vue';

const APP_URL = import.meta.env.VITE_APP_URL;
const TWITCH_CLIENT_ID = import.meta.env.VITE_TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = import.meta.env.VITE_TWITCH_CLIENT_SECRET;

const twitchError = ref<string | null>(null)
const router = useRouter();
const route = useRoute();
const store = useStore();

const connectedWithTwitch = () => {
    axios.post(`https://id.twitch.tv/oauth2/token`, {
        'client_id': TWITCH_CLIENT_ID,
        'client_secret': TWITCH_CLIENT_SECRET,
        'code': route.query.code,
        'grant_type': 'authorization_code',
        'redirect_uri': APP_URL+'/account'
    }).then((response: any) => {
        const accessToken = response.data.access_token;
        const refreshToken = response.data.refresh_token;
        console.log('got tokens');
        console.log(response);
        axios.get(`https://api.twitch.tv/helix/users`, {
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Client-Id': TWITCH_CLIENT_ID
            }
        }).then((response: any) => {
            console.log('got user data');
            console.log(response);
            axios.post(`/api/integrate_twitch`, {
                'access_token': accessToken,
                'refresh_token': refreshToken,
                'twitch_id': response.data.data[0].id,
                'twitch_login': response.data.data[0].login,
                'twitch_display_name': response.data.data[0].display_name,
                'twitch_email': response.data.data[0].email,
                'broadcaster_type': response.data.data[0].broadcaster_type,
                'view_count': response.data.data[0].view_count
            }).then((response: any) => {
                console.log('saved user data');
                console.log(response);
                store.dispatch('setAuth');
                router.replace('/account');
            }).catch(error => {
                twitchError.value = 'Error saving your data';
            });
        }).catch((error: any) => {
            twitchError.value = 'Error getting your user data';
        });
    }).catch((error: any) => {
        twitchError.value = 'Error getting your token';
    });
}

const revokeTwitch = () => {
    axios.delete(`/api/revoke_twitch`).then(() => {
        store.dispatch('setAuth');
    }).catch((error) => console.error(error))
}

onMounted(() => {
    if (route.query.code) {
        connectedWithTwitch();
    }
})
</script>

<style lang="scss" scoped>
@import '~styles/_variables';

.button-container {
    display: flex;
}

.revoke-access {
    justify-content: center;
    width: 25%;
    text-align: center;
    margin-left: 1rem;
}
.button, button {
    width: 50%;
    padding: 1rem 1rem;
    line-height: 39px;
    height: 39px;
    display: flex;
    align-items: center;
    margin-bottom: 1rem;

    &:last-of-type {
        margin-bottom: 0;
    }

    svg {
        margin-right: 0.5rem;
        width: 30px;
    }
}
</style>