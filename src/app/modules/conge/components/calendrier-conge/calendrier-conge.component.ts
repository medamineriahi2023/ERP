import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CongeNavComponent } from '../conge-nav/conge-nav.component';
import { CongeService } from '../../../../shared/services/conge.service';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  avatar: string;
  absences: any[];
}

@Component({
  selector: 'app-calendrier-conge',
  templateUrl: './calendrier-conge.component.html',
  styleUrls: ['./calendrier-conge.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    AvatarModule,
    DialogModule,
    TooltipModule,
    FullCalendarModule,
    CongeNavComponent
  ],
  providers: [DatePipe]
})
export class CalendrierCongeComponent implements OnInit {
  showEventDialog = false;
  selectedEvent: any = null;

  teamStats = {
    upcomingAbsences: 0,
    overlappingAbsences: 0,
    totalAbsences: 0
  };

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [],
    eventClick: this.handleEventClick.bind(this)
  };

  teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'John Doe',
      role: 'Developer',
      avatar: 'assets/avatars/avatar1.png',
      absences: []
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: 'Designer',
      avatar: 'assets/avatars/avatar2.png',
      absences: []
    }
  ];

  statistics = {
    totalAbsences: 0,
    pendingRequests: 0,
    overlappingAbsences: 0
  };

  constructor(
    private datePipe: DatePipe,
    private congeService: CongeService
  ) {}

  ngOnInit() {
    this.loadAbsences();
    this.updateTeamStats();
  }

  handleEventClick(info: any) {
    this.selectedEvent = info.event;
    this.showEventDialog = true;
  }

  getMemberAvailability(memberId: number): string {
    const now = new Date();
    const member = this.teamMembers.find(m => m.id === memberId);
    if (!member || !member.absences) return 'Disponible';

    const currentAbsence = member.absences.find(absence => {
      const startDate = new Date(absence.startDate);
      const endDate = new Date(absence.endDate);
      return startDate <= now && endDate >= now;
    });

    return currentAbsence ? 'Absent' : 'Disponible';
  }

  formatDate(date: Date | string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }

  private loadAbsences() {
    // Charger les congés de tous les membres de l'équipe
    Promise.all(this.teamMembers.map(member => 
      this.congeService.getConges(member.id).toPromise()
    )).then(congesArray => {
      const events: any[] = [];
      let totalAbsences = 0;
      const now = new Date();

      congesArray.forEach((conges, index) => {
        if (conges) {
          conges.forEach(conge => {
            const member = this.teamMembers[index];
            const startDate = new Date(conge.startDate);
            events.push({
              id: conge.id.toString(),
              title: `${member.name} - ${this.getCongeTypeLabel(conge.type)}`,
              start: startDate,
              end: new Date(conge.endDate),
              backgroundColor: this.getEventColor(conge.type, conge.status),
              borderColor: this.getEventColor(conge.type, conge.status),
              extendedProps: {
                member,
                conge
              }
            });

            totalAbsences++;
            if (startDate > now) {
              this.statistics.pendingRequests++;
            }
          });
        }
      });

      // Mettre à jour les statistiques
      this.statistics.totalAbsences = totalAbsences;
      this.statistics.overlappingAbsences = this.calculateOverlappingAbsences(events);

      // Mettre à jour le calendrier
      this.calendarOptions.events = events;
      this.updateTeamStats();
    });
  }

  private getCongeTypeLabel(type: string): string {
    switch (type) {
      case 'CONGE_PAYE': return 'CP';
      case 'MALADIE': return 'Maladie';
      case 'FORMATION': return 'Formation';
      case 'SANS_SOLDE': return 'SS';
      default: return 'Autre';
    }
  }

  private getEventColor(type: string, status: string): string {
    if (status === 'REFUSE') return '#ef4444';
    if (status === 'EN_ATTENTE') return '#f59e0b';

    switch (type) {
      case 'CONGE_PAYE': return '#22c55e';
      case 'MALADIE': return '#ef4444';
      case 'FORMATION': return '#3b82f6';
      case 'SANS_SOLDE': return '#a855f7';
      default: return '#64748b';
    }
  }

  private updateTeamStats() {
    const now = new Date();
    const events = this.calendarOptions.events as any[];
    
    this.teamStats.totalAbsences = events.length;
    this.teamStats.overlappingAbsences = this.calculateOverlappingAbsences(events);
    this.teamStats.upcomingAbsences = events.filter(e => {
      const startDate = new Date(e.start);
      return startDate > now;
    }).length;
  }

  private calculateOverlappingAbsences(events: any[]): number {
    let overlaps = 0;
    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        if (this.datesOverlap(
          new Date(events[i].start),
          new Date(events[i].end),
          new Date(events[j].start),
          new Date(events[j].end)
        )) {
          overlaps++;
        }
      }
    }
    return overlaps;
  }

  private datesOverlap(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
    return start1 <= end2 && start2 <= end1;
  }
}
