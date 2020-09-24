import { Permission } from './permission';

export class Group {
  id?: string;
  name: string;
  permissions?: string[];

  _permissions?: Permission[];
}