import { Component, OnInit, inject } from '@angular/core';

import { Team } from '../../model/team/team.model';
import { TeamService } from '../../services/team/team.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './team.html',
})
export class TeamListComponent implements OnInit {

  private readonly teamService = inject(TeamService);

  teams: Team[] = [];

  loading = false;
  errorMessage = '';

  router:Router = inject(Router)

  ngOnInit(): void {
    this.loadTeams();
  }

  goToCreateTeam(): void {
  this.router.navigate(['/teams/create']);
}

goToViewTeam(id: number): void {
  this.router.navigate(['/teams', id]);
}

  loadTeams(): void {
    this.loading = true;
    this.errorMessage = '';

    this.teamService.getAll().subscribe({
      next: (teams) => {
        this.teams = teams;
        this.loading = false;

        console.log('Teams:', teams);
      },

      error: (error) => {
        console.error('Error loading teams:', error);

        this.errorMessage =
          'Failed to load teams.';

        this.loading = false;
      },
    });
  }

 deletingTeamId: number | null = null;

showDeleteModal = false;
teamToDelete: Team | null = null;

openDeleteModal(team: Team): void {
  this.teamToDelete = team;
  this.showDeleteModal = true;
  this.errorMessage = '';
}

closeDeleteModal(): void {
  if (this.deletingTeamId !== null) {
    return;
  }

  this.showDeleteModal = false;
  this.teamToDelete = null;
}

deleteTeam(): void {
  if (!this.teamToDelete) {
    return;
  }

  const id = this.teamToDelete.id;

  this.deletingTeamId = id;
  this.errorMessage = '';

  this.teamService.delete(id).subscribe({
    next: () => {
      this.deletingTeamId = null;
      this.showDeleteModal = false;
      this.teamToDelete = null;

      this.loadTeams();
    },

    error: (error) => {
      console.error('Error deleting team:', error);

      this.errorMessage =
        error?.error?.message || 'Failed to delete team.';

      this.deletingTeamId = null;
    },
  });
}
}