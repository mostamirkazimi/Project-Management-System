import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TeamService } from '../../../services/team/team.service';
import { Team, TeamMember } from '../../../model/team/team.model';

import { User } from '../../../model/user/user.model';
import { UserService } from '../../../services/users/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-team-view',
  standalone: true,
  imports: [FormsModule,RouterLink],
 templateUrl: './team-detail.html',
})
export class TeamViewComponent implements OnInit {

  private readonly teamService = inject(TeamService);
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);

  team: Team | null = null;

  loading = false;
  errorMessage = '';
 successMessage = '';
  users: User[] = [];
 loadingUsers = false;

  ngOnInit(): void {
    this.loadTeam();
    this.loadUsers();
  }

  loadTeam(): void {
    const id = Number(
      this.route.snapshot.paramMap.get('id'),
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
        this.loading = false;

        console.log('Team:', team);
      },

      error: (error) => {
        console.error(
          'Error loading team:',
          error,
        );

        this.errorMessage =
          error?.error?.message ||
          'Failed to load team.';

        this.loading = false;
      },
    });
  }

  loadUsers(): void {
  this.loadingUsers = true;

  this.userService.getAllUsersForAdmin().subscribe({
    next: (users) => {
      this.users = users;
      this.loadingUsers = false;

      console.log('Users:', users);
    },
    error: (error) => {
      console.error('Error loading users:', error);
      this.loadingUsers = false;
    },
  });
}

selectedUserId: number | null = null;
addingMember = false;

addMember(): void {
  if (!this.team || !this.selectedUserId) {
    return;
  }

  this.addingMember = true;
  this.errorMessage = '';

  this.teamService
    .addMember(this.team.id, {
      userId: this.selectedUserId,
    })
    .subscribe({
     next: (member) => {
  console.log('Member added successfully:', member);

  this.addingMember = false;
  this.selectedUserId = null;

  this.successMessage = 'Member added successfully.';
  this.errorMessage = '';

  this.loadTeam();

  setTimeout(() => {
    this.successMessage = '';
  }, 3000);
},

      error: (error) => {
        console.error('Error adding member:', error);

        this.errorMessage =
          error?.error?.message || 'Failed to add team member.';

        this.addingMember = false;
      },
    });
}

removingMemberId: number | null = null;

showRemoveMemberModal = false;
memberToRemove: TeamMember | null = null;

openRemoveMemberModal(member: TeamMember): void {
  this.memberToRemove = member;
  this.showRemoveMemberModal = true;
  this.errorMessage = '';
}

closeRemoveMemberModal(): void {
  if (this.removingMemberId !== null) {
    return;
  }

  this.showRemoveMemberModal = false;
  this.memberToRemove = null;
}

removeMember(): void {
  if (!this.team || !this.memberToRemove) {
    return;
  }

  const userId = this.memberToRemove.userId;

  this.removingMemberId = userId;
  this.errorMessage = '';

  this.teamService
    .removeMember(this.team.id, userId)
    .subscribe({
      next: () => {
        this.removingMemberId = null;
        this.showRemoveMemberModal = false;
        this.memberToRemove = null;

        this.loadTeam();
      },

      error: (error) => {
        console.error('Error removing member:', error);

        this.errorMessage =
          error?.error?.message ||
          'Failed to remove team member.';

        this.removingMemberId = null;
      },
    });
}


}