-- CreateTable
CREATE TABLE "Mvp" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "lastKillTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respawnTime" INTEGER NOT NULL DEFAULT 9000000,
    "isAlive" BOOLEAN NOT NULL DEFAULT true,
    "killerName" TEXT DEFAULT '',
    "img" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Mvp_name_key" ON "Mvp"("name");
