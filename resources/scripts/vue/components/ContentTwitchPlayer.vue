<template>
    <div class="twitch-container">
        <div class="twitch-player-container">
            <div>
                <iframe
                    :src="`https://player.twitch.tv/?channel=karthy&parent=${appUrl}`"
                    allowfullscreen>
                </iframe>
            </div>
        </div>
        <a href="https://twitch.tv/karthy">
            <div class="twitch-message">
                <div class="twitch-message-logo">
                    <i class="fa fa-twitch fa-2x"></i>
                </div>
                <div class="twitch-message-text">
                    <span>Join us over on Twitch for the full experience!</span>
                </div>
            </div>
        </a>
    </div>

</template>

<script setup lang="ts">
const appUrl = import.meta.env.VITE_APP_DOMAIN;
</script>

<style scoped lang="scss">
@import '~styles/_variables';

.twitch-container {
    width: 100%;
    height: 100%;
    position: relative;
}

.twitch-player-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.twitch-player-container > div {
    width: 100%;
    height: 56.25vw;
    max-height: calc(100vh - 63px);
    position: relative;
    box-sizing: content-box;
}

.twitch-player-container iframe {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
}

.twitch-message {
    position: absolute;
    right: 0;
    top: 10%;
    color: $secondary-purple;
    background: $dark-grey;
    padding: 1rem;
    border-left: 3px solid $secondary-purple;
    width: 15%;
    min-width: 240px;
    display: flex;
    justify-content: space-between;
}

.twitch-message:hover {
    color: $secondary-blue;
    border-left: 3px solid $secondary-blue;
}

.twitch-message-logo {
    width: 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 4px;
    padding-top: 7px;
}

.twitch-message-text {
    width: 100%;
}

</style>