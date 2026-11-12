import type { MaintenanceRecord, Reminder, Vehicle } from '../domain/vehicle';
export const demoVehicles: Vehicle[] = [
 { id:'sandero',type:'car',nickname:'Sandero Stepway',brand:'Renault',model:'Sandero Stepway',odometer:80000,odometerUnit:'km',propulsion:'combustion',status:'active',accent:'#7435db',notes:'Kilometraje estimado al 16/09/2026. No representa lectura confirmada ni kilometraje actual.' }
];
export const demoMaintenance: MaintenanceRecord[] = [
 {id:'servicio-2026-09-16',vehicleId:'sandero',title:'Mantenimiento general y reparaciones',date:'2026-09-16',amount:1215000,category:'Mantenimiento general',mileage:80000,notes:'Kilometraje estimado. Taller Serviteca Alex Taborda. Facturas 330 ($1.165.000) y 331 ($50.000). Detalle: aceite motor $200.000; filtro aceite $30.000; filtro aire motor $35.000; filtro aire acondicionado $35.000; aceite y cambio caja $125.000; líquido frenos $100.000; aceite hidráulico $30.000; 2 cilindros freno traseros $140.000; cambio frenos y cilindros $120.000; amortiguadores y soportes delanteros $100.000; bujes estabilizadora $40.000; 4 bujías y cambio $120.000; rodamiento trasero $90.000; prensa hidráulica $20.000; mano de obra rodamiento $30.000.'}
];
export const demoReminders: Reminder[] = [];
