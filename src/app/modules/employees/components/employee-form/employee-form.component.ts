import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { Employee } from '../../../../shared/services/employee.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    InputNumberModule,
    MultiSelectModule,
    FileUploadModule,
    ButtonModule
  ],
  templateUrl: './employee-form.component.html'
})
export class EmployeeFormComponent implements OnInit {
  @Input() employee?: Employee;
  @Output() save = new EventEmitter<Partial<Employee>>();
  @Output() cancel = new EventEmitter<void>();

  employeeForm: FormGroup;

  departments = [
    { label: 'Engineering', value: 'Engineering' },
    { label: 'Product', value: 'Product' },
    { label: 'Marketing', value: 'Marketing' },
    { label: 'Sales', value: 'Sales' },
    { label: 'HR', value: 'HR' },
    { label: 'Finance', value: 'Finance' }
  ];

  contractTypes = [
    { label: 'CDI', value: 'CDI' },
    { label: 'CDD', value: 'CDD' },
    { label: 'Stage', value: 'STAGE' },
    { label: 'Intérim', value: 'INTERIM' }
  ];

  statuses = [
    { label: 'Actif', value: 'ACTIVE' },
    { label: 'Inactif', value: 'INACTIVE' },
    { label: 'En congé', value: 'ON_LEAVE' }
  ];

  skills = [
    { label: 'Angular', value: 'Angular' },
    { label: 'React', value: 'React' },
    { label: 'Vue.js', value: 'Vue.js' },
    { label: 'JavaScript', value: 'JavaScript' },
    { label: 'TypeScript', value: 'TypeScript' }
  ];

  constructor(private fb: FormBuilder) {
    this.employeeForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?\d{10,}$/)]],
      position: ['', Validators.required],
      department: ['', Validators.required],
      joinDate: [null, Validators.required],
      status: ['ACTIVE', Validators.required],
      skills: [[]],
      contractType: ['', Validators.required],
      salary: this.fb.group({
        base: [null, [Validators.required, Validators.min(0)]],
        bonus: [null, Validators.min(0)],
        lastReview: [new Date()]
      }),
      performanceRating: [null, [Validators.min(1), Validators.max(5)]]
    });
  }

  ngOnInit() {
    if (this.employee) {
      this.employeeForm.patchValue(this.employee);
    }
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      this.save.emit(this.employeeForm.value);
    } else {
      Object.keys(this.employeeForm.controls).forEach(key => {
        const control = this.employeeForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  onFileUpload(event: any) {
    const file = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.employeeForm.patchValue({
          avatar: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  }
}
