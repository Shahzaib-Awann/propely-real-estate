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