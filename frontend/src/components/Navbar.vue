<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthenticationStore } from '@/stores/AuthenticationStore';
import { useProfileStore } from '@/stores/ProfileStore';
import MatchmakingButton from './MatchmakingButton.vue';
import Login from './Login.vue';
import SettingsDropDown from './SettingsDropDown.vue';

const authStore = useAuthenticationStore();
const profileStore = useProfileStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);

// Sets username, avatar and 2fa to correct DB values
profileStore.setupProfile();
console.log(authStore.isAuthenticated);
</script>

<template>
    <div class="w-full h-20 flex justify-between border-b border-gray-400 p-4">
        <router-link to="/">
			<h1 class="text-3xl m-0 leading-none mr-5">ft_transcendence</h1>
		</router-link>
		<div class="flex space-x-4">
			<matchmaking-button />
            <matchmaking-button v-if="isAuthenticated" :is-ranked="true" />
		</div>
		<div>
			<Login />
		</div>
	</div>
</template>

<style scoped>
</style>