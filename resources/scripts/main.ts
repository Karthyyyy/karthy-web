import * as Vue from 'vue';
import App from '~vue/App.vue';

import axios from 'axios';
import VueAxios from 'vue-axios';
import store from "./vue/store";
import karthyBot from './karthyBot';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(fas);
library.add(fab);

import router from '~vue/router';

import { KARTHY_BOT } from './vue/types/injectionSymbols';



// @ts-ignore
const app = Vue.createApp(App);
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(VueAxios, axios);
app.provide(KARTHY_BOT, karthyBot);
app.use(router);
app.use(store);
app.mount("#app");