<template>
    <div class="integrations-separator">
        <span class="toggle-line">Or</span>
    </div>
    <div class="account-integrations">
        <button class="twitch">
            <div>
                <font-awesome-icon :icon="['fa-brands', 'twitch']" />
            </div>
            <div>
                Login With Twitch
            </div>
        </button>
        <button class="youtube">
            <div>
                <font-awesome-icon :icon="['fa-brands', 'youtube']" />
            </div>
            <div>
                Login With YouTube
            </div>
        </button>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
@import '~styles/variables';

.integrations-separator {
    position: relative;
    text-transform: uppercase;
    font-size: 0.8em;
    margin: 0 auto 1rem;
    text-align: center;
    border-radius: 12px;
    padding: 0.4rem 0.8rem;

    & > span {
        position: relative;
        background: $dark-grey;
        color: $grey-7;
        border-radius: 6px;
        padding: 0.4rem 0.8rem;
        z-index: 15;
    }


    &:after {
        position: absolute;
        left: 0;
        top: 50%;
        height: 1px;
        background: $grey-3;
        content: "";
        width: 100%;
        display: block;
        z-index: 1;
    }
}

button {
    width: 100%;
    margin: 0 0 1rem 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    & div {
        padding: 0 0.2rem;

        &:first-of-type {
            font-size: 1rem;
        }
    }
}

.twitch {
    background: #6441a5;

    &:hover {
        background: #815fc0;
    }
}

.youtube {
    background: #b2071d;

    &:hover {
        background: #de0924;
    }
}

</style>