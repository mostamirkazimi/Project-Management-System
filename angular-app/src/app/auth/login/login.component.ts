// import { Component, inject } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { Router, RouterLink } from '@angular/router';

// import { Login } from '../../model/auth/auth.moddel';
// import { AuhtService } from '../../services/auth/auht.service';
// import { MessageComponent } from "../../shared/message/message.component/message.component";

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [FormsModule, RouterLink, MessageComponent],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.css',
// })
// export class LoginComponent {

//   constructor(
//     private readonly auth_service: AuhtService
//   ) {}

//   message = '';
//   messageType: 'success' | 'error' | 'warning' | 'info' = 'info';

//   // Login Object
//   loginObj: Login = {
//     email: '',
//     password: '',
//   };

//   // Show / Hide Password
//   showPassword = false;

//   router: Router = inject(Router);

//   // Toggle Password Visibility
//   togglePassword(): void {
//     this.showPassword = !this.showPassword;
//   }

//   // Login
//   login() {

//     this.auth_service.login(this.loginObj).subscribe({

//       next: (result) => {

//         this.message = 'Login is Successful!';
//         this.messageType = 'success';

//         this.router.navigateByUrl('/dashboard');

//       },

//       error: (err: any) => {

//         console.error('Login error:', err);

//         console.log('Backend error:', err.error);

//         this.message = err.error?.message || 'Login failed';
//         this.messageType = 'error';

//       }

//     });

//   }

// }
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Login } from '../../model/auth/auth.moddel';
import { AuhtService } from '../../services/auth/auht.service';

import { ToastrService } from '@iqx-limited/ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  constructor(
    private readonly auth_service: AuhtService,
    private readonly toastr: ToastrService
  ) {}

  // Login Object
  loginObj: Login = {
    email: '',
    password: '',
  };

  // Show / Hide Password
  showPassword = false;

  // Router
  router: Router = inject(Router);


  // Show / Hide Password
  togglePassword(): void {

    this.showPassword = !this.showPassword;

  }


  
  login(): void {

  
    this.auth_service.login(this.loginObj).subscribe({

      // SUCCESS
      next: (result) => {

        console.log('Login successful:', result);

        this.toastr.success(
          'Login is Successful!',
          'Success'
        );
    
        this.router.navigateByUrl('/dashboard');

      },


      // ERROR
      error: (err: any) => {

        console.error('Login error:', err);

        console.log('Backend error:', err.error);

        this.toastr.error(
          err.error?.message || 'Login failed',
          'Login Error'
        );

      }

    });

  }
    

}