export default interface House {
  id: string;
  image: string;
  address: string;
  price: number;
  link: string;
  baths?: string;
  beds: string;
  availableDate?: string;
  source: string;
}
export interface Sublet {
  id: string;
  poster: string;
  userId: string;
  address: string;
  price: number;
  bedsSubleased: number;
  bedsTotal: number;
  baths: number;
  availableDate: Date;
  endDate?: Date;
  photos: string[];
  description: string;
  contact: string;
}

export interface UserData {
  uid: string;
  name: string;
  email: string;
  posted?: boolean;
}
