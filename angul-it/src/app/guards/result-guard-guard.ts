import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CaptchaState } from '../services/captcha-state';

export const resultGuard: CanActivateFn = (route, state) => {
  const stateService = inject(CaptchaState);
  const router = inject(Router);
  
  // Check if user has attempted all challenges (completed OR failed)
  const progress = stateService.loadProgress();
  
  if (progress) {
    const totalAttempted = (progress.completedStages?.length || 0) + (progress.failedStages?.length || 0);
    
    // Allow access if user attempted all 3 stages
    if (totalAttempted >= 3) {
      console.log('Access granted to results page');
      return true;
    }
  }
  
  // Redirect unauthorized users back to captcha
  console.log('Unauthorized access to results - redirecting to captcha');
  router.navigate(['/captcha']);
  return false;
};
