import {JwtPayload as OriginalJwtPayload} from 'jwt-decode';

export interface JwtPayload extends OriginalJwtPayload {
	// sub: any;
	twoFactorAuthEnabled: boolean;
	twoFactorAuthOTP: boolean;
	firstLogin: boolean;
}