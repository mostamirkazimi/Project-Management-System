export interface Login{
    email: string;
    password:string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface Signup{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    password: string;
    profileImage?: string;
    
}

export interface ChangePassword{
    currentPassword: string;
    newPassword: string;
}

export interface ForgotPassword{
    email: string;
}

export interface LogOut{
    refereshToken: string;
}

export interface RefreshToken{
    refreshToken: string;
}

export interface  ResetPasswor{
    email: string;
    otp: string;
    newPassword: string;
}

export interface VerifyOtp {
  email: string;
  otp: string;
}