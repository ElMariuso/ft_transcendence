import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3001/api' });

export default api;


// http://localhost:3001/test



// curl -F grant_type=authorization_code \
// -F client_id=u-s4t2ud-6f8374e35853b50b7fa28e4cc538fecc0922e180b3cdfa673d397efffcd860a4 \
// -F client_secret=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 \
// -F code=47efdc058b98d2baacf62af189d5b25ddb21d9695d5a5f61ae5f90e55bd2c735 \
// -F redirect_uri=https://myawesomeweb.site/callback \
// -X POST https://api.intra.42.fr/oauth/token