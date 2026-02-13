-- Add visibility flags for screenshot text fields
ALTER TABLE "WinningScreenshot" ADD COLUMN "showName" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "WinningScreenshot" ADD COLUMN "showMessage" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "WinningScreenshot" ADD COLUMN "showAmount" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "WinningScreenshot" ADD COLUMN "showTime" BOOLEAN NOT NULL DEFAULT true;
