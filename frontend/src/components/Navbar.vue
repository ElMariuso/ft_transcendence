<script>
import Matchmaking from './Matchmaking.vue';
import { joinQueue } from '@/services/matchmakingService';

export default {
    name: 'Navbar',
    components: {
        Matchmaking
    },
    data() {
        return {
            isSearching: false,
            playersInQueue: 0
        };
    },
    methods: {
        joinQueue() {
            this.isSearching = true;
            joinQueue()
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.log("Error: ", error);
            });
        },
        leaveQueue() {
            this.isSearching = false;
            leaveQueue()
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.log("Error: ", error);
            });
        },
        getQueueStatus() {
            getQueueStatus()
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
                <button @click="joinQueue">Play</button>
            </nav>
        </div>
        <div class="mr-30px text-lg">
            Right
        </div>
    </div>
</template>

<style scoped>
</style>