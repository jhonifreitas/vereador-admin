import { Config } from './config';

export class Tab {
  id?: string;
  config: string;
  name: string;
  text: string;
  order: number;

  _config?: Config;
}