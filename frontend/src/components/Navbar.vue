<script setup lang="ts">
import { computed } from 'vue';
import { useAuthenticationStore } from '@/stores/AuthenticationStore';
import { useProfileStore } from '@/stores/ProfileStore';
import MatchmakingButton from './MatchmakingButton.vue';
import Login from './Login.vue';
import SettingsDropDown from './SettingsDropDown.vue';
import jwt_decode from 'jwt-decode';

const authStore = useAuthenticationStore();
const profileStore = useProfileStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);

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
		
			<router-link to="">
					<p class="text-lg mr-5" >Play</p>
			</router-link>

			<!-- <div class="flex space-x-4">
				<matchmaking-button />
				<matchmaking-button v-if="isAuthenticated" :is-ranked="true" />
			</div> -->

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

	<div>
		<Login />
	</div>
</template>