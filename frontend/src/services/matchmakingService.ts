import api from './api';

const joinQueue = () => {
    return api.post('/matchmaking/join');
};

const leaveQueue = () => {
    return api.post('/matchmaking/leave');
};

const getQueueStatus = () => {
    return api.get('/matchmaking/status');
};

export { joinQueue, leaveQueue, getQueueStatus };