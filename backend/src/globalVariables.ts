export const MESSAGES = 
{
	USER:
	{
		DELETE_SUCCESS: "User deleted successfully"
	},

	CHANNEL:
	{
		DELETE_SUCCESS: "Channel deleted successfully",
	},

	MESSAGE:
	{
		DELETE_SUCCESS: "Message deleted successfully",
	},

	GAME:
	{
		DELETE_SUCCESS: "Game deleted successfully",
	},

	USER_CHANNEL:
	{
		DELETE_SUCCESS: "Userchannel deleted successfully",
	},

	UPLOAD:
	{
		UPLOAD_PATH: "src/../upload",
		// UPLOAD_PATH: "src/assets/upload",
		UPLOAD_SUCCESS: "Upload Successfully",
		UPLOAD_FAILED: "Upload failed"
	}
}

export const ERROR_MESSAGES = 
{
	/*	USER ERROR	*/

	USER:
	{
		NOT_FOUND: "User not found",
		AVATAR_NOT_FOUND: "Avatar not found",

		FILE_FORMAT_ERROR: "File must be a .jpg, a .jpeg or a .png",
		USERNAME_ALREADY_EXIST: "Username already exists",

		GETUSERBYID_FAILED: "Find user by id failed",
		CREATION_FAILED: "User creation failed",
		DELETION_FAILED: "User deletion failed",
		UPDATE_FAILED: "User deletion failed",
		GETAVATAR_FAILED: "Get avatar failed",
		GETLADDERUSER_FAILED: "Get user ladder failed",
	},

	/*	FRIEND ERROR	*/

	FRIEND:
	{
		NOT_FOUND: "Friendship not found",

		IN_WAITING: "Friendship in waiting",
		ALREADY_ACCEPTED: "Friendship already accepted",
		ALREADY_REFUSED: "Friendship already refused",

		USER_TRYING_ACCEPT: "You can not accept for others...",
		USER_TRYING_REFUSE: "You can not refuse for others...",
		USER_TRYING_INVITE_ITSELF: "You can not invite yourself",

		GETFRIENDS_FAILED: "Gets friends list failed",
		GETINVITATIONS_FAILED: "Gets friend invitations failed",
		ADDFRIEND_FAILED: "Adding friend failed",
		ACCEPTFRIEND_FAILED: "Accept friendship failed",
		REFUSEFRIEND_FAILED: "Refuse friendship failed",
		DELETEFRIEND_FAILED: "Delete friendship failed",
	},
	
	/*	BLOCK ERROR		*/

	BLOCK:
    {
        NOT_FOUND: "Relation not found",
        ALREADY_BLOCK: "User already blocked",
        USER_BLOCKED: "Cannot send invitation to this user",

        GETBLOCK_FAILED: "Gets blocked users list failed",
        BLOCKUSER_FAILED: "Block user failed",
    },

	/*	CHANNEL ERROR	*/

	CHANNEL:
	{
		NOT_FOUND: "Channel not found",
		PASSWORD_MISSING: "Missing password for private channel",

		CREATECHANNEL_FAILED: "Channel creation failed",
		DELETECHANNEL_FAILED: "Delete channel failed",
		GETALLMESSAGESFROMCHANNEL_FAILED: "Get all messages from a channel failed",
	},

	/*	CHANNEL TYPE ERROR	*/

	CHANNELTYPE:
	{
		NOT_FOUND: "Channel type not found",
	},

	/*	MESSAGE ERROR	*/

	MESSAGE:
	{
		NOT_FOUND: "Message not found",

		CREATEMESSAGE_FAILED: "Message creation failed",
		DELETEMESSAGE_FAILED: "Message deletion failed",
	},

	/*    USER_CHANNEL ERROR    */
    
    USER_CHANNEL:
    {
        NOT_FOUND: "The user is not in the channel",
        WRONG_PASSWORD: "Passwords don't match",
        WRONG_MUTETIME: "Wrong mute time",
        ALREADY_IN: "User already in the channel",
        FORBIDDEN_ACTION: "Forbidden action",
        KICK_OWNER: "Can not kick the owner",
        KICK_DM: "Can not kick anyone in DM",
        CHANGE_OWNER_ROLE: "Can not change the role of the owner",
        CHANGE_DM_ROLE: "Can not change role in DM",
        CANTREJOINDM: "Can not join a Direct Message Channel",
        STILL_MUTE: "Can send any messages. You are still muted until ",

        JOINCHANNEL_FAILED: "Joining channel failed",
        FINDCHANNELFORAUSER_FAILED: "Can't get the channels for this user",
        DELETEMEMBER_FAILED: "Userchannel deletion failed",
        MODIFYROLE_FAILED: "Role update failed",
        ADDMUTETIME_FAILED: "Adding mute time failed",
    },

	ROLE:
	{
		NOT_FOUND: " Role not found",
	},

	/*	GAME ERROR	*/

	GAME:
	{
		NOT_FOUND: "Game not found",

		CREATEGAME_FAILED: "Game creation failed",
		DELETEGAME_FAILED: "Game deletion failed",
		GETGAMESTATS_FAILED: "Get game datas failed",
		GETGAME_FAILED: "Get game failed",
		GETALLGAMEUSER_FAILED: "Get all games for a user failed",
	},

	/*	ACHIEVEMENT ERROR	*/

	ACHIEVEMENT:
	{
		NOT_FOUND: "Achievement not found",

		GETALLBYUSERID_FAILED: "Get all achievements by user's id failed",
	}
}

export const TYPE =
{
	PUBLIC: "public",
	PRIVATE: "private",
	DM: "dm",
}

export const ROLE =
{
	ADMIN: "Admin",
	MEMBER: "Member",
	BANNED: "Banned"
}

export const ACCEPTED_TYPE_FILE =
{
	JPG: "image/jpeg",
	PNG: "image/png"
}

// export const DEFAULT_AVATAR = "src/../upload/avatar-default.jpg";
// export const DEFAULT_AVATAR = "src/../upload/default_avatar.png";
export const DEFAULT_AVATAR = "src/../upload/default_avatar.png";

export const DEFAULT_PATH = "/usr/src/app/";