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

	jwtVerify(token: string): Promise<boolean> {
		try {
			const res =  this.jwtService.verify(token);
			return res
		} 
		catch {
			return null;
		}
	}
    async login(data: FT_User): Promise<string> {
        
		let user42Id = parseInt(data.id, 10);

        let user = await this.userService
          .findUserById42(user42Id)
          .catch(() => null);

		if (!user) {
			const userDto: CreateUserDTO = {
				username: data.username,
				email: data.email,
				id42: user42Id
			};
			user = await this.userService.createUser(userDto);
        }

		return this.jwtService.sign({ 
			sub: user.idUser,
		});
    }
}