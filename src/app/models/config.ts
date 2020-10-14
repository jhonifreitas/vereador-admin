class Image {
  url: string;
  width: number;
  height: number;
}

export class Config {
  id?: string;
  image: Image;
  
  // WEBSITE
  title: string;
  url: string;
  keywords: string[];
  description: string;
  shareMsg: string;
  donation?: string;
  
  owner?: string;

  pixel?: string;
}