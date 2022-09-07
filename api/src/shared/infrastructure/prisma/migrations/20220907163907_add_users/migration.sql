-- CreateTable
CREATE TABLE "UsersOnRoles" (
    "roleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UsersOnRoles_pkey" PRIMARY KEY ("userId","roleId")
);

-- AddForeignKey
ALTER TABLE "UsersOnRoles" ADD CONSTRAINT "UsersOnRoles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
