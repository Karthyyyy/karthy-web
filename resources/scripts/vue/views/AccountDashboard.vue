<template>
    <div class="content-body">
        <AccountDashboardAppIntegrations />
        <AccountDashboardBrowserSources />
    </div>
</template>

<script setup lang="ts">
import AccountDashboardBrowserSources from '~components/AccountDashboardBrowserSources.vue';
import AccountDashboardAppIntegrations from '~components/AccountDashboardAppIntegrations.vue';

</script>

<style lang="scss" scoped>
@import '~styles/_variables';

</style>