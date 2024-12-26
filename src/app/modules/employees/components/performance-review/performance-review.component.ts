import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { InputTextarea } from 'primeng/inputtextarea';
import { RatingModule } from 'primeng/rating';
import { TimelineModule } from 'primeng/timeline';

@Component({
  selector: 'app-performance-review',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    ChartModule,
    InputTextarea,
    RatingModule,
    TimelineModule
  ],
  templateUrl: './performance-review.component.html'
})
export class PerformanceReviewComponent implements OnInit {
  reviewForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.reviewForm = this.fb.group({
      metrics: this.fb.array([])
    });
  }

  ngOnInit() {
    this.initializeMetrics();
  }

  private initializeMetrics() {
    const metrics = [
      { category: 'Performance Technique', weight: 0.3 },
      { category: 'Communication', weight: 0.2 },
      { category: 'Leadership', weight: 0.2 },
      { category: 'Initiative', weight: 0.15 },
      { category: 'Travail d\'équipe', weight: 0.15 }
    ];

    const metricsArray = this.reviewForm.get('metrics') as FormArray;
    metrics.forEach(metric => {
      metricsArray.push(this.fb.group({
        category: [metric.category],
        weight: [metric.weight],
        score: [0],
        comments: ['']
      }));
    });
  }

  calculateOverallScore(): number {
    const metricsArray = this.reviewForm.get('metrics') as FormArray;
    if (metricsArray.length === 0) return 0;

    return metricsArray.controls.reduce((total, control) => {
      const weight = control.get('weight')?.value || 0;
      const score = control.get('score')?.value || 0;
      return total + (weight * score);
    }, 0);
  }

  getScoreColor(score: number): string {
    if (score >= 4) return 'text-green-500';
    if (score >= 3) return 'text-blue-500';
    if (score >= 2) return 'text-yellow-500';
    return 'text-red-500';
  }

  onSubmit() {
    if (this.reviewForm.valid) {
      console.log(this.reviewForm.value);
    }
  }
}
