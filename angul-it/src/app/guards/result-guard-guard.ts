import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CaptchaState } from '../services/captcha-state';

export const resultGuard: CanActivateFn = (route, state) => {
  const stateService = inject(CaptchaState);
  const router = inject(Router);
  
  // Check if user has completed all challenges
  const progress = stateService.loadProgress();
  
  // Allow access only if user completed all 3 stages
  if (progress && progress.completedStages.length >= 3) {
    console.log('Access granted to results page');
    return true;
  }
  
  // Redirect unauthorized users back to captcha
  console.log('Unauthorized access to results - redirecting to captcha');
  router.navigate(['/captcha']);
  return false;
};
