<template>
    <div class="anagrams-loading">
        <div class="loading-name">
            <AnimationSquigglyText><AnimationTextGif>Karthy.tv Words</AnimationTextGif></AnimationSquigglyText>
        </div>
        <div :class="[(!props.gameReady) ? 'loading-spinner' : 'loading-spinner-paused']"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        <div class="loading-text">
            <AnimationTextGif v-if="!props.gameReady">Loading game</AnimationTextGif>
            <AnimationTextGif v-else class="start-game" @click="$emit('startRound', true)">!startgame</AnimationTextGif>
        </div>
    </div>
</template>

<script setup lang="ts">
import AnimationTextGif from '~components/AnimationTextGif.vue';
import AnimationSquigglyText from '~components/AnimationSquigglyText.vue';
import { defineProps } from "vue";

const props = defineProps({
    gameReady: Boolean
});
</script>

<style lang="scss" scoped>
.anagrams-loading {
    height: 523px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: Amatic SC;
}

.loading-name {
    font-size: 10em;
    font-weight: bold;
}
.loading-text {
    font-size: 5em;
    font-weight: bold;
}

.start-game {
    cursor: pointer;

    &:hover {
        transform: scale(1.2);
        filter: brightness(4)
    }
}

.loading-spinner-paused {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.loading-spinner {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.loading-spinner div {
  animation: loading-spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  transform-origin: 40px 40px;
}
.loading-spinner div:after {
  content: " ";
  display: block;
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-image: url(https://media1.giphy.com/media/3oxQNAEvUrfsZuMAOk/giphy.gif?cid=ecf05e478xkzkvbulzibxwgxc9yl5ftw9gf4e0rj6cxpi7xx&rid=giphy.gif&ct=g);
  margin: -4px 0 0 -4px;
}
.loading-spinner div:nth-child(1) {
  animation-delay: -0.036s;
}
.loading-spinner div:nth-child(1):after {
  top: 63px;
  left: 63px;
}
.loading-spinner div:nth-child(2) {
  animation-delay: -0.072s;
}
.loading-spinner div:nth-child(2):after {
  top: 68px;
  left: 56px;
}
.loading-spinner div:nth-child(3) {
  animation-delay: -0.108s;
}
.loading-spinner div:nth-child(3):after {
  top: 71px;
  left: 48px;
}
.loading-spinner div:nth-child(4) {
  animation-delay: -0.144s;
}
.loading-spinner div:nth-child(4):after {
  top: 72px;
  left: 40px;
}
.loading-spinner div:nth-child(5) {
  animation-delay: -0.18s;
}
.loading-spinner div:nth-child(5):after {
  top: 71px;
  left: 32px;
}
.loading-spinner div:nth-child(6) {
  animation-delay: -0.216s;
}
.loading-spinner div:nth-child(6):after {
  top: 68px;
  left: 24px;
}
.loading-spinner div:nth-child(7) {
  animation-delay: -0.252s;
}
.loading-spinner div:nth-child(7):after {
  top: 63px;
  left: 17px;
}
.loading-spinner div:nth-child(8) {
  animation-delay: -0.288s;
}
.loading-spinner div:nth-child(8):after {
  top: 56px;
  left: 12px;
}
@keyframes loading-spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>