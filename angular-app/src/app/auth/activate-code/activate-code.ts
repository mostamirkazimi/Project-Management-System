import { Component } from '@angular/core';
import { VerifyOtp } from '../../model/auth/auth.moddel';
import { AuhtService } from '../../services/auth/auht.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from '@iqx-limited/ngx-toastr';

@Component({
  selector: 'app-activate-code',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './activate-code.html',
  styleUrl: './activate-code.css',
})
export class ActivateCode {

  constructor(
    private readonly authService: AuhtService,
    private readonly router: Router,
    private readonly toaster:ToastrService
  ) {}

  otp: string = '';

  accept() {

    const email = sessionStorage.getItem('reset_email');

    if (!email) {
      alert('Email not found. Please request OTP again.');
      return;
    }

    if (!this.otp || this.otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP.');
      return;
    }

    const verifyOtpData: VerifyOtp = {
      email: email,
      otp: this.otp
    };

    console.log('Verify OTP data:', verifyOtpData);

    this.authService.verifyOtp(verifyOtpData).subscribe({

      next: (result) => {

        console.log(
          'OTP verified successfully:',
          result
        );

        // ذخیره OTP برای مرحله Reset Password
        sessionStorage.setItem(
          'reset_otp',
          this.otp
        );

        console.log(
          'Saved reset OTP:',
          sessionStorage.getItem('reset_otp')
        );

        
        this.toaster.success('OTP verified successfully.','success')

        // رفتن به صفحه Reset Password
        this.router.navigate(['/reset-password']);
      },

      error: (error) => {

        console.error(
          'Verify OTP error:',
          error
        );

        console.error(
          'Backend error:',
          error.error
        );

        alert(
          error.error?.message ||
          'Invalid or expired OTP'
        );
      }

    });
  }
}