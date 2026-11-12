export type VehicleType = 'car' | 'motorcycle' | 'scooter' | 'bicycle';
export type VehicleStatus = 'active' | 'maintenance' | 'inactive';
export type PropulsionType = 'combustion' | 'electric' | 'human' | 'hybrid';

export interface Vehicle {
  id: string;
  type: VehicleType;
  nickname: string;
  brand: string;
  model: string;
  year?: number;
  plate?: string;
  odometer?: number;
  odometerUnit?: 'km' | 'mi';
  propulsion?: PropulsionType;
  status: VehicleStatus;
  accent: string;
  notes?: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  title: string;
  date: string;
  amount: number;
  category: string;
  mileage?: number;
  notes?: string;
}

export interface Reminder {
  id: string;
  vehicleId: string;
  title: string;
  dueDate?: string;
  dueMileage?: number;
  done: boolean;
}
