<template>
    <div class="settings-menu">
        <div @click="$emit('toggleMute')" :class="[props.isMuted ? 'off' : 'on']">
            <font-awesome-icon :icon="['fas', props.isMuted ? 'volume-xmark' : 'volume-high']" />
        </div>
        <div @click="$emit('toggleShuffle')" :class="[props.isShuffling ? 'on' : 'off']">
            <font-awesome-icon :icon="['fas', 'shuffle']" />
        </div>
        <div @click="$emit('toggleLockout')" :class="[props.lockoutActive ? 'on' : 'off']">
            <font-awesome-icon :icon="['fas', props.lockoutActive ? 'lock' : 'lock-open']" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
    isMuted: Boolean,
    isShuffling: Boolean,
    lockoutActive: Boolean
});
</script>

<style lang="scss" scoped>
@import '~styles/_variables';

.settings-menu {
    position: absolute;
    z-index: 20;
    top: -3.2rem;
    right: 2rem;
    padding: 0.45rem 0.25rem 0.6rem;
    border-radius: 0 0 0.5rem 0.5rem;
    display: flex;
    transition: all 0.2s ease-out;
    filter: saturate(0.75);

    & div {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        font-size: 1.1rem;
        margin-left: 0.5rem;
        color: $dark-grey;
        border-radius: 0.25rem;
        box-shadow: 1px 1px 1px $dark-grey;

        &.off {
            background: $pastel-red;
        }

        &.on {
            background: $pastel-green;
        }

        &:first-of-type {
            margin-left: 0;
        }

        &:hover {
            box-shadow: inset 1px 1px 2px $dark-grey;
            filter: brightness(0.8);
        }
    }
}
</style>