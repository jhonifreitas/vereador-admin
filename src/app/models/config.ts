export class Config {
  id?: string;
  image: {
    mobile?: string;
    desktop?: string;
  };
  
  // WEBSITE
  title: string;
  titleFeatured: string;
  url: string;
  keywords: string[];
  description: string;
  shareMsg: string;
  donation?: string;
  
  owner?: string;

  pixel?: string;

  constructor() {
    this.image = {
      mobile: null,
      desktop: null
    };
  }
}

