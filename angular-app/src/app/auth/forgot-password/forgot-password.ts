import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ForgotPassword as ForgotPasswordModel } from '../../model/auth/auth.moddel';
import { AuhtService } from '../../services/auth/auht.service';
import { ToastrService } from '@iqx-limited/ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule,RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {

  constructor(
    private readonly authService: AuhtService,
    private readonly router: Router,
    private readonly toaster:ToastrService
  ) {}

  forgotPasswordObj: ForgotPasswordModel = {
    email: ''
  };

  resetCode() {

    console.log(
      'Forgot password data:',
      this.forgotPasswordObj
    );

    this.authService
      .forgotPassword(this.forgotPasswordObj)
      .subscribe({

        next: (result) => {

          console.log(
            'Forgot password successful:',
            result
          );

          // ذخیره Email برای مرحله Verify OTP
          sessionStorage.setItem(
            'reset_email',
            this.forgotPasswordObj.email.trim()
          );

          console.log(
            'Reset email saved:',
            sessionStorage.getItem('reset_email')
          );


          this.toaster.success('OTP has been sent to your email.','success')

          // رفتن به صفحه وارد کردن OTP
          this.router.navigate(['/activate-code']);
        },

        error: (error) => {

          console.error(
            'Forgot password error:',
            error
          );

          console.error(
            'Backend error:',
            error.error
          );

          alert(
            error.error?.message ||
            'Unable to send OTP'
          );
        }

      });
  }
}