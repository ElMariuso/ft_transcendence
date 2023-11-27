import {JwtPayload as OriginalJwtPayload} from 'jwt-decode';

export interface JwtPayload extends OriginalJwtPayload {
	twoFactorAuthEnabled: boolean;
	twoFactorAuthOTP: boolean
}