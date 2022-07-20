<template>
    <div class="browser-source-form-container">
        <form>
            <router-link :to="{name: 'BrowserSource', params: { id: browserSourceData.id}}">
                <button style="margin-bottom: 1rem;display: block;">Go to browser source: {{ browserSourceData.id }}</button>
            </router-link>
            
            <label for="browserSourceName">Browser Source Name</label>
            <div class="browser-source-name-container">
                <input id="browserSourceName" type="text" v-model="browserSourceData.name" />

                <button @click.prevent="showComponentModal()">Add Component</button>
            </div>

            <div v-for="(component, key) in browserSourceData.contents" class="component-container">
                <div class="component-header" :class="{ expanded: openedComponents.includes(key) }" @click="toggleComponentDisplay(key)">
                    <div class="component-name">{{ component.name }}</div>
                    <font-awesome-icon :icon="['fas', openedComponents.includes(key) ? 'fa-minus' : 'fa-plus']" />
                </div>

                <div v-if="openedComponents.includes(key)" class="component-settings">
                    <label :for="`component${key}Resolution`">Resolution</label>
                    <select :id="`component${key}Resolution`" v-model="browserSourceData.contents[key].resolution">
                        <option :value="{ width: 1920, height: 1080 }">1920 x 1080</option>
                        <option :value="{ width: 1280, height: 720 }">1280 x 720</option>
                    </select>

                    <div class="component-positions">
                        <div>
                            <label :for="`component${key}PositionTop`">Position from Top (pixels)</label>
                            <input :id="`component${key}PositionTop`" type="number" v-model="browserSourceData.contents[key].positionFromTop" />
                        </div>

                        <div>
                            <label :for="`component${key}PositionLeft`">Position from Left (pixels)</label>
                            <input :id="`component${key}PositionLeft`" type="number" v-model="browserSourceData.contents[key].positionFromLeft" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="browser-source-submit">
                <div :class="[ formStatus.success ? 'success' : 'error']">{{ formStatus.message }}</div>
                <button @click.prevent="submitForm()">{{ submitButtonText }}</button>
            </div>
        </form>

        <AppModal :isShowing="showComponentSelectors" @close-modal="closeComponentModal()">
            <AccountDashboardBrowserSourceComponentSelector @add-component="(component) => addComponent(component)" />
        </AppModal>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, toRef } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import AccountDashboardBrowserSourceComponentSelector from '~components/AccountDashboardBrowserSourceComponentSelector.vue';
import AppModal from './AppModal.vue';

const store = useStore();

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

const props = defineProps<{ browserSource: BrowserSourceData }>();
// Pull from db
const browserSourceData = toRef(props, 'browserSource');

const showComponentSelectors = ref<boolean>(false);
const openedComponents = ref<number[]>([]);
const formStatus = reactive<{ success: boolean | null, message: string | null }>({
    success: null,
    message: null
});
const submitButtonText = computed(() => {
    return (browserSourceData.value.id ? 'Update' : 'Create');
})

const submitForm = () => {
     axios.post('/api/account/save_browser_source', {
        id: browserSourceData.value.id,
        name: browserSourceData.value.name,
        contents: browserSourceData.value.contents
    }).then(response => {
        formStatus.message = response.data.message;
        formStatus.success = response.data.success;
    }).catch(function (error) {
        console.error(error.response);
    });
    
}

const toggleComponentDisplay = (key: number) => {
    const index = openedComponents.value.indexOf(key);
    if (index !== -1) {
        openedComponents.value.splice(index, 1);
    } else {
        openedComponents.value.push(key);
    }
}

const addComponent = (component: string) => {
    browserSourceData.value.contents.push({
            name: 'Anagram Game',
            component: 'AnagramsContainer',
            resolution: {
                width: 1280,
                height: 720
            },
            positionFromTop: 0,
            positionFromLeft: 0,
        })
    closeComponentModal();
}

const closeComponentModal = () => {
    showComponentSelectors.value = false;
}

const showComponentModal = () => {
    showComponentSelectors.value = true;
}
</script>

<style lang="scss" scoped>
@import '~styles/_variables';

.browser-source-form-container {
    margin-top: 1rem;
    padding: 0 1rem;
}

.browser-source-name-container {
    display: flex;

    & > input {
        flex-grow: 1;
        margin-right: 1rem;
    }

    & > button {
        white-space: nowrap;
        margin: 0;
    }
}

.component-container {
    margin-top: 1rem;
    &:nth-of-type(odd) > .component-header {
        background: $secondary-blue-3;
    }

    &:nth-of-type(even) > .component-header {
        background: $secondary-purple-3;
    }
}

.component-header {
    padding: 1rem;
    display: flex;
    border-radius: 0.5rem;
    align-items: center;
    cursor: pointer;

    &.expanded {
        border-radius: 0.5rem 0.5rem 0 0;
    }

    .component-name {
        flex-grow: 1;
    }
}

.component-settings {
    padding: 1rem;
    box-shadow: inset 0 0 100px 100px rgba($grey-5, 0.1);
    border-radius: 0 0 0.5rem 0.5rem;
}

.component-positions {
    display: flex;
    margin-top: 1rem;

    div:first-of-type {
        margin-right: 1rem;
    }
}

.browser-source-submit {
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    div {
        margin-right: 1rem;

        &.success {
            color: $pastel-green;
        }

        &.error {
            color: $pastel-red;
        }
    }
}
</style>