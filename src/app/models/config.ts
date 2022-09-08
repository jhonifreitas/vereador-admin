export class Config {
  id?: string;
  image: {
    mobile?: string;
    desktop?: string;
  };
  
  // WEBSITE
  title: string;
  titleFeatured: string;
  keywords: string[];
  description: string;
  shareMsg: string;
  donation?: string;
  
  url?: string;
  domain?: string;

  owner?: string;

  pixel?: string;

  constructor() {
    this.image = {
      mobile: null,
      desktop: null
    };
  }
}

