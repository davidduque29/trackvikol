import { useState } from 'react';
import type { FormEvent } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import type { MaintenanceRecord, Vehicle } from '../domain/vehicle';
type Line = {id:string; description:string; amount:string};
const emptyLine=():Line=>({id:crypto.randomUUID(),description:'',amount:''});
export function MaintenanceEntry({vehicles,onSave,onClose}:{vehicles:Vehicle[];onSave:(record:MaintenanceRecord)=>void;onClose:()=>void}) {
 const [vehicleId,setVehicleId]=useState(vehicles[0]?.id ?? '');
 const [title,setTitle]=useState('');
 const [date,setDate]=useState(new Date().toLocaleDateString('en-CA'));
 const [workshop,setWorkshop]=useState('');
 const [mileage,setMileage]=useState('');
 const [estimated,setEstimated]=useState(false);
 const [invoice,setInvoice]=useState('');
 const [lines,setLines]=useState<Line[]>([emptyLine()]);
 const [error,setError]=useState('');
 const total=lines.reduce((s,l)=>s+(Number(l.amount)||0),0);
 function save(e:FormEvent){
  e.preventDefault();
  if(!vehicleId || !title.trim() || !date || lines.some(l=>!l.description.trim()||l.amount.trim()===''||!Number.isFinite(Number(l.amount))||Number(l.amount)<0)){setError('Completa el vehículo, título, fecha y todos los conceptos con valores válidos.');return;}
  if(mileage.trim()!==''&&(!Number.isFinite(Number(mileage))||Number(mileage)<0)){setError('El kilometraje no es válido.');return;}
  onSave({id:crypto.randomUUID(),vehicleId,title:title.trim(),date,category:'Mantenimiento',amount:total,mileage:mileage.trim()?Number(mileage):undefined,notes:[workshop.trim()&&'Taller: '+workshop.trim(),invoice.trim()&&'Factura: '+invoice.trim(),mileage.trim()&&'Kilometraje '+(estimated?'estimado':'confirmado'),...lines.map(l=>l.description.trim()+': '+Number(l.amount).toLocaleString('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}))].filter(Boolean).join(' | ')});
 }
 return <div className="modal-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}><div className="modal maintenance-entry" role="dialog" aria-modal="true" aria-labelledby="maintenance-title">
 <div className="modal-top"><div><span className="eyebrow">HISTORIAL</span><h2 id="maintenance-title">Nuevo mantenimiento</h2></div><button type="button" className="icon-button" onClick={onClose} aria-label="Cerrar"><X size={20}/></button></div>
 <form onSubmit={save}><div className="form-grid">
 <label>Vehículo *<select required value={vehicleId} onChange={e=>setVehicleId(e.target.value)}>{vehicles.map(v=><option key={v.id} value={v.id}>{v.nickname}</option>)}</select></label>
 <label>Servicio *<input required maxLength={100} value={title} onChange={e=>setTitle(e.target.value)} placeholder="Ej. Cambio de aceite"/></label>
 <label>Fecha *<input type="date" required value={date} onChange={e=>setDate(e.target.value)}/></label>
 <label>Taller<input maxLength={100} value={workshop} onChange={e=>setWorkshop(e.target.value)} placeholder="Nombre del taller"/></label>
 <label>Kilometraje<input type="number" min="0" step="1" value={mileage} onChange={e=>setMileage(e.target.value)} placeholder="Opcional"/></label>
 <label>N.º factura<input maxLength={60} value={invoice} onChange={e=>setInvoice(e.target.value)} placeholder="Opcional"/></label>
 </div><label className="estimate-checkbox"><input type="checkbox" checked={estimated} onChange={e=>setEstimated(e.target.checked)}/> Kilometraje estimado (no confirmado)</label>
 <h3>Repuestos y mano de obra</h3>
 {lines.map(line=><div className="line-entry" key={line.id}><input aria-label="Descripción del concepto" required placeholder="Concepto" value={line.description} onChange={e=>setLines(ls=>ls.map(l=>l.id===line.id?{...l,description:e.target.value}:l))}/><input aria-label="Valor en pesos" required type="number" min="0" step="1" placeholder="Valor COP" value={line.amount} onChange={e=>setLines(ls=>ls.map(l=>l.id===line.id?{...l,amount:e.target.value}:l))}/><button type="button" aria-label="Eliminar concepto" disabled={lines.length===1} onClick={()=>setLines(ls=>ls.filter(l=>l.id!==line.id))}><Trash2 size={17}/></button></div>)}
 <button className="secondary-button" type="button" onClick={()=>setLines(ls=>[...ls,emptyLine()])}><Plus size={16}/> Añadir concepto</button>
 <p className="entry-total">Total: {total.toLocaleString('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0})}</p>
 {error&&<p role="alert" className="entry-error">{error}</p>}
 <p className="form-hint">Se guarda en este navegador. No hay sincronización en la nube ni carga de fotografías todavía.</p>
 <div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancelar</button><button type="submit" className="primary-button">Guardar mantenimiento</button></div></form>
 </div></div>;
}
