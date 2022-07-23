<template>
    <div class="results-container" v-if="props.gameState?.currentGameState === 'results'">
        <div class="results-title">
            <AnimationSquigglyText><AnimationTextGif>You Passed!</AnimationTextGif></AnimationSquigglyText>
        </div>
        <div class="results-subtext">
            <AnimationTextGif>You were the first to attempt this anagram!</AnimationTextGif>
        </div>
        <div class="results-stats-container">
            <div class="game-level">1</div>
            <div class="round-stats">
                <div><AnimationTextGif>Total words: {{ resultsData.wordsCount }}</AnimationTextGif></div>
                <div><AnimationTextGif>Found words: {{ resultsData.foundCount }}</AnimationTextGif></div>
                <div><AnimationTextGif>Percentage found: {{ resultsData.percentageFound }}%</AnimationTextGif></div>
            </div>
            <div class="game-xp-bar"></div>
        </div>
        <div class="results-boards">
            <div class="results-board">
                <div class="board-user-container">
                    <div v-for="(score, user) in sortedRoundScores" v-bind:key="user" class="board-user">
                        <div class="user-level">
                            {{ props.gameState.gameUserStats?.[user]?.currentLevel?.level }}
                        </div>
                        <div class="user">
                            {{ user }}
                        </div>
                        <div class="xp-gained">
                            {{ score.xpGained }}xp gained
                        </div>
                        <div class="xp-bar">
                            <div class="current-xp" :style="`--current-xp-width: ${calculateUserXpWidth(props.gameState?.gameUserStats?.[user]?.total_xp ?? 0, props.gameState?.gameUserStats?.[user]?.currentLevel?.xp_required ?? 0, props.gameState.gameUserStats?.[user]?.nextLevel?.xp_required ?? 0)};`"></div>
                        </div>
                    </div>
                </div>
                <div class="results-board-label">Scores This Round</div>
            </div>
            <div class="results-board">
                <div class="board-user-container">
                    <div v-for="(score, user) in sortedGameScores" v-bind:key="user" class="board-user">
                        <div class="user-level">
                            {{ props.gameState?.gameUserStats?.[user]?.currentLevel.level }}
                        </div>
                        <div class="user">
                            {{ user }}
                        </div>
                        <div class="xp-gained">
                            {{ score.xpGained }}xp gained
                        </div>
                        <div class="xp-bar">
                            <div class="current-xp" :style="`--current-xp-width: ${calculateUserXpWidth(props.gameState?.gameUserStats?.[user]?.total_xp ?? 0, props.gameState?.gameUserStats?.[user]?.currentLevel?.xp_required ?? 0, props.gameState.gameUserStats?.[user]?.nextLevel?.xp_required ?? 0)};`"></div>
                        </div>
                    </div>
                </div>
                <div class="results-board-label">Total Scores</div>
            </div>
        </div>
        
        
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import AnimationTextGif from '~components/AnimationTextGif.vue';
import AnimationSquigglyText from '~components/AnimationSquigglyText.vue';
import { defineProps, onMounted, reactive, computed } from "vue";
import * as AnagramTypes from '~types/gamesAnagramTypes';

const props = defineProps<{gameState: AnagramTypes.GameState}>();

const resultsData = reactive({
    roundScores: {},
    wordsCount: 0,
    foundCount: 0,
    percentageFound: 0,
});

const sortedRoundScores = computed<any>(() => {
    if (resultsData.roundScores) {
        const entries = Object.entries(resultsData.roundScores);
        const sorted = entries.sort(([,a]: any,[,b]: any) => b.xpGained-a.xpGained);
        return Object.fromEntries(sorted);
    }
});

const sortedGameScores = computed<any>(() => {
    const entries = Object.entries(props.gameState?.gameUserScores);
    const sorted = entries.sort(([,a]: any,[,b]: any) => b.xpGained-a.xpGained);
    return Object.fromEntries(sorted);
});

const emit = defineEmits(['updateUserStats', 'loadNewRound']);

const calculateResults = () => {
    if (props.gameState?.results) {
        resultsData.roundScores = props.gameState?.results?.userScores;
        resultsData.wordsCount = Object.keys(props.gameState?.results.allWords).length;
        resultsData.foundCount = props.gameState?.results.foundWords.length;
        resultsData.percentageFound = Math.round((resultsData.foundCount * 100) / resultsData.wordsCount);
        axios.post('/api/games/words/save_round', {
            userResults: props.gameState?.results.userScores
        }).then(function (response) {
            emit('updateUserStats', response.data);
            saveGame();
        }).catch(function (error) {
            console.error(error);
        });
    }
}

const calculateUserXpWidth = (currentXp: number, currentLevelXp: number, nextLevelXp: number) => {
    if (currentXp) {
        const currentLevelXpAdjusted = currentXp - currentLevelXp;
        const nextLevelXpAdjusted = nextLevelXp - currentLevelXp;
        return (currentLevelXpAdjusted/nextLevelXpAdjusted*100)+'%';
    } else {
        return '0%';
    }
}

const saveGame = () => {
    console.log('saving game')
    const postData = {
        userId: props.gameState.userId,
        gameXp: props.gameState.gameXp,
        userResults: props.gameState?.gameUserScores
    }
    console.log(postData)
    if (props.gameState?.results) {
        axios.post('/api/games/words/save_game', postData).then(response => {
        }).catch(function (error) {
            console.error(error);
        });
    }
}

const loadNextRound = () => {
    emit('loadNewRound');
}

onMounted(() => {
    calculateResults();
    loadNextRound();
});
</script>

<style lang="scss" scoped>
@import '~styles/_variables';

.results-title {
    margin: 0 auto;
    font-size: 6em;
    line-height: 1.1em;
    font-weight: bold;
    text-align: center;
    font-family: Amatic SC;
}

.results-subtext {
    margin: 0 auto;
    font-size: 3em;
    line-height: 1.1em;
    font-weight: bold;
    text-align: center;
    font-family: Amatic SC;
}

.results-stats-container {
    margin: 1rem 4rem 0;
    position: relative;
    display: flex;
    font-size: 1.2em;
    font-weight: bold;

    & .game-level {
        position: relative;
        z-index: 2;
        width: 3rem;
        height: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: $secondary-purple-8;
        color: $secondary-blue-2;
        font-size: 1.2em;
        border-radius: 50%;
        box-shadow: 1px 1px 2px $dark-grey;
    }

    & .round-stats {
        padding: 0 1rem;
        flex-grow: 1;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    & .game-xp-bar {
        position: absolute;
        z-index: 1;
        height: 1rem;
        bottom: 0.125rem;
        left: 1.5rem;
        right: 0;
        border-radius: 0.5rem;
        background: $pastel-red-light;
        box-shadow: 4px 4px 8px $dark-grey;
    }
}

.results-boards {
    padding: 0 6rem 0 7rem;
    height: 25rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.results-board {
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    width: 45%;
    background-image: linear-gradient(to bottom right, $secondary-blue-9, $secondary-purple-8);
    border-radius: 0 0 0.5rem 0.5rem;
    box-shadow: 2px 2px 4px $dark-grey;
    padding: 1rem;

    & > .board-user-container {
        overflow-y: hidden;
        width: 100%;
        height: 100%;
    }

    & > .results-board-label {
        position: absolute;
        bottom: -1.25rem;
        padding: 0.25rem 0.5rem;
        background: $secondary-blue-1;
        border-radius: 0.5rem;
        box-shadow: 1px 1px 2px $dark-grey;
        color: $main-blue-9;
        margin: 0 auto;
    }
}

.board-user {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    flex-wrap: wrap;
    margin-left: 1rem;
    margin-bottom: 0.8rem;
    color: $main-blue-9;
    background: $secondary-blue-1;
    border: 2px solid $secondary-blue-1;
    border-radius: 0.5rem 0.5rem 0 0.5rem;

    & > .user-level {
        z-index: 5;
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        left: -1rem;
        font-weight: bold;
        border-radius: 50%;
        background: $secondary-blue-3;
        color: $main-blue-9;
        height: 36px;
        min-width: 36px;
        text-align: center;
        box-shadow: 1px 1px 2px $dark-grey;
        border: 2px solid $secondary-blue-1;
    }

    & > .user {
        margin-left: 18px;
        flex-grow: 1;
        padding: 0.125rem 0.5rem;
        height: 24px;
        line-height: 24px;
    }

    & > .xp-gained {
        width: 10rem;
        text-align: right;
        padding: 0.125rem 0.5rem;
        margin-right: 0.25rem;
    }

    & > .xp-bar {
        z-index: 3;
        position: relative;
        width: 100%;
        height: 0.5rem;
        background: $pastel-red;

        & > .current-xp {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: var(--current-xp-width);
            background: $pastel-green;
            transition: width 0.5s ease-in;
        }
    }
}
</style>