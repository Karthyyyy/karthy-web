import type { RouterOptions } from 'vue-router';
import {createRouter, createWebHistory} from 'vue-router'
import routes from './routes'

const router = createRouter(<RouterOptions>{
    history: createWebHistory(),
    routes
});

export default router;