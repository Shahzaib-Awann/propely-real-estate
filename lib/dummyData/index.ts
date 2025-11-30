
export interface listDataInterface {
  id: number
  title: string
  img: string
  bedRooms: number
  bathRooms: number
  price: number
  address: string
  latitude: number
  longitude: number
}

export interface SinglePostDataInterface {
  id: number;
  title: string;
  price: number;
  images: string[];
  bedRooms: number;
  bathroom: number;
  size: number;
  latitude: number;
  longitude: number;
  city: string;
  address: string;
  school: string;
  bus: string;
  restaurant: string;
  description: string;
}

export interface UserDataInterface {
  id: number;
  name: string;
  img: string;
}


export const listData: listDataInterface[] = [
  {
    id: 1,
    title: 'A Great Apartment Next to the Beach',
    img: "https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    bedRooms: 2,
    bathRooms: 1,
    price: 1000,
    address: "456 Park Avenue, London",
    latitude: 51.5074,
    longitude: -0.1278,
  },
  {
    id: 2,
    title: 'Modern Studio in Downtown',
    img: "https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    bedRooms: 1,
    bathRooms: 1,
    price: 800,
    address: "123 Main Street, New York",
    latitude: 40.7128,
    longitude: -74.0060,
  },
  {
    id: 3,
    title: 'Spacious Family House with Garden',
    img: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    bedRooms: 4,
    bathRooms: 3,
    price: 2500,
    address: "789 Elm Street, Los Angeles",
    latitude: 34.0522,
    longitude: -118.2437,
  },
  {
    id: 4,
    title: 'Cozy Cottage in the Countryside',
    img: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    bedRooms: 3,
    bathRooms: 2,
    price: 1200,
    address: "12 Maple Lane, Oxford",
    latitude: 51.7520,
    longitude: -1.2577,
  },
  {
    id: 5,
    title: 'Luxury Penthouse with City View',
    img: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    bedRooms: 3,
    bathRooms: 2,
    price: 4000,
    address: "22 Sunset Boulevard, Los Angeles",
    latitude: 34.0522,
    longitude: -118.2437,
  },
  {
    id: 6,
    title: 'Charming Apartment Near Park',
    img: "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    bedRooms: 1,
    bathRooms: 1,
    price: 1100,
    address: "89 Green Street, London",
    latitude: 51.5074,
    longitude: -0.1278,
  },
  {
    id: 7,
    title: 'Modern Loft with Open Space',
    img: "https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    bedRooms: 1,
    bathRooms: 1,
    price: 900,
    address: "55 River Road, New York",
    latitude: 40.7128,
    longitude: -74.0060,
  },
  {
    id: 8,
    title: 'Rustic Villa with Private Pool',
    img: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    bedRooms: 5,
    bathRooms: 4,
    price: 5000,
    address: "100 Ocean Drive, Miami",
    latitude: 25.7617,
    longitude: -80.1918,
  },
  {
    id: 9,
    title: 'Elegant Townhouse in Quiet Neighborhood',
    img: "https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    bedRooms: 3,
    bathRooms: 2,
    price: 2000,
    address: "33 Oak Avenue, Boston",
    latitude: 42.3601,
    longitude: -71.0589,
  },
  {
    id: 10,
    title: 'Bright Apartment with Balcony View',
    img: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    bedRooms: 2,
    bathRooms: 1,
    price: 1300,
    address: "77 Pine Street, Chicago",
    latitude: 41.8781,
    longitude: -87.6298,
  },
];

export const singlePostData: SinglePostDataInterface = {
  id: 1,
  title: "Beautiful Apartment",
  price: 1200,
  images: [
    "https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/2467285/pexels-photo-2467285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  ],
  bedRooms: 2,
  bathroom: 1,
  size: 861,
  latitude: 51.5074,
  longitude: -0.1278,
  city: "London",
  address: "1234 Broadway St",
  school: "250m away",
  bus: "100m away",
  restaurant: "50m away",
  description:
    "Future alike hill pull picture swim magic chain seed engineer nest outer raise bound easy poetry gain loud weigh me recognize farmer bare danger. actually put square leg vessels earth engine matter key cup indeed body film century shut place environment were stage vertical roof bottom lady function breeze darkness beside tin view local breathe carbon swam declared magnet escape has from pile apart route coffee storm someone hold space use ahead sheep jungle closely natural attached part top grain your grade trade corn salmon trouble new bend most teacher range anybody every seat fifteen eventually",
};

export const userData: UserDataInterface = {
  id: 1,
  name: "John Doe",
  img: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
};