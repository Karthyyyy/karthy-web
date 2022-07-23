<template>
    <div class="browser-source-components-container">
        <div>
            Anagrams
            <button @click.prevent="emit('addComponent', 'anagrams')">Add me!</button>
        </div>
    </div>
</template>

<script setup lang="ts">

const emit = defineEmits(['addComponent']);
</script>

<style lang="scss" scoped>
@import '~styles/_variables';

</style>