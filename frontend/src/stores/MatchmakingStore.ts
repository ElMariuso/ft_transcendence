import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';

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
        initializeStore() {
            let guestUUIDCookie = Cookies.get('guestUUID');
            if (!guestUUIDCookie) {
                guestUUIDCookie = uuidv4();
                Cookies.set('guestUUID', guestUUIDCookie, { expires: 365 });
            }
            this.guestUUID = guestUUIDCookie;

            const isSearchingCookie = Cookies.get('isSearching');
            this.isSearching = isSearchingCookie === 'true';

            const isRankedCookie = Cookies.get('isRanked');
            this.isRanked = isRankedCookie === 'true';

            const matchFoundCookie = Cookies.get('matchFound');
            this.matchFound = matchFoundCookie === 'true';

            const roomIDCookie = Cookies.get('roomID');
            if (roomIDCookie) {
                this.roomID = roomIDCookie;
            }
        },
        setGuestUUID(value) {
            this.guestUUID = value;
            Cookies.set('guestUUID', this.guestUUID, { expires: 365 });
        },
        setIsSearching(value) {
            this.isSearching = value;

            if (value) {
                Cookies.set('isSearching', 'true', { expires: 1/144 });
            } else {
                Cookies.remove('isSearching');
            }
        },
        setIsRanked(value) {
            this.isRanked = value;

            if (value) {
                Cookies.set('isRanked', 'true', { expires: 1/144 });
            } else {
                Cookies.remove('isRanked');
            }
        },
        setMatchFound(value) {
            this.matchFound = value;

            if (value) {
                Cookies.set('matchFound', 'true', { expires: 365 });
            } else {
                Cookies.remove('matchFound');
            }
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
                Cookies.set('roomID', id, { expires: 365} );
            } else {
                Cookies.remove('roomID');
            }
        }
    },
});