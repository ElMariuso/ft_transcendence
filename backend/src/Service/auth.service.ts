import { Injectable } from '@nestjs/common';
import { FT_User } from '../Utils/42user'
import { UserService } from './user.service'
import { CreateUserDTO } from '../DTO/user/createUser.dto'
import { JwtService } from '@nestjs/jwt';
import { authenticator } from 'otplib';
import { UserDTO } from 'src/DTO/user/user.dto';
import { UpdateUserDTO } from 'src/DTO/user/updateUser.dto';
import { toDataURL } from 'qrcode';

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
        
		let email42: string = data.email;
		let login42: string = data.login;

		console.log('email ' + email42)
		console.log('data ' + login42)
		let user42Id = parseInt(data.id, 10);

        let user = await this.userService
          .findUserById42(user42Id)
          .catch(() => null);

		if (!user) {
			const userDto: CreateUserDTO = {
				username: login42,
				// email: email42,
				email: "email@email.com",
				id42: user42Id
			};

			user = await this.userService.createUser(userDto);
        }

		return this.jwtService.sign({ 
			sub: user.idUser,
		});
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

	// isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User) {
	// 	return authenticator.verify({
	// 	  token: twoFactorAuthenticationCode,
	// 	  secret: user.twoFactorAuthenticationSecret,
	// 	});
	// }
}