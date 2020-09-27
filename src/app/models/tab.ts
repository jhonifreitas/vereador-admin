import { Config } from './config';

export class Tab {
  id?: string;
  config: string;
  name: string;
  text: string;

  _config?: Config;
}