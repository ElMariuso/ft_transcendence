-- CreateTable
CREATE TABLE "User" (
    "idUser" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "isTwoFactorAuthEnabled" BOOLEAN NOT NULL,
    "id42" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("idUser")
);

-- CreateTable
CREATE TABLE "Game" (
    "idGame" SERIAL NOT NULL,
    "scoreLeft" INTEGER NOT NULL,
    "scoreRight" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("idGame")
);

-- CreateTable
CREATE TABLE "User_Game" (
    "idUser_Game" SERIAL NOT NULL,
    "idUser" INTEGER NOT NULL,
    "idGame" INTEGER NOT NULL,
    "isWinner" BOOLEAN NOT NULL,

    CONSTRAINT "User_Game_pkey" PRIMARY KEY ("idUser_Game")
);

-- CreateTable
CREATE TABLE "Channel" (
    "idChannel" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "idOwner" INTEGER NOT NULL,
    "idType" INTEGER NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("idChannel")
);

-- CreateTable
CREATE TABLE "ChannelType" (
    "idChannelType" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ChannelType_pkey" PRIMARY KEY ("idChannelType")
);

-- CreateTable
CREATE TABLE "Message" (
    "idMessage" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "timestamps" TIMESTAMP(3) NOT NULL,
    "idUser" INTEGER NOT NULL,
    "idChannel" INTEGER NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("idMessage")
);

-- CreateTable
CREATE TABLE "User_Channel" (
    "idUser_Channel" SERIAL NOT NULL,
    "idUser" INTEGER NOT NULL,
    "idChannel" INTEGER NOT NULL,
    "idRole" INTEGER NOT NULL,
    "idStatus" INTEGER NOT NULL,
    "muteTime" TIMESTAMP(3),

    CONSTRAINT "User_Channel_pkey" PRIMARY KEY ("idUser_Channel")
);

-- CreateTable
CREATE TABLE "Role" (
    "idRole" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("idRole")
);

-- CreateTable
CREATE TABLE "Status" (
    "idStatus" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("idStatus")
);

-- CreateTable
CREATE TABLE "User_Achievement" (
    "idUser_Achievement" SERIAL NOT NULL,
    "idUser" INTEGER NOT NULL,
    "idAchievement" INTEGER NOT NULL,

    CONSTRAINT "User_Achievement_pkey" PRIMARY KEY ("idUser_Achievement")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "idAchievement" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("idAchievement")
);

-- CreateTable
CREATE TABLE "Friend" (
    "idFriend" SERIAL NOT NULL,
    "idUser" INTEGER NOT NULL,
    "idFriendUser" INTEGER NOT NULL,
    "idStatus" INTEGER NOT NULL,

    CONSTRAINT "Friend_pkey" PRIMARY KEY ("idFriend")
);

-- CreateTable
CREATE TABLE "Block" (
    "idBlock" SERIAL NOT NULL,
    "idUser" INTEGER NOT NULL,
    "idBlockedUser" INTEGER NOT NULL,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("idBlock")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_id42_key" ON "User"("id42");

-- AddForeignKey
ALTER TABLE "User_Game" ADD CONSTRAINT "User_Game_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Game" ADD CONSTRAINT "User_Game_idGame_fkey" FOREIGN KEY ("idGame") REFERENCES "Game"("idGame") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_idOwner_fkey" FOREIGN KEY ("idOwner") REFERENCES "User"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_idType_fkey" FOREIGN KEY ("idType") REFERENCES "ChannelType"("idChannelType") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_idChannel_fkey" FOREIGN KEY ("idChannel") REFERENCES "Channel"("idChannel") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Channel" ADD CONSTRAINT "User_Channel_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Channel" ADD CONSTRAINT "User_Channel_idChannel_fkey" FOREIGN KEY ("idChannel") REFERENCES "Channel"("idChannel") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Channel" ADD CONSTRAINT "User_Channel_idRole_fkey" FOREIGN KEY ("idRole") REFERENCES "Role"("idRole") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Channel" ADD CONSTRAINT "User_Channel_idStatus_fkey" FOREIGN KEY ("idStatus") REFERENCES "Status"("idStatus") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Achievement" ADD CONSTRAINT "User_Achievement_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Achievement" ADD CONSTRAINT "User_Achievement_idAchievement_fkey" FOREIGN KEY ("idAchievement") REFERENCES "Achievement"("idAchievement") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_idFriendUser_fkey" FOREIGN KEY ("idFriendUser") REFERENCES "User"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_idStatus_fkey" FOREIGN KEY ("idStatus") REFERENCES "Status"("idStatus") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_idBlockedUser_fkey" FOREIGN KEY ("idBlockedUser") REFERENCES "User"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Insert

-- Insert

--          PRIMARY DATAS

INSERT INTO "Status" ("name") VALUES ('Waiting');
INSERT INTO "Status" ("name") VALUES ('Accepted');
INSERT INTO "Status" ("name") VALUES ('Refused');

INSERT INTO "Role" ("name") VALUES ('Admin');
INSERT INTO "Role" ("name") VALUES ('Member');
INSERT INTO "Role" ("name") VALUES ('Banned');

INSERT INTO "ChannelType" ("name") VALUES ('private');
INSERT INTO "ChannelType" ("name") VALUES ('public');
INSERT INTO "ChannelType" ("name") VALUES ('dm');

INSERT INTO "Achievement" ("name", "content") VALUES ('Depucelage', 'Joue ta première partie.');
INSERT INTO "Achievement" ("name", "content") VALUES ('Mysanthrope?', 'Obtiens ton premier ami.');
INSERT INTO "Achievement" ("name", "content") VALUES ('Moulin à parole', 'Envoie ton premier message.');
INSERT INTO "Achievement" ("name", "content") VALUES ('Double-Face', 'Provoque ta propre chance.');

--          USER

INSERT INTO "User" ("username", "email", "avatar", "points", "isTwoFactorAuthEnabled", "id42", "twoFactorAuthSecret")
VALUES ('TinkyWinky', 'TinkyWinky@gmail.be', 'src/../upload/default_avatar.png', 50, false, 1, 'default');

INSERT INTO "User" ("username", "email", "avatar", "points", "isTwoFactorAuthEnabled", "id42", "twoFactorAuthSecret")
VALUES ('Dipsy', 'Dipsy@gmail.be', 'src/../upload/default_avatar.png', 0, false, 2, 'default');

INSERT INTO "User" ("username", "email", "avatar", "points", "isTwoFactorAuthEnabled", "id42", "twoFactorAuthSecret")
VALUES ('Laa-Laa', 'Laa-Laa@gmail.be', 'src/../upload/default_avatar.png', 10, false, 3, 'default');

INSERT INTO "User" ("username", "email", "avatar", "points", "isTwoFactorAuthEnabled", "id42", "twoFactorAuthSecret")
VALUES ('Po', 'Po@gmail.be', 'src/../upload/default_avatar.png', 40, false, 4, 'default');



--          CHANNEL

INSERT INTO "Channel" ("name", "password", "idOwner", "idType")
VALUES ('Cocktail in the tube', '', 1, 2);
INSERT INTO "User_Channel" ("idUser", "idChannel", "idRole", "muteTime")
VALUES (1, 1, 1, NULL);

INSERT INTO "Channel" ("name", "password", "idOwner", "idType")
VALUES ('The baby sun', '', 3, 2);
INSERT INTO "User_Channel" ("idUser", "idChannel", "idRole", "muteTime")
VALUES (3, 2, 1, NULL);

INSERT INTO "Channel" ("name", "password", "idOwner", "idType")
VALUES ('Viva la muerte!', '', 1, 2);
INSERT INTO "User_Channel" ("idUser", "idChannel", "idRole", "muteTime")
VALUES (1, 3, 1, NULL);

INSERT INTO "Channel" ("name", "password", "idOwner", "idType")
VALUES ('Les apirateurs sont vraiment nos amis ?', '', 4, 2);
INSERT INTO "User_Channel" ("idUser", "idChannel", "idRole", "muteTime")
VALUES (4, 4, 1, NULL);

INSERT INTO "Channel" ("name", "password", "idOwner", "idType")
VALUES ('Dipsy, this dick', '', 3, 2);
INSERT INTO "User_Channel" ("idUser", "idChannel", "idRole", "muteTime")
VALUES (3, 5, 1, NULL);

INSERT INTO "Channel" ("name", "password", "idOwner", "idType")
VALUES ('DM TinkyWinky | Laa-Laa', '', 1, 3);
INSERT INTO "User_Channel" ("idUser", "idChannel", "idRole", "muteTime")
VALUES (1, 6, 2, NULL);
INSERT INTO "User_Channel" ("idUser", "idChannel", "idRole", "muteTime")
VALUES (3, 6, 2, NULL);

--          JOIN CHANNEL

INSERT INTO "User_Channel" ("idUser", "idChannel", "idRole", "muteTime")
VALUES (2, 1, 2, NULL);
INSERT INTO "User_Channel" ("idUser", "idChannel", "idRole", "muteTime")
VALUES (3, 1, 2, NULL);
INSERT INTO "User_Channel" ("idUser", "idChannel", "idRole", "muteTime")
VALUES (4, 1, 2, NULL);

INSERT INTO "User_Channel" ("idUser", "idChannel", "idRole", "muteTime")
VALUES (2, 2, 2, NULL);

INSERT INTO "User_Channel" ("idUser", "idChannel", "idRole", "muteTime")
VALUES (4, 3, 2, NULL);

INSERT INTO "User_Channel" ("idUser", "idChannel", "idRole", "muteTime")
VALUES (1, 4, 2, NULL);
INSERT INTO "User_Channel" ("idUser", "idChannel", "idRole", "muteTime")
VALUES (2, 4, 2, NULL);

INSERT INTO "User_Channel" ("idUser", "idChannel", "idRole", "muteTime")
VALUES (1, 5, 2, NULL);
INSERT INTO "User_Channel" ("idUser", "idChannel", "idRole", "muteTime")
VALUES (2, 5, 3, NULL);
INSERT INTO "User_Channel" ("idUser", "idChannel", "idRole", "muteTime")
VALUES (4, 5, 2, NULL);

--          MESSAGE

INSERT INTO "Message" ("content", "timestamps", "idUser", "idChannel")
VALUES ('SALUT BG !', '1997-05-12 15:00:00', 1, 1);
INSERT INTO "Message" ("content", "timestamps", "idUser", "idChannel")
VALUES ('Oh quelle belle antenne... Tu ne capterais pas des programmes coquins ?', '1997-05-12 15:00:20', 3, 1);
INSERT INTO "Message" ("content", "timestamps", "idUser", "idChannel")
VALUES ('Viens un peu par ici que je te montre...', '1997-05-12 15:00:30', 1, 1);
INSERT INTO "Message" ("content", "timestamps", "idUser", "idChannel")
VALUES ('Grrrrrr!', '1997-05-12 15:00:40', 3, 1);
INSERT INTO "Message" ("content", "timestamps", "idUser", "idChannel")
VALUES ('Salut les coupains !!!!!!!', '1997-05-12 15:05:00', 2, 1);
INSERT INTO "Message" ("content", "timestamps", "idUser", "idChannel")
VALUES ('STFU Dipsy!', '1997-05-12 15:05:10', 4, 1);
INSERT INTO "Message" ("content", "timestamps", "idUser", "idChannel")
VALUES ('Jamais il va la fermer ce connard !', '1997-05-12 15:05:12', 1, 1);
INSERT INTO "Message" ("content", "timestamps", "idUser", "idChannel")
VALUES ('Honnetement, si j etais toi Dispsy, je me jeterai du haut de la maison la tete en avant... On n a tellement pas besoin de toi...', '1997-05-12 15:05:15', 3, 1);

INSERT INTO "Message" ("content", "timestamps", "idUser", "idChannel")
VALUES ('Mes bien chers freres... Mes bien cheres so... On n a pas le temps pour elles. Vous n etes pas sans savoir que le soleil n est une simple balle brillante amusante a regarder. Non stupide Dipsy ! Ce n est meme pas une balle! C est un bebe !', '2014-01-01 08:00:00', 3, 2);
INSERT INTO "Message" ("content", "timestamps", "idUser", "idChannel")
VALUES ('Tu es trop maligne Laa-Laa !', '2014-01-01 12:00:00', 2, 2);

--          GAME

INSERT INTO "Game" ("scoreLeft", "scoreRight", "date")
VALUES (5, 0 , '1997-05-12 12:00:00');
INSERT INTO "User_Game"("idUser", "idGame", "isWinner")
VALUES (1, 1, true);
INSERT INTO "User_Game"("idUser", "idGame", "isWinner")
VALUES (2, 1, false);

INSERT INTO "Game" ("scoreLeft", "scoreRight", "date")
VALUES (5, 0 , '1997-05-12 13:00:00');
INSERT INTO "User_Game"("idUser", "idGame", "isWinner")
VALUES (1, 2, true);
INSERT INTO "User_Game"("idUser", "idGame", "isWinner")
VALUES (2, 2, false);

INSERT INTO "Game" ("scoreLeft", "scoreRight", "date")
VALUES (5, 0 , '1997-05-12 14:00:00');
INSERT INTO "User_Game"("idUser", "idGame", "isWinner")
VALUES (1, 3, true);
INSERT INTO "User_Game"("idUser", "idGame", "isWinner")
VALUES (2, 3, false);

INSERT INTO "Game" ("scoreLeft", "scoreRight", "date")
VALUES (5, 0 , '1997-05-12 18:00:00');
INSERT INTO "User_Game"("idUser", "idGame", "isWinner")
VALUES (1, 4, true);
INSERT INTO "User_Game"("idUser", "idGame", "isWinner")
VALUES (2, 4, false);

INSERT INTO "Game" ("scoreLeft", "scoreRight", "date")
VALUES (5, 0 , '1997-05-12 19:00:00');
INSERT INTO "User_Game"("idUser", "idGame", "isWinner")
VALUES (1, 5, true);
INSERT INTO "User_Game"("idUser", "idGame", "isWinner")
VALUES (2, 5, false);

INSERT INTO "Game" ("scoreLeft", "scoreRight", "date")
VALUES (5, 0 , '1997-05-12 13:00:00');
INSERT INTO "User_Game"("idUser", "idGame", "isWinner")
VALUES (3, 6, true);
INSERT INTO "User_Game"("idUser", "idGame", "isWinner")
VALUES (4, 6, false);

INSERT INTO "Game" ("scoreLeft", "scoreRight", "date")
VALUES (5, 0 , '1997-05-12 13:00:00');
INSERT INTO "User_Game"("idUser", "idGame", "isWinner")
VALUES (3, 7, true);
INSERT INTO "User_Game"("idUser", "idGame", "isWinner")
VALUES (2, 7, false);

INSERT INTO "Game" ("scoreLeft", "scoreRight", "date")
VALUES (5, 0 , '1997-05-12 13:30:00');
INSERT INTO "User_Game"("idUser", "idGame", "isWinner")
VALUES (4, 8, true);
INSERT INTO "User_Game"("idUser", "idGame", "isWinner")
VALUES (3, 8, false);

INSERT INTO "Game" ("scoreLeft", "scoreRight", "date")
VALUES (5, 0 , '1997-05-12 13:10:00');
INSERT INTO "User_Game"("idUser", "idGame", "isWinner")
VALUES (4, 9, true);
INSERT INTO "User_Game"("idUser", "idGame", "isWinner")
VALUES (2, 9, false);

INSERT INTO "Game" ("scoreLeft", "scoreRight", "date")
VALUES (5, 0 , '1997-05-12 12:30:00');
INSERT INTO "User_Game"("idUser", "idGame", "isWinner")
VALUES (4, 10, true);
INSERT INTO "User_Game"("idUser", "idGame", "isWinner")
VALUES (2, 10, false);

INSERT INTO "Game" ("scoreLeft", "scoreRight", "date")
VALUES (5, 0 , '1997-05-12 13:20:00');
INSERT INTO "User_Game"("idUser", "idGame", "isWinner")
VALUES (4, 11, true);
INSERT INTO "User_Game"("idUser", "idGame", "isWinner")
VALUES (2, 11, false);