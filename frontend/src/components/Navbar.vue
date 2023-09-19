<script>
import axios from 'axios'

export default {
    name: 'Navbar',
    methods: {
        sendMessage() {
            axios.get('http://localhost:3000/test/message')
                .then(response => {
                    console.log(response.data);
                })
                .catch(error => {
                    console.log("Error: ", error);
                });
        }
    }
}
</script>

<template>
    <div class="w-full relative mx-auto mt-0 mb-0 flex justify-between border-b border-gray-400 p-15px">
        <div class="ml-30px flex items-baseline">
            <router-link to="/"><h1 class="text-3xl m-0 leading-none mr-5">ft_transcendence</h1></router-link>
            <nav class="text-lg">
                <button @click="sendMessage">Play</button>
            </nav>
        </div>
        <div class="mr-30px text-lg">
            Right
        </div>
    </div>
</template>

<style scoped>
</style>