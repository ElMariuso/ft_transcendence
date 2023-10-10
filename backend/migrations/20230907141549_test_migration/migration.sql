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

INSERT INTO "Status" ("name") VALUES ('Waiting');
INSERT INTO "Status" ("name") VALUES ('Accepted');
INSERT INTO "Status" ("name") VALUES ('Refused');

INSERT INTO "Role" ("name") VALUES ('Admin');
INSERT INTO "Role" ("name") VALUES ('Member');

INSERT INTO "ChannelType" ("name") VALUES ('private');
INSERT INTO "ChannelType" ("name") VALUES ('public');