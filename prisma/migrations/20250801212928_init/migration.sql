-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('WANT', 'HAVE');

-- CreateTable
CREATE TABLE "public"."albums" (
    "id" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "year" INTEGER,
    "format" TEXT,
    "genre" TEXT,
    "label" TEXT,
    "coverImage" TEXT,
    "discogsUrl" TEXT,
    "discogsId" TEXT,
    "status" "public"."Status" NOT NULL DEFAULT 'WANT',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "albums_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "albums_discogsId_key" ON "public"."albums"("discogsId");
