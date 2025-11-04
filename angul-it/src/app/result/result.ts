import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CaptchaState } from '../services/captcha-state';

interface ChallengeResult {
  stage: number;
  instruction: string;
  status: 'success' | 'failed';
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
  successfulStages = 0;
  failedStagesCount = 0;
  showCelebration = false;

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
    const instructions = progress.challengeInstructions || [];
    const completedStages = progress.completedStages || [];
    const failedStages = progress.failedStages || [];
    
    this.successfulStages = completedStages.length;
    this.failedStagesCount = failedStages.length;
    
    // Build results array with both successful and failed stages
    this.results = [];
    
    // Add successful stages
    completedStages.forEach(stageNum => {
      this.results.push({
        stage: stageNum,
        instruction: instructions[stageNum - 1] || `Challenge ${stageNum}`,
        status: 'success'
      });
    });
    
    // Add failed stages
    failedStages.forEach(stageNum => {
      this.results.push({
        stage: stageNum,
        instruction: instructions[stageNum - 1] || `Challenge ${stageNum}`,
        status: 'failed'
      });
    });
    
    // Sort by stage number for consistent display
    this.results.sort((a, b) => a.stage - b.stage);
  } else {
    // Fallback if no progress found
    this.results = [];
  }
}


  // ✅ UPDATED: Enhanced celebration with auto-dismiss
  private triggerCelebration() {
    if (this.successfulStages >= this.totalStages) {
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
  if (this.successfulStages >= this.totalStages) {
    return "🎉 Congratulations! You have successfully proven you are not a bot!";
  } else if (this.successfulStages >= 2) {
    return "👏 Great progress! Complete all challenges to prove you're not a bot!";
  } else if (this.successfulStages >= 1) {
    return "👍 Good start! Continue the challenges to verify you're human!";
  } else {
    return "🤔 Please complete the challenges to prove you're not a bot!";
  }
}


  get performanceRating(): string {
    const percentage = Math.round((this.successfulStages / this.totalStages) * 100);
    if (percentage >= 100) return "Excellent";
    if (percentage >= 67) return "Good";
    if (percentage >= 33) return "Fair";
    return "Needs Improvement";
  }
}
