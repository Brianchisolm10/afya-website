-- CreateTable
CREATE TABLE "PerformanceMetric" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pageName" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fcp" REAL,
    "lcp" REAL,
    "fid" REAL,
    "cls" REAL,
    "ttfb" REAL,
    "pageLoadTime" REAL,
    "deviceType" TEXT,
    "connectionType" TEXT,
    "userAgent" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "PerformanceMetric_pageName_timestamp_idx" ON "PerformanceMetric"("pageName", "timestamp");

-- CreateIndex
CREATE INDEX "PerformanceMetric_timestamp_idx" ON "PerformanceMetric"("timestamp");

-- CreateIndex
CREATE INDEX "PerformanceMetric_pageName_idx" ON "PerformanceMetric"("pageName");

-- CreateIndex
CREATE INDEX "PerformanceMetric_deviceType_idx" ON "PerformanceMetric"("deviceType");
