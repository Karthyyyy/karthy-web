import { createStore } from 'vuex';
import axios from "axios";

const store = createStore({
    state () {
        return {
            showModal: false,
            modalContent: {},
            authData: {
                isLoggedin: false,
                user: {}
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
        getUserAuth({commit}) {
            axios.get('/api/user/show')
                .then(response => {
                    commit('setUser', response.data);
                }).catch(err => console.log(err.response.data));
        }
    }
});

export default store;