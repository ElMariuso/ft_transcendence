// Importing necessary modules and decorators
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { FT_User } from '../Utils/42user';
import { UserService } from './user.service';
import { CreateUserDTO } from '../DTO/user/createUser.dto';
import { JwtService } from '@nestjs/jwt';

// Injectable AuthService class
@Injectable()
export class AuthService {
	constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {}

    /**
   	 * Verifies a JWT token.
   	 * @param token - The JWT token to verify.
   	 * @returns A boolean indicating the validity of the token.
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
   	 * @param data - The user data from 42's OAuth.
   	 * @returns A JWT token.
   	 */
    async login(data: FT_User): Promise<string> {
        const userIdFrom42 = parseInt(data.id, 10);
        let user = await this.findOrCreateUser(userIdFrom42, data);
		
		return this.signJwtForUser(user.idUser);
	}

	/**
   	 * Finds an existing user or creates a new one.
   	 * @param userIdFrom42 - The user's 42 ID.
   	 * @param data - The user data from 42's OAuth.
   	 * @returns The user.
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
   	 * Signs a JWT token for a user.
   	 * @param userId - The user's ID.
   	 * @returns A JWT token.
   	 */
	private signJwtForUser(userId: string): string {
		try {
		  return this.jwtService.sign({ sub: userId });
		} catch (error) {
		  throw new HttpException('Failed to sign JWT', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}