-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MEMBERSHIPS', 'MANAGE_CONVERSATIONS', 'ADMINISTRATOR');

-- CreateEnum
CREATE TYPE "UsernameType" AS ENUM ('twitter', 'wallet');

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    "permissions" "Permission"[],

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllowedUser" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "usernameType" "UsernameType" NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "AllowedUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AllowedUser" ADD CONSTRAINT "AllowedUser_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
