import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { FT_User } from '../Utils/42user';
import { UserService } from './user.service';
import { CreateUserDTO } from '../DTO/user/createUser.dto';
import { JwtService } from '@nestjs/jwt';

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
    async login(data: FT_User): Promise<string> {
        const userIdFrom42 = parseInt(data.id, 10);
        let user = await this.findOrCreateUser(userIdFrom42, data);
		
		return this.signJwtForUser(user.idUser);
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
	private async findOrCreateUser(userIdFrom42: number, data: FT_User) {
		let user;

		try {
			user = await this.userService.findUserById42(userIdFrom42)
		} catch (error){
			throw new HttpException('Failed to find user', HttpStatus.INTERNAL_SERVER_ERROR);
		}
		if (!user) {
			const userDto: CreateUserDTO = {
			  username: data.username,
			  email: data.email,
			  id42: userIdFrom42,
			};
			
			try {
			  user = await this.userService.createUser(userDto);
			} catch (error) {
			  throw new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);
			}
		}
		return user;
	}

	/**
     * Signs a JWT token for a specified user.
     *
     * @param userId - The ID of the user for whom the JWT is signed.
     * @returns A JWT token.
     * @throws {HttpException} - Throws an exception if token signing fails, with a 500 status code.
     */
	private signJwtForUser(userId: string): string {
		try {
		  return this.jwtService.sign({ sub: userId });
		} catch (error) {
		  throw new HttpException('Failed to sign JWT', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}