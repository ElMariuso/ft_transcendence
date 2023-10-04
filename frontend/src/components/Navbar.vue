<script>
export default {
    name: 'Navbar'
}
</script>

<template>
    <div class="w-full relative mx-auto mt-0 mb-0 flex justify-between border-b border-gray-400 p-15px">
        <div class="ml-30px flex items-baseline">
            <router-link to="/"><h1 class="text-3xl m-0 leading-none mr-5">ft_transcendence</h1></router-link>
            <nav class="text-lg">
                <section>Play</section>
            </nav>
        </div>
        <div class="mr-30px text-lg">
            Right
        </div>
    </div>
</template>

<style scoped>
</style>