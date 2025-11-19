-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PacketTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "packetType" TEXT NOT NULL,
    "clientType" TEXT,
    "sections" JSONB NOT NULL,
    "contentBlocks" JSONB NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_PacketTemplate" ("clientType", "contentBlocks", "createdAt", "createdBy", "id", "isDefault", "name", "packetType", "sections", "updatedAt") SELECT "clientType", "contentBlocks", "createdAt", "createdBy", "id", "isDefault", "name", "packetType", "sections", "updatedAt" FROM "PacketTemplate";
DROP TABLE "PacketTemplate";
ALTER TABLE "new_PacketTemplate" RENAME TO "PacketTemplate";
CREATE INDEX "PacketTemplate_packetType_clientType_idx" ON "PacketTemplate"("packetType", "clientType");
CREATE INDEX "PacketTemplate_isDefault_idx" ON "PacketTemplate"("isDefault");
CREATE INDEX "PacketTemplate_isActive_idx" ON "PacketTemplate"("isActive");
CREATE INDEX "PacketTemplate_packetType_isDefault_isActive_idx" ON "PacketTemplate"("packetType", "isDefault", "isActive");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Client_userId_idx" ON "Client"("userId");

-- CreateIndex
CREATE INDEX "Client_intakeCompletedAt_idx" ON "Client"("intakeCompletedAt");

-- CreateIndex
CREATE INDEX "Client_createdAt_idx" ON "Client"("createdAt");

-- CreateIndex
CREATE INDEX "IntakeAnalytics_clientType_idx" ON "IntakeAnalytics"("clientType");

-- CreateIndex
CREATE INDEX "IntakeAnalytics_completedAt_idx" ON "IntakeAnalytics"("completedAt");

-- CreateIndex
CREATE INDEX "IntakeAnalytics_abandonedAt_idx" ON "IntakeAnalytics"("abandonedAt");

-- CreateIndex
CREATE INDEX "IntakeAnalytics_startedAt_idx" ON "IntakeAnalytics"("startedAt");

-- CreateIndex
CREATE INDEX "IntakeAnalytics_clientType_completedAt_idx" ON "IntakeAnalytics"("clientType", "completedAt");

-- CreateIndex
CREATE INDEX "IntakePath_isActive_idx" ON "IntakePath"("isActive");

-- CreateIndex
CREATE INDEX "IntakeProgress_isComplete_idx" ON "IntakeProgress"("isComplete");

-- CreateIndex
CREATE INDEX "IntakeProgress_selectedPath_idx" ON "IntakeProgress"("selectedPath");

-- CreateIndex
CREATE INDEX "IntakeProgress_lastSavedAt_idx" ON "IntakeProgress"("lastSavedAt");

-- CreateIndex
CREATE INDEX "Packet_clientId_status_idx" ON "Packet"("clientId", "status");

-- CreateIndex
CREATE INDEX "Packet_status_retryCount_idx" ON "Packet"("status", "retryCount");

-- CreateIndex
CREATE INDEX "Packet_createdAt_idx" ON "Packet"("createdAt");

-- CreateIndex
CREATE INDEX "Packet_updatedAt_idx" ON "Packet"("updatedAt");

-- CreateIndex
CREATE INDEX "QuestionBlock_isActive_idx" ON "QuestionBlock"("isActive");

-- CreateIndex
CREATE INDEX "QuestionBlock_category_isActive_idx" ON "QuestionBlock"("category", "isActive");
