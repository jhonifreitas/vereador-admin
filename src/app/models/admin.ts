import { Group } from './group';
import { Permission } from './permission';

export class Admin {
  uid?: string;
  name: string;
  email: string;
  avatar?: string;
  active: boolean;
  groups: string[];
  password?: string;
  superUser: boolean;
  permissions?: string[];

  _groups?: Group[];
  _permissions?: Permission[];
}