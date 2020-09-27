import { Config } from './config';

export class Category {
  id?: string;
  config: string;
  name: string;
  text: string;

  _config?: Config;
}