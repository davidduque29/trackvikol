import type { MaintenanceRecord, Reminder, Vehicle } from '../domain/vehicle';

export const demoVehicles: Vehicle[] = [
  { id: 'v1', type: 'car', nickname: 'Mi carro', brand: 'Renault', model: 'Sandero Stepway', year: 2020, plate: 'ABC 123', odometer: 58420, odometerUnit: 'km', propulsion: 'combustion', status: 'active', accent: '#7d8ce8' },
  { id: 'v2', type: 'motorcycle', nickname: 'Mi moto', brand: 'Honda', model: 'XBlade 160', year: 2023, odometer: 12640, odometerUnit: 'km', propulsion: 'combustion', status: 'active', accent: '#e1a574' },
  { id: 'v3', type: 'scooter', nickname: 'Mi patineta', brand: 'Segway', model: 'Ninebot', odometer: 1840, odometerUnit: 'km', propulsion: 'electric', status: 'active', accent: '#8dc4b8' },
  { id: 'v4', type: 'bicycle', nickname: 'Mi bicicleta', brand: 'Trek', model: 'Marlin', year: 2022, odometer: 820, odometerUnit: 'km', propulsion: 'human', status: 'active', accent: '#c9a4da' },
];

export const demoMaintenance: MaintenanceRecord[] = [
  { id: 'm1', vehicleId: 'v1', title: 'Cambio de aceite y filtros', date: '2026-11-02', amount: 285000, category: 'Aceite', mileage: 58000 },
  { id: 'm2', vehicleId: 'v2', title: 'Revisión general de frenos', date: '2026-10-22', amount: 95000, category: 'Frenos' },
  { id: 'm3', vehicleId: 'v1', title: 'Alineación y balanceo', date: '2026-10-10', amount: 110000, category: 'Llantas' },
];

export const demoReminders: Reminder[] = [
  { id: 'r1', vehicleId: 'v1', title: 'Revisar vencimiento del SOAT', dueDate: '2026-12-02', done: false },
  { id: 'r2', vehicleId: 'v2', title: 'Lubricar y ajustar la cadena', dueMileage: 13000, done: false },
  { id: 'r3', vehicleId: 'v3', title: 'Revisión de frenos', dueDate: '2026-12-18', done: false },
];
