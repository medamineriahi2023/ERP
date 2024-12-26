export type CongeType = 'CONGE_PAYE' | 'MALADIE' | 'SANS_SOLDE' | 'FORMATION' | 'AUTRE';
export type UrgencyLevel = 'NORMAL' | 'URGENT';
export type CongeStatus = 'EN_ATTENTE' | 'APPROUVE' | 'REFUSE';

export interface CongeRequest {
    id?: number;
    employeeId: number;
    type: CongeType;
    startDate: Date;
    endDate: Date;
    duration: number;
    reason?: string;
    status: CongeStatus;
    urgencyLevel: UrgencyLevel;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CongeBalance {
    totalDays: number;
    remainingDays: number;
    usedDays: number;
    sickDays: number;
    upcomingRequests: number;
}
