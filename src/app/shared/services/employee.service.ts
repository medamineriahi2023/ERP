import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  joinDate: Date;
  position: string;
  department: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'PENDING';
  phone: string;
  address: string;
  contractType: string;
  skills: string[];
  projects: string[];
  performanceRating: number;
  avatar?: string;
  salary: {
    base: number;
    bonus: number;
    lastReview: Date;
  };
  training: {
    completed: number;
    inProgress: number;
    planned: number;
  };
  certifications: {
    active: number;
    expired: number;
    upcoming: number;
  };
  performance: {
    lastReviewDate: Date;
    currentScore: number;
    previousScore: number;
    trend: 'UP' | 'DOWN' | 'STABLE';
  };
}

export interface PerformanceReview {
  id: number;
  employeeId: number;
  reviewerId: number;
  date: Date;
  metrics: {
    category: string;
    score: number;
    weight: number;
    comments: string;
  }[];
  overallScore: number;
  strengths: string[];
  improvements: string[];
  goals: string[];
  comments: string;
  status: 'DRAFT' | 'SUBMITTED' | 'ACKNOWLEDGED';
}

export interface Training {
  id: number;
  employeeId: number;
  title: string;
  description: string;
  type: 'TECHNICAL' | 'SOFT_SKILLS' | 'MANAGEMENT' | 'COMPLIANCE';
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED';
  progress: number;
  startDate: Date;
  endDate: Date;
  duration: number;
  provider: string;
  certification?: string;
  skills: string[];
}

export interface Certification {
  id: number;
  employeeId: number;
  name: string;
  issuer: string;
  dateObtained: Date;
  expiryDate?: Date;
  status: 'ACTIVE' | 'EXPIRED';
  skills: string[];
}

export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  hireDate: Date;
  position: string;
  department: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'PENDING';
  phoneNumber: string;
  address: string;
  salary?: number;
  skills?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private mockEmployees: Employee[] = [
    {
      id: 1,
      firstName: 'Sarah',
      lastName: 'Martin',
      email: 'sarah.martin@company.com',
      birthDate: new Date('1990-01-01'),
      joinDate: new Date('2022-03-15'),
      position: 'Senior Developer',
      department: 'Engineering',
      status: 'ACTIVE',
      phone: '+212 6XX-XXXXXX',
      address: '123 Main St',
      contractType: 'CDI',
      skills: ['Angular', 'TypeScript', 'Node.js'],
      projects: [],
      performanceRating: 4.5,
      avatar: 'https://example.com/avatar.jpg',
      salary: {
        base: 45000,
        bonus: 5000,
        lastReview: new Date('2023-12-01')
      },
      training: {
        completed: 5,
        inProgress: 2,
        planned: 1
      },
      certifications: {
        active: 3,
        expired: 1,
        upcoming: 1
      },
      performance: {
        lastReviewDate: new Date('2023-11-15'),
        currentScore: 4.5,
        previousScore: 4.2,
        trend: 'UP'
      }
    },
    {
      id: 2,
      firstName: 'Mohammed',
      lastName: 'Alami',
      email: 'mohammed.alami@company.com',
      birthDate: new Date('1992-01-01'),
      joinDate: new Date('2021-06-01'),
      position: 'Product Manager',
      department: 'Product',
      status: 'ACTIVE',
      phone: '+212 6XX-XXXXXX',
      address: '456 Elm St',
      contractType: 'CDI',
      skills: ['Product Strategy', 'Agile', 'User Research'],
      projects: [],
      performanceRating: 4.8,
      salary: {
        base: 52000,
        bonus: 8000,
        lastReview: new Date('2023-11-15')
      },
      training: {
        completed: 0,
        inProgress: 0,
        planned: 0
      },
      certifications: {
        active: 0,
        expired: 0,
        upcoming: 0
      },
      performance: {
        lastReviewDate: new Date(),
        currentScore: 0,
        previousScore: 0,
        trend: 'STABLE'
      }
    }
  ];

  private mockReviews: PerformanceReview[] = [];
  private mockTrainings: Training[] = [];
  private mockCertifications: Certification[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize mock reviews
    this.mockReviews = [
      {
        id: 1,
        employeeId: 1,
        reviewerId: 2,
        date: new Date('2023-11-15'),
        metrics: [
          {
            category: 'Qualité du travail',
            score: 4.5,
            weight: 0.25,
            comments: 'Excellent travail, attention aux détails'
          }
        ],
        overallScore: 4.5,
        strengths: ['Technical expertise', 'Team collaboration'],
        improvements: ['Documentation'],
        goals: ['Learn new framework'],
        comments: 'Excellent performance overall',
        status: 'ACKNOWLEDGED'
      }
    ];

    // Initialize mock trainings
    this.mockTrainings = [
      {
        id: 1,
        employeeId: 1,
        title: 'Angular Advanced',
        description: 'Advanced Angular concepts',
        type: 'TECHNICAL',
        status: 'IN_PROGRESS',
        progress: 60,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-02-28'),
        duration: 40,
        provider: 'TechAcademy',
        skills: ['Angular', 'RxJS']
      }
    ];

    // Initialize mock certifications
    this.mockCertifications = [
      {
        id: 1,
        employeeId: 1,
        name: 'Angular Certified Developer',
        issuer: 'Google',
        dateObtained: new Date('2023-06-15'),
        expiryDate: new Date('2025-06-15'),
        status: 'ACTIVE',
        skills: ['Angular', 'TypeScript']
      }
    ];
  }

  // Employee CRUD operations
  getEmployees(): Observable<Employee[]> {
    return of(this.mockEmployees).pipe(delay(500));
  }

  getEmployee(id: number): Observable<Employee | undefined> {
    const employee = this.mockEmployees.find(e => e.id === id);
    return of(employee).pipe(delay(500));
  }

  createEmployee(employeeDto: CreateEmployeeDto): Observable<Employee> {
    const newEmployee: Employee = {
      id: Math.max(...this.mockEmployees.map(e => e.id)) + 1,
      firstName: employeeDto.firstName,
      lastName: employeeDto.lastName,
      email: employeeDto.email,
      birthDate: employeeDto.birthDate,
      joinDate: employeeDto.hireDate,
      position: employeeDto.position,
      department: employeeDto.department,
      status: employeeDto.status,
      phone: employeeDto.phoneNumber,
      address: employeeDto.address,
      contractType: 'CDI',
      skills: employeeDto.skills || [],
      projects: [],
      performanceRating: 0,
      avatar: undefined,
      salary: {
        base: employeeDto.salary || 0,
        bonus: 0,
        lastReview: new Date()
      },
      training: {
        completed: 0,
        inProgress: 0,
        planned: 0
      },
      certifications: {
        active: 0,
        expired: 0,
        upcoming: 0
      },
      performance: {
        lastReviewDate: new Date(),
        currentScore: 0,
        previousScore: 0,
        trend: 'STABLE'
      }
    };

    this.mockEmployees.push(newEmployee);
    return of(newEmployee).pipe(delay(500));
  }

  updateEmployee(id: number, updates: Partial<Employee>): Observable<Employee> {
    const index = this.mockEmployees.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Employee not found');

    this.mockEmployees[index] = { ...this.mockEmployees[index], ...updates };
    return of(this.mockEmployees[index]).pipe(delay(500));
  }

  deleteEmployee(id: number): Observable<void> {
    const index = this.mockEmployees.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Employee not found');

    this.mockEmployees.splice(index, 1);
    return of(void 0).pipe(delay(500));
  }

  // Performance Review operations
  getEmployeeReviews(employeeId: number): Observable<PerformanceReview[]> {
    const reviews = this.mockReviews.filter(r => r.employeeId === employeeId);
    return of(reviews).pipe(delay(500));
  }

  createReview(review: Omit<PerformanceReview, 'id'>): Observable<PerformanceReview> {
    const newReview = {
      ...review,
      id: Math.max(...this.mockReviews.map(r => r.id)) + 1
    };
    this.mockReviews.push(newReview);
    return of(newReview).pipe(delay(500));
  }

  // Training operations
  getEmployeeTrainings(employeeId: number): Observable<Training[]> {
    const trainings = this.mockTrainings.filter(t => t.employeeId === employeeId);
    return of(trainings).pipe(delay(500));
  }

  updateTrainingProgress(id: number, progress: number): Observable<Training> {
    const index = this.mockTrainings.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Training not found');

    this.mockTrainings[index] = {
      ...this.mockTrainings[index],
      progress,
      status: progress >= 100 ? 'COMPLETED' : 'IN_PROGRESS'
    };
    return of(this.mockTrainings[index]).pipe(delay(500));
  }

  // Certification operations
  getEmployeeCertifications(employeeId: number): Observable<Certification[]> {
    const certifications = this.mockCertifications.filter(c => c.employeeId === employeeId);
    return of(certifications).pipe(delay(500));
  }

  addCertification(cert: Omit<Certification, 'id'>): Observable<Certification> {
    const newCert = {
      ...cert,
      id: Math.max(...this.mockCertifications.map(c => c.id)) + 1
    };
    this.mockCertifications.push(newCert);
    return of(newCert).pipe(delay(500));
  }

  getEmployeeStats(): Observable<EmployeeStats> {
    const stats: EmployeeStats = {
      totalEmployees: this.mockEmployees.length,
      activeEmployees: this.mockEmployees.filter(e => e.status === 'ACTIVE').length,
      onLeave: this.mockEmployees.filter(e => e.status === 'ON_LEAVE').length,
      departmentDistribution: {},
      contractTypeDistribution: {},
      averagePerformance: 0
    };

    // Calculate department distribution
    this.mockEmployees.forEach(emp => {
      stats.departmentDistribution[emp.department] = (stats.departmentDistribution[emp.department] || 0) + 1;
    });

    // Calculate contract type distribution
    this.mockEmployees.forEach(emp => {
      stats.contractTypeDistribution[emp.contractType] = (stats.contractTypeDistribution[emp.contractType] || 0) + 1;
    });

    // Calculate average performance
    const totalPerformance = this.mockEmployees.reduce((sum, emp) => sum + (emp.performanceRating || 0), 0);
    stats.averagePerformance = totalPerformance / this.mockEmployees.length;

    return of(stats).pipe(delay(500));
  }
}

export interface EmployeeStats {
  totalEmployees: number;
  activeEmployees: number;
  onLeave: number;
  departmentDistribution: { [key: string]: number };
  contractTypeDistribution: { [key: string]: number };
  averagePerformance: number;
}
