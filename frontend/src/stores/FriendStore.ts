import { defineStore } from 'pinia'
import { ref } from 'vue'
import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie';

import { getFriendsFromUser, getBlockedList } from '@/services/friends-helpers'

export const useFriendStore = defineStore('friends', () => {
    const friendsList = ref([]);
    const friendRequests = ref([]);
    const blockedList = ref([]);

    async function setupFriends() {
        const token = Cookies.get('token');
		const id = jwt_decode(token).sub;

        try {
            const friends = await getFriendsFromUser(id);
            const blocked = await getBlockedList(id); 
            const requests = await getFriendInvitations(id);

            console.log("Friends list:")
            console.log(friends)
            console.log("Blocked list:")
            console.log(blocked)
            console.log("fr requests list:")
            console.log(requests)

            friendsList.value = friends;
            blockedList.value = blocked;
            friendRequests.value = requests;

        } catch (error) {
            console.log("Error setting up friends list:", error);
        }
    }

    return {
        friendsList, blockedList, friendRequests,
        setupFriends,
    };
})