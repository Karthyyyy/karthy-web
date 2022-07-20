<template>
    <div>
        <div style="padding: 1rem">{{ store.state.karthyBot.user }}: {{ store.state.karthyBot.message }}</div>
        <AnagramsContainer :userId="store.state.user.userId" />
    </div>
</template>

<script setup lang="ts">
import AnagramsContainer from '~components/games/anagrams/AnagramsContainer.vue';
import { useStore } from 'vuex';
const store = useStore();
</script>