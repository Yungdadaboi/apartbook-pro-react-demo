import { useState, useEffect } from "react";

const T = {
  bg:"#07090f",surface:"#0d1117",surface2:"#161b22",border:"#21262d",
  border2:"#30363d",text:"#e6edf3",muted:"#7d8590",blue:"#58a6ff",
  green:"#3fb950",orange:"#d29922",red:"#f85149",purple:"#bc8cff",
  cyan:"#39d353",grad1:"linear-gradient(135deg,#1f6feb,#388bfd)",
  grad2:"linear-gradient(135deg,#238636,#2ea043)",
  grad3:"linear-gradient(135deg,#6e40c9,#8b5cf6)",
};

const MOCK = {
  rides:[
    {id:"r1",passenger:"Esther Okafor",phone:"09150784065",pickup:"Whisper Apartments, GRA",dropoff:"Benin Airport",driver:"John Okoro",driverId:"d1",plate:"BEN-123-AA",vehicle:"Toyota Camry",date:"2026-04-20",time:"08:30",status:"Completed",fare:4200,km:18.5,isAirport:true},
    {id:"r2",passenger:"Michael Eze",phone:"08134567890",pickup:"Ring Road",dropoff:"UNIBEN Main Gate",driver:"Chidi Obi",driverId:"d2",plate:"BEN-456-BB",vehicle:"Honda Accord",date:"2026-04-20",time:"10:15",status:"Active",fare:0,km:0,isAirport:false},
    {id:"r3",passenger:"Amaka Peters",phone:"07012345678",pickup:"Sapele Road",dropoff:"GT Plaza",driver:"John Okoro",driverId:"d1",plate:"BEN-123-AA",vehicle:"Toyota Camry",date:"2026-04-20",time:"14:00",status:"Pending",fare:0,km:0,isAirport:false},
    {id:"r4",passenger:"Tunde Badmus",phone:"08098765432",pickup:"Oba Market",dropoff:"Ramat Park",driver:"Chidi Obi",driverId:"d2",plate:"BEN-456-BB",vehicle:"Honda Accord",date:"2026-04-19",time:"16:30",status:"Cancelled",fare:0,km:0,isAirport:false},
    {id:"r5",passenger:"Grace Ihejirika",phone:"09087654321",pickup:"Uselu Market",dropoff:"Edo Specialist",driver:"John Okoro",driverId:"d1",plate:"BEN-123-AA",vehicle:"Toyota Camry",date:"2026-04-18",time:"09:00",status:"Completed",fare:2800,km:11.2,isAirport:false},
  ],
  drivers:[
    {id:"d1",name:"John Okoro",phone:"09134871345",vehicle:"Toyota Camry",plate:"BEN-123-AA",color:"Silver",license:"EDO-12345",status:"Online",rides:12,earnings:48500},
    {id:"d2",name:"Chidi Obi",phone:"08123456789",vehicle:"Honda Accord",plate:"BEN-456-BB",color:"Black",license:"EDO-67890",status:"On Ride",rides:8,earnings:32000},
    {id:"d3",name:"Emeka Nwosu",phone:"07098765432",vehicle:"Toyota Corolla",plate:"BEN-789-CC",color:"White",license:"EDO-11223",status:"Offline",rides:5,earnings:18500},
  ],
  properties:[
    {id:"p1",name:"Whisper Apartments",type:"Apartment",address:"12 GRA Road, Benin City",units:24,occupied:20,rent:150000,status:"Active",image:"🏢"},
    {id:"p2",name:"Sunrise Court",type:"Duplex",address:"45 Sapele Road, Benin City",units:8,occupied:6,rent:250000,status:"Active",image:"🏘️"},
    {id:"p3",name:"Palm Estate",type:"Bungalow",address:"78 Ugbowo, Benin City",units:12,occupied:10,rent:80000,status:"Active",image:"🏠"},
  ],
  units:[
    {id:"u1",propId:"p1",number:"A1",floor:1,type:"1 Bedroom",tenant:"Esther Okafor",phone:"09150784065",rent:150000,paid:true,leaseEnd:"2026-12-31",status:"Occupied"},
    {id:"u2",propId:"p1",number:"A2",floor:1,type:"2 Bedroom",tenant:"Michael Eze",phone:"08134567890",rent:180000,paid:false,leaseEnd:"2026-09-30",status:"Occupied"},
    {id:"u3",propId:"p1",number:"B1",floor:2,type:"1 Bedroom",tenant:"",phone:"",rent:150000,paid:false,leaseEnd:"",status:"Vacant"},
    {id:"u4",propId:"p2",number:"D1",floor:1,type:"3 Bedroom",tenant:"Amaka Peters",phone:"07012345678",rent:250000,paid:true,leaseEnd:"2027-03-31",status:"Occupied"},
    {id:"u5",propId:"p3",number:"E1",floor:1,type:"2 Bedroom",tenant:"Tunde Badmus",phone:"08098765432",rent:80000,paid:false,leaseEnd:"2026-06-30",status:"Occupied"},
  ],
  maintenance:[
    {id:"m1",unit:"A2",property:"Whisper Apartments",issue:"AC not cooling",priority:"High",status:"Open",date:"2026-04-18",tenant:"Michael Eze"},
    {id:"m2",unit:"D1",property:"Sunrise Court",issue:"Plumbing leak in bathroom",priority:"Urgent",status:"In Progress",date:"2026-04-19",tenant:"Amaka Peters"},
    {id:"m3",unit:"E1",property:"Palm Estate",issue:"Door lock broken",priority:"Medium",status:"Resolved",date:"2026-04-15",tenant:"Tunde Badmus"},
  ],
};

const fmt = (n: number) => "₦" + Number(n||0).toLocaleString();
const ini = (n: string) => (n||"?").split(" ").map((x:string)=>x[0]).join("").slice(0,2).toUpperCase();
const calcFare = (km: number, airport=false, night=false) => {
  let f = 500 + km*150 + 100;
  if(airport) f+=800;
  if(night) f*=1.5;
  return Math.max(Math.round(f),800);
};

const STATUS: Record<string,{bg:string,text:string}> = {
  Pending:{bg:"#2d1f0d",text:"#f59e0b"},Active:{bg:"#0d2d1a",text:"#3fb950"},
  Completed:{bg:"#0d1a2d",text:"#58a6ff"},Cancelled:{bg:"#2d0d0d",text:"#f85149"},
  Online:{bg:"#0d2d1a",text:"#3fb950"},Offline:{bg:"#1a1a1a",text:"#7d8590"},
  "On Ride":{bg:"#0d1a2d",text:"#58a6ff"},Occupied:{bg:"#0d2d1a",text:"#3fb950"},
  Vacant:{bg:"#2d1f0d",text:"#f59e0b"},Open:{bg:"#2d0d0d",text:"#f85149"},
  "In Progress":{bg:"#2d1f0d",text:"#f59e0b"},Resolved:{bg:"#0d1a2d",text:"#58a6ff"},
  Urgent:{bg:"#2d0d0d",text:"#f85149"},High:{bg:"#2d1a0d",text:"#d29922"},
  Medium:{bg:"#0d1a2d",text:"#58a6ff"},Low:{bg:"#0d2d1a",text:"#3fb950"},
};

const Badge = ({label}:{label:string}) => {
  const s = STATUS[label]||{bg:"#1a1a1a",text:"#7d8590"};
  return <span style={{background:s.bg,color:s.text,borderRadius:6,padding:"3px 9px",fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>{label}</span>;
};

const Av = ({name,size=36,color=T.blue}:{name:string,size?:number,color?:string}) => (
  <div style={{width:size,height:size,borderRadius:"50%",background:T.surface2,border:`2px solid ${color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.3,fontWeight:700,color,flexShrink:0}}>{ini(name)}</div>
);

const Card = ({children,style={}}:{children:React.ReactNode,style?:React.CSSProperties}) => (
  <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,padding:"18px 20px",marginBottom:14,...style}}>{children}</div>
);

const StatCard = ({label,value,color,icon}:{label:string,value:string|number,color:string,icon:string}) => {
  const [v,setV] = useState(false);
  useEffect(()=>{setTimeout(()=>setV(true),150);},[]);
  return (
    <div style={{background:T.surface,border:`1px solid ${T.border}`,borderTop:`3px solid ${color}`,borderRadius:12,padding:"14px 16px",transition:"transform .2s",cursor:"default"}}
      onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.transform="translateY(-3px)";}}
      onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.transform="translateY(0)";}}>
      <div style={{fontSize:10,color:T.muted,marginBottom:5}}>{icon} {label}</div>
      <div style={{fontSize:20,fontWeight:800,color,opacity:v?1:0,transform:v?"translateY(0)":"translateY(8px)",transition:"all .5s"}}>{value}</div>
    </div>
  );
};

const SectionTitle = ({children}:{children:React.ReactNode}) => (
  <div style={{fontSize:12,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".08em",marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
    {children}<div style={{flex:1,height:1,background:T.border}}/>
  </div>
);

const ProgressBar = ({pct,color=T.blue}:{pct:number,color?:string}) => (
  <div style={{height:6,background:T.surface2,borderRadius:4,overflow:"hidden",marginTop:6}}>
    <div style={{height:"100%",width:`${pct}%`,background:color,borderRadius:4,transition:"width 1s ease"}}/>
  </div>
);

type Ride = typeof MOCK.rides[0];
type Driver = typeof MOCK.drivers[0];
type Unit = typeof MOCK.units[0];

function RideRow({ride,onClick}:{ride:Ride,onClick:()=>void}) {
  const [hov,setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{display:"flex",alignItems:"center",gap:10,padding:"11px 8px",borderBottom:`1px solid ${T.border}`,cursor:"pointer",background:hov?T.surface2:"transparent",borderRadius:8,transition:"all .15s"}}>
      <Av name={ride.passenger} size={34} color={ride.status==="Active"?T.green:ride.status==="Pending"?T.orange:T.blue}/>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontWeight:600,fontSize:13}}>{ride.passenger}</div>
        <div style={{fontSize:11,color:T.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>📍 {ride.pickup} → {ride.dropoff}</div>
        <div style={{fontSize:11,color:T.muted}}>🚗 {ride.driver} · {ride.date}</div>
      </div>
      <div style={{textAlign:"right",flexShrink:0}}>
        <Badge label={ride.status}/>
        {ride.fare>0&&<div style={{fontSize:12,color:T.green,fontWeight:600,marginTop:4}}>{fmt(ride.fare)}</div>}
      </div>
    </div>
  );
}

function DriverCard({driver}:{driver:Driver}) {
  return (
    <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,padding:16,transition:"all .2s"}}
      onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.borderColor=T.blue;(e.currentTarget as HTMLDivElement).style.transform="translateY(-2px)";}}
      onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.borderColor=T.border;(e.currentTarget as HTMLDivElement).style.transform="translateY(0)";}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <Av name={driver.name} size={42} color={driver.status==="Online"?T.green:driver.status==="On Ride"?T.blue:T.muted}/>
          <div><div style={{fontWeight:600,fontSize:14}}>{driver.name}</div><div style={{fontSize:11,color:T.muted}}>{driver.phone}</div></div>
        </div>
        <Badge label={driver.status}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
        {[["Vehicle",driver.vehicle],["Plate",driver.plate],["Rides",String(driver.rides)],["Color",driver.color]].map(([l,v])=>(
          <div key={l} style={{background:T.surface2,borderRadius:8,padding:"7px 10px"}}>
            <div style={{fontSize:10,color:T.muted}}>{l}</div>
            <div style={{fontSize:12,fontWeight:600,color:l==="Plate"?T.blue:T.text}}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{fontSize:11,color:T.muted,marginBottom:4}}>Earnings</div>
      <div style={{fontSize:15,fontWeight:700,color:T.green,marginBottom:4}}>{fmt(driver.earnings)}</div>
      <ProgressBar pct={(driver.earnings/50000)*100} color={T.green}/>
    </div>
  );
}

function TransportView({rides,drivers}:{rides:Ride[],drivers:Driver[]}) {
  const [sub,setSub] = useState("Overview");
  const [sel,setSel] = useState<Ride|null>(null);
  const [search,setSearch] = useState("");
  const [filter,setFilter] = useState("All");
  const [selDriver,setSelDriver] = useState<string|null>(null);
  const [form,setForm] = useState({passenger:"",phone:"",pickup:"",dropoff:"",isAirport:false,notes:""});
  const [booked,setBooked] = useState(false);
  const upd = (k:string,v:string|boolean) => setForm(f=>({...f,[k]:v}));
  const activeRides = rides.filter(r=>r.status==="Active");
  const pendingRides = rides.filter(r=>r.status==="Pending");
  const totalRev = rides.filter(r=>r.status==="Completed").reduce((s,r)=>s+r.fare,0);
  const avail = drivers.filter(d=>d.status!=="On Ride");
  const est = form.pickup&&form.dropoff ? (() => { const km=Math.max(2,Math.min(25,(form.pickup.length+form.dropoff.length)*.28)); return {fare:calcFare(km,form.isAirport),km:km.toFixed(1)}; })() : null;
  const filtered = rides.filter(r=>{const q=search.toLowerCase();return(!q||r.passenger.toLowerCase().includes(q)||r.driver.toLowerCase().includes(q)||r.pickup.toLowerCase().includes(q))&&(filter==="All"||r.status===filter);});

  const TABS = ["Overview","New Ride","All Rides","Drivers"];
  return (
    <div>
      {sel&&(
        <div onClick={()=>setSel(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:400,padding:16,backdropFilter:"blur(6px)"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:T.surface,border:`1px solid ${T.border2}`,borderRadius:16,padding:24,maxWidth:440,width:"100%",maxHeight:"88vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={{fontWeight:700,fontSize:16}}>Ride Details</div>
              <button onClick={()=>setSel(null)} style={{background:T.surface2,border:`1px solid ${T.border}`,color:T.muted,borderRadius:8,padding:"5px 12px",cursor:"pointer"}}>✕</button>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:12,background:T.surface2,borderRadius:12,padding:14,marginBottom:16}}>
              <Av name={sel.passenger} size={46}/><div><div style={{fontWeight:700,fontSize:15}}>{sel.passenger}</div><div style={{color:T.muted,fontSize:12}}>{sel.phone}</div></div>
              <div style={{marginLeft:"auto"}}><Badge label={sel.status}/></div>
            </div>
            {[["📍 Pickup",sel.pickup],["🏁 Dropoff",sel.dropoff],["🚗 Driver",sel.driver],["🔢 Plate",sel.plate],["📅 Date",sel.date],["⏰ Time",sel.time],["📏 Distance",sel.km?`${sel.km} km`:"Not yet"],["💰 Fare",sel.fare?fmt(sel.fare):"Pending"]].map(([l,v])=>(
              <div key={l} style={{display:"flex",padding:"9px 0",borderBottom:`1px solid ${T.border}`,fontSize:13}}><span style={{color:T.muted,width:130,flexShrink:0}}>{l}</span><span style={{color:T.text,fontWeight:500}}>{v}</span></div>
            ))}
            {sel.status==="Pending"&&<div style={{display:"flex",gap:10,marginTop:16}}>
              <button style={{flex:1,padding:12,background:T.grad1,border:"none",borderRadius:10,color:"#fff",fontWeight:600,cursor:"pointer"}}>🚗 Start Ride</button>
              <button style={{flex:1,padding:12,background:"rgba(248,81,73,.12)",border:`1px solid ${T.red}44`,borderRadius:10,color:T.red,fontWeight:600,cursor:"pointer"}}>❌ Cancel</button>
            </div>}
            {sel.status==="Active"&&<button style={{width:"100%",padding:12,background:T.grad2,border:"none",borderRadius:10,color:"#fff",fontWeight:600,cursor:"pointer",marginTop:16}}>✅ Complete Ride</button>}
          </div>
        </div>
      )}

      <div style={{display:"flex",gap:6,marginBottom:18,background:T.surface2,borderRadius:10,padding:4,overflowX:"auto"}}>
        {TABS.map(t=><button key={t} onClick={()=>setSub(t)} style={{background:sub===t?T.grad1:"transparent",border:"none",borderRadius:7,padding:"7px 16px",fontSize:12,fontWeight:600,color:sub===t?"#fff":T.muted,cursor:"pointer",whiteSpace:"nowrap"}}>{t}</button>)}
      </div>

      {sub==="Overview"&&<>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:10,marginBottom:18}}>
          <StatCard label="Total Rides" value={rides.length} color={T.blue} icon="🚗"/>
          <StatCard label="Active" value={activeRides.length} color={T.green} icon="🟢"/>
          <StatCard label="Pending" value={pendingRides.length} color={T.orange} icon="⏳"/>
          <StatCard label="Revenue" value={fmt(totalRev)} color={T.green} icon="💰"/>
          <StatCard label="Drivers" value={`${drivers.filter(d=>d.status!=="Offline").length}/${drivers.length}`} color={T.purple} icon="👨‍✈️"/>
        </div>
        {pendingRides.length>0&&<Card style={{borderLeft:`3px solid ${T.orange}`}}>
          <SectionTitle>⏳ Pending — Action Required ({pendingRides.length})</SectionTitle>
          {pendingRides.map(r=><RideRow key={r.id} ride={r} onClick={()=>setSel(r)}/>)}
        </Card>}
        {activeRides.length>0&&<Card style={{borderLeft:`3px solid ${T.green}`}}>
          <SectionTitle>🚗 Active Rides ({activeRides.length})</SectionTitle>
          {activeRides.map(r=><RideRow key={r.id} ride={r} onClick={()=>setSel(r)}/>)}
        </Card>}
        <Card><SectionTitle>🕐 Recent Rides</SectionTitle>{rides.slice(0,5).map(r=><RideRow key={r.id} ride={r} onClick={()=>setSel(r)}/>)}</Card>
        <Card>
          <SectionTitle>👨‍✈️ Driver Status</SectionTitle>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:10}}>
            {drivers.map(d=>(
              <div key={d.id} style={{background:T.surface2,border:`1px solid ${T.border2}`,borderRadius:12,padding:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:9}}><Av name={d.name} size={36} color={d.status==="Online"?T.green:d.status==="On Ride"?T.blue:T.muted}/><div><div style={{fontWeight:600,fontSize:13}}>{d.name}</div><div style={{fontSize:11,color:T.muted}}>{d.vehicle}</div></div></div>
                  <Badge label={d.status}/>
                </div>
                <div style={{fontSize:11,color:T.muted}}>{d.plate} · {d.rides} rides · <span style={{color:T.green}}>{fmt(d.earnings)}</span></div>
              </div>
            ))}
          </div>
        </Card>
      </>}

      {sub==="New Ride"&&<Card>
        <SectionTitle>📋 Passenger Info</SectionTitle>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[["Passenger Name *","passenger","Full name"],["Phone 📱","phone","0801-234-5678"]].map(([l,k,ph])=>(
            <div key={k}><label style={{fontSize:11,color:T.muted,display:"block",marginBottom:5}}>{l}</label>
            <input value={form[k as keyof typeof form] as string} onChange={e=>upd(k,e.target.value)} placeholder={ph} style={{width:"100%",background:T.surface2,border:`1px solid ${T.border2}`,borderRadius:8,color:T.text,padding:"10px 12px",fontSize:13,outline:"none"}}/></div>
          ))}
        </div>
        <SectionTitle>📍 Route</SectionTitle>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          {[["Pickup *","pickup","e.g. Whisper Apartments"],["Dropoff *","dropoff","e.g. Benin Airport"]].map(([l,k,ph])=>(
            <div key={k}><label style={{fontSize:11,color:T.muted,display:"block",marginBottom:5}}>{l}</label>
            <input value={form[k as keyof typeof form] as string} onChange={e=>upd(k,e.target.value)} placeholder={ph} style={{width:"100%",background:T.surface2,border:`1px solid ${T.border2}`,borderRadius:8,color:T.text,padding:"10px 12px",fontSize:13,outline:"none"}}/></div>
          ))}
        </div>
        <div onClick={()=>upd("isAirport",!form.isAirport)} style={{display:"flex",alignItems:"center",gap:12,background:form.isAirport?"#0d2d1a":T.surface2,border:`1px solid ${form.isAirport?"rgba(63,185,80,.4)":T.border2}`,borderRadius:10,padding:"12px 14px",marginBottom:14,cursor:"pointer",transition:"all .2s"}}>
          <div style={{width:42,height:23,background:form.isAirport?T.green:T.border2,borderRadius:12,position:"relative",transition:".3s",flexShrink:0}}><div style={{position:"absolute",top:2,left:form.isAirport?21:2,width:19,height:19,background:"#fff",borderRadius:"50%",transition:".3s"}}/></div>
          <div><div style={{fontSize:13,fontWeight:500}}>Airport Ride ✈️</div><div style={{fontSize:11,color:T.muted}}>Adds ₦800 surcharge</div></div>
        </div>
        {est&&<div style={{background:"linear-gradient(135deg,#0d2d1a,#081a0f)",border:"1.5px solid rgba(63,185,80,.3)",borderRadius:12,padding:"14px 16px",marginBottom:14}}>
          <div style={{fontSize:10,color:"#86efac",marginBottom:5,textTransform:"uppercase",letterSpacing:".06em"}}>💰 Estimated Fare</div>
          <div style={{fontSize:28,fontWeight:800,color:T.green}}>{fmt(est.fare)}</div>
          <div style={{display:"flex",gap:12,fontSize:11,color:T.muted,marginTop:5,flexWrap:"wrap"}}>
            <span>Base: ₦500</span><span>~{est.km}km × ₦150</span><span>Fee: ₦100</span>
            {form.isAirport&&<span style={{color:"#7dd3fc"}}>✈️ +₦800</span>}
          </div>
        </div>}
        <SectionTitle>🚗 Select Driver *</SectionTitle>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10,marginBottom:14}}>
          {avail.map(d=>(
            <div key={d.id} onClick={()=>setSelDriver(d.id===selDriver?null:d.id)} style={{background:selDriver===d.id?"#0d2d1a":T.surface2,border:`2px solid ${selDriver===d.id?T.blue:T.border2}`,borderRadius:10,padding:12,cursor:"pointer",transition:"all .2s"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontWeight:600,fontSize:12}}>{d.name}</span><Badge label={d.status}/></div>
              <div style={{fontSize:11,color:T.muted}}>{d.vehicle} · {d.plate}</div>
              {selDriver===d.id&&<div style={{fontSize:10,color:T.green,marginTop:5,fontWeight:600}}>✅ Selected</div>}
            </div>
          ))}
        </div>
        {booked&&<div style={{background:"#0d2d1a",border:"1px solid rgba(63,185,80,.4)",borderRadius:8,padding:"10px 14px",marginBottom:12,color:T.green,fontSize:13}}>✅ Ride booked! WhatsApp confirmation sent.</div>}
        <button onClick={()=>{if(!form.passenger||!form.pickup||!form.dropoff||!selDriver)return;setBooked(true);setTimeout(()=>{setBooked(false);setForm({passenger:"",phone:"",pickup:"",dropoff:"",isAirport:false,notes:""});setSelDriver(null);},3000);}} disabled={!form.passenger||!form.pickup||!form.dropoff||!selDriver}
          style={{width:"100%",padding:14,background:T.grad1,border:"none",borderRadius:12,color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer",opacity:(!form.passenger||!form.pickup||!form.dropoff||!selDriver)?.5:1}}>🚗 Book Ride</button>
      </Card>}

      {sub==="All Rides"&&<div>
        <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search…" style={{flex:1,minWidth:160,background:T.surface2,border:`1px solid ${T.border2}`,borderRadius:8,color:T.text,padding:"9px 12px",fontSize:13,outline:"none"}}/>
          <select value={filter} onChange={e=>setFilter(e.target.value)} style={{background:T.surface2,border:`1px solid ${T.border2}`,borderRadius:8,color:T.text,padding:"9px 12px",fontSize:13,outline:"none"}}>
            {["All","Pending","Active","Completed","Cancelled"].map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
        {filtered.map(r=><RideRow key={r.id} ride={r} onClick={()=>setSel(r)}/>)}
        {!filtered.length&&<div style={{textAlign:"center",color:T.muted,padding:40}}>No rides found</div>}
      </div>}

      {sub==="Drivers"&&<div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontSize:13,color:T.muted}}>{drivers.length} drivers</div>
          <button style={{background:T.grad1,border:"none",borderRadius:9,color:"#fff",padding:"9px 18px",fontSize:13,fontWeight:600,cursor:"pointer"}}>+ Add Driver</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
          {drivers.map(d=><DriverCard key={d.id} driver={d}/>)}
        </div>
      </div>}
    </div>
  );
}

function PropertyView({properties,units,maintenance}:{properties:typeof MOCK.properties,units:Unit[],maintenance:typeof MOCK.maintenance}) {
  const [sub,setSub] = useState("Overview");
  const totalRent = units.filter(u=>u.status==="Occupied").reduce((s,u)=>s+u.rent,0);
  const collected = units.filter(u=>u.paid).reduce((s,u)=>s+u.rent,0);
  const vacant = units.filter(u=>u.status==="Vacant").length;
  const openMaint = maintenance.filter(m=>m.status!=="Resolved").length;
  const unpaid = units.filter(u=>u.status==="Occupied"&&!u.paid);
  const TABS = ["Overview","Units","Tenants","Maintenance"];

  return (
    <div>
      <div style={{display:"flex",gap:6,marginBottom:18,background:T.surface2,borderRadius:10,padding:4,overflowX:"auto"}}>
        {TABS.map(t=><button key={t} onClick={()=>setSub(t)} style={{background:sub===t?T.grad3:"transparent",border:"none",borderRadius:7,padding:"7px 16px",fontSize:12,fontWeight:600,color:sub===t?"#fff":T.muted,cursor:"pointer",whiteSpace:"nowrap"}}>{t}</button>)}
      </div>

      {sub==="Overview"&&<>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:10,marginBottom:18}}>
          <StatCard label="Properties" value={properties.length} color={T.purple} icon="🏢"/>
          <StatCard label="Total Units" value={units.length} color={T.blue} icon="🚪"/>
          <StatCard label="Vacant" value={vacant} color={T.orange} icon="🔑"/>
          <StatCard label="Rent/Month" value={fmt(totalRent)} color={T.green} icon="💰"/>
          <StatCard label="Collected" value={fmt(collected)} color={T.cyan} icon="✅"/>
          <StatCard label="Maintenance" value={openMaint} color={T.red} icon="🔧"/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12,marginBottom:14}}>
          {properties.map(p=>{
            const pu=units.filter(u=>u.propId===p.id);
            const occ=pu.filter(u=>u.status==="Occupied").length;
            const rev=pu.filter(u=>u.paid).reduce((s,u)=>s+u.rent,0);
            return (
              <div key={p.id} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,padding:18,transition:"all .2s"}}
                onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.borderColor=T.purple;(e.currentTarget as HTMLDivElement).style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.borderColor=T.border;(e.currentTarget as HTMLDivElement).style.transform="translateY(0)";}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><div style={{fontSize:32}}>{p.image}</div><Badge label={p.status}/></div>
                <div style={{fontWeight:700,fontSize:15,marginBottom:3}}>{p.name}</div>
                <div style={{fontSize:12,color:T.muted,marginBottom:12}}>{p.address}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                  {[["Units",`${occ}/${pu.length}`],["Type",p.type],["Rent",fmt(p.rent)],["Collected",fmt(rev)]].map(([l,v])=>(
                    <div key={l} style={{background:T.surface2,borderRadius:8,padding:"7px 10px"}}>
                      <div style={{fontSize:10,color:T.muted}}>{l}</div>
                      <div style={{fontSize:12,fontWeight:600,color:l==="Collected"?T.green:T.text}}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{fontSize:11,color:T.muted,marginBottom:4}}>Occupancy: {Math.round(occ/pu.length*100)}%</div>
                <ProgressBar pct={(occ/pu.length)*100} color={T.purple}/>
              </div>
            );
          })}
        </div>
        <Card>
          <SectionTitle>🔧 Maintenance Requests ({openMaint} open)</SectionTitle>
          {maintenance.map(m=>(
            <div key={m.id} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 0",borderBottom:`1px solid ${T.border}`}}>
              <div style={{width:36,height:36,borderRadius:10,background:m.priority==="Urgent"?"#2d0d0d":m.priority==="High"?"#2d1a0d":"#0d1a2d",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>
                {m.priority==="Urgent"?"🚨":m.priority==="High"?"⚠️":"🔧"}
              </div>
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{m.issue}</div><div style={{fontSize:11,color:T.muted}}>{m.property} · Unit {m.unit} · {m.tenant}</div></div>
              <div style={{textAlign:"right"}}><Badge label={m.status}/><div style={{marginTop:4}}><Badge label={m.priority}/></div></div>
            </div>
          ))}
        </Card>
      </>}

      {sub==="Units"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
        {units.map(u=>{
          const prop=properties.find(p=>p.id===u.propId);
          return (
            <div key={u.id} style={{background:T.surface,border:`1px solid ${u.status==="Vacant"?T.orange+"44":T.border}`,borderRadius:14,padding:16}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><div><div style={{fontWeight:700,fontSize:15}}>Unit {u.number}</div><div style={{fontSize:11,color:T.muted}}>{prop?.name} · {u.type}</div></div><Badge label={u.status}/></div>
              {u.tenant?<div style={{display:"flex",alignItems:"center",gap:10,background:T.surface2,borderRadius:10,padding:10,marginBottom:12}}><Av name={u.tenant} size={34} color={T.purple}/><div><div style={{fontWeight:500,fontSize:13}}>{u.tenant}</div><div style={{fontSize:11,color:T.muted}}>{u.phone}</div></div></div>:<div style={{background:T.surface2,borderRadius:10,padding:10,marginBottom:12,textAlign:"center",color:T.muted,fontSize:12}}>🔑 Vacant</div>}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                {[["Rent",fmt(u.rent)],["Lease",u.leaseEnd||"N/A"],["Floor",`Floor ${u.floor}`],["Payment",u.paid?"Paid":"Unpaid"]].map(([l,v])=>(
                  <div key={l} style={{background:T.surface2,borderRadius:8,padding:"7px 10px"}}><div style={{fontSize:10,color:T.muted}}>{l}</div><div style={{fontSize:12,fontWeight:600,color:l==="Payment"?u.paid?T.green:T.red:l==="Rent"?T.green:T.text}}>{v}</div></div>
                ))}
              </div>
              {u.tenant&&<div style={{display:"flex",gap:8}}>
                <button style={{flex:1,padding:8,background:"#0a2d1a",border:"1.5px solid rgba(37,211,102,.4)",borderRadius:8,color:"#25d366",fontSize:11,cursor:"pointer"}}>💬 WhatsApp</button>
                {!u.paid&&<button style={{flex:1,padding:8,background:T.grad1,border:"none",borderRadius:8,color:"#fff",fontSize:11,cursor:"pointer"}}>💰 Mark Paid</button>}
              </div>}
            </div>
          );
        })}
      </div>}

      {sub==="Tenants"&&<div>
        {unpaid.length>0&&<Card style={{borderLeft:`3px solid ${T.red}`}}>
          <SectionTitle>⚠️ Rent Overdue ({unpaid.length})</SectionTitle>
          {unpaid.map(u=>(
            <div key={u.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
              <Av name={u.tenant} size={34} color={T.red}/><div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{u.tenant}</div><div style={{fontSize:11,color:T.muted}}>Unit {u.number} · {u.phone}</div></div>
              <div style={{textAlign:"right"}}><div style={{color:T.red,fontWeight:700}}>{fmt(u.rent)}</div></div>
            </div>
          ))}
        </Card>}
        <Card>
          <SectionTitle>👥 All Tenants</SectionTitle>
          {units.filter(u=>u.status==="Occupied"&&u.tenant).map(u=>(
            <div key={u.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:`1px solid ${T.border}`}}>
              <Av name={u.tenant} size={38} color={u.paid?T.green:T.orange}/><div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{u.tenant}</div><div style={{fontSize:11,color:T.muted}}>Unit {u.number} · Lease ends {u.leaseEnd}</div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:13,fontWeight:700,color:u.paid?T.green:T.red}}>{fmt(u.rent)}</div><div style={{marginTop:3}}><Badge label={u.paid?"Paid":"Unpaid"}/></div></div>
            </div>
          ))}
        </Card>
      </div>}

      {sub==="Maintenance"&&<Card>
        <SectionTitle>🔧 All Maintenance Requests</SectionTitle>
        {maintenance.map(m=>(
          <div key={m.id} style={{background:T.surface2,borderRadius:12,padding:14,marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><div style={{fontWeight:600,fontSize:14}}>{m.issue}</div><Badge label={m.status}/></div>
            {[["Property",m.property],["Unit",m.unit],["Tenant",m.tenant],["Date",m.date]].map(([l,v])=>(
              <div key={l} style={{display:"flex",gap:10,fontSize:12,marginBottom:3}}><span style={{color:T.muted,width:70}}>{l}</span><span>{v}</span></div>
            ))}
            <div style={{display:"flex",gap:8,marginTop:10}}><Badge label={m.priority}/>{m.status!=="Resolved"&&<button style={{background:T.grad2,border:"none",borderRadius:6,color:"#fff",fontSize:11,padding:"4px 12px",cursor:"pointer"}}>Mark Resolved</button>}</div>
          </div>
        ))}
        <button style={{width:"100%",marginTop:4,padding:11,background:T.grad3,border:"none",borderRadius:10,color:"#fff",fontWeight:600,cursor:"pointer"}}>+ New Request</button>
      </Card>}
    </div>
  );
}

function ReportsView({rides,drivers,units}:{rides:Ride[],drivers:Driver[],units:Unit[]}) {
  const totalRev = rides.filter(r=>r.status==="Completed").reduce((s,r)=>s+r.fare,0);
  const rentRev = units.filter(u=>u.paid).reduce((s,u)=>s+u.rent,0);
  const maxEarn = Math.max(...drivers.map(d=>d.earnings),1);
  const statusData = [
    {l:"Completed",c:rides.filter(r=>r.status==="Completed").length,col:T.blue},
    {l:"Active",c:rides.filter(r=>r.status==="Active").length,col:T.green},
    {l:"Pending",c:rides.filter(r=>r.status==="Pending").length,col:T.orange},
    {l:"Cancelled",c:rides.filter(r=>r.status==="Cancelled").length,col:T.red},
  ];
  const maxC = Math.max(...statusData.map(s=>s.c),1);
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:10,marginBottom:18}}>
        <StatCard label="Transport Rev" value={fmt(totalRev)} color={T.green} icon="🚗"/>
        <StatCard label="Rent Collected" value={fmt(rentRev)} color={T.purple} icon="🏢"/>
        <StatCard label="Total Revenue" value={fmt(totalRev+rentRev)} color={T.cyan} icon="💰"/>
        <StatCard label="KM Driven" value={`${rides.reduce((s,r)=>s+r.km,0).toFixed(0)}km`} color={T.blue} icon="📏"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        <Card>
          <SectionTitle>📊 Ride Status</SectionTitle>
          {statusData.map(s=>(
            <div key={s.l} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{color:s.col,fontWeight:500}}>{s.l}</span><span style={{color:T.muted}}>{s.c}</span></div>
              <ProgressBar pct={(s.c/maxC)*100} color={s.col}/>
            </div>
          ))}
        </Card>
        <Card>
          <SectionTitle>🏢 Rent Status</SectionTitle>
          {[{l:"Paid",c:units.filter(u=>u.paid).length,col:T.green},{l:"Unpaid",c:units.filter(u=>u.status==="Occupied"&&!u.paid).length,col:T.red},{l:"Vacant",c:units.filter(u=>u.status==="Vacant").length,col:T.orange}].map(s=>(
            <div key={s.l} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{color:s.col,fontWeight:500}}>{s.l}</span><span style={{color:T.muted}}>{s.c} units</span></div>
              <ProgressBar pct={(s.c/units.length)*100} color={s.col}/>
            </div>
          ))}
        </Card>
      </div>
      <Card>
        <SectionTitle>👨‍✈️ Driver Earnings</SectionTitle>
        {drivers.map(d=>(
          <div key={d.id} style={{marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:5}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}><Av name={d.name} size={26}/><span style={{fontSize:12,fontWeight:500}}>{d.name}</span><span style={{fontSize:11,color:T.muted}}>{d.rides} rides</span></div>
              <span style={{color:T.green,fontWeight:700,fontSize:13}}>{fmt(d.earnings)}</span>
            </div>
            <ProgressBar pct={(d.earnings/maxEarn)*100} color={T.blue}/>
          </div>
        ))}
      </Card>
      <div style={{display:"flex",gap:10}}>
        <button style={{flex:1,padding:13,background:T.grad2,border:"none",borderRadius:12,color:"#fff",fontWeight:600,cursor:"pointer",fontSize:13}}>📊 Export CSV</button>
        <button style={{flex:1,padding:13,background:T.grad1,border:"none",borderRadius:12,color:"#fff",fontWeight:600,cursor:"pointer",fontSize:13}}>📄 Download PDF</button>
      </div>
    </div>
  );
}

const MODULES = ["🚗 Transport","🏢 Property","📊 Reports","⚙️ Settings"];

export default function App() {
  const [module,setModule] = useState("🚗 Transport");
  const rides = MOCK.rides;
  const drivers = MOCK.drivers;
  const properties = MOCK.properties;
  const units = MOCK.units;
  const maintenance = MOCK.maintenance;
  const activeRides = rides.filter(r=>r.status==="Active").length;
  const unpaidRent = units.filter(u=>u.status==="Occupied"&&!u.paid).length;

  return (
    <div style={{background:T.bg,minHeight:"100vh",color:T.text,fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <div style={{background:T.surface,borderBottom:`1px solid ${T.border}`,position:"sticky",top:0,zIndex:200}}>
        <div style={{display:"flex",alignItems:"center",padding:"0 16px",height:54,gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <div style={{width:34,height:34,background:T.grad1,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🏙️</div>
            <div><div style={{fontWeight:800,fontSize:15}}>ApartBook <span style={{color:T.blue}}>Pro</span></div><div style={{fontSize:9,color:T.muted,textTransform:"uppercase",letterSpacing:".06em"}}>Property & Transport</div></div>
          </div>
          <div style={{display:"flex",gap:3,background:T.surface2,borderRadius:10,padding:3,marginLeft:8,overflowX:"auto"}}>
            {MODULES.map(m=><button key={m} onClick={()=>setModule(m)} style={{background:module===m?T.grad1:"transparent",border:"none",borderRadius:7,padding:"5px 10px",fontSize:11,fontWeight:600,color:module===m?"#fff":T.muted,cursor:"pointer",whiteSpace:"nowrap"}}>{m}</button>)}
          </div>
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6}}>
            {activeRides>0&&<div style={{background:"#0d2d1a",border:"1px solid rgba(63,185,80,.4)",borderRadius:20,padding:"3px 8px",fontSize:10,fontWeight:600,color:T.green}}>🚗 {activeRides}</div>}
            {unpaidRent>0&&<div style={{background:"#2d0d0d",border:"1px solid rgba(248,81,73,.4)",borderRadius:20,padding:"3px 8px",fontSize:10,fontWeight:600,color:T.red}}>⚠️ {unpaidRent}</div>}
            <div style={{background:T.surface2,border:`1px solid ${T.border2}`,borderRadius:9,padding:"5px 10px",display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:26,height:26,borderRadius:"50%",background:T.grad1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff"}}>AD</div>
              <div style={{fontSize:10,color:T.text}}>Admin</div>
            </div>
            <button style={{background:"#2d0d0d",border:"1.5px solid rgba(248,81,73,.4)",borderRadius:8,padding:"5px 9px",cursor:"pointer",color:T.red,fontSize:11,fontWeight:700}}>⏻</button>
          </div>
        </div>
      </div>
      <div style={{padding:"18px 16px",maxWidth:1100,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <div style={{fontWeight:700,fontSize:18}}>{module}</div>
          <div style={{fontSize:11,color:T.muted,background:T.surface2,border:`1px solid ${T.border}`,borderRadius:6,padding:"4px 10px"}}>⚛️ React + TypeScript</div>
        </div>
        {module==="🚗 Transport"&&<TransportView rides={rides} drivers={drivers}/>}
        {module==="🏢 Property"&&<PropertyView properties={properties} units={units} maintenance={maintenance}/>}
        {module==="📊 Reports"&&<ReportsView rides={rides} drivers={drivers} units={units}/>}
        {module==="⚙️ Settings"&&<Card>
          <SectionTitle>⚙️ Fare Pricing</SectionTitle>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
            {[["Base Fare (₦)","500"],["Per KM (₦)","150"],["Per Wait Min (₦)","25"],["Min Fare (₦)","800"],["Night Multiplier","1.5"],["Airport Fee (₦)","800"]].map(([l,v])=>(
              <div key={l}><label style={{fontSize:11,color:T.muted,display:"block",marginBottom:5}}>{l}</label><input defaultValue={v} style={{width:"100%",background:T.surface2,border:`1px solid ${T.border2}`,borderRadius:8,color:T.text,padding:"10px 12px",fontSize:13,outline:"none"}}/></div>
            ))}
          </div>
          <button style={{width:"100%",padding:13,background:T.grad1,border:"none",borderRadius:12,color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer"}}>💾 Save Settings</button>
        </Card>}
      </div>
      <div style={{position:"fixed",bottom:20,right:20,width:50,height:50,borderRadius:"50%",background:"#25d366",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,cursor:"pointer",boxShadow:"0 4px 20px rgba(37,211,102,.5)",zIndex:300}}>💬</div>
    </div>
  );
}
