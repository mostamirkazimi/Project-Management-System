import { Component, inject, OnInit, PLATFORM_ID } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { UserService } from "../../../services/users/user.service";
import { isPlatformBrowser } from "@angular/common";


@Component({
  selector: 'app-edit-profile',
  imports: [
    ReactiveFormsModule,
    RouterLink,
   
],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css',
})
export class EditProfileComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router)

  editForm!: FormGroup;

  userId!: number;

  profileImage: string | null = null;

  selectedImage: string | null = null;

  selectedFile: File | null = null;


  ngOnInit(): void {

    this.editForm = this.fb.group({

      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50)
        ]
      ],

      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{10,15}$/)
        ]
      ],

      address: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(255)
        ]
      ],

      city: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100)
        ]
      ]

    });


    if (isPlatformBrowser(this.platformId)) {

      this.userService.getMe().subscribe({

        next: (user) => {

          this.userId = user.id;

          if (user.profileImage) {

            this.profileImage =
              'http://localhost:3000' + user.profileImage;

          } else {

            this.profileImage = null;

          }

          this.editForm.patchValue({

            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            address: user.address,
            city: user.city

          });

        },

        error: (error) => {

          console.error('❌ GET ME ERROR:', error);

        }

      });

    }

  }


  onImageSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {

      console.error('❌ Only image files are allowed');

      input.value = '';

      return;
    }

    if (file.size > 5 * 1024 * 1024) {

      console.error('❌ Image must be less than 5MB');

      input.value = '';

      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();

    reader.onload = () => {

      this.selectedImage = reader.result as string;

    };

    reader.readAsDataURL(file);

  }


  removeSelectedImage(): void {

    this.selectedImage = null;
    this.selectedFile = null;

  }


  // onSubmit(): void {

  //   if (this.editForm.invalid) {

  //     this.editForm.markAllAsTouched();

  //     return;

  //   }

  //   if (!this.userId) {

  //     console.error('❌ USER ID NOT FOUND');

  //     return;

  //   }


  //   const formData = new FormData();

  //   formData.append(
  //     'firstName',
  //     this.editForm.get('firstName')?.value
  //   );

  //   formData.append(
  //     'lastName',
  //     this.editForm.get('lastName')?.value
  //   );

  //   formData.append(
  //     'email',
  //     this.editForm.get('email')?.value
  //   );

  //   formData.append(
  //     'phone',
  //     this.editForm.get('phone')?.value
  //   );

  //   formData.append(
  //     'address',
  //     this.editForm.get('address')?.value
  //   );

  //   formData.append(
  //     'city',
  //     this.editForm.get('city')?.value
  //   );


  //   if (this.selectedFile) {

  //     formData.append(
  //       'profileImage',
  //       this.selectedFile
  //     );

  //   }


  //   this.userService.updateUser(
  //     this.userId,
  //     formData
  //   ).subscribe({

  //     next: (updatedUser) => {

  //       console.log(
  //         '✅ USER UPDATED:',
  //         updatedUser
  //       );

  //       if (updatedUser.profileImage) {

  //         this.profileImage =
  //           'http://localhost:3000' +
  //           updatedUser.profileImage;

  //       }

  //       this.selectedImage = null;
  //       this.selectedFile = null;

  //     },

  //     error: (error) => {

  //       console.error(
  //         '❌ UPDATE ERROR:',
  //         error
  //       );

  //     }

  //   });

  // }
  onSubmit(): void {

  console.log('🔥 SAVE CHANGES CLICKED');

  // =========================================================
  // Validate Form
  // =========================================================

  if (this.editForm.invalid) {

    console.log('❌ FORM IS INVALID');

    this.editForm.markAllAsTouched();

    return;
  }


  // =========================================================
  // Check User ID
  // =========================================================

  if (!this.userId) {

    console.error('❌ USER ID NOT FOUND');

    return;
  }


  // =========================================================
  // Create FormData
  // =========================================================

  const formData = new FormData();


  // =========================================================
  // Add Form Fields
  // =========================================================

  formData.append(
    'firstName',
    this.editForm.get('firstName')?.value
  );

  formData.append(
    'lastName',
    this.editForm.get('lastName')?.value
  );

  formData.append(
    'email',
    this.editForm.get('email')?.value
  );

  formData.append(
    'phone',
    this.editForm.get('phone')?.value
  );

  formData.append(
    'address',
    this.editForm.get('address')?.value
  );

  formData.append(
    'city',
    this.editForm.get('city')?.value
  );


  // =========================================================
  // Add Profile Image
  // =========================================================

  const input =
    document.getElementById(
      'profileImage'
    ) as HTMLInputElement;

  if (input?.files && input.files.length > 0) {

    const file = input.files[0];

    console.log(
      '🖼️ UPLOADING IMAGE:',
      file.name
    );

    formData.append(
      'profileImage',
      file
    );

  }


  // =========================================================
  // Debug FormData
  // =========================================================

  console.log(
    '📤 SENDING USER UPDATE'
  );

  formData.forEach((value, key) => {

    console.log(
      `📦 ${key}:`,
      value
    );

  });


  // =========================================================
  // Send Request
  // =========================================================

  this.userService
    .updateUser(
      this.userId,
      formData
    )
    .subscribe({

      next: (updatedUser) => {

        console.log(
          '✅ USER UPDATED SUCCESSFULLY:',
          updatedUser
        );


        // =====================================================
        // Update Profile Image Immediately
        // =====================================================

        if (updatedUser.profileImage) {

          this.profileImage =
            'http://localhost:3000' +
            updatedUser.profileImage;

        }


        // Remove temporary preview

        this.selectedImage = null;


        // Success message

       this.router.navigateByUrl('/users')

         
      },

      error: (error) => {

        console.error(
          '❌ UPDATE USER ERROR:',
          error
        );

        alert(
          'Failed to update profile.'
        );

      }

    });

}


  get firstName() {
    return this.editForm.get('firstName');
  }

  get lastName() {
    return this.editForm.get('lastName');
  }

  get email() {
    return this.editForm.get('email');
  }

  get phone() {
    return this.editForm.get('phone');
  }

  get address() {
    return this.editForm.get('address');
  }

  get city() {
    return this.editForm.get('city');
  }

}



