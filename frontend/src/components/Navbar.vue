<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthenticationStore } from '@/stores/AuthenticationStore';
import { useProfileStore } from '@/stores/ProfileStore';
import jwt_decode from 'jwt-decode';
import MatchmakingButton from './MatchmakingButton.vue';
import LeaveMatch from './LeaveMatch.vue';
import SettingsDropDown from './SettingsDropDown.vue';
import { useMatchmakingStore } from '@/stores/MatchmakingStore';
import JoinMatch from './JoinMatch.vue';

const authStore = useAuthenticationStore();
const profileStore = useProfileStore();
const matchmakingStore = useMatchmakingStore();
const route = useRoute();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const showButtons = computed(() => route.path.startsWith('/game/'));
const isInGame = computed(() => (matchmakingStore.roomID !== null));

// Sets username, avatar and 2fa to correct DB values
const token = localStorage.getItem('token');
if (token) {
	const id = jwt_decode(token).sub;
	profileStore.setupProfile();
	profileStore.setUserID(id);
}
</script>

<template>
   <div class="w-full h-20 flex justify-between border-b border-gray-400 p-4">
        <div class="ml-30px flex items-baseline">
		
			<router-link to="/">
				<h1 class="text-3xl m-0 leading-none mr-5">ft_transcendence</h1>
			</router-link>

			<router-link to="/community">
				<nav class="text-lg mr-5">
					<section>Community</section>
				</nav>
			</router-link>

			<router-link to="/profile">
				<nav class="text-lg mr-5">
					<section>Profile</section>
				</nav>
			</router-link>

			<div class="flex space-x-4">
				<matchmaking-button v-if="!showButtons && !isInGame" />
				<matchmaking-button v-if="!showButtons && isAuthenticated && !isInGame" :is-ranked="true" />
				<LeaveMatch v-if="showButtons && isInGame" />
				<JoinMatch v-if="!showButtons && isInGame" />
			</div>
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

	</div>
</template>