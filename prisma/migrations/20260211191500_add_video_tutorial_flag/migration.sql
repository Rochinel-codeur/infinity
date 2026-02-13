-- Add a dedicated tutorial flag for the phone tutorial video
ALTER TABLE "Video" ADD COLUMN "isTutorial" BOOLEAN NOT NULL DEFAULT false;

-- Ensure only one video can be marked as tutorial at any time
CREATE UNIQUE INDEX "Video_isTutorial_true_key" ON "Video"("isTutorial") WHERE "isTutorial" = 1;
