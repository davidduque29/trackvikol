import type { MaintenanceRecord, Vehicle } from '../domain/vehicle';
const base='https://zryhmxqfibkiebbrhpzg.supabase.co';
const key='sb_publishable_MHWZMJaxxibi-60XvZwQdw_X1icPw1k';
export type Session={access_token:string;refresh_token:string;expires_at:number;user:{id:string;email?:string}};
const sessionKey='trackvikol-auth-session';
export function getSession():Session|null {try{return JSON.parse(localStorage.getItem(sessionKey)||'null') as Session|null}catch{return null}}
function storeSession(value:Session|null){if(value)localStorage.setItem(sessionKey,JSON.stringify(value));else localStorage.removeItem(sessionKey)}
async function request(path:string,method='GET',body?:unknown,token?:string,extra?:Record<string,string>){
 const response=await fetch(base+path,{method,headers:{apikey:key,...(token?{Authorization:'Bearer '+token}:{}),...(body!==undefined?{'Content-Type':'application/json'}:{}),...extra},body:body===undefined?undefined:JSON.stringify(body)});
 if(!response.ok){let detail='';try{const payload=await response.json() as {message?:string;msg?:string;error_description?:string};detail=payload.message||payload.msg||payload.error_description||''}catch{}throw new Error(detail||'Error HTTP '+response.status)}
 if(response.status===204)return null;
 return response.json();
}
export async function signIn(email:string,password:string):Promise<Session>{const data=await request('/auth/v1/token?grant_type=password','POST',{email,password}) as Session&{expires_in:number};const session={access_token:data.access_token,refresh_token:data.refresh_token,expires_at:Math.floor(Date.now()/1000)+data.expires_in,user:data.user};storeSession(session);return session}
export async function signUp(email:string,password:string){return request('/auth/v1/signup','POST',{email,password})}
export async function signOut(session:Session){try{await request('/auth/v1/logout','POST',undefined,session.access_token)}finally{storeSession(null)}}
export async function validSession():Promise<Session|null>{
 let session=getSession();if(!session)return null;
 if(session.expires_at>Date.now()/1000+60)return session;
 try{const data=await request('/auth/v1/token?grant_type=refresh_token','POST',{refresh_token:session.refresh_token}) as Session&{expires_in:number};session={access_token:data.access_token,refresh_token:data.refresh_token,expires_at:Math.floor(Date.now()/1000)+data.expires_in,user:data.user};storeSession(session);return session}catch{storeSession(null);return null}
}
type VehicleRow={id:string;type:Vehicle['type'];nickname:string;brand:string|null;model:string|null;model_year:number|null;plate:string|null;odometer:number|null;odometer_unit:'km'|'mi';notes:string|null};
type MaintenanceRow={id:string;vehicle_id:string;title:string;performed_on:string;category:string;total_amount:number;odometer:number|null;notes:string|null};
export async function loadCloud(){
 const session=await validSession();if(!session)throw new Error('Tu sesión expiró. Vuelve a iniciar sesión.');
 const [vr,mr]=await Promise.all([request('/rest/v1/vehicles?select=*&order=created_at.desc','GET',undefined,session.access_token),request('/rest/v1/maintenance_records?select=*&order=performed_on.desc','GET',undefined,session.access_token)]) as [VehicleRow[],MaintenanceRow[]];
 const vehicles:Vehicle[]=vr.map(v=>({id:v.id,type:v.type,nickname:v.nickname,brand:v.brand||'',model:v.model||'',year:v.model_year||undefined,plate:v.plate||undefined,odometer:v.odometer??undefined,odometerUnit:v.odometer_unit,status:'active',accent:'#7435db',notes:v.notes||undefined}));
 const maintenances:MaintenanceRecord[]=mr.map(m=>({id:m.id,vehicleId:m.vehicle_id,title:m.title,date:m.performed_on,category:m.category,amount:Number(m.total_amount),mileage:m.odometer??undefined,notes:m.notes||undefined}));
 return {vehicles,maintenances};
}
export async function createCloudVehicle(v:Vehicle){
 const session=await validSession();if(!session)throw new Error('Sesión expirada');
 await request('/rest/v1/vehicles','POST',{id:v.id,owner_id:session.user.id,type:v.type,nickname:v.nickname,brand:v.brand,model:v.model,model_year:v.year||null,plate:v.plate||null,odometer:v.odometer??null,odometer_unit:v.odometerUnit||'km',notes:v.notes||null},session.access_token,{Prefer:'return=minimal'});
}
export async function createCloudMaintenance(m:MaintenanceRecord){
 const session=await validSession();if(!session)throw new Error('Sesión expirada');
 await request('/rest/v1/maintenance_records','POST',{id:m.id,owner_id:session.user.id,vehicle_id:m.vehicleId,title:m.title,performed_on:m.date,category:m.category,total_amount:m.amount,odometer:m.mileage??null,notes:m.notes||null},session.access_token,{Prefer:'return=minimal'});
}
