import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

import {
  ChangePassword,
  ForgotPassword,
  Login,
  LoginResponse,
  LogOut,
  RefreshToken,
  ResetPasswor,
  Signup,
  VerifyOtp
} from '../../model/auth/auth.moddel';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuhtService {

  constructor(private readonly http: HttpClient) {}

  private apiUrl = `${environment.apiUrl}/auth/`;
  // =========================================================
  // Login
  // =========================================================

  
  login(loginData: Login): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(
    this.apiUrl + 'login',
    loginData,
    {
      withCredentials: true
    }
  );
}

  // =========================================================
  // Get Access Token
  // =========================================================

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // =========================================================
  // Get Refresh Token
  // =========================================================

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  // =========================================================
  // Sign Up
  // =========================================================

 signUp(formData: FormData): Observable<any> {
  return this.http.post<any>(
    this.apiUrl + 'register',
    formData
  );
}

  // =========================================================
  // Verify Registration OTP
  // =========================================================

  verifyRegistrationOtp(data: {
    email: string;
    otp: string;
  }) {
    return this.http.post(
      `${this.apiUrl}verify-registration-otp`,
      data
    );
  }

  // =========================================================
  // Change Password
  // =========================================================

  changePassword(
    changePasswordData: ChangePassword
  ): Observable<ChangePassword> {

    return this.http.post<ChangePassword>(
      this.apiUrl + 'change-password',
      changePasswordData
    );
  }

  // =========================================================
  // Forgot Password
  // =========================================================

  forgotPassword(
    forgotPasswordData: ForgotPassword
  ): Observable<ForgotPassword> {

    return this.http.post<ForgotPassword>(
      this.apiUrl + 'forgot-password',
      forgotPasswordData
    );
  }

  // =========================================================
  // Verify OTP
  // =========================================================

  verifyOtp(
    verifyOtpData: VerifyOtp
  ): Observable<VerifyOtp> {

    return this.http.post<VerifyOtp>(
      this.apiUrl + 'verify-otp',
      verifyOtpData
    );
  }

  // =========================================================
  // Reset Password
  // =========================================================

  resetPassword(
    resetPasswordData: ResetPasswor
  ): Observable<ResetPasswor> {

    return this.http.post<ResetPasswor>(
      this.apiUrl + 'reset-password',
      resetPasswordData
    );
  }

  // =========================================================
  // Refresh Token
  // =========================================================

  // refresh(
  //   refreshData: RefreshToken
  // ): Observable<RefreshToken> {

  //   return this.http.post<RefreshToken>(
  //     this.apiUrl + 'refresh',
  //     refreshData
  //   );
  // }

  refresh(): Observable<any> {

  return this.http.post<any>(
    this.apiUrl + 'refresh',
    {},
    {
      withCredentials: true
    }
  );
}

  // =========================================================
  // Logout
  // =========================================================

  

  logout(): Observable<any> {

  return this.http.post<any>(
    this.apiUrl + 'logout',
    {},
    {
      withCredentials: true
    }
    
  );

  
}

  

  // =========================================================
  // Admin Users
  // =========================================================

  getAllUsersForAdmin(): Observable<Signup[]> {
    return this.http.get<Signup[]>(
      this.apiUrl + 'admin/users'
    );
  }

  // =========================================================
  // Clear Authentication
  // =========================================================

  clearTokens(): void {

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

  }

  // =========================================================
  // Guard
  // =========================================================
 
  


checkAuth(): Observable<any> {
  return this.http.get<any>(
    this.apiUrl + 'me',
    {
      withCredentials: true
    }
  );
}
}