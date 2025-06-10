import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnChanges {
  @Input() reloadTrigger: any;
  @Input() selectedUserId: number | null = null;
  @Output() userSelected = new EventEmitter<any>();
  @Output() userDeleted = new EventEmitter<number>();


  users: any[] = [];
  loading = false;
  loadingUsers: number[] = [];

  constructor(private userService: UserService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reloadTrigger']) {
      this.loadUsers();
    }
  }

  async loadUsers() {
    this.loading = true;
    try {
      this.users = await this.userService.getAllUsers();
    } catch (err) {
      console.error('❌ Error al cargar usuarios:', err);
    } finally {
      this.loading = false;
    }
  }

  selectUser(user: any) {
    this.userSelected.emit(user);
  }
  

  async deleteUser(userId: number) {
    if (!confirm('¿Seguro que quieres eliminar este usuario?')) return;

    this.loadingUsers.push(userId);
    try {
      await this.userService.deleteUser(userId);
      this.userDeleted.emit(userId);
      this.loadUsers(); 
    } catch (err) {
      console.error('❌ Error al eliminar usuario:', err);
    } finally {
      this.loadingUsers = this.loadingUsers.filter(id => id !== userId);
    }
  }
}
