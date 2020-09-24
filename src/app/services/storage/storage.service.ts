import { Injectable } from '@angular/core';

import { Admin } from 'src/app/models/admin';
import { Group } from 'src/app/models/group';
import { Permission } from 'src/app/models/permission';
import { FBGroupService } from '../firebase/group/group.service';
import { FBPermissionService } from '../firebase/permission/permission.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private fbGroup: FBGroupService,
    private fbPermission: FBPermissionService,
  ) {}

  // USER
  async setUser(data: Admin) {
    const groups = [];
    const permissions = [];

    if(data.permissions){
      for(const permission_id of data.permissions) {
        await this.fbPermission.get(permission_id).toPromise().then(permission => {
          permissions.push(permission);
        })
      }
      this.setPermissions(permissions)
    }
    if(data.groups){
      for(const group_id of data.groups) {
        await this.fbGroup.get(group_id).toPromise().then(async group => {
          for(const permission_id of group.permissions) {
            await this.fbPermission.get(permission_id).toPromise().then(permission => {
              group._permissions.push(permission);
            })
          }
          groups.push(group);
        })
      }
      this.setGroups(groups)
    }
    localStorage.setItem('user', JSON.stringify(data));
  }
  getUser(): Admin {
    return JSON.parse(localStorage.getItem('user'));
  }
  removeUser() {
    localStorage.removeItem('user');
  }

  // GROUP
  setGroups(data: Group[]) {
    localStorage.setItem('groups', JSON.stringify(data));
  }
  getGroups(): Group[] {
    return JSON.parse(localStorage.getItem('groups')) || [];
  }
  removeGroups() {
    localStorage.removeItem('groups');
  }

  // PERMISSIONS
  setPermissions(data: Permission[]) {
    localStorage.setItem('permissions', JSON.stringify(data));
  }
  getPermissions(): Permission[] {
    return JSON.parse(localStorage.getItem('permissions')) || [];
  }
  removePermissions() {
    localStorage.removeItem('permissions');
  }
}
