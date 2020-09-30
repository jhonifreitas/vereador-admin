export class Access {
  lat: number;
  long: number;
  date: firebase.firestore.Timestamp;
}

export class Analytics {
  id: string;
  ip: string;
  config: string;
  access: Access[];
}