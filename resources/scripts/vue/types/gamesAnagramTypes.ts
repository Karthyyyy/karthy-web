type PlatformTypes = "twitch" | "discord";
type GameStateTypes = "ingame" | "results" | "loading";

interface GameState {
    userId: number,
    gameOwner: App.Models.User | null,
    gameReady: boolean,
    resultsActive: boolean,
    currentGameState: GameStateTypes,
    incomingMessage: IncomingMessage | null,
    loading: boolean,
    isMuted: boolean,
    isShuffling: boolean,
    lockoutActive: boolean,
    gameXp: number,
    gameUserScores: { [key: string]: UserScore },
    gameUserStats: UserStats[] | null,
    results: RoundResults | null
}

type RoundState = {
    gameSettings: GameSettings,
    roundData: RoundData,
    resultsRound: RoundResults
}

type GameSettings = {
    timerLockout: number,
    timerGame: number,
    isMasterShuffling: boolean
}

type RoundData = {
    masterWord: string | null,
    masterWordShuffledArray: string[],
    anagramsByLetterCount: AnagramsByLetterCount,
    foundWordCount: FoundWordsByLetterCount,
    foundWord: FoundWord,
    masterWordsFoundBy: string | null,
    xpToPass: number,
    xpMax: number,
    lockedOutUsers: string[],
}

type FoundWord = {
    active: boolean,
    user: string | null,
    word: string | null,
    timeoutId: ReturnType<typeof setTimeout> | null
}

type FoundWordsByLetterCount = {
    "4": number,
    "5": number,
    "6": number,
    "7": number,
    "8": number,
    "9+": number
}

type AnagramsByLetterCount = {
    "4": App.Models.GamesWordsList[],
    "5": App.Models.GamesWordsList[],
    "6": App.Models.GamesWordsList[],
    "7": App.Models.GamesWordsList[],
    "8": App.Models.GamesWordsList[],
    "9+": App.Models.GamesWordsList[]
}

type KarthyBotMessage = {
    incomingMessage: string
}

type UserScore = {
    xpGained: number,
    userId: string,
    platform: PlatformTypes
}

type IncomingMessage = {
    channel: string,
    message: string,
    platform: PlatformTypes,
    user: {}
}

type UserStats = {
    created_at: string,
    currentLevel: LevelData,
    id: number,
    nextLevel: LevelData,
    platform: PlatformTypes,
    platform_user_id: string,
    platform_user_name: string,
    total_xp: number,
    updated_at: string,
    user_id: null,
}

type RoundResults = {
    allWords: { [key: string]: AllWordsFound},
    foundWords: string[],
    userScores: { [key: string]: UserScore },
    xpGained: number
}

type AllWordsFound = {
    isWordFound: boolean,
    foundByUser: string
}

type LevelData = {
    level: number,
    xp_required: number
}

export {
    UserScore,
    RoundState,
    GameState,
    UserStats,
    RoundResults,
    FoundWordsByLetterCount
}