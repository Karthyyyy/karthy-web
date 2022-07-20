<template>
    <div>
        <div class="animation-text" :class="[props.onHover ? 'on-hover' : 'always-active']">
            <slot></slot>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="squiggly-svg">
            <defs>

                
                <filter id="squiggly-0">
                <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="2" result="noise" seed="0"/>
                <feDisplacementMap id="displacement" in="SourceGraphic" in2="noise" scale="3" />
                </filter>
                <filter id="squiggly-1">
                <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="2" result="noise" seed="1"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" />
                </filter>
                
                <filter id="squiggly-2">
                <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="2" result="noise" seed="2"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
                </filter>
                <filter id="squiggly-3">
                <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="2" result="noise" seed="3"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" />
                </filter>
                
                <filter id="squiggly-4">
                <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="2" result="noise" seed="4"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
                </filter>
            </defs> 
            </svg>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
    text: String,
    onHover: Boolean
});
</script>

<style lang="scss" scoped>
@keyframes squiggly-anim {
    0%       { filter: url('#squiggly-0') }
    25%      { filter: url('#squiggly-1') }
    50%      { filter: url('#squiggly-2') }
    75%      { filter: url('#squiggly-3') }
    100%     { filter: url('#squiggly-4') }
}

.animation-text {
    &.always-active {
        animation: squiggly-anim 0.34s linear infinite;
    }

    &.on-hover:hover {
        animation: squiggly-anim 0.34s linear infinite;
    }
}

.squiggly-svg {
    display: none;
}
</style>