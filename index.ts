import {createClient} from "https://esm.sh/@supabase/supabase-js@2.45.4";
const cors={"Access-Control-Allow-Origin":Deno.env.get("ALLOWED_ORIGIN")??"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};
const J=(b:unknown,s=200)=>new Response(JSON.stringify(b),{status:s,headers:{...cors,"Content-Type":"application/json"}});
const s=(v:unknown,n:number)=>typeof v==="string"?v.trim().slice(0,n):"";
const MAP=/^https:\/\/(www\.google\.com\/maps|maps\.google\.com|maps\.app\.goo\.gl|goo\.gl\/maps)(\/|\?|$)/;
const UUID=/^[0-9a-f-]{36}$/i,PHONE=/^[+\d][\d\s().-]{5,24}$/,MAIL=/^[^@\s]+@[^@\s]+\.[^@\s]+$/,DATE=/^\d{4}-\d{2}-\d{2}$/,TIME=/^\d{2}:\d{2}$/;
const sb=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
Deno.serve(async req=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
 try{
  const {type,data:d,hp}=await req.json();if(hp)return J({ok:true});
  const ip=(req.headers.get("x-forwarded-for")??"x").split(",")[0].trim();
  const h=Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(ip+Deno.env.get("SUPABASE_URL"))))).map(b=>b.toString(16).padStart(2,"0")).join("");
  const {count}=await sb.from("rate_limits").select("*",{count:"exact",head:true}).eq("ip_hash",h).gte("at",new Date(Date.now()-3600e3).toISOString());
  if((count??0)>=5)return J({ok:false,error:"rate"},429);
  const bad=()=>J({ok:false,error:"invalid"},400);
  if(type==="sign"){ // URLs signees pour photos de reference (max 3, jpeg/png/webp, 5 Mo impose par le bucket)
   const ex:Record<string,string>={"image/jpeg":"jpg","image/png":"png","image/webp":"webp"},types=Array.isArray(d?.types)?d.types.slice(0,3):[];
   if(!types.length||types.some((t:string)=>!ex[t]))return bad();
   const out=[];for(const t of types){const path=`ref/${crypto.randomUUID()}.${ex[t]}`;const {data,error}=await sb.storage.from("reference-uploads").createSignedUploadUrl(path);if(error)return J({ok:false,error:"sign"},500);out.push({path,token:data.token})}
   await sb.from("rate_limits").insert({ip_hash:h});return J({ok:true,files:out});
  }
  let row:Record<string,unknown>,table:string;
  const lang=d.lang==="es"?"es":"ht";
  if(type==="review"){const r=Number(d.rating);if(!s(d.display_name,80)||!s(d.body,2000)||!(r>=1&&r<=5))return bad();table="reviews";row={display_name:s(d.display_name,80),rating:Math.round(r),body:s(d.body,2000),status:"pending",verified:false}}
  else{
   if(!s(d.name,120)||!PHONE.test(s(d.phone,30)))return bad();
   if(d.email&&!MAIL.test(s(d.email,200)))return bad();
   if(d.country&&!["HT","DO"].includes(d.country))return bad();
   if(type!=="contact"&&!d.country)return bad();
   if(d.map_link&&!MAP.test(s(d.map_link,500)))return bad();
   const addr:Record<string,string>={};if(d.address&&typeof d.address==="object")for(const[k,v]of Object.entries(d.address).slice(0,12))addr[s(k,30)]=s(v,200);
   const lat=Number(d.lat),lng=Number(d.lng),geo=d.lat!=null&&Math.abs(lat)<=90&&Math.abs(lng)<=180;
   const svc=UUID.test(s(d.service_id,40))?s(d.service_id,40):null;
   const att=Array.isArray(d.attachments)?d.attachments.slice(0,3).map((x:unknown)=>s(x,80)).filter((x:string)=>/^ref\/[0-9a-f-]{36}\.(jpg|png|webp)$/.test(x)):[];
   const base={name:s(d.name,120),phone:s(d.phone,30),email:s(d.email,200)||null,lang,country:d.country||null,address:addr};
   if(type==="contact"){if(!s(d.message,3000))return bad();table="inquiries";row={...base,whatsapp:s(d.whatsapp,30)||null,subject:s(d.subject,200)||null,message:s(d.message,3000)}}
   else if(type==="quote"){if(!s(d.description,3000))return bad();table="quotes";row={...base,service_id:svc,map_link:s(d.map_link,500)||null,attachments:att,lat:geo?lat:null,lng:geo?lng:null,description:s(d.description,3000),size_text:s(d.size_text,200)||null,start_date:DATE.test(s(d.start_date,10))?d.start_date:null,budget_text:s(d.budget_text,200)||null}}
   else if(type==="appointment"){if(!DATE.test(s(d.pref_date,10))||!TIME.test(s(d.pref_time,5))||d.pref_date<new Date().toISOString().slice(0,10))return bad();table="appointments";row={...base,service_id:svc,map_link:s(d.map_link,500)||null,attachments:att,lat:geo?lat:null,lng:geo?lng:null,description:s(d.description,3000)||null,pref_date:d.pref_date,pref_time:d.pref_time,status:"new"}}
   else return bad();
  }
  const {error}=await sb.from(table).insert(row);
  if(error){console.error(error.message);return J({ok:false,error:"db"},500)}
  await sb.from("rate_limits").insert({ip_hash:h});
  const key=Deno.env.get("RESEND_API_KEY"),to=Deno.env.get("NOTIFY_EMAIL"),from=Deno.env.get("FROM_EMAIL");
  if(key&&to&&from)try{await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${key}`,"Content-Type":"application/json"},body:JSON.stringify({from,to:[to],subject:`KONSTRIVAL: nouvelle demande (${type})`,text:"Nouvelle demande enregistree. Ouvrez /admin pour la consulter."})})}catch(e){console.error("mail",String(e))}
  return J({ok:true});
 }catch(e){console.error(String(e));return J({ok:false,error:"server"},400)}
});
