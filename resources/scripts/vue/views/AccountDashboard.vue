<template>
    <div class="content-body">
        <AccountDashboardBrowserSources />
    </div>
</template>

<script setup lang="ts">
import AccountDashboardBrowserSources from '~components/AccountDashboardBrowserSources.vue';

</script>

<style lang="scss" scoped>
@import '~styles/_variables';

.content-body {
    display: block;
    min-width: 45rem;
    width: 45vw;
    margin: 0 auto;
}
</style>