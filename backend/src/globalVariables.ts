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
	}
}

export const ERROR_MESSAGES = 
{
	/*	USER ERROR	*/

	USER:
	{
		NOT_FOUND: "User not found",
		USERNAME_ALREADY_EXIST: "Username already exists",

		CREATION_FAILED: "User creation failed",
		DELETION_FAILED: "User deletion failed",
		UPDATE_FAILED: "User deletion failed",
	},

	/*	FRIEND ERROR	*/

	FRIEND:
	{
		NOT_FOUND: "Friendship not found",

		ALREADY_ACCEPTED: "Friendship already accepted",
		ALREADY_REFUSED: "Friendship already refused",

		USER_TRYING_ACCEPT: "You can not accept for others...",
		USER_TRYING_REFUSE: "You can not refuse for others...",

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

		ALREADY_BLOCK: "USer already blocked",

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
	},

	/*	MESSAGE ERROR	*/

	MESSAGE:
	{
		NOT_FOUND: "Message not found",

		CREATEMESSAGE_FAILED: "Message creation failed",
		DELETEMESSAGE_FAILED: "Message deletion failed",
	},

	/*	USER_CHANNEL ERROR	*/
	
	USER_CHANNEL:
	{
		NOT_FOUND: "The user is not in the channel",
		WRONG_PASSWORD: "Passwords don't match",
		WRONG_MUTETIME: "Wrong mute time",
		ALREADY_IN: "User already in the channel",

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
		DELETEGAME_FAILED: "Game deletion failed"
	}
}

export const TYPE =
{
	PUBLIC: "public",
	PRIVATE: "private"
}

export const ROLE =
{
	ADMIN: "Admin",
	MEMBER: "Member"
}