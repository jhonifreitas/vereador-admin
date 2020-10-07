import { NgIf } from '@angular/common';
import { Config } from './config';

export class Social {
  id?: string;
  config: string;
  url: string;
  type: 'facebook' | 'instagram' | 'youtube' | 'linkedin';
  order: number;

  _config?: Config;
}