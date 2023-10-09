<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthenticationStore } from '@/stores/AuthenticationStore';
import { useProfileStore } from '@/stores/ProfileStore';
import MatchmakingButton from './MatchmakingButton.vue';
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
		<router-link :to="{name: 'community'}">
			<nav class="text-lg mr-5">
				<section>Community</section>
			</nav>
		</router-link>
		<router-link to="/profile">
			<nav class="text-lg mr-5">
				<section>Profile</section>
			</nav>
		</router-link>
	</div>
		
	<div v-if="isAuthenticated" class="flex items-center">
		<div>
			<p>{{ profileStore.username }}</p>
		</div>
		<div class="mr-4 text-lg">
			<img :src="profileStore.avatar" alt="avatar" class="h-14 w-auto">
		</div>
		<SettingsDropDown />
    </div>
</template>

<style scoped>
</style>