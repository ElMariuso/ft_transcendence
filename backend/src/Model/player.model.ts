/**
 * Type representing an authenticated player awaiting matchmaking.
 * 
 * - id: The unique identifier for the authenticated player.
 * - isGuest: A boolean value that's always 'false' for authenticated players, 
 *            indicating this player isn't a guest.
 * - points: The current points of the authenticated player, which might be used 
 *           for sorting or matchmaking purposes.
 */
export type AuthenticatedPlayer = {
    id: number;
    isGuest: false;
    points: number;
};

/**
 * Type representing a guest player awaiting matchmaking.
 * 
 * - id: The unique identifier generated for the guest player. This could be, for instance, 
 *       a UUID or some other randomly generated string.
 * - isGuest: A boolean value that's always 'true' for guests, 
 *            indicating this player is a guest and not an authenticated player.
 */
export type GuestPlayer = {
    id: string;
    isGuest: true;
};

/**
 * Type representing a player in the matchmaking queue.
 * This player could either be an authenticated player or a guest player.
 * 
 * The nature of this union type ensures that the properties and 'isGuest' values 
 * are consistent with the type of player (authenticated or guest).
 */
export type PlayerInQueue = AuthenticatedPlayer | GuestPlayer;
