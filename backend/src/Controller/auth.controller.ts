import { Controller, Get, Req, Res, UseGuards, HttpStatus } from '@nestjs/common';
import { FT_AuthGuard } from '../Guards/42-auth.guard';
import { FT_User } from '../Utils/42user'
import { AuthService } from '../Service/auth.service';

/**
 * AuthController manages authentication routes and logic.
 *
 * This controller provides endpoints to:
 * - Redirect and authenticate users via 42's OAuth, generating and providing a JWT.
 * - Verify the validity of a provided JWT.
 *
 * AuthController interacts with `AuthService` to handle the business logic related to
 * user authentication and JWT management.
 */
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	/**
     * Redirects to authenticate users via 42's OAuth and provide a JWT.
     *
     * @param {Request} req - The express request object, expected to contain user data when
     * authenticated via 42's OAuth.
     * @param {Response} res - The express response object, used to redirect the user.
     * @returns A redirect response containing the generated JWT as a query parameter.
     * @throws {HttpException} - Throws an exception if JWT generation or redirect fails, with a status code.
     */
	@UseGuards(FT_AuthGuard)
	@Get('/42/redirect')
	async login(@Req() req, @Res() res) {
		const token = await this.authService.login(req.user as FT_User);

		const url = new URL(`${req.protocol}:${req.hostname}`);
		url.port = "8080";
		url.pathname = 'login';
		url.searchParams.set('code', token);

		res.status(302).redirect(url.href);
	}

	/**
     * Verifies the provided JWT token.
     *
     * @param {Request} req - The express request object, expected to contain the JWT in the 'Authorization' header.
     * @param {Response} res - The express response object, used to return the verification result.
     * @returns A JSON object containing the verification result or an error message.
     * @throws {HttpException} - Throws an exception if JWT verification fails, with a 401 status code.
     */
	@Get('/jwt/verify')
	jwtVerify(@Req() req, @Res() res) {
		if (!req.headers.authorization)
			return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Authorization header is missing' });
		
		const tokenSplitted = req.headers.authorization.split(' ');
		if (tokenSplitted.length !== 2 || tokenSplitted[0].toLowerCase() !== 'bearer')
			return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Malformed authorization header' });	
		const token = tokenSplitted[1];

		try {
			const payload = this.authService.jwtVerify(token);
			return res.status(HttpStatus.OK).json({ payload });
		} catch (error) {
			return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid token', error: error.message });
		}
	}
}
