import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MatchmakingStateService {
    username: string;
    isSearching: boolean;
    isRanked: boolean;
    matchFound: boolean;
    opponentUUID: string;
    opponentUsername: string;

    setUsername(value: string) {
        this.username = value;
    }

    setIsSearching(value: boolean) {
        this.isSearching = value;
    }

    setIsRanked(value: boolean) {
        this.isRanked = value;
    }

    setMatchFound(value: boolean) {
        this.matchFound = value;
    }

    setOpponentUUID(value: string) {
        this.opponentUUID = value;
    }

    setOpponentUsername(value: string) {
        this.opponentUsername = value;
    }
}