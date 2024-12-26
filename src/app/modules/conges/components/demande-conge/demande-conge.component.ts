import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextarea } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CongesService } from '../../../../shared/services/conges.service';

interface TypeConge {
  label: string;
  value: string;
}

@Component({
  selector: 'app-demande-conge',
  templateUrl: './demande-conge.component.html',
  styleUrls: ['./demande-conge.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ButtonModule,
    DropdownModule,
    CalendarModule,
    InputTextarea,
    FileUploadModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class DemandeCongeComponent implements OnInit {
  demandeForm: FormGroup;
  typesConge: TypeConge[] = [
    { label: 'Congé Annuel', value: 'ANNUEL' },
    { label: 'Congé Maladie', value: 'MALADIE' },
    { label: 'Congé Exceptionnel', value: 'EXCEPTIONNEL' }
  ];
  minDate: Date = new Date();
  selectedFile: File | null = null;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private congesService: CongesService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.demandeForm = this.fb.group({
      type: ['', Validators.required],
      periode: [null, Validators.required],
      commentaire: ['']
    });
  }

  ngOnInit() {
    // Initialisation supplémentaire si nécessaire
  }

  onFileSelect(event: any) {
    const file = event.files[0];
    if (file) {
      if (file.type === 'application/pdf' && file.size <= 1000000) {
        this.selectedFile = file;
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Le fichier doit être un PDF de moins de 1MB'
        });
      }
    }
  }

  removeFile() {
    this.selectedFile = null;
  }

  calculateWorkingDays(startDate: Date, endDate: Date): number {
    let count = 0;
    const curDate = new Date(startDate.getTime());
    while (curDate <= endDate) {
      const dayOfWeek = curDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
      curDate.setDate(curDate.getDate() + 1);
    }
    return count;
  }

  onSubmit() {
    if (this.demandeForm.valid) {
      this.isSubmitting = true;
      const formValues = this.demandeForm.value;
      const [dateDebut, dateFin] = formValues.periode;
      
      const demande = {
        type: formValues.type,
        dateDebut: dateDebut,
        dateFin: dateFin,
        jours: this.calculateWorkingDays(dateDebut, dateFin),
        commentaire: formValues.commentaire,
        pieceJointe: this.selectedFile ? this.selectedFile.name : undefined
      };

      this.congesService.soumettreDemandeConge(demande).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Votre demande de congé a été soumise avec succès'
          });
          this.router.navigate(['/conges/liste']);
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Une erreur est survenue lors de la soumission de votre demande'
          });
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      Object.keys(this.demandeForm.controls).forEach(key => {
        const control = this.demandeForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}
