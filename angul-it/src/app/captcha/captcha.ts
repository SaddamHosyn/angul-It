import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CaptchaState } from '../services/captcha-state';

interface ChallengeImage {
  src: string;
  alt: string;
  category: string;
}

interface Challenge {
  instruction: string;
  images: ChallengeImage[];
  correctCategory: string;
  correctAnswers: number[];
}

@Component({
  selector: 'app-captcha',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './captcha.html',
  styleUrl: './captcha.css'
})
export class CaptchaComponent implements OnInit, OnDestroy {
  currentStage = 1;
  totalStages = 3;
  selectedImages: number[] = [];
  completedStages: number[] = [];
  
  // Validation properties
  showValidation = false;
  validationMessage = '';
  isCorrect = false;
  attemptCount = 0;
  maxAttempts = 3;
  
  // State management
  showRestorePrompt = false;
  
 


challenges: Challenge[] = [
  {
    instruction: "Select all images with CARS",
    correctCategory: "car",
    correctAnswers: [0, 2, 5],
    images: [
      { src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0ZGNDQ0NCIvPjx0ZXh0IHg9Ijc1IiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+agTwvdGV4dD48dGV4dCB4PSI3NSIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNBUjwvdGV4dD48L3N2Zz4=", alt: "Red car", category: "car" },
      { src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzIyOEIyMiIvPjx0ZXh0IHg9Ijc1IiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+MsjwvdGV4dD48dGV4dCB4PSI3NSIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlRSRUU8L3RleHQ+PC9zdmc+", alt: "Tree", category: "nature" },
      { src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzQxNjlFMSIvPjx0ZXh0IHg9Ijc1IiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+amTwvdGV4dD48dGV4dCB4PSI3NSIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNBUjwvdGV4dD48L3N2Zz4=", alt: "Blue car", category: "car" },
      { src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzcwODA5MCIvPjx0ZXh0IHg9Ijc1IiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+PojwvdGV4dD48dGV4dCB4PSI3NSIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJVSUxESU5HPC90ZXh0Pjwvc3ZnPg==", alt: "Building", category: "building" },
      { src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzMyQ0QzMiIvPjx0ZXh0IHg9Ijc1IiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+MuDwvdGV4dD48dGV4dCB4PSI3NSIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkZMT1dFUjwvdGV4dD48L3N2Zz4=", alt: "Flower", category: "nature" },
      { src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0ZGRDcwMCIvPjx0ZXh0IHg9Ijc1IiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzAwMDAwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+amDwvdGV4dD48dGV4dCB4PSI3NSIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMwMDAwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNBUjwvdGV4dD48L3N2Zz4=", alt: "Yellow car", category: "car" },
      { src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzY5Njk2OSIvPjx0ZXh0IHg9Ijc1IiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+MiTwvdGV4dD48dGV4dCB4PSI3NSIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJSSURHRTwvdGV4dD48L3N2Zz4=", alt: "Bridge", category: "building" },
      { src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzhGQkM4RiIvPjx0ZXh0IHg9Ijc1IiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+26DP77iPPC90ZXh0Pjx0ZXh0IHg9Ijc1IiB5PSI5MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TU9VTlRBSU48L3RleHQ+PC9zdmc+", alt: "Mountain", category: "nature" },
      { src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzJGNEY0RiIvPjx0ZXh0IHg9Ijc1IiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+bozwvdGV4dD48dGV4dCB4PSI3NSIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlNUUkVFVDwvdGV4dD48L3N2Zz4=", alt: "Street", category: "building" }
    ]
  },
  {
    instruction: "Select all images with TRAFFIC LIGHTS",
    correctCategory: "traffic",
    correctAnswers: [1, 4, 7],
    images: [
      { src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzgwODA4MCIvPjx0ZXh0IHg9Ijc1IiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+bozwvdGV4dD48dGV4dCB4PSI3NSIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlJPQUQ8L3RleHQ+PC9zdmc+", alt: "Road", category: "road" },
      { src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0ZGMDAwMCIvPjx0ZXh0IHg9Ijc1IiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+apjwvdGV4dD48dGV4dCB4PSI3NSIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxJR0hUPC90ZXh0Pjwvc3ZnPg==", alt: "Traffic Light", category: "traffic" },
      { src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0ZGQTU0MyIvPjx0ZXh0IHg9Ijc1IiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+ZjDwvdGV4dD48dGV4dCB4PSI3NSIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJVUzwvdGV4dD48L3N2Zz4=", alt: "Bus", category: "vehicle" },
      { src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0MwQzBDMCIvPjx0ZXh0IHg9Ijc1IiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzAwMDAwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+agzwvdGV4dD48dGV4dCB4PSI3NSIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMwMDAwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPldBTEs8L3RleHQ+PC9zdmc+", alt: "Crosswalk", category: "road" },
      { src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzAwRkYwMCIvPjx0ZXh0IHg9Ijc1IiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzAwMDAwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+apjwvdGV4dD48dGV4dCB4PSI3NSIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMwMDAwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxJR0hUPC90ZXh0Pjwvc3ZnPg==", alt: "Traffic Light Green", category: "traffic" },
      { src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzQxNjlFMSIvPjx0ZXh0IHg9Ijc1IiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+asjwvdGV4dD48dGV4dCB4PSI3NSIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJJS0U8L3RleHQ+PC9zdmc+", alt: "Bicycle", category: "vehicle" },
      { src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0RDMTQzQyIvPjx0ZXh0IHg9Ijc1IiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+boTwvdGV4dD48dGV4dCB4PSI3NSIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlNUT1A8L3RleHQ+PC9zdmc+", alt: "Stop Sign", category: "road" },
      { src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0ZGOEMwMCIvPjx0ZXh0IHg9Ijc1IiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+apjwvdGV4dD48dGV4dCB4PSI3NSIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxJR0hUPC90ZXh0Pjwvc3ZnPg==", alt: "Traffic Light Orange", category: "traffic" },
      { src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzhCNDUxMyIvPjx0ZXh0IHg9Ijc1IiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+asjwvdGV4dD48dGV4dCB4PSI3NSIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlRSVUNLPC90ZXh0Pjwvc3ZnPg==", alt: "Truck", category: "vehicle" }
    ]
  },
  {
    instruction: "Select all images with CROSSWALKS",
    correctCategory: "crosswalk", 
    correctAnswers: [0, 3, 6],
    images: [
      { src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0ZGRkZGRiIvPjx0ZXh0IHg9Ijc1IiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzAwMDAwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+agzwvdGV4dD48dGV4dCB4PSI3NSIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMwMDAwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNST1NTPC90ZXh0Pjwvc3ZnPg==", alt: "Crosswalk", category: "crosswalk" },
      { src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzcwODA5MCIvPjx0ZXh0IHg9Ijc1IiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+agzwvdGV4dD48dGV4dCB4PSI3NSIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPldBTEs8L3RleHQ+PC9zdmc+", alt: "Sidewalk", category: "road" },
      { src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzIyOEIyMiIvPjx0ZXh0IHg9Ijc1IiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+MszwvdGV4dD48dGV4dCB4PSI3NSIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlBBUks8L3RleHQ+PC9zdmc+", alt: "Park", category: "nature" },
      { src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzAwMDAwMCIvPjx0ZXh0IHg9Ijc1IiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4pasSuKWmzwvdGV4dD48dGV4dCB4PSI3NSIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNST1NTPC90ZXh0Pjwvc3ZnPg==", alt: "Zebra Crossing", category: "crosswalk" },
      { src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzhCMDAwMCIvPjx0ZXh0IHg9Ijc1IiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+aijwvdGV4dD48dGV4dCB4PSI3NSIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlRSQUk8L3RleHQ+PC9zdmc+", alt: "Train", category: "vehicle" },
      { src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0RBQTUyMCIvPjx0ZXh0IHg9Ijc1IiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+PmzwvdGV4dD48dGV4dCB4PSI3NSIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlBMQVpBPC90ZXh0Pjwvc3ZnPg==", alt: "Plaza", category: "building" },
      { src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzJGNEY0RiIvPjx0ZXh0IHg9Ijc1IiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+auDwvdGV4dD48dGV4dCB4PSI3NSIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNST1NTPC90ZXh0Pjwvc3ZnPg==", alt: "Pedestrian Crossing", category: "crosswalk" },
      { src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzU1NkIyRiIvPjx0ZXh0IHg9Ijc1IiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+bozwvdGV4dD48dGV4dCB4PSI3NSIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkhJR0hXQVk8L3RleHQ+PC9zdmc+", alt: "Highway", category: "road" },
      { src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzQ2ODJCNCIvPjx0ZXh0IHg9Ijc1IiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+PrDwvdGV4dD48dGV4dCB4PSI3NSIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk1BTEw8L3RleHQ+PC9zdmc+", alt: "Shopping Mall", category: "building" }
    ]
  }
];




  constructor(
    private router: Router,
    private stateService: CaptchaState
  ) {}

  ngOnInit() {
  this.checkForSavedProgress();
  this.resetValidation();
  
  if (!this.stateService.hasSavedProgress()) {
    this.stateService.initializeProgress();
  }
  
  // ✅ Handle users who already completed everything
  setTimeout(() => this.handleCompletedUser(), 100);
}


// ✅ UPDATE: saveCurrentProgress method to preserve start time
private saveCurrentProgress() {
  this.stateService.saveProgress(
    this.currentStage,
    this.selectedImages,
    this.attemptCount,
    this.completedStages
    // Don't pass startTime - let service preserve the original
  );
}


  ngOnDestroy() {
    // Auto-save progress when leaving component
    this.saveCurrentProgress();
  }

  // Check if there's saved progress and show restore option
  private checkForSavedProgress() {
    if (this.stateService.hasSavedProgress()) {
      this.showRestorePrompt = true;
    }
  }

// Restore saved progress
restoreProgress() {
  const savedProgress = this.stateService.loadProgress();
  if (savedProgress) {
    this.currentStage = savedProgress.currentStage;
    this.selectedImages = [...savedProgress.selectedImages];
    
    // ✅ FIX: Cap attemptCount to maxAttempts
    this.attemptCount = Math.min(savedProgress.attemptCount, this.maxAttempts);
    
    this.completedStages = [...savedProgress.completedStages];
  }
  this.showRestorePrompt = false;
}


  // Start fresh (ignore saved progress)
  startFresh() {
    this.stateService.clearProgress();
    this.showRestorePrompt = false;
    this.resetToInitialState();
  }



  get currentChallenge(): Challenge {
    return this.challenges[this.currentStage - 1];
  }

  toggleImageSelection(index: number) {
    // Don't allow selection changes after validation shows correct answer
    if (this.showValidation && this.isCorrect) return;

    const selectedIndex = this.selectedImages.indexOf(index);
    if (selectedIndex > -1) {
      this.selectedImages.splice(selectedIndex, 1);
    } else {
      this.selectedImages.push(index);
    }
    
    // Reset validation when user changes selection
    if (this.showValidation) {
      this.resetValidation();
    }
    
    // Auto-save progress on every selection change
    this.saveCurrentProgress();
  }



validateSelection(): boolean {
  const correctAnswers = this.currentChallenge.correctAnswers;
  const selectedImages = this.selectedImages;
  
  // Convert to sets for comparison (handles duplicates and order)
  const selectedSet = new Set(selectedImages);
  const correctSet = new Set(correctAnswers);
  
  // Check if sets have same size
  if (selectedSet.size !== correctSet.size) {
    console.log('Validation failed: Different number of unique selections');
    return false;
  }
  
  // Check if every correct answer is selected
  const isValid = [...correctSet].every(answer => selectedSet.has(answer));
  
  console.log('Set-based validation:', {
    selected: [...selectedSet].sort(),
    correct: [...correctSet].sort(),
    isValid: isValid
  });
  
  return isValid;
}



nextStage() {
  if (this.selectedImages.length === 0) {
    this.showValidationMessage('Please select at least one image before proceeding.', false);
    return;
  }

  const isValid = this.validateSelection();
  
  // ✅ FIX: Only increment if not already at max
  if (this.attemptCount < this.maxAttempts) {
    this.attemptCount++;
  }

  if (isValid) {
    if (!this.completedStages.includes(this.currentStage)) {
      this.completedStages.push(this.currentStage);
    }
    
    this.showValidationMessage('Correct! Moving to next stage...', true);
    this.saveCurrentProgress();
    
    if (this.currentStage === this.totalStages) {
      this.router.navigate(['/result']);
    } else {
      this.currentStage++;
      this.resetStage(); // This resets attemptCount to 0
      this.saveCurrentProgress();
    }
    
  } else {
    const remainingAttempts = this.maxAttempts - this.attemptCount;
    
    if (remainingAttempts > 0) {
      this.showValidationMessage(
        `Incorrect selection. You have ${remainingAttempts} attempts remaining. Try again!`, 
        false
      );
      this.saveCurrentProgress();
    } else {
      // ✅ FIX: Force stage completion when max attempts reached
      if (!this.completedStages.includes(this.currentStage)) {
        this.completedStages.push(this.currentStage);
      }
      
      this.showValidationMessage(
        'Maximum attempts reached. Moving to next stage...', 
        false
      );
      
      this.saveCurrentProgress();
      
      if (this.currentStage === this.totalStages) {
        this.router.navigate(['/result']);
      } else {
        this.currentStage++;
        this.resetStage(); // This resets attemptCount to 0
        this.saveCurrentProgress();
      }
    }
  }
}





















  previousStage() {
    if (this.currentStage > 1) {
      this.currentStage--;
      this.resetStage();
      this.saveCurrentProgress();
    }
  }

  private showValidationMessage(message: string, success: boolean) {
    this.validationMessage = message;
    this.isCorrect = success;
    this.showValidation = true;
  }

  private resetValidation() {
    this.showValidation = false;
    this.validationMessage = '';
    this.isCorrect = false;
  }

  private resetStage() {
    this.selectedImages = [];
    this.attemptCount = 0;
    this.resetValidation();
  }

  private resetToInitialState() {
    this.currentStage = 1;
    this.completedStages = [];
    this.resetStage();
  }

  // Helper methods for template
  isImageCorrect(index: number): boolean {
    return this.currentChallenge.correctAnswers.includes(index);
  }

  shouldShowCorrectIndicator(index: number): boolean {
    return this.showValidation && this.isImageCorrect(index);
  }

  shouldShowIncorrectIndicator(index: number): boolean {
    return this.showValidation && !this.isCorrect && 
           this.selectedImages.includes(index) && !this.isImageCorrect(index);
  }






private handleCompletedUser() {
  // If user has completed all stages, don't allow further attempts
  if (this.completedStages.length >= this.totalStages) {
    this.router.navigate(['/result']);
    return;
  }
}











}
