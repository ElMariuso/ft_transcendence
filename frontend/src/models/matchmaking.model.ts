export type MatchmakingStoreState = {
    guestUUID: string;
    isSearching: boolean;
    isRanked: boolean;
    matchFound: boolean;
    numberOfPlayers: number;
    opponentUUID: string | null;
    opponentUsername: string | null;
    roomID: string | null;
};

export interface UpdateInfoData {
    isSearching: boolean;
    isRanked: boolean;
    matchFound: boolean;
    opponentUUID: string | null;
    opponentUsername: string | null;
}