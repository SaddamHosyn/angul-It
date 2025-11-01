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
    this.completedStages = progress.completedStages.length;
    
    // Use actual challenge instructions from saved progress
    const instructions = progress.challengeInstructions || [];
    
    this.results = progress.completedStages.map(stageNum => ({
      stage: stageNum,
      instruction: instructions[stageNum - 1] || `Challenge ${stageNum}`,
      completed: true,
      status: 'success' as const
    }));
  } else {
    // Fallback if no progress found
    this.results = [];
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
    const percentage = Math.round((this.completedStages / this.totalStages) * 100);
    if (percentage >= 100) return "Excellent";
    if (percentage >= 67) return "Good";
    if (percentage >= 33) return "Fair";
    return "Needs Improvement";
  }
}
