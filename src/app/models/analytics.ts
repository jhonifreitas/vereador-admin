export class Access {
  lat: number;
  long: number;
  date: firebase.firestore.Timestamp;
}

export class Analytics {
  ip: string;
  config: string;
  access: Access[];
}