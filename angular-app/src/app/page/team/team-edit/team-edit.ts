import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { TeamService } from '../../../services/team/team.service';
import {
  Team,
  UpdateTeamRequest,
} from '../../../model/team/team.model';


import { Project } from '../../../model/project/project.model';
import { ProjectsService } from '../../../services/project/projects.service';

@Component({
  selector: 'app-team-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './team-edit.html',
})
export class TeamEdit implements OnInit {

  private readonly teamService = inject(TeamService);
  private readonly projectsService = inject(ProjectsService
  );
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  team: Team | null = null;

  projects: Project[] = [];

  loading = false;
  loadingProjects = false;
  saving = false;

  errorMessage = '';
  successMessage = '';

  form: UpdateTeamRequest = {
    name: '',
    description: '',
    projectId: 0,
  };


  ngOnInit(): void {
    this.loadTeam();
    this.loadProjects();
  }


  // =========================
  // Load Team
  // =========================

  loadTeam(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!id) {
      this.errorMessage = 'Invalid team ID.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.teamService.getById(id).subscribe({

      next: (team) => {

        this.team = team;

        this.form = {
          name: team.name,
          description: team.description || '',
          projectId: team.projectId,
        };

        this.loading = false;

      },

      error: (error) => {

        console.error(
          'Error loading team:',
          error
        );

        this.errorMessage =
          error?.error?.message ||
          'Failed to load team.';

        this.loading = false;

      },

    });
  }


  // =========================
  // Load Projects
  // =========================

  loadProjects(): void {

    this.loadingProjects = true;

    this.projectsService.getAll().subscribe({

      next: (projects) => {

        this.projects = projects;
        this.loadingProjects = false;

      },

      error: (error) => {

        console.error(
          'Error loading projects:',
          error
        );

        this.loadingProjects = false;

      },

    });
  }


  // =========================
  // Update Team
  // =========================

  updateTeam(): void {

    if (!this.team) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.form.name?.trim()) {

      this.errorMessage =
        'Team name is required.';

      return;
    }

    if (!this.form.projectId) {

      this.errorMessage =
        'Please select a project.';

      return;
    }

    this.saving = true;

    const data: UpdateTeamRequest = {
      name: this.form.name.trim(),
      description:
        this.form.description?.trim() || '',
      projectId: Number(
        this.form.projectId
      ),
    };

    this.teamService
      .update(this.team.id, data)
      .subscribe({

        next: (updatedTeam) => {

          this.team = updatedTeam;

          this.successMessage =
            'Team updated successfully.';

          this.saving = false;

        },

        error: (error) => {

          console.error(
            'Error updating team:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Failed to update team.';

          this.saving = false;

        },

      });
  }


  // =========================
  // Cancel
  // =========================

  cancel(): void {

    if (!this.team) {
      return;
    }

    this.router.navigate([
      '/teams',
      this.team.id,
    ]);

  }

}