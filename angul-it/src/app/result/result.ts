import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CaptchaState } from '../services/captcha-state';

interface ChallengeResult {
  stage: number;
  instruction: string;
  completed: boolean;
  status: 'success' | 'partial' | 'skipped';
}

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result.html',
  styleUrl: './result.css'
})
export class ResultComponent implements OnInit {
  results: ChallengeResult[] = [];
  totalStages = 3;
  completedStages = 0;
  completionPercentage = 0;
  completionTime: string = '';
  showCelebration = false;

  challengeData = [
    { stage: 1, instruction: 'Select all images with CARS' },
    { stage: 2, instruction: 'Select all images with TRAFFIC LIGHTS' },
    { stage: 3, instruction: 'Select all images with CROSSWALKS' }
  ];

  constructor(
    private router: Router,
    private stateService: CaptchaState
  ) {}

  ngOnInit() {
    this.loadResults();
    this.triggerCelebration();
  }

private loadResults() {
  const progress = this.stateService.loadProgress();
  
  if (progress) {
    this.completedStages = progress.completedStages.length;
    this.completionPercentage = Math.round((this.completedStages / this.totalStages) * 100);
    
    // ✅ FIXED: Calculate total time from start to now
    const totalTimeSpent = Date.now() - progress.startTime;
    this.completionTime = this.formatTime(totalTimeSpent);
    
    // Generate results for each stage
    this.results = this.challengeData.map(challenge => ({
      stage: challenge.stage,
      instruction: challenge.instruction,
      completed: progress.completedStages.includes(challenge.stage),
      status: this.getStageStatus(challenge.stage, progress.completedStages)
    }));
  } else {
    // Fallback if no progress found
    this.completionTime = "0s";
    this.results = this.challengeData.map(challenge => ({
      stage: challenge.stage,
      instruction: challenge.instruction,
      completed: false,
      status: 'skipped' as const
    }));
  }
}


  private getStageStatus(stage: number, completedStages: number[]): 'success' | 'partial' | 'skipped' {
    if (completedStages.includes(stage)) {
      return 'success';
    } else if (stage <= Math.max(...completedStages, 0) + 1) {
      return 'partial';
    } else {
      return 'skipped';
    }
  }

  private formatTime(milliseconds: number): string {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }

  // ✅ UPDATED: Enhanced celebration with auto-dismiss
  private triggerCelebration() {
    if (this.completedStages >= this.totalStages) {
      setTimeout(() => {
        this.showCelebration = true;
        
        // Auto-hide celebration after 4 seconds
        setTimeout(() => {
          this.showCelebration = false;
        }, 4000);
        
      }, 500);
    }
  }

  // ✅ NEW: Add method to manually dismiss celebration
  dismissCelebration() {
    this.showCelebration = false;
  }

  startNewChallenge() {
    // Clear all saved progress
    this.stateService.clearProgress();
    
    // Navigate to captcha page
    this.router.navigate(['/captcha']);
  }

  goHome() {
    this.router.navigate(['/']);
  }

get completionMessage(): string {
  if (this.completedStages >= this.totalStages) {
    return "🎉 Congratulations! You have successfully proven you are not a bot!";
  } else if (this.completedStages >= 2) {
    return "👏 Great progress! Complete all challenges to prove you're not a bot!";
  } else if (this.completedStages >= 1) {
    return "👍 Good start! Continue the challenges to verify you're human!";
  } else {
    return "🤔 Please complete the challenges to prove you're not a bot!";
  }
}


  get performanceRating(): string {
    if (this.completionPercentage >= 100) return "Excellent";
    if (this.completionPercentage >= 67) return "Good";
    if (this.completionPercentage >= 33) return "Fair";
    return "Needs Improvement";
  }
}
