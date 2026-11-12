import type { Vehicle, VehicleType } from './vehicle';

export interface FieldDefinition {
  key: keyof Vehicle;
  label: string;
  required?: boolean;
}

export interface VehicleTypeAdapter {
  type: VehicleType;
  label: string;
  labelPlural: string;
  icon: 'car' | 'motorcycle' | 'scooter' | 'bicycle';
  fields: FieldDefinition[];
  maintenanceCategories: string[];
}

const shared: FieldDefinition[] = [
  { key: 'nickname', label: 'Nombre del vehículo', required: true },
  { key: 'brand', label: 'Marca', required: true },
  { key: 'model', label: 'Modelo', required: true },
  { key: 'year', label: 'Año' },
];

export const vehicleAdapters: Record<VehicleType, VehicleTypeAdapter> = {
  car: {
    type: 'car', label: 'Carro', labelPlural: 'Carros', icon: 'car',
    fields: [...shared, { key: 'plate', label: 'Placa' }, { key: 'odometer', label: 'Kilometraje' }],
    maintenanceCategories: ['Motor', 'Frenos', 'Llantas', 'Aceite', 'Suspensión', 'Eléctrico'],
  },
  motorcycle: {
    type: 'motorcycle', label: 'Moto', labelPlural: 'Motos', icon: 'motorcycle',
    fields: [...shared, { key: 'plate', label: 'Placa' }, { key: 'odometer', label: 'Kilometraje' }],
    maintenanceCategories: ['Aceite', 'Cadena', 'Frenos', 'Llantas', 'Batería'],
  },
  scooter: {
    type: 'scooter', label: 'Patineta', labelPlural: 'Patinetas', icon: 'scooter',
    fields: [...shared, { key: 'odometer', label: 'Kilometraje' }],
    maintenanceCategories: ['Batería', 'Frenos', 'Llantas', 'Rodamientos'],
  },
  bicycle: {
    type: 'bicycle', label: 'Bicicleta', labelPlural: 'Bicicletas', icon: 'bicycle',
    fields: [...shared, { key: 'odometer', label: 'Kilometraje' }],
    maintenanceCategories: ['Cadena', 'Frenos', 'Llantas', 'Transmisión', 'Suspensión'],
  },
};

export function getVehicleAdapter(type: VehicleType): VehicleTypeAdapter {
  return vehicleAdapters[type];
}
