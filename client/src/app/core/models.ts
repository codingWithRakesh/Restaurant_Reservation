export interface User { _id: string; name: string; email: string; isOnline?: boolean }

export interface Restaurant {
  _id: string; name: string; address: string; phone: string; email: string;
  opening_Time: string; closing_Time: string; description: string; image: string;
}

export interface Table {
  _id: string; tableNumber: number; capacity: number; floor: number;
  status: 'available' | 'reserved'; image: string; restaurant: string;
}

export interface Food { _id: string; name: string; description: string; price: number; image: string }

/** Shape returned by GET /reservation/user */
export interface UserReservation {
  _id: string; date: string; time: string; status: 'pending' | 'confirmed' | 'cancelled';
  restaurant: { _id: string; name: string; address: string };
  table: { _id: string; tableNumber: number; capacity: number; floor: number };
}

/** Shape returned by GET /reservation/restaurant */
export interface RestaurantReservation {
  _id: string; date: string; time: string; status: 'pending' | 'confirmed' | 'cancelled';
  user: { _id: string; name: string; email: string };
  table: { _id: string; tableNumber: number; capacity: number; floor: number };
}
