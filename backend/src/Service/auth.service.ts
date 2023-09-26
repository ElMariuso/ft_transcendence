import { Injectable } from '@nestjs/common';
import { FT_User } from '../Utils/42user'
import { UserService } from './user.service'
import { CreateUserDTO } from '../DTO/user/createUser.dto'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
      ) {}
	
	generateJWT(userId: number, username : string) {
		return {
			access_token: this.jwtService.signAsync({ sub: userId, username }),
		}
	}

    async login(data: FT_User): Promise<string> {
        
		let userId = parseInt(data.id, 10);

        let connection = await this.userService
          .findUserById42(userId)
          .catch(() => null);

		if (!connection) {
			const userDto: CreateUserDTO = {
				username: data.username,
				email: data.email,
				id42: userId
			};
			const user = await this.userService.createUser(userDto);
        }

		return  this.jwtService.signAsync({ sub: connection.userId, username: connection.username });
    }
}