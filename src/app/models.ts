export default interface House {
  id: string;
  image: string;
  address: string;
  price: number;
  link: string;
  baths?: string;
  beds: number;
  availableDate?: string;
  source: string;
}
