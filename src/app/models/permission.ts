export class Permission {
  id?: string;
  page: string;
  role: 'can-list' | 'can-view' | 'can-add' | 'can-update' | 'can-delete';
}