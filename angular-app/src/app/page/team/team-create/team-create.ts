import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TeamService } from '../../../services/team/team.service';
import { ProjectsService } from '../../../services/project/projects.service';
import { Project } from '../../../model/project/project.model';
import { CreateTeamRequest } from '../../../model/team/team.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-team-create',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl: './team-create.html',
})
export class TeamCreateComponent implements OnInit {

  private readonly teamService = inject(TeamService);
  private readonly projectsService = inject(ProjectsService);

  projects: Project[] = [];

  team: CreateTeamRequest = {
    name: '',
    description: '',
    projectId: 0,
  };

  loadingProjects = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadProjects();
  }

  router:Router = inject(Router)

  loadProjects(): void {
    this.loadingProjects = true;
    this.errorMessage = '';

    this.projectsService.getAll().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.loadingProjects = false;

        console.log('Projects:', projects);
      },

      error: (error) => {
        console.error(
          'Error loading projects:',
          error,
        );

        this.errorMessage =
          'Failed to load projects.';

        this.loadingProjects = false;
      },
    });
  }

  createTeam(): void {
this.errorMessage = '';

if (!this.team.name.trim()) {
this.errorMessage = 'Team name is required.';
return;
}

if (this.team.projectId <= 0) {
this.errorMessage = 'Please select a project.';
return;
}

this.teamService.create(this.team).subscribe({
next: (createdTeam) => {
  console.log(
    'Team created successfully:',
    createdTeam,
  );

  alert('Team created successfully!');

  this.router.navigate(['/teams']);
},

error: (error) => {
  console.error(
    'Error creating team:',
    error,
  );

  this.errorMessage =
    error?.error?.message ||
    'Failed to create team.';
},


});
}

}