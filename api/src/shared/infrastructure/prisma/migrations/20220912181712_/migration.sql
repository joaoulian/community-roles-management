/*
  Warnings:

  - A unique constraint covering the columns `[roleId,communityId]` on the table `permissions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[roleId,channelId]` on the table `permissions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "permissions_roleId_channelId_communityId_key";

-- CreateIndex
CREATE UNIQUE INDEX "permissions_roleId_communityId_key" ON "permissions"("roleId", "communityId");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_roleId_channelId_key" ON "permissions"("roleId", "channelId");
