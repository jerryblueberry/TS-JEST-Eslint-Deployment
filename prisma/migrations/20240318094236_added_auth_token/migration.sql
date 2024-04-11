-- CreateTable
CREATE TABLE "authToken" (
    "id" SERIAL NOT NULL,
    "user" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "authToken_pkey" PRIMARY KEY ("id")
);
