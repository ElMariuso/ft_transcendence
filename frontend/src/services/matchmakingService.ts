import api from './api';

const joinQueue = () => {
    return api.post('/matchmaking/join');
};

export { joinQueue };