<template>
    <div class="w-full relative mx-auto mt-0 mb-0 flex justify-between border-b border-gray-400 p-15px">
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

		<div v-if="authStore.authState"> 
			<router-link  to=""></router-link>
			<div class="mr-30px text-lg">
				Profile + settings (2af, avatar, name)
			</div>
		</div>
		
    </div>
</template>

<script setup lang="ts">
import { useAuthenticationStore } from '../stores/AuthenticationStore'

const authStore = useAuthenticationStore()
const name = 'Navbar'
</script>

<style scoped>
</style>