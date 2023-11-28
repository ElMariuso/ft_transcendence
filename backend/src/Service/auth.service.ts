import { Injectable, HttpException, HttpStatus, NotFoundException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from '../DTO/user/createUser.dto';
import { JwtService } from '@nestjs/jwt';
import { authenticator } from 'otplib';
import { UserDTO } from 'src/DTO/user/user.dto';
import { UpdateUserDTO } from 'src/DTO/user/updateUser.dto';
import { toDataURL } from 'qrcode';

/**
 * AuthService handles the authentication functionality within the application, facilitating
 * user login and JWT (JSON Web Token) generation and validation.
 *
 * This service provides methods to:
 * - Verify the validity of a JWT.
 * - Log in a user via 42's OAuth and produce a JWT.
 * - Find or create a user in the system, based on data retrieved from 42’s OAuth.
 * - Sign a JWT for a user.
 *
 * AuthService interacts with `JwtService` for JWT-related operations and `UserService` 
 * to manage user-related database transactions.
*/
@Injectable()
export class AuthService {

	constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
	) {}

    /**
     * Verifies the provided JWT token.
     *
     * @param token - The JWT token to verify.
     * @returns A boolean indicating whether the token is valid or not.
     * @throws {HttpException} - Throws an exception if the token is invalid, with a 400 status code.
	*/
    jwtVerify(token: string): boolean {
        try {
            return Boolean(this.jwtService.verify(token));
        } catch (error) {
            // Throw an HttpException if token verification fails
            throw new HttpException('Invalid Token', HttpStatus.BAD_REQUEST);
        }
    }

  	/**
     * Authenticates a user and returns a JWT token.
     * 
     * This involves finding or creating a user based on the provided data 
     * and signing a JWT for them.
     *
     * @param data - The user data obtained from 42's OAuth.
     * @returns A promise resolving with a JWT token.
    */
	async login(data): Promise<string> {
        const userIdFrom42 = parseInt(data.id, 10);
        let res = await this.findOrCreateUser(userIdFrom42, data);
		let user = res.user;
		let first_auth = res.first_auth;
		
		return this.signJwtForUser(user.idUser, user.isTwoFactorAuthEnabled, first_auth);
	}

	login2fa(userID: string, twoFactorAuthEnabled: boolean) {
		try
		{
			let id = parseInt(userID, 10);

			let user = this.userService.findUserById(id);
			if (!user)
				throw new NotFoundException("klk");
			return this.signJwtForUser(userID, twoFactorAuthEnabled, false, true);
		}
		catch (error)
		{
			if (error instanceof NotFoundException)
				throw new NotFoundException(error.message);
			throw new InternalServerErrorException("kkk");
		}
		
	}

	/**
     * Finds an existing user or creates a new one, based on the provided 42 ID and data.
     * 
     * If the user does not exist in the system, a new user is created with the provided data.
     *
     * @param userIdFrom42 - The user's ID from 42's system.
     * @param data - The user data obtained from 42’s OAuth.
     * @returns A promise resolving with the user object.
     * @throws {HttpException} - Throws an exception if user retrieval/creation fails, with a 500 status code.
    */
	private async findOrCreateUser(userIdFrom42: number, data) {
		let user;
		let first_auth = false;

		try {
			user = await this.userService.findUserById42(userIdFrom42)
		} catch (error){
			throw new HttpException('Failed to find user', HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
		if (!user) {
			first_auth = true;
			const userDto: CreateUserDTO = {
				username: data._json.login,
				email: data._json.email,
				id42: data._json.id
			};
			
			try {
				user = await this.userService.createUser(userDto);
			} catch (error) {
				throw new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);
			}
		}
		return {user, first_auth };
	}



	/**
     * Signs a JWT token for a specified user.
     *
     * @param userId - The ID of the user for whom the JWT is signed.
     * @returns A JWT token.
     * @throws {HttpException} - Throws an exception if token signing fails, with a 500 status code.
    */
	private signJwtForUser(userId: string, user2fa: boolean, first_auth=false, otp=false): string {
		try {
			return this.jwtService.sign({ 
				sub: userId,
				twoFactorAuthEnabled: user2fa,
				twoFactorAuthOTP: otp,
				firstLogin: first_auth,
			});
		} catch (error) {
			throw new HttpException('Failed to sign JWT', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async generateTwoFactorAuthenticationSecret(user: UserDTO) {
		const data : any = {};
		
		const secret: string = authenticator.generateSecret();
		const otpauthUrl = authenticator.keyuri(user.email, 'ft_transcendence', secret);
		data.twoFactorAuthSecret = secret;
		
		await this.userService.updateUser(user.idUser, data)
		return {
		  secret,
		  otpauthUrl
		}
	}

	async generateQrCodeDataURL(otpAuthUrl: string) {
		return toDataURL(otpAuthUrl);
	}

	async isTwoFactorAuthenticationCodeValid(twoFactorAuthCode: string, userID: number) {
		const user = await this.userService.findUserById(userID);

		if (!user)
			throw new NotFoundException("FDP");

		const attempts = this.failedAttempts[user.idUser] || 0;
		if (attempts >= this.maxAttempts)
			throw new ForbiddenException("AL BATOR");

		const verification =  authenticator.verify({
		  token: twoFactorAuthCode,
		  secret: user.twoFactorAuthSecret,
		});

		if (!verification)
		{
			this.failedAttempts[user.idUser] = attempts + 1;

			if (this.failedAttempts[user.idUser] === this.maxAttempts)
				setTimeout(() =>
					{	this.resetAttempts(user.idUser) },
					this.timeout
				);
		}
		else
		{
			this.resetAttempts(user.idUser);
		}

		return verification;
	}

	private failedAttempts: { [userId: number]: number } = {}
	private maxAttempts = 3;
	private timeout = 60000; // 1 minutes

	private resetAttempts(id: number)
	{
		this.failedAttempts[id] = 0;
	}
}