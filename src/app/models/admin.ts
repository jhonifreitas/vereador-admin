import { Group } from './group';
import { Config } from './config';
import { Permission } from './permission';

export class Admin {
  uid?: string;
  name: string;
  email: string;
  config?: string;
  avatar?: string;
  active: boolean;
  groups: string[];
  password?: string;
  superUser: boolean;
  permissions?: string[];

  _config?: Config;
  _groups?: Group[];
  _permissions?: Permission[];
}