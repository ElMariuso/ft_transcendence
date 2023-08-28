import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3001/api' });

export default api;


// http://localhost:3001/test



// curl -F grant_type=authorization_code \
// -F client_id=u-s4t2ud-6f8374e35853b50b7fa28e4cc538fecc0922e180b3cdfa673d397efffcd860a4 \
// -F client_secret=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 \
// -F code=676b2d8b68d17823aaa69e9ee3dd82e8dbf0782d689f3e99e22424aefb3464c6 \
// -F redirect_uri='https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-6f8374e35853b50b7fa28e4cc538fecc0922e180b3cdfa673d397efffcd860a4&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Ftest&response_type=code' \
// -X POST https://api.intra.42.fr/oauth/token