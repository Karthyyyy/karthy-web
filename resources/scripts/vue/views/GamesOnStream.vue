<template>
    <div class="games-menu">
        <router-link :to="{name: 'GameAnagrams'}">
            <div class="games-menu-game">
                <div class="game-icon">

                </div>
                <div class="game-name">
                Anagrams Anagrams
                </div>
            </div>
        </router-link>
        <router-link :to="{name: 'GameAnagrams'}">
            <div class="games-menu-game">
                <div class="game-icon">

                </div>
                <div class="game-name">
                Test Game
                </div>
            </div>
        </router-link>
    </div>
    <router-view></router-view>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
@import '~styles/_variables';

.games-menu {
    height: 14rem;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 1rem;
}

.games-menu-game {
    height: 100%;
    width: 9rem;
    padding: 0.5rem;
    background: $grey-2;
    border-radius: 0.375rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    margin: 0 0.5rem;

    &:hover {
        background: $main-blue-2;
    }
}

.game-icon {
    width: 8rem;
    height: 8rem;
    background: $black;
    margin: 0 auto;
    margin-bottom: 0.5rem;
}

.game-name {
    width: 100%;
    text-align: center;
}
</style>