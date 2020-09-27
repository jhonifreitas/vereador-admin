import { Config } from './config';

export class Social {
  id?: string;
  config: string;
  url: string;
  type: 'facebook' | 'instagram' | 'youtube' | 'linkedin';

  _config?: Config;
}