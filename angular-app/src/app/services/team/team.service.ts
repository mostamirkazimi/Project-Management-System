import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Team,
  CreateTeamRequest,
  UpdateTeamRequest,
  TeamMember,
  AddTeamMemberRequest,
} from '../../model/team/team.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/team`;

  getAll(): Observable<Team[]> {
    return this.http.get<Team[]>(
      this.apiUrl,
      {
        withCredentials: true,
      },
    );
  }

  getById(id: number): Observable<Team> {
    return this.http.get<Team>(
      `${this.apiUrl}/${id}`,
      {
        withCredentials: true,
      },
    );
  }

  create(
    data: CreateTeamRequest,
  ): Observable<Team> {
    return this.http.post<Team>(
      this.apiUrl,
      data,
      {
        withCredentials: true,
      },
    );
  }

  update(
    id: number,
    data: UpdateTeamRequest,
  ): Observable<Team> {
    return this.http.patch<Team>(
      `${this.apiUrl}/${id}`,
      data,
      {
        withCredentials: true,
      },
    );
  }

  delete(id: number): Observable<{
    message: string;
  }> {
    return this.http.delete<{
      message: string;
    }>(
      `${this.apiUrl}/${id}`,
      {
        withCredentials: true,
      },
    );
  }

  addMember(
    teamId: number,
    data: AddTeamMemberRequest,
  ): Observable<TeamMember> {
    return this.http.post<TeamMember>(
      `${this.apiUrl}/${teamId}/members`,
      data,
      {
        withCredentials: true,
      },
    );
  }

  getMembers(
    teamId: number,
  ): Observable<TeamMember[]> {
    return this.http.get<TeamMember[]>(
      `${this.apiUrl}/${teamId}/members`,
      {
        withCredentials: true,
      },
    );
  }

  removeMember(
    teamId: number,
    userId: number,
  ): Observable<{
    message: string;
  }> {
    return this.http.delete<{
      message: string;
    }>(
      `${this.apiUrl}/${teamId}/members/${userId}`,
      {
        withCredentials: true,
      },
    );
  }
}