import { Injectable } from '@angular/core';

// Browser check helper
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

interface CaptchaProgress {
  currentStage: number;
  selectedImages: number[];
  attemptCount: number;
  completedStages: number[];
  timestamp: number;
  startTime: number;
  challengeInstructions?: string[]; // Store actual challenge instructions
  failedStages?: number[]; // Track failed stages separately
}

@Injectable({
  providedIn: 'root'
})
export class CaptchaState {
  private readonly STORAGE_KEY = 'angul-it-captcha-progress';
  private readonly EXPIRY_HOURS = 24;

  constructor() {}

  saveProgress(currentStage: number, selectedImages: number[], attemptCount: number, completedStages: number[], startTime?: number, challengeInstructions?: string[], failedStages?: number[]): void {
    if (!isBrowser()) return; // Guard for SSR
    
    const existingProgress = this.loadProgress();
    
    const progress: CaptchaProgress = {
      currentStage,
      selectedImages,
      attemptCount,
      completedStages,
      timestamp: Date.now(),
      startTime: startTime || existingProgress?.startTime || Date.now(),
      challengeInstructions: challengeInstructions || existingProgress?.challengeInstructions,
      failedStages: failedStages || existingProgress?.failedStages || []
    };
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save progress to localStorage:', error);
    }
  }

  initializeProgress(): void {
    if (!isBrowser()) return; // Guard for SSR
    
    const startTime = Date.now();
    this.saveProgress(1, [], 0, [], startTime);
  }

  loadProgress(): CaptchaProgress | null {
    if (!isBrowser()) return null; // Guard for SSR
    
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

      // Validate and sanitize loaded data
      progress.attemptCount = Math.min(progress.attemptCount || 0, 3);
      progress.currentStage = Math.max(1, Math.min(progress.currentStage || 1, 3));
      progress.completedStages = progress.completedStages || [];
      progress.selectedImages = progress.selectedImages || [];
      progress.failedStages = progress.failedStages || [];

      return progress;
    } catch (error) {
      console.error('Failed to load progress from localStorage:', error);
      return null;
    }
  }

  clearProgress(): void {
    if (!isBrowser()) return; // Guard for SSR
    
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear progress:', error);
    }
  }

  private isProgressExpired(timestamp: number): boolean {
    const expiryTime = this.EXPIRY_HOURS * 60 * 60 * 1000;
    return (Date.now() - timestamp) > expiryTime;
  }

  hasSavedProgress(): boolean {
    if (!isBrowser()) return false; // Guard for SSR
    
    const progress = this.loadProgress();
    return progress !== null;
  }

  getProgressSummary(): { stage: number; total: number } | null {
    if (!isBrowser()) return null; // Guard for SSR
    
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
