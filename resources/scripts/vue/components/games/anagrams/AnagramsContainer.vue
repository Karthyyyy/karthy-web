<template>
    <div class="anagrams-container">
        <AnagramsSettings
            :isMuted="state.isMuted"
            :isShuffling="state.isShuffling"
            :lockoutActive="state.lockoutActive"
            @toggle-mute="toggleMute"
            @toggle-shuffle="toggleShuffle"
            @toggle-lockout="toggleLockout"
        />
        <AnagramsLoading v-if="state.currentGameState === 'loading'" :gameReady="state.gameReady" @start-round="(isActive) => startRound(isActive)"></AnagramsLoading>
        <AnagramsGame
            ref="gameRef"
            :gameState="state"
            @set-game-ready-state="(isReady) => setGameReadyState(isReady)"
            @play-sound="(soundFile, volume = 1) => playSound(soundFile, volume)"
            @restart-game="loadNewRound"
            @end-round="(gameStateToSave) => endRound(gameStateToSave)"
        />
        <AnagramsResults :gameState="state" v-if="state.resultsActive" @update-user-stats="(newUserStats) => updateUserStats(newUserStats)" @load-new-round="loadNewRound()" />
        <div class="powered-by"><AnimationTextGif>Powered by Karthy.tv</AnimationTextGif></div>
    </div>
    <button @click="passEndRound()">End</button>
</template>

<script setup lang="ts">
import axios from 'axios';
import { reactive, onMounted, computed, ref, watch, inject } from 'vue';
import { useStore } from 'vuex';
import AnagramsSettings from '~components/games/anagrams/AnagramsSettings.vue';
import AnagramsLoading from '~components/games/anagrams/AnagramsLoading.vue';
import AnagramsGame from '~components/games/anagrams/AnagramsGame.vue';
import AnagramsResults from '~components/games/anagrams/AnagramsResults.vue';
import AnimationTextGif from '~components/AnimationTextGif.vue';
import AnimationSquigglyText from '~components/AnimationSquigglyText.vue';
import * as AnagramTypes from '~types/gamesAnagramTypes';

const props = defineProps<{ userId: number }>()

const karthyBot = inject('karthyBot');

const store = useStore();

const state = reactive<AnagramTypes.GameState>({
    userId: props.userId,
    gameReady: false,
    resultsActive: false,
    currentGameState: 'loading',
    incomingMessage: null,
    loading: true,
    isMuted: true,
    isShuffling: true,
    lockoutActive: false,
    gameXp: 0,
    gameUserScores: {},
    gameUserStats: null,
    results: null
});

const gameRef = ref();

const playSound = (filename: string, volume = 1) => {
    if (!state.isMuted) {
        const sound = new Audio();
        sound.src = '/sounds/games/anagrams/'+filename;
        sound.load();
        sound.volume = volume;
        const promise = sound.play();
        if (promise !== undefined) {
            promise.then(() => {}).catch(error => {console.error(error)});
        }
    }
}

const toggleMute = () => {
    state.isMuted = !state.isMuted;
}

const toggleShuffle = () => {
    state.isShuffling = !state.isShuffling;
}

const toggleLockout = () => {
    state.lockoutActive = !state.lockoutActive;
}

const setGameReadyState = (isReady: boolean) => {
    if (!isReady) {
        state.loading = true;
        state.currentGameState = 'loading';
    }
    state.gameReady = isReady;
}

const loadNewRound = () => {
    state.loading = true;
    if (state.currentGameState !== 'results') state.currentGameState = 'loading';
    state.gameReady = false;
    gameRef.value.loadRound();
}

const startRound = (isActive: boolean) => {
    if (isActive) state.currentGameState = 'ingame';
    state.resultsActive = false;
}

const guessWord = ref();
const submitWord = (guessWord: string, user: string) => {
    gameRef.value.submitWord(guessWord, user, '#karthy');
}

const passEndRound = () => {
    gameRef.value.endRound();
}

const updateUserStats = (newUserStats: AnagramTypes.UserStats[]) => {
    state.gameUserStats = newUserStats;
}

const endRound = (resultsToSave: AnagramTypes.RoundResults) => {
    resultsToSave.userScores = {
        matt: {xpGained: 52, userId: '37277689', platform: 'twitch'},
        karthy: {xpGained: 48, userId: '37277688', platform: 'twitch'},
    }
    for (const [key, value] of Object.entries(resultsToSave.userScores)) {
        if (state.gameUserScores?.[key]) state.gameUserScores[key].xpGained += value.xpGained;
        else state.gameUserScores[key] = value;
    };
    state.results = resultsToSave;
    state.currentGameState = 'results';
    state.resultsActive = true;
}

const loadGame = () => {
    axios.post('/api/games/words/load_game', {
        userId: props.userId
    }).then(response => {
        if (response.data.activeGame) {
            console.log(response.data)
            state.gameUserScores = JSON.parse(response.data.activeGame.score_data) ?? {};
            state.gameXp = response.data.activeGame.game_xp ?? 0;
        }
    }).catch(function (error) {
        console.error(error);
    });
}

watch(() => store.state.karthyBot, () => {
    // Purely for testing
    if (store.state.karthyBot.user.badges.broadcaster === '1' || store.state.karthyBot.user.mod === true) {
        if (store.state.karthyBot.message.includes('!endround')) passEndRound();
        if (store.state.karthyBot.message.includes('!newround')) startRound(true);
    }
    state.incomingMessage = store.state.karthyBot;
});

onMounted(() => {
    loadGame();
})
</script>

<style scoped lang="scss">
@import '~styles/_variables';

.anagrams-container {
    position: relative;
    overflow: hidden;
    margin: 2rem;
    width: calc(100% - 4rem);
    height: 50rem;
    padding: 2rem;
    background-image: linear-gradient(to bottom right, $secondary-blue, $main-blue);
    border-radius: 0.5rem;

    &:hover .settings-menu {
        top: -0.25rem;
    }
}

.powered-by {
    position: absolute;
    bottom: 0.25rem;
    left: 0.75rem;
    font-weight: bold;
    font-family: Amatic SC;
    font-size: 2em;
}
</style>