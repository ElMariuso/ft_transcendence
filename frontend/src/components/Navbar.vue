<template>
    <div class="w-full h-20 flex justify-between border-b border-gray-400 p-4">
        <div class="ml-30px flex items-baseline">
            <router-link to="/">
				<h1 class="text-3xl m-0 leading-none mr-5">ft_transcendence</h1>
			</router-link>
            
			<router-link to="">
					<p class="text-lg mr-5" >Play</p>
			</router-link>

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
		
		<div v-if="authStore.authState" class="flex z-10 items-center">
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

<script setup lang="ts">
import { useAuthenticationStore } from '../stores/AuthenticationStore'
import { useProfileStore } from '../stores/ProfileStore'
import SettingsDropDown from './SettingsDropDown.vue' 

const authStore = useAuthenticationStore()
const profileStore = useProfileStore()
const name = 'Navbar'

// Sets username, avatar and 2fa to correct DB values
profileStore.setupProfile()
</script>

<style scoped>
</style>