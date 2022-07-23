<template>
    <component v-for="component in activeComponents.components" :is="component" :userId="browserSource.data?.user_id" />
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import type { Component } from 'vue';

import AnagramsContainer from '../components/games/anagrams/AnagramsContainer.vue';

type ComponentType = 'AnagramsContainer';

type ComponentData = {
    name: string,
    component: ComponentType,
    resolution: {
        width: number,
        height: number
    },
    positionFromTop: number,
    positionFromLeft: number
}

const componentsMap: { [key in ComponentType]: Component } = {
    AnagramsContainer: AnagramsContainer
}

const route = useRoute();
const browserSource = reactive<{ data: App.Models.UserBrowserSource | null }>({
    data: null
})
const activeComponents = reactive<{ components: Component[] }>({
    components: []
})

const getBrowserSources = () => {
    axios.post('/api/account/get_browser_source', {
        id: route.params.id
    }).then(response => {
        browserSource.data = response.data;
        JSON.parse(response.data.contents).forEach((value: ComponentData) => {
            activeComponents.components.push(componentsMap[value.component])
        });
    }).catch(function (error) {
        console.error(error);
    });
}

onMounted(() => {
    getBrowserSources();
});
</script>