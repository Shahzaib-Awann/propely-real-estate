import { SerializedEditorState } from "lexical";



/*
 * CORE ENUM / UNION TYPES
 */
export type PropertyType = "apartment" | "house" | "condo" | "land";
export type ListingType = "buy" | "rent";
export type UtilitiesPolicyType = "owner" | "tenant" | "shared";
export type PetPolicyType = "allowed" | "not-allowed";



/*
 * SHARED TYPES
 */
export interface PostFeature {
  id?: number;
  title: string;
  description: string;
}

export interface PostSellerInfo {
  id: number;
  avatar: string | null;
  name: string;
  email: string;
}

export interface PostImages {
  id?: number;
  imageUrl: string;
  publicId: string;
}

export interface Permissions {
  canEdit: boolean;
  canDelete: boolean;
  canBookmark: boolean;
}



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



/*
 * LISTING (CARD VIEW)
 */
export interface ListPropertyInterface {
  id: string;
  sellerId: number;

  title: string;
  img: string;

  bedRooms: number;
  bathRooms: number;

  price: string;
  address: string;
  location: string;

  ptype: PropertyType;
  ltype: ListingType;

  latitude: string;
  longitude: string;

  isSaved: boolean;
  permissions: Permissions;
}



/*
 * LISTING META / RESPONSE
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

export interface PropertiesResponse {
  meta: ListPropertiesMeta;
  items: ListPropertyInterface[];
}



/*
 * SINGLE PROPERTY (DETAIL VIEW)
 */
export interface SinglePostSEO {
  id: string;
  title: string;

  city: string;
  address: string;

  price: string;

  bedRooms: number;
  bathroom: number;

  ptype: PropertyType;
  ltype: ListingType;

  images: string[];
}

export interface SinglePostDetails {
  id: string;

  title: string;
  description: string | SerializedEditorState;

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

  ptype: PropertyType;
  ltype: ListingType;

  school: number | null;
  bus: number | null;
  restaurant: number | null;

  sellerInfo: PostSellerInfo | null;

  isSaved: boolean;
  permissions: Permissions;

  createdAt: string;
  updatedAt: string | null;
}



/*
 * EDIT VIEW (EXTENDED)
 */
export interface SinglePostDetailsForEdit {
  id: string;

  title: string;
  description: string | SerializedEditorState;

  price: string;
  size: number;

  state: string;

  images: PostImages[];

  bedRooms: number;
  bathroom: number;

  features: PostFeature[];

  utilities: UtilitiesPolicyType;
  petPolicy: PetPolicyType;
  incomePolicy: string;

  address: string;
  city: string;

  latitude: string;
  longitude: string;

  ptype: PropertyType;
  ltype: ListingType;

  school: number | null;
  bus: number | null;
  restaurant: number | null;

  createdAt: string;
  updatedAt: string | null;
}