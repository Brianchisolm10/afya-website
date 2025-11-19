-- AlterTable
ALTER TABLE "Client" ADD COLUMN "aggravatingPositions" TEXT;
ALTER TABLE "Client" ADD COLUMN "clientType" TEXT;
ALTER TABLE "Client" ADD COLUMN "competitionLevel" TEXT;
ALTER TABLE "Client" ADD COLUMN "conditioningMetrics" JSONB;
ALTER TABLE "Client" ADD COLUMN "injuryLocation" TEXT;
ALTER TABLE "Client" ADD COLUMN "intakeCompletedAt" DATETIME;
ALTER TABLE "Client" ADD COLUMN "intakeResponses" JSONB;
ALTER TABLE "Client" ADD COLUMN "medicalClearance" BOOLEAN;
ALTER TABLE "Client" ADD COLUMN "mobilityLimitations" TEXT;
ALTER TABLE "Client" ADD COLUMN "painPatterns" TEXT;
ALTER TABLE "Client" ADD COLUMN "position" TEXT;
ALTER TABLE "Client" ADD COLUMN "powerMetrics" JSONB;
ALTER TABLE "Client" ADD COLUMN "recoveryGoals" TEXT;
ALTER TABLE "Client" ADD COLUMN "seasonPhase" TEXT;
ALTER TABLE "Client" ADD COLUMN "speedMetrics" JSONB;
ALTER TABLE "Client" ADD COLUMN "sport" TEXT;
ALTER TABLE "Client" ADD COLUMN "strengthBenchmarks" JSONB;
ALTER TABLE "Client" ADD COLUMN "trainingAge" INTEGER;

-- CreateTable
CREATE TABLE "IntakeProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "selectedPath" TEXT,
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "totalSteps" INTEGER,
    "responses" JSONB,
    "isComplete" BOOLEAN NOT NULL DEFAULT false,
    "lastSavedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "IntakeProgress_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QuestionBlock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "questions" JSONB NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "IntakePath" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "questionBlocks" JSONB NOT NULL,
    "branchingRules" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PacketTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "packetType" TEXT NOT NULL,
    "clientType" TEXT,
    "sections" JSONB NOT NULL,
    "contentBlocks" JSONB NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "IntakeAnalytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientType" TEXT NOT NULL,
    "startedAt" DATETIME NOT NULL,
    "completedAt" DATETIME,
    "abandonedAt" DATETIME,
    "completionTime" INTEGER,
    "dropOffStep" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Packet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "content" JSONB,
    "docUrl" TEXT,
    "pdfUrl" TEXT,
    "templateId" TEXT,
    "generatedBy" TEXT,
    "generationMethod" TEXT,
    "lastError" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 1,
    "previousVersionId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Packet_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Packet" ("clientId", "createdAt", "docUrl", "id", "lastError", "status", "type", "updatedAt") SELECT "clientId", "createdAt", "docUrl", "id", "lastError", "status", "type", "updatedAt" FROM "Packet";
DROP TABLE "Packet";
ALTER TABLE "new_Packet" RENAME TO "Packet";
CREATE INDEX "Packet_clientId_type_idx" ON "Packet"("clientId", "type");
CREATE INDEX "Packet_status_idx" ON "Packet"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "IntakeProgress_clientId_key" ON "IntakeProgress"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionBlock_name_key" ON "QuestionBlock"("name");

-- CreateIndex
CREATE INDEX "QuestionBlock_category_idx" ON "QuestionBlock"("category");

-- CreateIndex
CREATE UNIQUE INDEX "IntakePath_clientType_key" ON "IntakePath"("clientType");

-- CreateIndex
CREATE INDEX "PacketTemplate_packetType_clientType_idx" ON "PacketTemplate"("packetType", "clientType");

-- CreateIndex
CREATE INDEX "Client_clientType_idx" ON "Client"("clientType");
