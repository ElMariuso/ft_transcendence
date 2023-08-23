// auth.controller.ts
import { ConsoleLogger, Controller, Get, Req, Res } from '@nestjs/common';
import axios from 'axios';

@Controller('auth')
export class AuthController {
  @Get('/start-oauth')
  async startOAuth(@Req() req, @Res() res) {
    // Construct the OAuth provider's authorization URL
    const authorizationUrl = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-fdfa37f70ca1fab842f0a19e1cb52d4a3836dd35ca69c619191ada8a7f0646df&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&response_type=code';
    
    return res.json({ authorizationUrl });
  }

//   @Get('oauth-callback')
//   async oauthCallback(@Req() req, @Res() res) {
//     console.log("IN AUTH CALL BACK");

//     const authorizationCode = req.query.code;
//     const accessTokenResponse = await axios.post(
//       'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-a12c5c392f8c67b10f2e0b48d6a2c5cd8c1d2b8ef061bdb6ff9a68631754f1a5&redirect_uri=foo%3A%2F%2Fexample.com%3A8042&response_type=code',
//       {
//         grant_type: 'authorization_code',
//         code: authorizationCode,
//         client_id: '0',
//         client_secret: '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',
//         redirect_uri: 'localhost:3000',
//       }
//     );

    // Handle the response and store the access token
    // ...

  //   return res.redirect('/'); // Redirect back to frontend
  // }
}