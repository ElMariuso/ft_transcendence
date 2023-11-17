import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';
import { rejoinMatchmaking, rejoinRoom } from '@/services/matchmaking-helpers';

export const useMatchmakingStore = defineStore('matchmaking', {
    state: () => ({
        guestUUID: '',
        isSearching: false,
        isRanked: false,
        matchFound: false,
        numberOfPlayers: 0,
        opponentUUID: null,
        opponentUsername: null,
        roomID: null,
    }),
    actions: {
        initializeStore(profileStore) {
            let guestUUIDCookie = Cookies.get('guestUUID');
            if (!guestUUIDCookie) {
                guestUUIDCookie = uuidv4();
                Cookies.set('guestUUID', guestUUIDCookie, { expires: 365 });
            }
            this.guestUUID = guestUUIDCookie;

            const playerId = profileStore.userID <= 0 ? this.guestUUID : profileStore.userID;
            rejoinMatchmaking(playerId);

            const roomIDCookie = Cookies.get('roomID');
            if (roomIDCookie) {
                this.roomID = roomIDCookie;
                const username = profileStore.isAuthenticated ? profileStore.username : 'Guest' + this.guestUUID.substring(0, 8);
                const data = {
                    playerId: playerId,
                    roomId: this.roomID, 
                    username: username
                };
                rejoinRoom(data);
            }
        },
        updateInformations(data) {
            this.isSearching = data.isSearching;
            this.isRanked = data.isRanked
            this.matchFound = data.matchFound;
            this.opponentUUID = data.opponentUUID;
            this.opponentUsername = data.opponentUsername;
        },
        setGuestUUID(value) {
            this.guestUUID = value;
            Cookies.set('guestUUID', this.guestUUID, { expires: 365 });
        },
        setIsSearching(value) {
            this.isSearching = value;
        },
        setIsRanked(value) {
            this.isRanked = value;
        },
        setMatchFound(value) {
            this.matchFound = value;
        },
        setNumberOfPlayers(count) {
            this.numberOfPlayers = count;
        },
        setOpponentUUID(uuid) {
            this.opponentUUID = uuid;
        },
        setOpponentUsername(username) {
            this.opponentUsername = username;  
        },
        setRoomID(id) {
            this.roomID = id;

            if (id) {
                Cookies.set('roomID', id, { expires: 1} );
            } else {
                Cookies.remove('roomID');
            }
        }
    },
});