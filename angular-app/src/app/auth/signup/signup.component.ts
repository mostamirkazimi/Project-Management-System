import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Signup } from '../../model/auth/auth.moddel';
import { AuhtService } from '../../services/auth/auht.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  constructor(
    private readonly authService: AuhtService,
    private readonly router: Router
  ) {}

  cpassword: string = '';

   message = '';
  messageType: 'success' | 'error' | 'warning' | 'info' = 'info';

clearMessage(): void {

    this.message = '';

  }

  // فایل انتخاب‌شده
  selectedFile: File | null = null;

  signupObj: Signup = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    password: '',
    profileImage: ''
  };


  // ==============================
  // انتخاب عکس
  // ==============================

  onFileSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {

      this.selectedFile = input.files[0];

      console.log('Selected file:', this.selectedFile);

    }
  }


  // ==============================
  // Signup
  // ==============================

  signup(): void {

    // 1. بررسی Password
    if (this.signupObj.password !== this.cpassword) {

      this.message = 'Password and Confirm Password do not match.';
      this.messageType = 'error';

      return;
    }


    // 2. ساخت FormData
    const formData = new FormData();

    formData.append(
      'firstName',
      this.signupObj.firstName
    );

    formData.append(
      'lastName',
      this.signupObj.lastName
    );

    formData.append(
      'email',
      this.signupObj.email
    );

    formData.append(
      'phone',
      this.signupObj.phone
    );

    formData.append(
      'address',
      this.signupObj.address || ''
    );

    formData.append(
      'city',
      this.signupObj.city
    );

    formData.append(
      'password',
      this.signupObj.password
    );


    // 3. اضافه کردن عکس
    if (this.selectedFile) {

      formData.append(
        'profileImage',
        this.selectedFile
      );

    }


    // 4. نمایش اطلاعات FormData برای تست
    console.log('Signup FormData:');

    formData.forEach((value, key) => {
      console.log(key, value);
    });


    // 5. ارسال به Backend
    this.authService.signUp(formData).subscribe({

      next: (result) => {

        console.log(
          'Registration started:',
          result
        );


        // ذخیره Email برای OTP
        sessionStorage.setItem(
          'registration_email',
          this.signupObj.email
            .trim()
            .toLowerCase()
        );


       
        this.message='Verification code sent to your email.'
        this.messageType='info'


        // رفتن به صفحه OTP
        this.router.navigate([
          '/activate-code-registration'
        ]);

      },


      error: (error) => {

        console.error(
          'Signup error:',
          error
        );

        console.error(
          'Backend error:',
          error.error
        );


        
       this.message= error.error?.message ||  'Error creating account.'
       this.messageType='error'
  

      }

    });

  }

}