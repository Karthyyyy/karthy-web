<template>
    <div>
        <div class="animation-text">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
    backgroundImage: String
});
</script>

<style lang="scss" scoped>
.animation-text {
    background-image: url(https://media1.giphy.com/media/3oxQNAEvUrfsZuMAOk/giphy.gif?cid=ecf05e478xkzkvbulzibxwgxc9yl5ftw9gf4e0rj6cxpi7xx&rid=giphy.gif&ct=g);
    background-size: cover;
    background-position: center;
    color: transparent;
    background-clip: text;
    -webkit-background-clip: text;
}
</style>