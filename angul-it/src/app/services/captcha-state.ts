import { Injectable } from '@angular/core';


interface CaptchaProgress {
  currentStage: number;
  selectedImages: number[];
  attemptCount: number;
  completedStages: number[];
  timestamp: number;
  startTime: number;  // Add this for time tracking
}


@Injectable({
  providedIn: 'root'  // ✅ ADD THIS LINE
})


export class CaptchaState {
  private readonly STORAGE_KEY = 'angul-it-captcha-progress';
  private readonly EXPIRY_HOURS = 24;

  constructor() {}

  // ✅ UPDATED: Include startTime parameter
  saveProgress(currentStage: number, selectedImages: number[], attemptCount: number, completedStages: number[], startTime?: number): void {
    const existingProgress = this.loadProgress();
    
    const progress: CaptchaProgress = {
      currentStage,
      selectedImages,
      attemptCount,
      completedStages,
      timestamp: Date.now(),
      startTime: startTime || existingProgress?.startTime || Date.now()
    };
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
      console.log('Progress saved:', progress);
    } catch (error) {
      console.error('Failed to save progress to localStorage:', error);
    }
  }

  // ✅ NEW: Method to initialize with start time
  initializeProgress(): void {
    const startTime = Date.now();
    this.saveProgress(1, [], 0, [], startTime);
  }

  // Existing methods remain the same...
loadProgress(): CaptchaProgress | null {
  try {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (!saved) {
      return null;
    }

    const progress: CaptchaProgress = JSON.parse(saved);
    
    if (this.isProgressExpired(progress.timestamp)) {
      this.clearProgress();
      return null;
    }

    // ✅ FIX: Validate and sanitize loaded data
    progress.attemptCount = Math.min(progress.attemptCount || 0, 3); // Cap at 3
    progress.currentStage = Math.max(1, Math.min(progress.currentStage || 1, 3)); // Between 1-3
    progress.completedStages = progress.completedStages || [];
    progress.selectedImages = progress.selectedImages || [];

    return progress;
  } catch (error) {
    console.error('Failed to load progress from localStorage:', error);
    return null;
  }
}


  clearProgress(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('Progress cleared');
    } catch (error) {
      console.error('Failed to clear progress:', error);
    }
  }

  private isProgressExpired(timestamp: number): boolean {
    const expiryTime = this.EXPIRY_HOURS * 60 * 60 * 1000;
    return (Date.now() - timestamp) > expiryTime;
  }

  hasSavedProgress(): boolean {
    const progress = this.loadProgress();
    return progress !== null;
  }

  getProgressSummary(): { stage: number; total: number } | null {
    const progress = this.loadProgress();
    if (!progress) {
      return null;
    }
    
    return {
      stage: progress.currentStage,
      total: 3
    };
  }
}
