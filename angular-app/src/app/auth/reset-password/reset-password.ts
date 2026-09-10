import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ResetPasswor } from '../../model/auth/auth.moddel';
import { AuhtService } from '../../services/auth/auht.service';
import { ToastrService } from '@iqx-limited/ngx-toastr';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {

  constructor(
    private readonly authService: AuhtService,
    private readonly router: Router,
    private readonly toaster:ToastrService
  ) {}

  newPassword: string = '';
  confirmPassword: string = '';

  resetPassword() {

    // گرفتن Email و OTP از sessionStorage
    const email = sessionStorage.getItem('reset_email');
    const otp = sessionStorage.getItem('reset_otp');

    if (!email || !otp) {
      this.toaster.error('Reset information is missing. Please start again.','error')
      return;
    }

    // بررسی دو Password
    if (this.newPassword !== this.confirmPassword) {
     
      this.toaster.error('Password and Confirm Password do not match.','error')
      return;
    }

    if (!this.newPassword) {
      this.toaster.warning('Please enter your new password.','warning')
      return;
    }

    // فقط newPassword به Backend ارسال می‌شود
    const resetPasswordData: ResetPasswor = {
      email: email,
      otp: otp,
      newPassword: this.newPassword
    };

    console.log('Reset password data:', resetPasswordData);

    this.authService.resetPassword(resetPasswordData).subscribe({

      next: (result) => {

        console.log(
          'Password reset successfully:',
          result
        );

        
        this.toaster.success('Password changed successfully.','success')
        this.router.navigate(['/login']) 

        // پاک کردن اطلاعات موقت
        sessionStorage.removeItem('reset_email');
        sessionStorage.removeItem('reset_otp');

        // برگشت به Login
        this.router.navigate(['/login']);
      },

      error: (error) => {

        console.error(
          'Reset password error:',
          error
        );

        console.error(
          'Backend error:',
          error.error
        );

        alert(
          error.error?.message ||
          'Unable to reset password.'
        );
      }

    });
  }
}