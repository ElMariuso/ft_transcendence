<script>
import Matchmaking from './Matchmaking.vue';
import { joinQueue, leaveQueue, getQueueStatus } from '@/services/matchmakingService';

export default {
    name: 'Navbar',
    components: {
        Matchmaking
    },
    data() {
        return {
            isSearching: false,
            playersInQueue: 0,
            currentUser: null,
            queueInterval: null,
        };
    },
    mounted() {
        this.getQueueStatus();
        this.queueInterval = setInterval(this.getQueueStatus, 1000);
    },
    beforeDestroy() {
        clearInterval(this.queueInterval);
    },
    computed: {
        isAuthenticated() {
            return this.currentUser !== null && !this.currentUser.isGuest;
        }
    },
    methods: {
        joinQueue() {
            this.isSearching = true;
            const playerData = {
                isGuest: true
            };
            joinQueue(playerData)
            .then(response => {
                this.currentUser = {
                    id: response.data.playerId,
                    isGuest: true
                }
                console.log(response.data);
            })
            .catch(error => {
                console.log("Error: ", error);
            });
        },
        leaveQueue() {
            if (!this.currentUser) {
                console.error("Unable to leave queue. User null.");
                return ;
            }
            if (!this.currentUser.id) {
                console.error("Unable to leave queue. User ID not found.");
                return ;
            }
            this.isSearching = false;
            leaveQueue({ playerId: this.currentUser.id })
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
                this.playersInQueue = response.data.playersInQueue;
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
                <button @click="joinQueue">Standard</button>
                <button v-if="isAuthenticated">Ranked</button>
            </nav>
        </div>
        <div class="mr-30px text-lg">
            Right
        </div>
    </div>
    <Matchmaking  :isOpen="isSearching" :numberOfPlayers="playersInQueue" @cancel="leaveQueue" />
</template>

<style scoped>
</style>