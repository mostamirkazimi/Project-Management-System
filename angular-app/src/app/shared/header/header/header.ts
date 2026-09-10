import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuhtService } from '../../../services/auth/auht.service';
import { ToastrService } from '@iqx-limited/ngx-toastr';

@Component({
  selector: 'app-header',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  private authService = inject(AuhtService);
  private toaster = inject(ToastrService);
  private router = inject(Router)

  

  
  isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

 
 

  logout() {
    

    this.authService.logout().subscribe({
      next: (result) => {
        
        
        this.toaster.success('Logout successful','success')
        
        this.router.navigateByUrl('/login')

      },
      error: (error) => {
       
       

        this.toaster.error('Logout failed','error')
      }
    });
  }
}