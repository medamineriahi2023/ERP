import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map, switchMap, tap } from 'rxjs/operators';
import { EmployeeService } from './employee.service';

export interface CongeRequest {
  id: number;
  employeeId: number;
  type: 'CONGE_PAYE' | 'MALADIE' | 'SANS_SOLDE' | 'FORMATION' | 'AUTRE';
  startDate: Date;
  endDate: Date;
  duration: number;
  status: 'EN_ATTENTE' | 'APPROUVE' | 'REFUSE';
  reason?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
  approverComment?: string;
  urgencyLevel?: 'NORMAL' | 'URGENT';
  replacementEmployee?: number;
  impactOnTraining?: boolean;
  trainingAdjustments?: {
    trainingId: number;
    newEndDate: Date;
    currentProgress?: number;
  }[];
}

export interface CongeBalance {
  totalDays: number;
  usedDays: number;
  remainingDays: number;
  sickDays: number;
  trainingDays: number;
  upcomingRequests: number;
}

@Injectable({
  providedIn: 'root'
})
export class CongeService {
  private mockConges: CongeRequest[] = [];

  constructor(private employeeService: EmployeeService) {
    this.initializeMockData();
  }

  private initializeMockData() {
    this.mockConges = [
      {
        id: 1,
        employeeId: 1,
        type: 'CONGE_PAYE',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-20'),
        duration: 5,
        status: 'APPROUVE',
        reason: 'Vacances d\'hiver',
        createdAt: new Date('2023-12-20'),
        updatedAt: new Date('2023-12-21'),
        urgencyLevel: 'NORMAL',
        impactOnTraining: true,
        trainingAdjustments: [
          {
            trainingId: 1,
            newEndDate: new Date('2024-03-15'),
            currentProgress: 60
          }
        ]
      }
    ];
  }

  getConges(employeeId: number): Observable<CongeRequest[]> {
    return of(this.mockConges.filter(c => c.employeeId === employeeId))
      .pipe(delay(500));
  }

  getCongeBalance(employeeId: number): Observable<CongeBalance> {
    const balance: CongeBalance = {
      totalDays: 30,
      usedDays: this.calculateUsedDays(employeeId),
      remainingDays: 0,
      sickDays: 5,
      trainingDays: 10,
      upcomingRequests: this.mockConges.filter(c => 
        c.employeeId === employeeId && 
        c.status === 'EN_ATTENTE'
      ).length
    };
    balance.remainingDays = balance.totalDays - balance.usedDays;
    return of(balance).pipe(delay(500));
  }

  private calculateUsedDays(employeeId: number): number {
    return this.mockConges
      .filter(c => c.employeeId === employeeId && c.status === 'APPROUVE')
      .reduce((sum, c) => sum + c.duration, 0);
  }

  submitCongeRequest(request: Partial<CongeRequest>): Observable<CongeRequest> {
    const newRequest: CongeRequest = {
      id: Math.max(...this.mockConges.map(c => c.id)) + 1,
      employeeId: request.employeeId!,
      type: request.type!,
      startDate: request.startDate!,
      endDate: request.endDate!,
      duration: request.duration!,
      status: 'EN_ATTENTE',
      reason: request.reason,
      attachments: request.attachments || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      urgencyLevel: request.urgencyLevel || 'NORMAL',
      replacementEmployee: request.replacementEmployee,
      impactOnTraining: false,
      trainingAdjustments: []
    };

    // Check if leave request impacts any training
    return this.checkTrainingImpact(newRequest).pipe(
      tap(requestWithImpact => {
        this.mockConges.push(requestWithImpact);
      })
    );
  }

  private checkTrainingImpact(request: CongeRequest): Observable<CongeRequest> {
    return this.employeeService.getEmployeeTrainings(request.employeeId).pipe(
      map(trainings => {
        const impactedTrainings = trainings.filter(t => 
          t.status === 'IN_PROGRESS' &&
          this.datesOverlap(
            request.startDate,
            request.endDate,
            t.startDate,
            t.endDate
          )
        );

        if (impactedTrainings.length > 0) {
          request.impactOnTraining = true;
          request.trainingAdjustments = impactedTrainings.map(t => ({
            trainingId: t.id,
            newEndDate: new Date(t.endDate.getTime() + 
              (request.endDate.getTime() - request.startDate.getTime())),
            currentProgress: t.progress
          }));
        }

        return request;
      })
    );
  }

  private datesOverlap(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
    return start1 <= end2 && start2 <= end1;
  }

  updateCongeRequest(id: number, updates: Partial<CongeRequest>): Observable<CongeRequest> {
    const index = this.mockConges.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Demande de congé non trouvée');
    }

    this.mockConges[index] = {
      ...this.mockConges[index],
      ...updates,
      updatedAt: new Date()
    };

    // If request is approved and impacts training, update training dates
    if (updates.status === 'APPROUVE' && this.mockConges[index].impactOnTraining) {
      this.mockConges[index].trainingAdjustments?.forEach(adjustment => {
        this.employeeService.updateTrainingProgress(
          adjustment.trainingId,
          adjustment.currentProgress || 0
        ).subscribe();
      });
    }

    return of(this.mockConges[index]).pipe(delay(500));
  }

  cancelCongeRequest(id: number): Observable<void> {
    const index = this.mockConges.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Demande de congé non trouvée');
    }

    this.mockConges.splice(index, 1);
    return of(void 0).pipe(delay(500));
  }

  getPublicHolidays(year: number): Observable<Date[]> {
    // Mock public holidays for the given year
    const holidays = [
      new Date(`${year}-01-01`), // New Year
      new Date(`${year}-05-01`), // Labor Day
      new Date(`${year}-07-30`), // Throne Day
      new Date(`${year}-08-14`), // Oued Ed-Dahab Day
      new Date(`${year}-08-20`), // Revolution Day
      new Date(`${year}-08-21`), // Youth Day
      new Date(`${year}-11-06`), // Green March
      new Date(`${year}-11-18`)  // Independence Day
    ];
    return of(holidays).pipe(delay(500));
  }
}
