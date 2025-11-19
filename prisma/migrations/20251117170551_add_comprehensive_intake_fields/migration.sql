-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'CLIENT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "goal" TEXT,
    "gender" TEXT,
    "dateOfBirth" DATETIME,
    "heightInches" INTEGER,
    "weightLbs" REAL,
    "activityLevel" TEXT,
    "dailyMovementPattern" TEXT,
    "mainFitnessGoals" TEXT,
    "trainingExperience" TEXT,
    "trainingHistory" TEXT,
    "daysPerWeek" INTEGER,
    "sessionDuration" INTEGER,
    "preferredWorkoutTime" TEXT,
    "availableEquipment" TEXT,
    "workoutLocation" TEXT,
    "trainingStyle" TEXT,
    "coachingStyle" TEXT,
    "motivation" TEXT,
    "biggestStruggle" TEXT,
    "injuries" TEXT,
    "medicalConditions" TEXT,
    "medications" TEXT,
    "painOrDiscomfort" TEXT,
    "dietType" TEXT,
    "foodAllergies" TEXT,
    "foodsToAvoid" TEXT,
    "eatsBreakfast" BOOLEAN,
    "eatsAnimalProducts" BOOLEAN,
    "mealsPerDay" INTEGER,
    "beverageConsumption" TEXT,
    "waterIntakeOz" INTEGER,
    "typicalDayEating" TEXT,
    "favoriteMeals" TEXT,
    "preferredMacros" TEXT,
    "fastingPattern" TEXT,
    "culturalDietaryNeeds" TEXT,
    "deliveryPreference" TEXT,
    "wantsWeeklyCheckins" BOOLEAN,
    "sportsPlayed" TEXT,
    "schoolGrade" TEXT,
    "eatsBeforePractice" BOOLEAN,
    "staysHydrated" BOOLEAN,
    "seasonMotivation" TEXT,
    "seasonChallenges" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Packet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "docUrl" TEXT,
    "lastError" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Packet_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_userId_key" ON "Client"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- CreateIndex
CREATE INDEX "Client_email_idx" ON "Client"("email");

-- CreateIndex
CREATE INDEX "Packet_clientId_idx" ON "Packet"("clientId");

-- CreateIndex
CREATE INDEX "Packet_clientId_type_idx" ON "Packet"("clientId", "type");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
