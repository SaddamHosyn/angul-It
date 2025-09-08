import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';          // Use curly braces
import { CaptchaComponent } from './captcha/captcha';  // Use curly braces
import { ResultComponent } from './result/result';      // Use curly braces

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'captcha', component: CaptchaComponent },
  { path: 'result', component: ResultComponent },
];
