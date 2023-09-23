import api from './api';

const joinQueue = (playerData) => {
    return api.post('/matchmaking/join', playerData);
};

const leaveQueue = (playerId) => {
    return api.post('/matchmaking/leave', playerId);
};

const getQueueStatus = () => {
    return api.get('/matchmaking/status');
};

export { joinQueue, leaveQueue, getQueueStatus };