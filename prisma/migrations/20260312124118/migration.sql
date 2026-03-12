-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "FeedbackStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET');

-- CreateEnum
CREATE TYPE "ApiKeyType" AS ENUM ('INGESTION', 'MANAGEMENT');

-- CreateEnum
CREATE TYPE "Environment" AS ENUM ('DEVELOPMENT', 'STAGING', 'PRODUCTION');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('EVENT', 'FEEDBACK', 'SYSTEM', 'PROJECT', 'SECURITY');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('INFO', 'SUCCESS', 'WARNING', 'ERROR');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('IN_APP', 'EMAIL', 'SMS', 'PUSH', 'WEBHOOK');

-- CreateEnum
CREATE TYPE "DigestFrequency" AS ENUM ('REAL_TIME', 'DAILY', 'WEEKLY');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "profileImage" TEXT,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "bannedReason" TEXT,
    "emailVerified" BOOLEAN DEFAULT false,
    "previousHashes" TEXT[],
    "loginFails" INTEGER,
    "lastProjectId" TEXT,
    "globalNotificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "notificationChannels" "NotificationChannel"[] DEFAULT ARRAY['IN_APP']::"NotificationChannel"[],
    "quietHoursStart" TIMESTAMP(3),
    "quietHoursEnd" TIMESTAMP(3),
    "digestFrequency" "DigestFrequency" NOT NULL DEFAULT 'REAL_TIME',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "emailVerifiedAt" TIMESTAMP(3),
    "accountLock" TIMESTAMP(3),
    "bannedAt" TIMESTAMP(3),
    "lastAccessed" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "eventNotifications" BOOLEAN NOT NULL DEFAULT true,
    "feedbackNotifications" BOOLEAN NOT NULL DEFAULT true,
    "systemNotifications" BOOLEAN NOT NULL DEFAULT true,
    "securityNotifications" BOOLEAN NOT NULL DEFAULT true,
    "autoArchive" BOOLEAN NOT NULL DEFAULT false,
    "retentionDays" INTEGER NOT NULL DEFAULT 30,
    "defaultEnvironment" "Environment" NOT NULL DEFAULT 'DEVELOPMENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "features" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "properties" JSONB NOT NULL,
    "metadata" JSONB NOT NULL,
    "environment" "Environment" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "eventTimestamp" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,
    "endUserId" TEXT NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "end_users" (
    "id" TEXT NOT NULL,
    "anonymousId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "externalUserId" TEXT,
    "traits" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "projectId" TEXT NOT NULL,

    CONSTRAINT "end_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedbacks" (
    "id" TEXT NOT NULL,
    "rating" INTEGER,
    "title" TEXT,
    "message" TEXT NOT NULL,
    "additionalInfo" TEXT,
    "status" "FeedbackStatus" NOT NULL DEFAULT 'NEW',
    "properties" JSONB NOT NULL,
    "metadata" JSONB NOT NULL,
    "environment" "Environment" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "feedbackTimestamp" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "projectId" TEXT NOT NULL,
    "endUserId" TEXT NOT NULL,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "maxExpiresAt" TIMESTAMP(3) NOT NULL,
    "userAgent" TEXT,
    "ip" TEXT,
    "sessionId" TEXT,
    "csrfToken" TEXT,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auditlogs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "action" TEXT NOT NULL,
    "userAgent" TEXT,
    "ip" TEXT,
    "metadata" JSONB,

    CONSTRAINT "auditlogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ratelimitlog" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ratelimitlog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apikeys" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "keyValue" TEXT,
    "keyHash" TEXT NOT NULL,
    "keyHint" TEXT NOT NULL,
    "type" "ApiKeyType" NOT NULL DEFAULT 'INGESTION',
    "environment" "Environment" NOT NULL DEFAULT 'DEVELOPMENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "rotatedAt" TIMESTAMP(3),
    "projectId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "apikeys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'SYSTEM',
    "status" "NotificationStatus" NOT NULL DEFAULT 'INFO',
    "notificationChannel" "NotificationChannel" NOT NULL DEFAULT 'IN_APP',
    "read" BOOLEAN NOT NULL DEFAULT false,
    "actionUrl" TEXT,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "projectId" TEXT,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_id_idx" ON "users"("id");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "projects_id_ownerId_idx" ON "projects"("id", "ownerId");

-- CreateIndex
CREATE INDEX "projects_ownerId_name_idx" ON "projects"("ownerId", "name");

-- CreateIndex
CREATE INDEX "projects_ownerId_idx" ON "projects"("ownerId");

-- CreateIndex
CREATE INDEX "projects_deletedAt_idx" ON "projects"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "projects_ownerId_name_deletedAt_key" ON "projects"("ownerId", "name", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "projects_id_ownerId_deletedAt_key" ON "projects"("id", "ownerId", "deletedAt");

-- CreateIndex
CREATE INDEX "features_createdById_idx" ON "features"("createdById");

-- CreateIndex
CREATE INDEX "features_projectId_idx" ON "features"("projectId");

-- CreateIndex
CREATE INDEX "features_deletedAt_idx" ON "features"("deletedAt");

-- CreateIndex
CREATE INDEX "events_projectId_eventName_idx" ON "events"("projectId", "eventName");

-- CreateIndex
CREATE INDEX "events_projectId_eventTimestamp_idx" ON "events"("projectId", "eventTimestamp");

-- CreateIndex
CREATE INDEX "events_endUserId_eventTimestamp_idx" ON "events"("endUserId", "eventTimestamp");

-- CreateIndex
CREATE INDEX "events_projectId_idx" ON "events"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "end_users_anonymousId_key" ON "end_users"("anonymousId");

-- CreateIndex
CREATE INDEX "end_users_email_idx" ON "end_users"("email");

-- CreateIndex
CREATE INDEX "end_users_projectId_idx" ON "end_users"("projectId");

-- CreateIndex
CREATE INDEX "end_users_anonymousId_idx" ON "end_users"("anonymousId");

-- CreateIndex
CREATE UNIQUE INDEX "end_users_projectId_externalUserId_key" ON "end_users"("projectId", "externalUserId");

-- CreateIndex
CREATE UNIQUE INDEX "end_users_projectId_anonymousId_key" ON "end_users"("projectId", "anonymousId");

-- CreateIndex
CREATE INDEX "feedbacks_endUserId_idx" ON "feedbacks"("endUserId");

-- CreateIndex
CREATE INDEX "feedbacks_projectId_idx" ON "feedbacks"("projectId");

-- CreateIndex
CREATE INDEX "feedbacks_projectId_createdAt_idx" ON "feedbacks"("projectId", "createdAt");

-- CreateIndex
CREATE INDEX "feedbacks_deletedAt_idx" ON "feedbacks"("deletedAt");

-- CreateIndex
CREATE INDEX "feedbacks_projectId_rating_idx" ON "feedbacks"("projectId", "rating");

-- CreateIndex
CREATE INDEX "feedbacks_projectId_environment_idx" ON "feedbacks"("projectId", "environment");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionId_key" ON "sessions"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_csrfToken_key" ON "sessions"("csrfToken");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE INDEX "auditlogs_userId_idx" ON "auditlogs"("userId");

-- CreateIndex
CREATE INDEX "ratelimitlog_key_identifier_createdAt_idx" ON "ratelimitlog"("key", "identifier", "createdAt");

-- CreateIndex
CREATE INDEX "tokens_userId_type_idx" ON "tokens"("userId", "type");

-- CreateIndex
CREATE INDEX "tokens_tokenHash_idx" ON "tokens"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_tokenHash_type_key" ON "tokens"("tokenHash", "type");

-- CreateIndex
CREATE INDEX "apikeys_projectId_idx" ON "apikeys"("projectId");

-- CreateIndex
CREATE INDEX "apikeys_projectId_deletedAt_idx" ON "apikeys"("projectId", "deletedAt");

-- CreateIndex
CREATE INDEX "apikeys_keyHash_deletedAt_idx" ON "apikeys"("keyHash", "deletedAt");

-- CreateIndex
CREATE INDEX "apikeys_keyHash_deletedAt_revokedAt_environment_idx" ON "apikeys"("keyHash", "deletedAt", "revokedAt", "environment");

-- CreateIndex
CREATE UNIQUE INDEX "apikeys_keyHash_key" ON "apikeys"("keyHash");

-- CreateIndex
CREATE INDEX "notifications_userId_read_idx" ON "notifications"("userId", "read");

-- CreateIndex
CREATE INDEX "notifications_userId_createdAt_idx" ON "notifications"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "notifications_userId_projectId_idx" ON "notifications"("userId", "projectId");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_projectId_idx" ON "notifications"("projectId");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "features" ADD CONSTRAINT "features_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "features" ADD CONSTRAINT "features_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_endUserId_fkey" FOREIGN KEY ("endUserId") REFERENCES "end_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "end_users" ADD CONSTRAINT "end_users_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_endUserId_fkey" FOREIGN KEY ("endUserId") REFERENCES "end_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditlogs" ADD CONSTRAINT "auditlogs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apikeys" ADD CONSTRAINT "apikeys_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apikeys" ADD CONSTRAINT "apikeys_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
