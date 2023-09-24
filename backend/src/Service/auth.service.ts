import { Injectable } from '@nestjs/common';
import { FT_User } from '../Utils/42user'
import { UserService } from './user.service'

@Injectable()
export class AuthService {

    constructor(
        // private readonly jwtService: JwtService,
        private readonly userService: UserService,
        // private readonly connectionService: ConnectionService,
      ) {}

    async login(data: FT_User): Promise<string> {
        
        let connection = await this.userService
          .findUserById(data.id)
          .catch(() => null);
    
        if (!connection) {
            console.log ('Not found')
        //   const user = await this.userService.createUser();
        //   connection = await this.connectionService.createConnection(user.id);
        //   await this.connectionService.updateConnection(connection.id, {
        //     '42': data.id,
        //   });
    
        //   if (data.photos) {
        //     const photo = await download(data.photos[0].value);
        //     await this.userService.setAvatar(user.id, {
        //       originalname: '42',
        //       buffer: photo,
        //     } as Express.Multer.File);
        //   }
        }
        else {
            console.log('Found')
        }
        return connection;
        // this.generateJWT(connection.id, !connection.otp);
    }
}