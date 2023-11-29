<script setup lang="ts">
import { computed } from 'vue';
import { joinQueue, leaveQueue, joinRankedQueue, leaveRankedQueue } from '@/services/matchmaking-helpers'
import { useProfileStore } from '@/stores/ProfileStore';
import { useMatchmakingStore } from '@/stores/MatchmakingStore';
import { useAuthenticationStore } from '@/stores/AuthenticationStore';
import { AuthenticatedPlayer, PlayerInQueue } from "@/models/player.model";

const props = defineProps({
    isRanked: {
        type: Boolean,
        default: false,
    },
});

const matchmakingStore = useMatchmakingStore();
const profileStore = useProfileStore();
const authenticationStore = useAuthenticationStore();

const isSearching = computed(() => matchmakingStore.isSearching);
const guestUUID = computed(() => matchmakingStore.guestUUID);
const buttonText = computed(() => {
    return isSearching.value ? 'Cancel' : (props.isRanked ? 'Ranked' : 'Standard');
});
const isAuthenticated = computed(() => authenticationStore.isAuthenticated);

const handleClick = async () => {
    matchmakingStore.setIsRanked(props.isRanked);

    if (isSearching.value) {
        console.log('Cancelling the match search...');
        try {
            if (props.isRanked) {
                await leaveRankedQueue(profileStore.userID);
            } else {
                await leaveQueue(guestUUID.value);
            }
        } catch (error) {
            console.error(error);
        }
    } else {
        console.log(`Joining a ${props.isRanked ? 'ranked' : 'standard'} match...`);
        try {
            if (props.isRanked) {
				let idUser = parseInt(profileStore.userID, 10);

                const playerData: AuthenticatedPlayer = { 
                    id: idUser,
                    isGuest: false,
                    points: 0,
                    username: profileStore.username
                };
                await joinRankedQueue(playerData);
            } else {
                let playerData: PlayerInQueue;
                if (isAuthenticated.value) {
					let idUser = parseInt(profileStore.userID, 10);

                    playerData = {
                        id: idUser,
                        isGuest: false,
                        username: profileStore.username,
						points: 0,
                    };
                } else {
                    playerData = {
                        id: guestUUID.value,
                        isGuest: true,
                        username: 'Guest' + guestUUID.value.substring(0, 8)
                    };
                }
                await joinQueue(playerData);
            }
        } catch (error) {
            console.error(error);
        }
    }
};
</script>

<template>
    <button @click="handleClick">{{ buttonText }}</button>
</template>