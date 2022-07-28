<template>
    <div class="game-container" v-if="props.gameState?.currentGameState === 'ingame'">
        <div class="anagrams-xp-container" :style="xpStyles">
            <div class="anagrams-xp">
                <div class="xp-bar xp-current"></div>
                <div class="xp-bar xp-pass"></div>
                <div class="xp-level-container">
                    <div class="xp-level">
                        1
                    </div>
                    <div class="xp-level-label">
                        Level
                    </div>
                </div>
            </div>
            <div class="anagrams-lockout">
                <div class="lockout-icon"><font-awesome-icon :icon="['fas', props.gameState?.lockoutActive && roundState.roundData.lockedOutUsers.length ? 'lock' : 'lock-open']" /></div>
                <div class="lockout-text">
                    <span v-if="props.gameState?.lockoutActive">Lockout expires in {{ roundState.gameSettings.timerLockout }}s</span>
                    <span v-else>No lockout, go crazy!</span>
                </div>
            </div>
        </div>
        <div class="master-container">
            <div v-for="(letter, index) in roundState.roundData.masterWordShuffledArray" v-bind:key="index" class="master-letter" :class="{ shuffling: roundState.gameSettings.isMasterShuffling, flashing: roundState.roundData.masterWordsFoundBy }">
                {{letter}}
            </div>
            <div v-if="roundState.roundData.masterWordsFoundBy" class="master-word-found">
                Found by {{ roundState.roundData.masterWordsFoundBy }}
            </div>
        </div>
        <div class="anagram-group"
            v-for="(anagramGroup, letterCount) in roundState.roundData.anagramsByLetterCount" :key="letterCount" v-bind:anagramGroup="anagramGroup">
            <div class="group-title">
                <span>{{ letterCount }} letter words ( {{ roundState.roundData.foundWordCount[letterCount] }} / {{countWordsInGroup(anagramGroup)}} )</span>
            </div>
            <Vue3Marquee :duration="marqueeDuration(anagramGroup)" :delay="isMarqueePaused(anagramGroup, letterCount)">
                <div class="group-words">
                    <div v-for="(word) in anagramGroup" :key="word.id" :class="`word${word.id}`" v-bind:word="word" class="anagram-word" :ref="el => bindWordToGroupRef(el as HTMLDivElement, word)">
                        <div v-for="letter, index2 in wordToArray(word.word)" :key="index2" v-bind:letter="letter" class="anagram-word-letter">
                        <span v-if="roundState.resultsRound.allWords[word.word].isWordFound">{{ letter }}</span>
                        </div>
                        <div class="word-user" v-if="roundState.resultsRound.allWords[word.word].isWordFound">
                            {{ roundState.resultsRound.allWords[word.word].foundByUser }}
                        </div>
                    </div>
                </div>
            </Vue3Marquee>
        </div>
        <div class="found-words-container" :class="{ active: roundState.roundData.foundWord.active }">
            <div class="found-word">{{ roundState.roundData.foundWord.user }} found {{ roundState.roundData.foundWord.word }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { defineProps, computed, ref, watch, reactive, onMounted, inject, onUnmounted } from "vue";
import { Vue3Marquee } from 'vue3-marquee';
import 'vue3-marquee/dist/style.css';
import { useStore } from 'vuex';
import type { CommonUserstate } from 'tmi.js';
import * as AnagramTypes from '~types/gamesAnagramTypes';
import { KARTHY_BOT } from '~types/injectionSymbols';

const store = useStore();

const props = defineProps<{gameState: AnagramTypes.GameState}>();

const roundState = reactive<AnagramTypes.RoundState>({
    gameSettings: {
        timerLockout: 30,
        timerGame: 300,
        isMasterShuffling: false
    },
    roundData: {
        masterWord: "",
        masterWordShuffledArray: [],
        anagramsByLetterCount: {
            "4": [],
            "5": [],
            "6": [],
            "7": [],
            "8": [],
            "9+": []
        },
        foundWordCount: {
            "4": 0,
            "5": 0,
            "6": 0,
            "7": 0,
            "8": 0,
            "9+": 0
        },
        foundWord: {
            active: false,
            user: null,
            word: null,
            timeoutId: null
        },
        masterWordsFoundBy: null,
        xpToPass: 0,
        xpMax: 0,
        lockedOutUsers: [],
    },
    resultsRound: {
        allWords: {},
        xpGained: 0,
        foundWords: [],
        userScores: {}
    }
});

const emit = defineEmits(['setGameReadyState', 'playSound', 'endRound', 'restartGame'])
const wordRefs = ref<HTMLDivElement[]>([]);
const karthyBot = inject(KARTHY_BOT);

const xpStyles = computed(() => {
    const xpGainedWidth = roundState.resultsRound.xpGained / roundState.roundData.xpMax * 100;
    const xpPassWidth = roundState.roundData.xpToPass / roundState.roundData.xpMax * 100;
    return {
        '--xp-current-width': `${xpGainedWidth}%`,
        '--xp-pass-width': `${xpPassWidth}%`
    }
})

const submitWord = (karthyBotData: CommonUserstate) => {
    const byUser = karthyBotData.user.username;
    const userData = karthyBotData.user;
    const guessWord = karthyBotData.message;
    const channel = karthyBotData.channel;
    const platform = karthyBotData.platform;
    if ((guessWord in roundState.resultsRound.allWords) && (!roundState.resultsRound.allWords[guessWord].isWordFound) && (!isLockedOut(byUser))) {
        // Calculations
        const xpGained = Math.ceil(roundState.roundData.xpMax / Object.keys(roundState.resultsRound.allWords).length);
        // Set roundState variables
        roundState.resultsRound.allWords[guessWord].isWordFound = true;
        roundState.resultsRound.allWords[guessWord].foundByUser = byUser;
        // Update count for group
        let letterCount = guessWord.length;
        if (letterCount > 8) letterCount = "9+";
        roundState.roundData.foundWordCount[letterCount as keyof AnagramTypes.FoundWordsByLetterCount]++;
        // Reply in chat
        karthyBot.send(JSON.stringify({action: 'replyWords', user: byUser, word: guessWord, channel: channel}));
        emit('playSound', 'word_found.wav');
        // Clear previous word found pop up and create new
        foundWordPopup(byUser, guessWord);
        // Add user to lockout
        roundState.roundData.lockedOutUsers.push(byUser);
        // Add to game state to save at end of round
        roundState.resultsRound.xpGained += xpGained
        roundState.resultsRound.foundWords.push(guessWord);
        if (!roundState.resultsRound.userScores[byUser]) roundState.resultsRound.userScores[byUser] = {xpGained: 0, userId: userData['user-id'], platform: platform};
        roundState.resultsRound.userScores[byUser].xpGained += xpGained;
    }
}

const foundWordPopup = (byUser: string, guessWord: string) => {
    if (guessWord.length === roundState.roundData?.masterWord?.length) {
        roundState.roundData.masterWordShuffledArray = wordToArray(guessWord);
        roundState.roundData.masterWordsFoundBy = byUser;
        setTimeout(() => {
            roundState.roundData.masterWordsFoundBy = null;
            shuffleWord();
        }, 10000);
    } else {
        if (roundState.roundData.foundWord.timeoutId) clearTimeout(roundState.roundData.foundWord.timeoutId);
        roundState.roundData.foundWord.active = true;
        roundState.roundData.foundWord.user = byUser;
        roundState.roundData.foundWord.word = guessWord;
        roundState.roundData.foundWord.timeoutId = setTimeout(() => {roundState.roundData.foundWord.active = false}, 2500);
    }
}

const isLockedOut = (byUser: string) => {
    if (!props.gameState?.lockoutActive) return false;
    if (roundState.roundData.lockedOutUsers.includes(byUser)) return true;
    return false;
}

const timerStart = () => {
    reshuffleTimer(10000);
    lockoutTimer();
}

const lockoutTimer = () => {
    if (props.gameState?.lockoutActive) {
        setInterval(function() {
            roundState.gameSettings.timerLockout--;
            if (roundState.gameSettings.timerLockout === 0) {
                emit('playSound', 'unlock.wav');
                roundState.gameSettings.timerLockout = 30;
                roundState.roundData.lockedOutUsers = [];
            }
        }, 1000);
    }
}

const countWordsInGroup = (group: App.Models.GamesWordsList[]) => {
    return group.length;
}

const reshuffleTimer = (timeInMs: number) => {
    setInterval(function() {
        if (props.gameState?.isShuffling && !roundState.roundData.masterWordsFoundBy) {
            shuffleWord();  
        }
    }, timeInMs);
}

const marqueeDuration = (group: App.Models.GamesWordsList[]) => {
    const wordCount = countWordsInGroup(group);
    let modifier = 100;
    if (wordCount > 5) modifier = 50;
    if (wordCount > 25) modifier = 30;
    if (wordCount > 75) modifier = 20;
    if (wordCount > 150) modifier = 15;
    if (wordCount > 350) modifier = 8;
    if (wordCount > 500) modifier = 5;

    return (2000-wordCount)/modifier;
}

const isMarqueePaused = (group: App.Models.GamesWordsList[], letterCount: string) => {
    if (letterCount) {
    const wordCount = countWordsInGroup(group);
    const visibleInRow = 6-Number(letterCount.match(/\d+/))+6;
    return (wordCount > visibleInRow) ? 0 : 60000;
    }
}

const wordToArray = (word: string) => {
    return word.split("");
}

const bindWordToGroupRef = (el: HTMLDivElement, word: any) => {
    wordRefs.value[word.word] = el;
}

const shuffleWord = (isMuted = false) => {
    if (!isMuted) emit('playSound', 'reshuffle1.wav', 0.5);
    roundState.gameSettings.isMasterShuffling = true;
    setTimeout(function() {
        if (!isMuted) emit('playSound', 'reshuffle2.wav', 0.5);
        if (roundState.roundData.masterWord) {
            const word = roundState.roundData.masterWord.split('');
            let currentIndex = word.length,  randomIndex;

            // While there remain elements to shuffle.
            while (currentIndex != 0) {
                // Pick a remaining element.
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;

                // And swap it with the current element.
                [word[currentIndex], word[randomIndex]] = [
                word[randomIndex], word[currentIndex]];
            }
            
            roundState.roundData.masterWordShuffledArray = word;
            roundState.gameSettings.isMasterShuffling = false;
        }
    }, 250);
}

const resetFoundWordCount = () => {
    roundState.roundData.foundWordCount = {
        "4": 0,
        "5": 0,
        "6": 0,
        "7": 0,
        "8": 0,
        "9+": 0
    }
}

const loadRound = () => {
    axios.get('/api/games/words/new_round').then(response => {
        roundState.roundData.masterWord = response.data.masterWord.word;
        roundState.roundData.anagramsByLetterCount = response.data.anagramsByLetters;
        roundState.resultsRound.allWords = response.data.anagramsUngrouped;
        roundState.resultsRound.xpGained = 0;
        roundState.resultsRound.foundWords = [];
        roundState.resultsRound.userScores = {};

        resetFoundWordCount();
        shuffleWord(true);
        setMaxXp();
        emit('setGameReadyState', true)
    }).catch(function (error) {
        console.error(error);
    });
}

const setMaxXp = () => {
    let maxXp = 0;
    Object.entries(roundState.roundData.anagramsByLetterCount).forEach((value) => {
        if (value[0] === '9+') maxXp += 12*value[1].length;
        else maxXp += Number(value[0])*value[1].length;
    })
    roundState.roundData.xpMax = maxXp*10;
    roundState.roundData.xpToPass = maxXp / 3.5;
}

const restartGame = () => {
    emit('restartGame', false);
    loadRound();
}

const endRound = () => {
    emit('endRound', roundState.resultsRound);
}

defineExpose({
    submitWord, restartGame, endRound, loadRound
});

watch(() => props.gameState?.currentGameState, () => {
    if (props.gameState?.currentGameState === 'ingame') {
        timerStart();
    }
});
watch(() => store.state.karthyBot, () => {
    if (store.state.karthyBot.channel === '#karthy') {
        if (store.state.karthyBot.user == 'karthy' && store.state.karthyBot.message == '!newgame') {
            restartGame();
        }
        if (!(/\s/).test(store.state.karthyBot.message)) {
            submitWord(store.state.karthyBot)
        }
    }
});

onMounted(() => {
    loadRound();
});
</script>

<style lang="scss" scoped>
@import '~styles/_variables';

.anagrams-xp-container {
    position: relative;
    margin: 1rem 0 2rem 1rem;
}

.anagrams-xp {
    position: relative;
    width: calc(100% - 13rem + 1px);
    background-image: linear-gradient(to bottom right, $pastel-blue, $secondary-purple);
    border: 1px solid $dark-grey;
    height: 8px;
    border-radius: 0.25rem 0 0 0.25rem;
}

.xp-bar {
    position: absolute;
    height: 8px;
    border: 1px solid $dark-grey;
    border-right: 0;
    border-radius: 0.25rem 0 0 0.25rem;
    margin-top: -1px;
    transition: width 0.5s ease-in-out;

    &::after {
        position: absolute;
        display: flex;
        align-content: flex-end;
        justify-content: flex-end;
        flex-wrap: nowrap;
        padding: 0 0.25rem;
        height: 1.1rem;
        right: -1px;
        text-shadow: 1px 1px 1px $dark-grey;
        font-weight: bold;
        font-size: 0.7em;
        text-transform: uppercase;
        width: 100%;
        overflow-x: hidden;
        overflow-y: visible;
        white-space: nowrap;
    }
}

.xp-current {
    width: var(--xp-current-width);
    background: $pastel-green;
    z-index: 10;
    box-shadow: 4px 0px 2px rgb(0, 255, 0);

    &::after {
        content: "Current XP";
        color: $pastel-green;
        bottom: -1rem;
    }
}

.xp-pass {
    width: var(--xp-pass-width);
    background: $pastel-red;
    z-index: 5;
    box-shadow: 1px 0px 1px red;

    &::after {
        content: "XP to pass";
        color: $pastel-red;
        top: -1rem;
    }
}

.xp-level-container {
    position: absolute;
    top: -1.75rem;
    left: -1.75rem;
    width: 4rem;
    height: 4rem;
    background-image: linear-gradient(to bottom right, $main-blue-8, $secondary-purple);
    border: 2px solid $dark-grey;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 1px 1px 4px $grey-2;
    z-index: 15;
}

.xp-level {
    font-size: 2em;
    color: $dark-grey;
}

.xp-level-label {
    font-size: 0.7em;
    font-weight: bold;
    text-transform: uppercase;
    position: absolute;
    bottom: -0.5rem;
    background: $grey-2;
    border-radius: 0.25rem;
    padding: 0 0.5rem;
    box-shadow: 0px 0px 2px $grey-2;
}

.anagrams-lockout {
    position: absolute;
    display: flex;
    align-items: center;
    top: -0.75rem;
    right: 0;
    width: 13rem;
    flex-basis: 200px;
    height: 2rem;
}

.lockout-icon {
    position: relative;
    z-index: 15;
    text-align: center;
    font-size: 1.4em;
    height: 2.4rem;
    width: 2.4rem;
    background: $grey-3;
    border: 3px solid $dark-grey;
    border-radius: 0.25rem;
    box-shadow: 1px 1px 2px $grey-2;
}

.lockout-text {
    flex-grow: 1;
    font-size: 0.8em;
    

    & span {
        text-align: right;
        display: inline-block;
        background: $dark-grey;
        padding: 0.125rem 1rem;
        border-radius: 0 0.25rem 0.25rem 0;
        width: 100%;
    }
}

.master-container {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
}

.master-word-found {
    position: absolute;
    z-index: 20;
    top: 3rem;
    margin: 0 auto;
    background: linear-gradient(to bottom right, #bbd5ff, #BD54FF);
    padding: 0.25rem 1rem;
    text-transform: capitalize;
    font-size: 1em;
    color: $dark-grey;
    border-radius: 0.25rem;
    box-shadow: 2px 2px 4px $dark-grey;
}

.master-letter {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 1.7em;
    height: 1.7em;
    background: $main-blue-6;
    color: $dark-grey;
    margin: 0 0.5rem;
    border-radius: 0.25rem;
    text-transform: uppercase;
    font-size: 2em;
    font-weight: bold;
    box-shadow: 1px 1px 2px $grey-2;
    transition: transform 0.25s ease-in;

    &.shuffling {
        transform: scale(0);
    }

    &.flashing {
        animation: blinkingBackground 2s infinite;
    }

    @keyframes blinkingBackground{
		0%		{ background-color: $main-blue-6;}
		25%		{ background-color: $pastel-green;}
		50%		{ background-color: $main-blue-6;}
		75%		{ background-color: $pastel-green;}
		100%	{ background-color: $main-blue-6;}
	}
}

.anagram-group {
    display: flex;
    flex-direction: column;
}

.group-title {
    margin: 1rem auto 0.5rem auto;
    text-align: center;
    width: 100%;
    text-transform: uppercase;
    position: relative;
    

    & > span {
        position: relative;
        display: inline-block;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        background: $dark-grey;
        font-size: 0.8em;
        z-index: 2;
    }

    &:after {
        position: absolute;
        left: 10%;
        top: 50%;
        height: 3px;
        background-image: linear-gradient(to right, rgba(0,0,0,0), $grey-2, rgba(0,0,0,0));
        content: "";
        width: 80%;
        display: block;
        z-index: 1;
        border-radius: 0.25rem;
    }
}

.group-words {
    position: relative;
    overflow-x: hidden;
    overflow-y: visible;
    display: flex;
    flex-direction: row;
    height: 3rem;
    margin: 0 auto;
}

.anagram-word {
    position: relative;
    margin: 0 0.5rem;
    display: flex;
    flex-direction: row;
}

.word-user {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translateX(-50%);
    background: $main-blue;
    color: $dark-grey;
    padding: 0 0.5rem;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 0.8em;
    border-radius: 0.25rem;
    box-shadow: 1px 1px 2px $grey-2;
}

.anagram-word-letter {
    display: flex;
    align-items: center;
    justify-content: center;
    background: $main-blue-9;
    width: 1.6em;
    height: 1.6em;
    margin: 0 0.1rem;
    border-radius: 0.25rem;
    color: $dark-grey;
    font-weight: bold;
    text-transform: uppercase;
    box-shadow: 1px 1px 2px $grey-2;
}

.found-words-container {
    position: absolute;
    bottom: -5rem;
    left: 0;
    width: 100%;
    display: flex;
    transition: all 0.2s ease-in;

    &.active {
        bottom: 0.5rem;
    }
}

.found-word {
    margin: 0 auto;
    padding: 0.5rem 1rem;
    background-image: linear-gradient(to bottom right, $secondary-purple, $secondary-blue);
    color: $main-blue-9;
    text-shadow: 2px 2px 2px $dark-grey;
    border-radius: 0.25rem;
    box-shadow: 2px 2px 4px $grey-2;
    font-weight: bold;
}
</style>