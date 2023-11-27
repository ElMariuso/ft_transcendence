import {JwtPayload as OriginalJwtPayload} from 'jwt-decode';

export interface JwtPayload extends OriginalJwtPayload {
	// sub: any;
	sub: number;
	twoFactorAuthEnabled: boolean;
	twoFactorAuthOTP: boolean;
}