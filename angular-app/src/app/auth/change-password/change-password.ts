import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ChangePassword } from '../../model/auth/auth.moddel';
import { AuhtService } from '../../services/auth/auht.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class ChangePasswordComponent {

  constructor(
    private readonly authService: AuhtService
  ) {}

  changePasswordObj: ChangePassword = {
    currentPassword: '',
    newPassword: ''
  };

  confirmPassword: string = '';

  changePassword() {

    // بررسی رمز جدید و Confirm Password
    if (
      this.changePasswordObj.newPassword !==
      this.confirmPassword
    ) {
      alert('New Password and Confirm Password do not match.');
      return;
    }

    // بررسی حداقل طول Password
    if (this.changePasswordObj.newPassword.length < 6) {
      alert('New Password must be at least 6 characters.');
      return;
    }

    console.log(
      'Change password data:',
      this.changePasswordObj
    );

    this.authService
      .changePassword(this.changePasswordObj)
      .subscribe({

        next: (result) => {

          console.log(
            'Password changed successfully:',
            result
          );

          alert('Password changed successfully.');

          // پاک کردن فرم
          this.changePasswordObj = {
            currentPassword: '',
            newPassword: ''
          };

          this.confirmPassword = '';
        },

        error: (error) => {

          console.error(
            'Change password error:',
            error
          );

          console.error(
            'Backend error:',
            error.error
          );

          alert(
            error.error?.message ||
            'Unable to change password.'
          );
        }

      });
  }
}