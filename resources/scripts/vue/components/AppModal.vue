<template>
    <Transition name="fade">
        <div class="modal-container" @click.self="closeModal" v-if="props.isShowing">
            <div class="modal-content">
                <slot></slot>
                <component v-for="(component, componentId) in store.state.modalContent" :key="componentId" :is="component"></component>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { emit } from 'process';
import { useStore } from 'vuex'
const store = useStore();

type AppModalProps = {
    isShowing: boolean
}

const props = defineProps<AppModalProps>();
const emits = defineEmits(['closeModal']);

const closeModal = () => {
    emits('closeModal');
    store.commit('closeModal')
}
</script>

<style scoped lang="scss">
@import '~styles/variables';

.modal-container {
    z-index: 10;
    background: rgba(0, 0, 0, 0.4);
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.modal-content {
    border-radius: 10px;
    background: $dark-grey;
    width: 30vw;
    min-height: 30vh;
    padding: 2rem;
    box-shadow:0 0 15px 4px rgba(0,0,0,0.6);
    border: 2px solid $main-blue-2;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>