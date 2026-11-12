import { describe, expect, it } from 'vitest';
import { getVehicleAdapter, vehicleAdapters } from './adapters';

describe('vehicle adapters', () => {
  it('registers the four initial vehicle types', () => {
    expect(Object.keys(vehicleAdapters)).toHaveLength(4);
  });
  it('exposes shared fields and specialized maintenance categories', () => {
    expect(getVehicleAdapter('bicycle').fields.map((field) => field.key)).toContain('brand');
    expect(getVehicleAdapter('bicycle').maintenanceCategories).toContain('Cadena');
    expect(getVehicleAdapter('scooter').maintenanceCategories).toContain('Batería');
  });
});
