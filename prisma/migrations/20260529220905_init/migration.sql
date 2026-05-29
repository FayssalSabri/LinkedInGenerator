-- CreateTable
CREATE TABLE "HistoryItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mode" TEXT,
    "description" TEXT,
    "brief" TEXT,
    "tone" TEXT,
    "draft" TEXT,
    "publication" TEXT NOT NULL,
    "note" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "HistoryItem_userId_idx" ON "HistoryItem"("userId");
