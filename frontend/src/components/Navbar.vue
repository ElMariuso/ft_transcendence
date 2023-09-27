<script>
export default {
    name: 'Navbar',
}


</script>

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
				<router-link to=""></router-link>
				<div class="mr-30px text-lg">
					Right
			</div>
    </div>
</template>

<style scoped>
</style>