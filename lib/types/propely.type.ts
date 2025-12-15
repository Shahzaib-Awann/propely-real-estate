/**
 * Query params for the properties page and filter component
 */
export interface PropertiesQueryParamsInterface {
  search?: string;
  page?: string;
  limit?: string;
  type?: string;
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  property?: string;
  bedroom?: string;
}



/** 
 * A single property item from the properties API. 
 */
export interface ListPropertyInterface {
  id: number;
  title: string;
  img: string | null;
  bedRooms: number;
  bathRooms: number;
  price: string;
  address: string;
  location: string;
  ptype: string;
  ltype: string;
  latitude: string;
  longitude: string;
}



/** 
 * Pagination and filter metadata returned with property listings.
 */
export interface ListPropertiesMeta {
  search?: string;
  location?: string;
  minPrice: number;
  maxPrice: number;
  bedroom?: number;
  page: number;
  limit: number;
  totalPage: number;
  totalItems: number;
}



/**
 * Full properties API response
 */
export interface PropertiesResponse {
  meta: ListPropertiesMeta;
  items: ListPropertyInterface[];
}



/**
 * Feature attached to a property
 */
interface PostFeature {
  title: string;
  description: string;
}



/**
 * Seller / owner information
 */
interface PostSelletInfo {
  id: number;
  avatar: string | null;
  name: string;
  email: string;
}



/**
 * Full Single property details response
 */
export interface SinglePostDetails {
  id: number;
  title: string;
  description: string;

  price: string;
  size: number;

  images: string[];

  bedRooms: number;
  bathroom: number;
  features: PostFeature[];

  utilities: string;
  petPolicy: string;
  incomePolicy: string;

  address: string;
  city: string;
  latitude: string;
  longitude: string;
  ptype: string;
  ltype: string;
  school: string | null;
  bus: string | null;
  restaurant: string | null;

  sellerInfo: PostSelletInfo | null
  
  createdAt: string;
  updatedAt: string | null;
}
