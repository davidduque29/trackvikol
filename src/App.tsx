import { useState } from 'react';
import type { ReactNode } from 'react';
import { Activity, ArrowDownRight, ArrowRight, Bell, Bike, CalendarClock, CarFront, Check, ChevronDown, CircleHelp, ClipboardList, FileText, Gauge, LayoutDashboard, Menu, MoreHorizontal, Plus, Search, Settings2, ShieldCheck, Sparkles, TrendingUp, Wallet, Wrench, X, type LucideIcon } from 'lucide-react';
import { demoMaintenance, demoReminders, demoVehicles } from './data/demo';
import { getVehicleAdapter, vehicleAdapters } from './domain/adapters';
import { formatCOP, formatDate, formatNumber } from './domain/format';
import type { MaintenanceRecord, Reminder, Vehicle, VehicleType } from './domain/vehicle';

type Page = 'dashboard' | 'vehicles' | 'maintenance' | 'documents' | 'reminders' | 'expenses' | 'settings';
type NavItem = { key: Page; title: string; icon: LucideIcon };
const nav: NavItem[] = [
  { key: 'dashboard', title: 'Resumen', icon: LayoutDashboard },
  { key: 'vehicles', title: 'Mis vehículos', icon: CarFront },
  { key: 'maintenance', title: 'Mantenimientos', icon: Wrench },
  { key: 'documents', title: 'Documentos', icon: FileText },
  { key: 'reminders', title: 'Recordatorios', icon: Bell },
  { key: 'expenses', title: 'Gastos', icon: Wallet },
];
const icons: Record<VehicleType, LucideIcon> = { car: CarFront, motorcycle: Gauge, scooter: Activity, bicycle: Bike };
const categories: Record<VehicleType, string> = { car: 'Automóvil', motorcycle: 'Motocicleta', scooter: 'Patineta', bicycle: 'Bicicleta' };

function VehicleIcon({ vehicle, size = 30 }: { vehicle: Vehicle; size?: number }) {
  const Icon = icons[vehicle.type];
  return <div className="vehicle-illustration" style={{ background: vehicle.accent + '22', color: vehicle.accent }}><Icon size={size} strokeWidth={1.7} /></div>;
}

function Pill({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'green' | 'orange' }) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}

function Empty({ icon: Icon, title, message }: { icon: LucideIcon; title: string; message: string }) {
  return <div className="empty"><Icon size={34} /><h3>{title}</h3><p>{message}</p></div>;
}

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [vehicles, setVehicles] = useState<Vehicle[]>(demoVehicles);
  const [maintenances, setMaintenances] = useState<MaintenanceRecord[]>(demoMaintenance);
  const [reminders, setReminders] = useState<Reminder[]>(demoReminders);
  const [isDemo, setIsDemo] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedType, setSelectedType] = useState<VehicleType>('car');
  const [draft, setDraft] = useState({ nickname: '', brand: '', model: '', year: '', plate: '', odometer: '' });
  const [search, setSearch] = useState('');
  const [navOpen, setNavOpen] = useState(false);

  const totalSpent = maintenances.reduce((sum, record) => sum + record.amount, 0);
  const activeReminders = reminders.filter((reminder) => !reminder.done);
  const filteredVehicles = vehicles.filter((v) => [v.nickname, v.brand, v.model, v.plate ?? ''].join(' ').toLowerCase().includes(search.toLowerCase()));

  function addVehicle(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.nickname.trim() || !draft.brand.trim() || !draft.model.trim()) return;
    const year = draft.year.trim() ? Number(draft.year) : undefined;
    const odometer = draft.odometer.trim() ? Number(draft.odometer) : undefined;
    if (year !== undefined && (!Number.isInteger(year) || year < 1886 || year > new Date().getFullYear() + 1)) return;
    if (odometer !== undefined && (!Number.isFinite(odometer) || odometer < 0)) return;
    const palette = ['#7d8ce8', '#e1a574', '#8dc4b8', '#c9a4da'];
    setVehicles((previous) => [...previous, {
      id: crypto.randomUUID(), type: selectedType, nickname: draft.nickname.trim(),
      brand: draft.brand.trim(), model: draft.model.trim(),
      year, plate: draft.plate.trim() || undefined, odometer, odometerUnit: 'km',
      status: 'active', accent: palette[previous.length % palette.length],
    }]);
    setDraft({ nickname: '', brand: '', model: '', year: '', plate: '', odometer: '' });
    setShowAdd(false);
    setPage('vehicles');
  }

  function clearDemo() {
    setVehicles([]);
    setMaintenances([]);
    setReminders([]);
    setIsDemo(false);
  }

  function go(next: Page) { setPage(next); setNavOpen(false); }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${navOpen ? 'sidebar-open' : ''}`}>
        <div className="brand"><div className="brand-logo"><img src={`${import.meta.env.BASE_URL}trackvikol-mark.svg`} alt="Símbolo TrackVikol" /></div><div><strong>Track<span>Vikol</span></strong><small>GESTIÓN INTEGRAL DE TUS VEHÍCULOS</small></div><button className="close-mobile" onClick={() => setNavOpen(false)} aria-label="Cerrar menú"><X size={20}/></button></div>
        <div className="workspace"><span className="workspace-avatar">T</span><div><strong>Mi espacio</strong><small>Cuenta personal</small></div><ChevronDown size={15} /></div>
        <div className="nav-caption">ESPACIO DE TRABAJO</div>
        <nav aria-label="Navegación principal">{nav.map((item) => <button key={item.key} onClick={() => go(item.key)} className={`nav-link ${page === item.key ? 'selected' : ''}`}><item.icon size={19} /><span>{item.title}</span>{item.key === 'reminders' && activeReminders.length > 0 && <span className="nav-count">{activeReminders.length}</span>}</button>)}</nav>
        <div className="sidebar-bottom"><div className="side-help"><Sparkles size={18} /><strong>Tu vehículo, tu historia</strong><span>Toda tu movilidad, organizada en un lugar.</span></div><button className="nav-link" onClick={() => go('settings')}><Settings2 size={19} />Configuración</button><div className="side-user"><div className="user-avatar">D</div><div><strong>Espacio personal</strong><small>Versión de demostración</small></div><MoreHorizontal size={19}/></div></div>
      </aside>
      {navOpen && <button className="scrim" aria-label="Cerrar menú" onClick={() => setNavOpen(false)} />}
      <main className="main">
        <header className="topbar"><div className="topbar-left"><button className="menu-button" aria-label="Abrir menú" onClick={() => setNavOpen(true)}><Menu size={23}/></button><span>Mi espacio</span><span className="divider">/</span><strong>{page === 'dashboard' ? 'Panel general' : page === 'settings' ? 'Configuración' : nav.find((item) => item.key === page)?.title}</strong></div><div className="top-actions"><span className="demo-badge"><span className="green-dot" /> Modo demo</span><button className="icon-button" aria-label="Ver recordatorios" onClick={() => go('reminders')}><Bell size={19}/></button><div className="user-avatar small">D</div></div></header>
        <div className="content">
          {isDemo && <div className="demo-banner"><div><CircleHelp size={19}/><span><strong>Vista de demostración.</strong> El Sandero tiene datos de las facturas 330 y 331; el kilometraje de 80.000 km es estimado. Los cambios no se guardan.</span></div><button onClick={clearDemo}>Empezar desde cero <ArrowRight size={16}/></button></div>}
          {page === 'dashboard' && <>
            <div className="page-heading"><div><span className="eyebrow">MI MOVILIDAD · PANEL GENERAL</span><h1>Todo en orden, <em>en movimiento.</em></h1><p>El espacio para cuidar lo que te lleva a todas partes.</p></div><button className="primary-button" onClick={() => setShowAdd(true)}><Plus size={18}/> Agregar vehículo</button></div>
            <div className="stats-grid"><div className="stat-card"><span className="stat-top">Mis vehículos <CarFront size={19}/></span><strong>{vehicles.length.toString().padStart(2, '0')}</strong><span className="stat-foot"><Pill tone="green">● Activos</Pill><small>En tu colección</small></span></div><div className="stat-card"><span className="stat-top">Mantenimientos <Wrench size={19}/></span><strong>{maintenances.length.toString().padStart(2, '0')}</strong><span className="stat-foot"><Pill>Historial</Pill><small>Registros totales</small></span></div><div className="stat-card"><span className="stat-top">Gastos registrados <Wallet size={19}/></span><strong className="money-number">{formatCOP(totalSpent)}</strong><span className="stat-foot"><Pill tone="green"><TrendingUp size={13}/> Seguimiento</Pill><small>Total registrado</small></span></div><div className="stat-card"><span className="stat-top">Recordatorios <CalendarClock size={19}/></span><strong>{activeReminders.length.toString().padStart(2, '0')}</strong><span className="stat-foot"><Pill tone={activeReminders.length > 0 ? 'orange' : 'green'}>{activeReminders.length > 0 ? '● Pendientes' : 'Al día'}</Pill><small>Por revisar</small></span></div></div>
            <section className="section"><div className="section-heading"><div><h2>Mi garaje <span className="count">({vehicles.length})</span></h2><p>Tus vehículos, todos en un mismo lugar.</p></div><button className="text-button" onClick={() => go('vehicles')}>Ver todos <ArrowRight size={16}/></button></div><div className="vehicle-grid">{vehicles.slice(0, 4).map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}{vehicles.length === 0 && <Empty icon={CarFront} title="Tu garaje está vacío" message="Agrega tu primer vehículo para comenzar."/>}</div></section>
            <div className="bottom-grid"><section className="panel"><div className="section-heading"><div><h2>Actividad reciente</h2><p>Últimos mantenimientos registrados</p></div><button className="text-button" onClick={() => go('maintenance')}>Ver historial <ArrowRight size={16}/></button></div>{maintenances.length ? maintenances.slice(0, 3).map((m) => { const vehicle = vehicles.find((v) => v.id === m.vehicleId);return <div className="activity-row" key={m.id}><div className="row-icon"><Wrench size={18}/></div><div className="activity-copy"><strong>{m.title}</strong><span>{vehicle?.nickname ?? 'Vehículo'} · {formatDate(m.date)}</span></div><b>{formatCOP(m.amount)}</b></div>; }) : <Empty icon={ClipboardList} title="Sin actividad" message="Aquí aparecerán tus mantenimientos."/>}</section><section className="panel reminders-panel"><div className="section-heading"><div><h2>Próximos pendientes</h2><p>No pierdas de vista lo importante</p></div><button className="text-button" onClick={() => go('reminders')}>Ver todos <ArrowRight size={16}/></button></div>{activeReminders.slice(0, 3).map((r) => <ReminderRow key={r.id} reminder={r} vehicles={vehicles} />)}{activeReminders.length === 0 && <Empty icon={Check} title="Todo al día" message="No tienes recordatorios pendientes."/>}</section></div>
            <div className="value-strip"><div className="value-icon"><ShieldCheck size={24}/></div><div><strong>La historia de tu vehículo, siempre contigo.</strong><span>Registra cada detalle hoy para tomar mejores decisiones mañana.</span></div><ArrowDownRight size={22}/></div>
          </>}
          {page === 'vehicles' && <><PageHeader eyebrow="TU COLECCIÓN" title="Mis vehículos" description="Carros, motos, patinetas y bicicletas en un solo lugar." action={() => setShowAdd(true)} actionLabel="Agregar vehículo"/><div className="search-box"><Search size={19}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre, marca, modelo o placa..." aria-label="Buscar vehículos"/></div><div className="vehicle-grid">{filteredVehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle}/>)}{!filteredVehicles.length && <Empty icon={CarFront} title="No hay resultados" message="Prueba otra búsqueda o agrega un vehículo."/>}</div></>}
          {page === 'maintenance' && <><PageHeader eyebrow="HISTORIAL DE SERVICIO" title="Mantenimientos" description="Cada revisión cuenta. Lleva un historial claro de los cuidados realizados."/><div className="panel list-panel">{maintenances.map((m) => { const vehicle = vehicles.find((v) => v.id === m.vehicleId);return <div className="activity-row" key={m.id}><div className="row-icon"><Wrench size={19}/></div><div className="activity-copy"><strong>{m.title}</strong><span>{vehicle?.nickname ?? 'Vehículo'} · {m.category} · {formatDate(m.date)}{m.id === 'servicio-2026-09-16' ? ' · 80.000 km estimados · Facturas 330 y 331' : ''}</span>{m.notes && <details className="maintenance-notes"><summary>Ver detalle y conceptos</summary><p>{m.notes}</p></details>}</div><b>{formatCOP(m.amount)}</b></div>; })}{!maintenances.length && <Empty icon={Wrench} title="Aún no hay mantenimientos" message="El registro de servicios estará disponible en la próxima etapa."/>}</div></>}
          {page === 'documents' && <><PageHeader eyebrow="ARCHIVO DIGITAL" title="Documentos" description="Facturas, SOAT, seguros y demás documentos importantes."/><div className="panel"><Empty icon={FileText} title="Tu archivo digital comienza aquí" message="La carga y almacenamiento seguro de documentos se implementarán en la siguiente fase. No hay documentos almacenados todavía."/></div></>}
          {page === 'reminders' && <><PageHeader eyebrow="AGENDA DE CUIDADO" title="Recordatorios" description="Revisiones, trámites y mantenimientos que no quieres olvidar."/><div className="panel list-panel">{reminders.map((r) => <div className="reminder-with-check" key={r.id}><input type="checkbox" checked={r.done} onChange={() => setReminders((prev) => prev.map((item) => item.id === r.id ? { ...item, done: !item.done } : item))} aria-label={`Marcar ${r.title} como ${r.done ? 'pendiente' : 'completado'}`}/><div className={r.done ? 'completed' : ''}><ReminderRow reminder={r} vehicles={vehicles}/></div></div>)}{!reminders.length && <Empty icon={Bell} title="Sin recordatorios" message="La creación de nuevos recordatorios se habilitará en otra etapa."/>}</div></>}
          {page === 'expenses' && <><PageHeader eyebrow="CONTROL FINANCIERO" title="Gastos" description="Entiende cuánto inviertes en el cuidado de tus vehículos."/><div className="expense-summary"><span>Total registrado en mantenimientos</span><strong>{formatCOP(totalSpent)}</strong><small>Basado en los registros disponibles en esta sesión.</small></div><div className="panel list-panel">{maintenances.map((m) => <div className="activity-row" key={m.id}><div className="row-icon"><Wallet size={18}/></div><div className="activity-copy"><strong>{m.title}</strong><span>{formatDate(m.date)}</span></div><b>{formatCOP(m.amount)}</b></div>)}{!maintenances.length && <Empty icon={Wallet} title="Aún no hay gastos" message="Los gastos se asociarán a mantenimientos y otros movimientos."/>}</div></>}
          {page === 'settings' && <><PageHeader eyebrow="PREFERENCIAS" title="Configuración" description="Administra la experiencia de tu espacio TrackVikol."/><div className="panel settings-panel"><h2>Catálogo de vehículos</h2><p>La arquitectura inicial separa el núcleo compartido de las configuraciones por tipo.</p><div className="adapter-list">{Object.values(vehicleAdapters).map((adapter) => <div key={adapter.type}><span>{adapter.label}</span><small>{adapter.maintenanceCategories.length} categorías de mantenimiento</small><Pill tone="green">Configurado</Pill></div>)}</div><p className="settings-note">La edición de adaptadores desde un panel administrativo y la persistencia con Supabase son funcionalidades futuras.</p></div></>}
        </div>
      </main>
      <nav className="nav-mobile" aria-label="Navegación móvil">{([{key:'dashboard',title:'Inicio',icon:LayoutDashboard},{key:'vehicles',title:'Vehículos',icon:CarFront},{key:'maintenance',title:'Historial',icon:Wrench},{key:'expenses',title:'Gastos',icon:Wallet},{key:'documents',title:'Facturas',icon:FileText}] as NavItem[]).map(item => <button key={item.key} className={page === item.key ? 'active' : ''} onClick={() => go(item.key)}><item.icon/><span>{item.title}</span></button>)}</nav>
      {showAdd && <div className="modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowAdd(false); }}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-top"><div><span className="eyebrow">MI GARAJE</span><h2 id="modal-title">Agregar vehículo</h2></div><button className="icon-button" onClick={() => setShowAdd(false)} aria-label="Cerrar"><X size={20}/></button></div><p>Elige qué tipo de vehículo deseas agregar a tu colección.</p><div className="type-picker">{(Object.keys(vehicleAdapters) as VehicleType[]).map((type) => {const Icon = icons[type];return <button key={type} className={selectedType === type ? 'chosen' : ''} onClick={() => setSelectedType(type)}><Icon size={24}/><span>{vehicleAdapters[type].label}</span></button>})}</div><form onSubmit={addVehicle}><div className="form-grid"><label>Nombre del vehículo *<input required maxLength={50} value={draft.nickname} onChange={(e) => setDraft({ ...draft, nickname: e.target.value })} placeholder="Ej. Mi compañera de rutas"/></label><label>Marca *<input required maxLength={50} value={draft.brand} onChange={(e) => setDraft({ ...draft, brand: e.target.value })} placeholder="Ej. Honda"/></label><label>Modelo *<input required maxLength={60} value={draft.model} onChange={(e) => setDraft({ ...draft, model: e.target.value })} placeholder="Ej. XBlade 160"/></label><label>Año<input type="number" min="1886" max={new Date().getFullYear()+1} value={draft.year} onChange={(e) => setDraft({ ...draft, year: e.target.value })} placeholder="Ej. 2024"/></label>{getVehicleAdapter(selectedType).fields.some((f) => f.key === 'plate') && <label>Placa (opcional)<input maxLength={15} value={draft.plate} onChange={(e) => setDraft({ ...draft, plate: e.target.value })} placeholder="Ej. ABC123"/></label>}<label>Kilometraje (opcional)<input type="number" min="0" step="0.1" value={draft.odometer} onChange={(e) => setDraft({ ...draft, odometer: e.target.value })} placeholder="0"/></label></div><div className="form-hint"><CircleHelp size={16}/>Los vehículos agregados se guardan solo en memoria durante esta sesión.</div><div className="modal-actions"><button className="secondary-button" type="button" onClick={() => setShowAdd(false)}>Cancelar</button><button className="primary-button" type="submit"><Plus size={18}/> Agregar vehículo</button></div></form></div></div>}
    </div>
  );
}

function PageHeader({ eyebrow, title, description, action, actionLabel }: { eyebrow: string; title: string; description: string; action?: () => void; actionLabel?: string }) {
  return <div className="page-heading alt"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{action && <button className="primary-button" onClick={action}><Plus size={18}/>{actionLabel}</button>}</div>;
}
function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return <article className="vehicle-card"><div className="vehicle-card-top"><Pill tone="green">● Activo</Pill><MoreHorizontal size={21} className="muted" /></div><VehicleIcon vehicle={vehicle} size={49}/><div className="vehicle-card-body"><span className="vehicle-category">{categories[vehicle.type]}</span><h3>{vehicle.nickname}</h3><p>{vehicle.brand} {vehicle.model}</p></div><div className="vehicle-card-footer"><div><Gauge size={16}/>{vehicle.odometer !== undefined ? `${formatNumber(vehicle.odometer)} ${vehicle.odometerUnit ?? 'km'}${vehicle.id === 'sandero' ? ' · Estimado' : ''}` : 'Sin kilometraje'}</div><span>{vehicle.year ?? '—'}</span></div></article>;
}
function ReminderRow({ reminder, vehicles }: { reminder: Reminder; vehicles: Vehicle[] }) {
  const vehicle = vehicles.find((v) => v.id === reminder.vehicleId);
  return <div className="reminder-row"><div className="reminder-icon"><CalendarClock size={19}/></div><div><strong>{reminder.title}</strong><span>{vehicle?.nickname ?? 'Vehículo'} · {reminder.dueDate ? formatDate(reminder.dueDate) : reminder.dueMileage !== undefined ? `A los ${formatNumber(reminder.dueMileage)} km` : 'Sin fecha'}</span></div><span className="reminder-dot"/></div>;
}
