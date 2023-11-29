import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { rejoinMatchmaking, rejoinRoom } from '@/services/matchmaking-helpers';
import { useProfileStore } from './ProfileStore';
import { MatchmakingStoreState, UpdateInfoData } from '@/models/matchmaking.model';
import { useAuthenticationStore } from './AuthenticationStore';
import Cookies from 'js-cookie';

export const useMatchmakingStore = defineStore('matchmaking', {
    state: (): MatchmakingStoreState => ({
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
        initializeStore(): void {
            const profileStore = useProfileStore();
            const authenticationStore = useAuthenticationStore();
            let guestUUIDCookie = Cookies.get('guestUUID');

            if (!guestUUIDCookie) {
                guestUUIDCookie = uuidv4();
                Cookies.set('guestUUID', guestUUIDCookie, { expires: 365 });
            }
            this.guestUUID = guestUUIDCookie;

            const playerId = parseInt(profileStore.userID, 10) <= 0 ? this.guestUUID : profileStore.userID;
            rejoinMatchmaking(playerId);

            const roomIDCookie = Cookies.get('roomID');
            if (roomIDCookie) {
                this.roomID = roomIDCookie;
                const username = authenticationStore.isAuthenticated ? profileStore.username : 'Guest' + this.guestUUID.substring(0, 8);
                const data = {
                    playerId: playerId,
                    roomId: this.roomID, 
                    username: username
                };
                rejoinRoom(data);
            }
        },
        updateInformations(data: UpdateInfoData): void {
            this.isSearching = data.isSearching;
            this.isRanked = data.isRanked
            this.matchFound = data.matchFound;
            this.opponentUUID = data.opponentUUID;
            this.opponentUsername = data.opponentUsername;
        },
        setGuestUUID(value: string): void {
            this.guestUUID = value;
            Cookies.set('guestUUID', this.guestUUID, { expires: 365 });
        },
        setIsSearching(value: boolean): void {
            this.isSearching = value;
        },
        setIsRanked(value: boolean): void {
            this.isRanked = value;
        },
        setMatchFound(value: boolean): void {
            this.matchFound = value;
        },
        setNumberOfPlayers(count: number): void {
            this.numberOfPlayers = count;
        },
        setOpponentUUID(uuid: string | null): void {
            this.opponentUUID = uuid;
        },
        setOpponentUsername(username: string | null): void {
            this.opponentUsername = username;  
        },
        setRoomID(id: string | null): void {
            this.roomID = id;

            if (id) {
                Cookies.set('roomID', id, { expires: 1} );
            } else {
                Cookies.remove('roomID');
            }
        }
    },
});