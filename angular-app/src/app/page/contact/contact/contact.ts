import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ContactService } from '../../../services/contact/contact.service';


@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {

  contactForm: FormGroup;

  submitted = false;
  isSubmitting = false;

  constructor(private readonly fb: FormBuilder, private readonly contactService: ContactService) {

    this.contactForm = this.fb.group({

      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z\u0600-\u06FF\s]+$/),
        ],
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email,
        ],
      ],

      phone: [
        '',
        [
          Validators.pattern(/^[0-9+\-\s()]{7,20}$/),
        ],
      ],

      subject: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],

      message: [
        '',
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(1000),
        ],
      ],

    });
  }

  // =========================================================
  // Getters
  // =========================================================

  get name() {
    return this.contactForm.get('name')!;
  }

  get email() {
    return this.contactForm.get('email')!;
  }

  get phone() {
    return this.contactForm.get('phone')!;
  }

  get subject() {
    return this.contactForm.get('subject')!;
  }

  get message() {
    return this.contactForm.get('message')!;
  }

  // =========================================================
  // Error Helper
  // =========================================================

  showError(control: any): boolean {
    return control.invalid &&
      (control.touched ||
        control.dirty ||
        this.submitted);
  }


  showSuccessModal = false;
  showErrorModal = false;
  errorMessage = '';
  // =========================================================
  // Submit
  // =========================================================

  submit(): void {
  this.submitted = true;

  if (this.contactForm.invalid) {
    this.contactForm.markAllAsTouched();
    return;
  }

  this.isSubmitting = true;
  this.showSuccessModal = false;
  this.showErrorModal = false;

  this.contactService.sendMessage(this.contactForm.value).subscribe({
    next: (response) => {
      this.isSubmitting = false;

      this.contactForm.reset();
      this.submitted = false;

      this.showSuccessModal = true;
    },

    error: (error) => {
      this.isSubmitting = false;

      console.error('Contact form error:', error);

      this.errorMessage =
        error.error?.message ||
        'Failed to send your message. Please try again.';

      this.showErrorModal = true;
    },
  });
}

closeSuccessModal(): void {
  this.showSuccessModal = false;
}

closeErrorModal(): void {
  this.showErrorModal = false;
}

}