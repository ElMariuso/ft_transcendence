import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import axios from 'axios';

@Controller('auth')
export class AuthController {
	
	@Get('/start-oauth')
	async startOAuth(@Req() req, @Res() res) {
		console.log("Accessing 42 login page")
		const authorizationUrl = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-6f8374e35853b50b7fa28e4cc538fecc0922e180b3cdfa673d397efffcd860a4&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Ftest&response_type=code';
		
		return res.json({ authorizationUrl });
	}

	
  	@Post('/oauth-token')
  	async exchangeCodeForToken(@Req() req, @Res() res) {
		const authorizationCode : string = req.body.code;
	
		try {
			const tokenResponse = await axios.post(
				'https://api.intra.42.fr/oauth/token',
				{
					grant_type: 'authorization_code',
					client_id: 'u-s4t2ud-6f8374e35853b50b7fa28e4cc538fecc0922e180b3cdfa673d397efffcd860a4',
					client_secret: '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',
					code: authorizationCode,
					redirect_uri: 'http://localhost:8080/test',
				}
			);
			
			// Handle token here
			if (tokenResponse)
				console.log(tokenResponse);

			return res.json(tokenResponse.data);
		} 
		catch (error) {
			console.error('Error exchanging code for token:', error);
			return res.status(500).json({ error: 'Failed to exchange code for token' });
		}
	}
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