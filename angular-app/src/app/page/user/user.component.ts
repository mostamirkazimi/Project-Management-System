

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  PLATFORM_ID,
  inject
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { User } from '../../model/user/user.model';
import { UserService } from '../../services/users/user.service';

import { Header } from '../../shared/header/header/header';
import { Footer } from '../../shared/footer/footer/footer';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    RouterLink,
    Header,
    Footer
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit, AfterViewInit {

  user: User | null = null;

  private readonly platformId = inject(PLATFORM_ID);

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    console.log('🟢 1 - USER ngOnInit');

    console.log(
      '🟢 Platform:',
      isPlatformBrowser(this.platformId)
        ? 'BROWSER'
        : 'SERVER'
    );

    // فقط Browser
    if (!isPlatformBrowser(this.platformId)) {

      console.log('🟡 SSR: skip loadUser()');

      return;
    }

    console.log('🟢 Browser: calling loadUser()');

    this.loadUser();
  }

  ngAfterViewInit(): void {

    console.log('🔵 2 - USER ngAfterViewInit');

    setTimeout(() => {

      console.log(
        '🔵 3 - USER AfterViewInit + 1 second',
        this.user
      );

    }, 1000);
  }

  private loadUser(): void {

    console.log('🟠 Calling getMe()...');

    this.userService.getMe().subscribe({

      next: (response: User) => {

        console.log(
          '🟢 USER RESPONSE:',
          response
        );

        this.user = response;

        console.log(
          '🟢 USER ASSIGNED:',
          this.user
        );

        // 🔥 به Angular می‌گوییم View را دوباره بررسی کن
        this.cdr.detectChanges();

        console.log(
          '🟢 USER CHANGE DETECTION COMPLETED'
        );

        setTimeout(() => {

          console.log(
            '🟢 USER AFTER 1 SECOND:',
            this.user
          );

        }, 1000);

      },

      error: (error) => {

        console.error(
          '🔴 GET ME ERROR:',
          error
        );

        if (error.status === 401) {

          this.router.navigateByUrl('/login');

        }

      }

    });
  }

  changePassword(): void {

    this.router.navigateByUrl('/change-password');

  }

}