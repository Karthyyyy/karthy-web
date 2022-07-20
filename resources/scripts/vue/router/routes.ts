import type { RouteRecordRaw } from 'vue-router';

// Import pages
import Home from '~views/Home.vue';
import Coding from '~views/Coding.vue';
import GamesOnStream from '~views/GamesOnStream.vue';
import GameAnagrams from '~views/GameAnagrams.vue';
import BrowserSource from '~views/BrowserSource.vue';
import AccountDashboard from '~views/AccountDashboard.vue';

const routesArr: any = [
    {
        name: 'Home',
        path: '/',
        component: Home
    },
    {
        name: 'Coding',
        path: '/coding',
        component: Coding,
    },
    {
        name: 'GamesOnStream',
        path: '/games',
        component: GamesOnStream,
        children: [
            {
                name: 'GameAnagrams',
                path: 'anagrams',
                component: GameAnagrams
            }
        ]
    },
    {
        name: 'AccountDashboard',
        path: '/account',
        component: AccountDashboard
    },
    {
        name: 'BrowserSource',
        path: '/browser_source/:id',
        component: BrowserSource,
        meta: { standalone: true }
    }
]

const routes = routesArr;

export default routes;