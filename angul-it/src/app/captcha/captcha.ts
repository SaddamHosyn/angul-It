import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
export class CaptchaComponent implements OnInit {
  currentStage = 1;
  totalStages = 3;
  selectedImages: number[] = [];
  
  // Validation properties
  showValidation = false;
  validationMessage = '';
  isCorrect = false;
  attemptCount = 0;
  maxAttempts = 3;
  
  challenges: Challenge[] = [
    {
      instruction: "Select all images with CARS",
      correctCategory: "car",
      correctAnswers: [0, 2, 5],
      images: [
        { src: "https://picsum.photos/150/150?random=1", alt: "Car", category: "car" },
        { src: "https://picsum.photos/150/150?random=2", alt: "Tree", category: "nature" },
        { src: "https://picsum.photos/150/150?random=3", alt: "Car", category: "car" },
        { src: "https://picsum.photos/150/150?random=4", alt: "Building", category: "building" },
        { src: "https://picsum.photos/150/150?random=5", alt: "Flower", category: "nature" },
        { src: "https://picsum.photos/150/150?random=6", alt: "Car", category: "car" },
        { src: "https://picsum.photos/150/150?random=7", alt: "Bridge", category: "building" },
        { src: "https://picsum.photos/150/150?random=8", alt: "Mountain", category: "nature" },
        { src: "https://picsum.photos/150/150?random=9", alt: "Street", category: "building" }
      ]
    },
    {
      instruction: "Select all images with TRAFFIC LIGHTS",
      correctCategory: "traffic",
      correctAnswers: [1, 4, 7],
      images: [
        { src: "https://picsum.photos/150/150?random=10", alt: "Road", category: "road" },
        { src: "https://picsum.photos/150/150?random=11", alt: "Traffic Light", category: "traffic" },
        { src: "https://picsum.photos/150/150?random=12", alt: "Bus", category: "vehicle" },
        { src: "https://picsum.photos/150/150?random=13", alt: "Crosswalk", category: "road" },
        { src: "https://picsum.photos/150/150?random=14", alt: "Traffic Light", category: "traffic" },
        { src: "https://picsum.photos/150/150?random=15", alt: "Bicycle", category: "vehicle" },
        { src: "https://picsum.photos/150/150?random=16", alt: "Stop Sign", category: "road" },
        { src: "https://picsum.photos/150/150?random=17", alt: "Traffic Light", category: "traffic" },
        { src: "https://picsum.photos/150/150?random=18", alt: "Truck", category: "vehicle" }
      ]
    },
    {
      instruction: "Select all images with CROSSWALKS",
      correctCategory: "crosswalk",
      correctAnswers: [0, 3, 6],
      images: [
        { src: "https://picsum.photos/150/150?random=19", alt: "Crosswalk", category: "crosswalk" },
        { src: "https://picsum.photos/150/150?random=20", alt: "Sidewalk", category: "road" },
        { src: "https://picsum.photos/150/150?random=21", alt: "Park", category: "nature" },
        { src: "https://picsum.photos/150/150?random=22", alt: "Crosswalk", category: "crosswalk" },
        { src: "https://picsum.photos/150/150?random=23", alt: "Train", category: "vehicle" },
        { src: "https://picsum.photos/150/150?random=24", alt: "Plaza", category: "building" },
        { src: "https://picsum.photos/150/150?random=25", alt: "Crosswalk", category: "crosswalk" },
        { src: "https://picsum.photos/150/150?random=26", alt: "Highway", category: "road" },
        { src: "https://picsum.photos/150/150?random=27", alt: "Mall", category: "building" }
      ]
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.resetValidation();
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
  }

  validateSelection(): boolean {
    const correctAnswers = this.currentChallenge.correctAnswers;
    const selectedSorted = [...this.selectedImages].sort();
    const correctSorted = [...correctAnswers].sort();
    
    // Check if arrays are equal
    return selectedSorted.length === correctSorted.length && 
           selectedSorted.every((val, index) => val === correctSorted[index]);
  }

  nextStage() {
    if (this.selectedImages.length === 0) {
      this.showValidationMessage('Please select at least one image before proceeding.', false);
      return;
    }

    const isValid = this.validateSelection();
    this.attemptCount++;

    if (isValid) {
      this.showValidationMessage('Correct! Moving to next stage...', true);
      
      // Advance after short delay to show success message
      setTimeout(() => {
        if (this.currentStage === this.totalStages) {
          this.router.navigate(['/result']);
        } else {
          this.currentStage++;
          this.resetStage();
        }
      }, 1500);
      
    } else {
      const remainingAttempts = this.maxAttempts - this.attemptCount;
      
      if (remainingAttempts > 0) {
        this.showValidationMessage(
          `Incorrect selection. You have ${remainingAttempts} attempts remaining. Try again!`, 
          false
        );
      } else {
        this.showValidationMessage(
          'Maximum attempts reached. Moving to next stage...', 
          false
        );
        
        // Force advance after max attempts
        setTimeout(() => {
          if (this.currentStage === this.totalStages) {
            this.router.navigate(['/result']);
          } else {
            this.currentStage++;
            this.resetStage();
          }
        }, 2000);
      }
    }
  }

  previousStage() {
    if (this.currentStage > 1) {
      this.currentStage--;
      this.resetStage();
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
}
