import api from './api';

// ************ FRIENDS

export const getFriendsFromUser = async (userID) => {
    try {
        const res = await api.('/users/' + userID + '/friends');
        return res.data;
    } catch (error) {
        console.error('Error fetching friends list:', error);
        throw error;
    }
}

export const addNewFriend = async (id, friendName) => {

    const res = await api.post('/users/' + id + '/addFriend', {
        username: friendName,
    })
    
    console.log(res.data);
    return res.data
}

export const getFriendInvitations = async (id) => {
    const res = await api.get('/users/' + id + '/getInvitations');
    
    console.log(res.data);
    return res.data;
}

export const acceptFriendInvitation = async (friendID) => {
    const res = await api.put('/users/' + id + '/acceptFriendship', {
        idFriend: friendID,
    })

    console.log(res.data);
    return res.data;    
}

export const refuseFriendInvitation = async (id, friendID) => {

    const res = await api.put('/users/' + id + '/refuseFriendship', {
        idFriend: friendID,
    });

    console.log(res.data);
    return res.data;
}

export const deleteFriend = async (id, friendID) => {

    const res = await api.delete('users/' + id + 'deleteFriendship', {
        idFriend: friendID,
    });

    console.log(res.data);
    return res.data;
}

// ************************************************

// ************ BLOCKED

export const getBlockedList = async (id) => {
    const res = await api.get('/user/' + id + '/blocked');

    console.log(res.data);
    return res.data;
}

// ************************************************
