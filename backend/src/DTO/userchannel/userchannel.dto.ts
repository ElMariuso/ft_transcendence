/**
 * DTO used for representing a userchannel's information
 */
export class UserChannelDTO
{
    idUser_Channel: number;
    idUser: number;
    idChannel: number;
    idRole: number;
    muteTime: Date | null;
}