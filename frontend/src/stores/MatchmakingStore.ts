import { defineStore } from 'pinia';
import Cookies from 'js-cookie';

export const useMatchmakingStore = defineStore('matchmaking', {
    state: () => ({
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
            const isSearchingCookie = Cookies.get('isSearching');
            this.isSearching = isSearchingCookie === 'true';
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