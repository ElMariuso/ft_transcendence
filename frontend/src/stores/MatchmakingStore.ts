import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';

export const useMatchmakingStore = defineStore('matchmaking', {
    state: () => ({
        guestUUID: '',
        isSearching: false,
        numberOfPlayers: 0,
    }),
    getters: {
        getIsSearching(state) {
            return state.isSearching;
        },
    },
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
        setNumberOfPlayers(count) {
            this.numberOfPlayers = count;
        }
    },
});