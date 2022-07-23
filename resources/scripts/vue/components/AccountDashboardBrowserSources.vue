<template>
    <div>
        <h1>Browser Sources</h1>
        <div class="content-section">
            <div class="browser-source-select-container">
                <select class="browser-source-select" v-model="activeBrowserSource">
                    <option disabled selected :value="null">Select a browser source...</option>
                    <option v-for="browserSource in browserSources" :value="browserSource">{{ browserSource.name }}</option>
                    <option :value="blankBrowserSource">Add a new source...</option>
                </select>
                <button class="browser-source-new" @click="setNewBrowserSource()">New browser source</button>
            </div>
            <AccountDashboardBrowserSourceForm :browserSource="activeBrowserSource" v-if="activeBrowserSource" />
        </div> 
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref, reactive } from 'vue';
import AccountDashboardBrowserSourceForm from '~components/AccountDashboardBrowserSourceForm.vue';

type ComponentData = {
    name: string,
    component: string,
    resolution: {
        width: number,
        height: number
    }
    positionFromTop: number,
    positionFromLeft: number,
}
type BrowserSourceData = {
    id: string | null,
    name: string,
    contents: ComponentData[]
}

const browserSources = ref<App.Models.UserBrowserSource[]>([]);
const activeBrowserSource = ref<BrowserSourceData | null>(null)
const blankBrowserSource = reactive<BrowserSourceData>({
    id: null,
    name: "",
    contents: []
});

const setNewBrowserSource = () => {
    activeBrowserSource.value = blankBrowserSource;
}

const getBrowserSources = () => {
    axios.get('/api/account/get_browser_sources').then(response => {
        response.data.forEach((browserSource: App.Models.UserBrowserSource) => {
            browserSources.value.push(browserSource);
        })
        console.log(response.data);
    }).catch(function (error) {
        console.error(error.response);
    });
}

onMounted(() => {
    getBrowserSources();
})
</script>

<style lang="scss" scoped>
@import '~styles/_variables';
.content-section {
    background-color: $dark-grey;
    padding: 1rem;
}

.browser-source-select-container {
    display: flex;
}

.browser-source-select {
    flex-grow: 1;
    margin-right: 1rem;
}

.browser-source-new {
    white-space: nowrap;
    margin: 0;
}
</style>