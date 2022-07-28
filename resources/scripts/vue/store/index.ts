import { createStore } from 'vuex';
import axios from "axios";

const store = createStore({
    state () {
        return {
            csrf: null,
            showModal: false,
            modalContent: {},
            authData: {
                isLoggedin: false,
                user: {},
                twitch: {}
            },
            karthyBot: {
                user: "Karthy",
                message: "Test",
                channel: ""
            }
        }
    },
    getters: {
        getAuthData(state) {
            return state.authData.isLoggedin;
        }
    },
    mutations: {
        setCSRF (state, csrfCookie) {
            state.csrf = csrfCookie;
        },
        setAuthData (state, authData) {
            state.authData = authData;
        },
        showModal (state, payload) {
            state.modalContent = payload;
            state.showModal = true;
        },
        closeModal (state) {
            state.modalContent = {};
            state.showModal = false;
        },
        setWebSocketData (state, payload) {
            state.karthyBot = payload;
        }
    },
    actions: {
        setAuth() {
            axios.post('/api/checkauth').then((response: any) => {
                if (response.data.success) {
                    store.commit('setAuthData', response.data.authData);
                }
            }).catch((error: any) => {
                console.error(error);
            });
        }
    }
});

export default store;