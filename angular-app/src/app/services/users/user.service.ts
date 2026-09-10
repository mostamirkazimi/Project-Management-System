import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../model/user/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiUrl = 'http://localhost:3000/users/';

  constructor(private readonly http: HttpClient) {}

  getMe(): Observable<User> {
    return this.http.get<User>(
      this.apiUrl + 'me',
      {
        withCredentials: true
      }
    );
  }

  getAllUsersForAdmin(): Observable<User[]> {
    return this.http.get<User[]>(
      this.apiUrl + 'admin/users',
      {
        withCredentials: true
      }
    );
  }

  findOneUser(id: number): Observable<User> {
    return this.http.get<User>(
      this.apiUrl + id,
      {
        withCredentials: true
      }
    );
  }

  

// updateUser(
//   id: number,
//   formData: FormData
// ): Observable<User> {

//   return this.http.patch<User>(
//     this.apiUrl + id,
//     formData,
//     {
//       withCredentials: true
//     }
//   );

// }

updateUser(
  id: number,
  formData: FormData
): Observable<User> {
  return this.http.patch<User>(
    this.apiUrl + id,
    formData,
    {
      withCredentials: true
    }
  );
}

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(
      this.apiUrl + id,
      {
        withCredentials: true
      }
    );
  }
}