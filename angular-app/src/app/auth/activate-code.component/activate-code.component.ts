import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuhtService } from '../../services/auth/auht.service';
import { readonly } from '@angular/forms/signals';
import { ToastrService } from '@iqx-limited/ngx-toastr';

@Component({
  selector: 'app-activate-code',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './activate-code.component.html',
  styleUrl: './activate-code.component.css',
})
export class ActivateCodeComponent {

  constructor(
    private readonly authService: AuhtService,
    private readonly router: Router,
    readonly toaster:ToastrService
  ) {}

  otp: string = '';

  message = '';
  messageType: 'success' | 'error' | 'warning' | 'info' = 'info';

clearMessage(): void {

    this.message = '';

  }

  verifyOtp() {

    // Email را خودمان از sessionStorage می‌گیریم
    const email = sessionStorage.getItem('registration_email');

    if (!email) {
      this.toaster.error('Registration session expired. Please signup again.','error')
      this.router.navigate(['/signup']);
      return;
    }

    console.log('Registration email:', email);
    console.log('OTP:', this.otp);

    // ارسال Email + OTP به Backend
    this.authService.verifyRegistrationOtp({
      email: email,
      otp: this.otp
    }).subscribe({

      next: (result) => {

        console.log(
          'Registration verification successful:',
          result
        );

        // دیگر به Email نیاز نداریم
        sessionStorage.removeItem('registration_email');

        this.toaster.success('Account created successfully.',"success")
       

        // رفتن به Login
        this.router.navigate(['/login']);
      },

      error: (error) => {

        console.error(
          'OTP verification error:',
          error
        );

        console.error(
          'Backend error:',
          error.error
        );

        alert(
          error.error?.message ||
          'Invalid or expired verification code.'
        );
      }

    });
  }
}