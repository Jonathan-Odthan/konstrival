(()=>{
const L=document.documentElement.lang==='es'?'es':'ht',C=window.KONSTRIVAL_CONFIG||{},$=s=>document.querySelector(s),WA='50940894038';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const TT={ht:{wa:'Bonjou KONSTRIVAL, mwen enterese nan sèvis nou yo. Mwen ta renmen jwenn plis enfòmasyon sou pwojè mwen an.',name:'Non konplè',phone:'Telefòn',whatsapp:'WhatsApp (si diferan)',email:'Imèl (opsyonèl)',lang:'Lang preferans',subject:'Sijè',message:'Mesaj',countryQ:'Peyi kote travay la ap fèt',haiti:'Ayiti / Haití',dr:'Repiblik Dominikèn / República Dominicana',service:'Sèvis',date:'Dat preferans',time:'Lè preferans',desc:'Dekri pwojè a',size:'Gwosè apwoksimatif (opsyonèl)',start:'Dat pou kòmanse (opsyonèl)',budget:'Bidjè (opsyonèl)',send:'Voye',ok:'Mesaj ou anrejistre. KONSTRIVAL ap kontakte w.',okA:'Demann ou anrejistre. Se KONSTRIVAL ki pral konfime randevou a; li poko konfime.',err:'Nou pa t kapab anrejistre demann lan. Tanpri eseye ankò oswa ekri nou sou WhatsApp.',cfg:'Sit la poko konekte ak baz done a.',mapLink:'Lyen Google Maps (opsyonèl)',mapOpen:'Louvri adrès la sou Google Maps',useLoc:'Itilize pozisyon mwen (opsyonèl)',locOk:'Pozisyon anrejistre.',locNo:'Pozisyon pa disponib.',mapBad:'Lyen kat la pa valid.',rating:'Nòt',yname:'Non ou',review:'Avi ou',revOk:'Mèsi! Avi ou ap parèt apre revizyon.',none:'Okenn.',noRev:'Poko gen avi.',noFaq:'Poko gen kesyon.',noSv:'Poko gen sèvis.',noProj:'Poko gen pwojè ki pibliye. Kontakte nou pou plis enfòmasyon.',all:'Tout sèvis',similar:'Mande yon sèvis menm jan',quote:'Mande yon estimasyon',waBtn:'Ekri sou WhatsApp',price:'Pri',avg:'Mwayèn',reply:'Repons KONSTRIVAL',dept:'Depatman',commune:'Komin',section:'Seksyon kominal / katye',street:'Ri oswa wout',number:'Nimewo kay (si genyen)',landmark:'Pwen repè tou pre',directions:'Lòt direksyon',province:'Pwovens',municipality:'Minisipalite / distri',sector:'Sektè / katye',unit:'Apatman / inite (si genyen)',before:'Avan',after:'Apre',video:'Videyo',es:'Espayòl',ht:'Kreyòl'},
es:{wa:'Hola KONSTRIVAL, me interesan sus servicios. Quisiera recibir más información sobre mi proyecto.',name:'Nombre completo',phone:'Teléfono',whatsapp:'WhatsApp (si es diferente)',email:'Correo (opcional)',lang:'Idioma preferido',subject:'Asunto',message:'Mensaje',countryQ:'País donde se realizará el trabajo',haiti:'Ayiti / Haití',dr:'Repiblik Dominikèn / República Dominicana',service:'Servicio',date:'Fecha preferida',time:'Hora preferida',desc:'Describe el proyecto',size:'Tamaño aproximado (opcional)',start:'Fecha de inicio (opcional)',budget:'Presupuesto (opcional)',send:'Enviar',ok:'Tu mensaje fue guardado. KONSTRIVAL te contactará.',okA:'Tu solicitud fue guardada. KONSTRIVAL confirmará la cita; aún no está confirmada.',err:'No pudimos guardar la solicitud. Inténtalo de nuevo o escríbenos por WhatsApp.',cfg:'El sitio aún no está conectado a la base de datos.',mapLink:'Enlace de Google Maps (opcional)',mapOpen:'Abrir la dirección en Google Maps',useLoc:'Usar mi ubicación (opcional)',locOk:'Ubicación guardada.',locNo:'Ubicación no disponible.',mapBad:'El enlace del mapa no es válido.',rating:'Calificación',yname:'Tu nombre',review:'Tu opinión',revOk:'¡Gracias! Tu opinión aparecerá tras la revisión.',none:'Ninguno.',noRev:'Aún no hay opiniones.',noFaq:'Aún no hay preguntas.',noSv:'Aún no hay servicios.',noProj:'Aún no hay proyectos publicados. Contáctanos para más información.',all:'Todos los servicios',similar:'Solicitar un servicio similar',quote:'Solicitar presupuesto',waBtn:'Escribir por WhatsApp',price:'Precio',avg:'Promedio',reply:'Respuesta de KONSTRIVAL',dept:'Departamento',commune:'Comuna',section:'Sección comunal / barrio',street:'Calle o camino',number:'Número de casa (si existe)',landmark:'Punto de referencia cercano',directions:'Indicaciones adicionales',province:'Provincia',municipality:'Municipio / distrito',sector:'Sector / barrio',unit:'Apartamento / unidad (si aplica)',before:'Antes',after:'Después',video:'Video',es:'Español',ht:'Criollo haitiano'}};
TT.ht.photos='Foto referans (maks 3, 5 MB chak, opsyonèl)';TT.es.photos='Fotos de referencia (máx. 3, 5 MB c/u, opcional)';TT.ht.photoBad='Foto yo dwe JPEG/PNG/WebP, maks 3 ak 5 MB.';TT.es.photoBad='Las fotos deben ser JPEG/PNG/WebP, máx. 3 y 5 MB.';TT.ht.cons='Nou ka itilize Google Analytics pou konprann itilizasyon sit la (san done pèsonèl). Aksepte?';TT.es.cons='¿Aceptas que usemos Google Analytics para entender el uso del sitio (sin datos personales)?';TT.ht.yes='Aksepte';TT.es.yes='Aceptar';TT.ht.no='Refize';TT.es.no='Rechazar';TT.ht.hours='Orè';TT.es.hours='Horario';TT.ht.addr='Adrès biwo';TT.es.addr='Dirección de oficina';
const T=TT[L],ok=C.url&&!C.url.includes('VOTRE'),sb=ok&&window.supabase?supabase.createClient(C.url,C.anon):null;
const pub=p=>sb.storage.from('public-media').getPublicUrl(p).data.publicUrl,nm=(r,k)=>r[k+'_'+L]||r[k+'_ht']||'',page=document.body.dataset.page,app=$('#app'),qs=new URLSearchParams(location.search);
const waUrl=x=>`https://wa.me/${WA}?text=${encodeURIComponent(T.wa+(x?' ('+x+')':''))}`;
let BIZ={};const track=(n,p)=>{try{window.gtag&&gtag('event',n,p||{})}catch(e){}};
const stars=n=>'★'.repeat(n)+'☆'.repeat(5-n);
const MAP=/^https:\/\/(www\.google\.com\/maps|maps\.google\.com|maps\.app\.goo\.gl|goo\.gl\/maps)(\/|\?|$)/;
const DEPT=['Artibonite','Centre',"Grand'Anse",'Nippes','Nord','Nord-Est','Nord-Ouest','Ouest','Sud','Sud-Est'];
async function services(){if(!sb)return[];const{data}=await sb.from('services').select('*').eq('active',true).order('sort');return data||[]}
// ---------- home
async function home(){if(!sb)return;
 const{data:s}=await sb.from('site_settings').select('value').eq('key','hero_image').maybeSingle();if(s?.value?.path){const i=$('.hero');i.removeAttribute('width');i.removeAttribute('height');i.src=pub(s.value.path)}
 const sv=await services();if(sv.length)$('#sv-list').innerHTML=sv.map(x=>`<li>${esc(nm(x,'name'))}</li>`).join('');
 const{data:p}=await sb.from('projects').select('id,title_ht,title_es,project_media(path,kind,sort)').eq('status','published').eq('featured',true).limit(6);
 if(p?.length)$('#pr-list').innerHTML=p.map(card).join('')}
const card=p=>{const m=(p.project_media||[]).filter(x=>x.kind!=='video').sort((a,b)=>a.sort-b.sort)[0];return`<a class="pc" href="/${L}/projets/?id=${p.id}">${m?`<img loading="lazy" src="${pub(m.path)}" alt="${esc(nm(p,'title'))}">`:''}<b>${esc(nm(p,'title'))}</b></a>`}
// ---------- services
async function servicesPage(){if(!sb)return app.innerHTML=T.cfg;const sv=await services();
 app.innerHTML=sv.map(x=>`<article class="card"><h2>${esc(nm(x,'name'))}</h2><p>${esc(nm(x,'desc'))}</p>${x.price_text?`<p><b>${T.price}:</b> ${esc(x.price_text)}</p>`:''}<a class="b r" href="/${L}/devis/?service=${x.id}">${T.quote}</a> <a class="b g" href="${waUrl(nm(x,'name'))}">${T.waBtn}</a></article>`).join('')||`<p>${T.noSv}</p>`}
// ---------- projects
async function projectsPage(){if(!sb)return app.innerHTML=T.cfg;const id=qs.get('id');
 if(id){const{data:p}=await sb.from('projects').select('*,project_media(*)').eq('id',id).maybeSingle();if(!p)return app.innerHTML=T.noProj;
  const m=(p.project_media||[]).sort((a,b)=>a.sort-b.sort);document.title=(p.seo_title||nm(p,'title'))+' | KONSTRIVAL';if(p.seo_desc)document.querySelector('meta[name=description]')?.setAttribute('content',p.seo_desc);
  app.innerHTML=`<article><h2>${esc(nm(p,'title'))}</h2><p>${esc(nm(p,'desc'))}</p>${p.public_location?`<p>${esc(p.public_location)}</p>`:''}<div class="gal">${m.map(x=>x.kind==='video'?`<figure><video controls preload="metadata" src="${pub(x.path)}"></video></figure>`:`<figure><img loading="lazy" src="${pub(x.path)}" alt="${esc(nm(p,'title'))} — ${T[x.kind]||''}">${T[x.kind]?`<figcaption>${T[x.kind]}</figcaption>`:''}</figure>`).join('')}</div>${p.testimonial?`<blockquote>${esc(p.testimonial)}</blockquote>`:''}<p><a class="b r" href="/${L}/devis/?service=${p.service_id||''}&project=${p.id}">${T.similar}</a> <a class="b g" href="${waUrl(nm(p,'title'))}">${T.waBtn}</a></p></article>`;return}
 const[{data:ps},sv]=await Promise.all([sb.from('projects').select('id,title_ht,title_es,service_id,project_media(path,kind,sort)').eq('status','published').order('created_at',{ascending:false}),services()]);
 if(!ps?.length)return app.innerHTML=`<p>${T.noProj}</p><p><a class="b g" href="${waUrl()}">${T.waBtn}</a></p>`;
 app.innerHTML=`<label for="flt">${T.service}</label><select id="flt"><option value="">${T.all}</option>${sv.map(x=>`<option value="${x.id}">${esc(nm(x,'name'))}</option>`).join('')}</select><div class="grid" id="pg"></div>`;
 const draw=()=>{const f=$('#flt').value;$('#pg').innerHTML=ps.filter(p=>!f||p.service_id===f).map(card).join('')};$('#flt').onchange=draw;draw()}
// ---------- faq / reviews
async function faqPage(){if(!sb)return app.innerHTML=T.cfg;const{data}=await sb.from('faqs').select('*').eq('active',true).order('sort');
 app.innerHTML=(data||[]).map(f=>`<details class="card"><summary>${esc(nm(f,'q'))}</summary><p>${esc(nm(f,'a'))}</p></details>`).join('')||`<p>${T.noFaq}</p>`}
async function reviewsPage(){if(!sb)return app.innerHTML=T.cfg;const{data}=await sb.from('reviews').select('*').eq('status','approved').order('created_at',{ascending:false});
 const avg=data?.length?(data.reduce((a,r)=>a+r.rating,0)/data.length).toFixed(1):null;
 app.innerHTML=(avg?`<p><b>${T.avg}: ${avg}/5</b> (${data.length})</p>`:'')+((data||[]).map(r=>`<article class="card"><b>${esc(r.display_name)}</b> <span class="st" aria-label="${r.rating}/5">${stars(r.rating)}</span><p>${esc(r.body)}</p>${r.admin_reply?`<p><em>${T.reply}:</em> ${esc(r.admin_reply)}</p>`:''}</article>`).join('')||`<p>${T.noRev}</p>`)+`<form id="f" class="card" novalidate><h2>${T.review}</h2>${fld('display_name',T.yname,{req:1})}${fld('rating',T.rating,{req:1,opts:[5,4,3,2,1].map(n=>[n,stars(n)])})}${fld('body',T.review,{type:'textarea',req:1})}${hp()}<button class="b r">${T.send}</button><p id="res" role="status"></p></form>`;
 $('#f').onsubmit=e=>send(e,'review',T.revOk)}
// ---------- forms
const fld=(id,label,o={})=>{const r=o.req?' required':'',lab=`<label for="${id}">${label}${o.req?' *':''}</label>`;
 if(o.opts)return lab+`<select id="${id}" name="${id}"${r}><option value="">—</option>${o.opts.map(x=>`<option value="${esc(x[0])}">${esc(x[1])}</option>`).join('')}</select>`;
 if(o.type==='textarea')return lab+`<textarea id="${id}" name="${id}" rows="4" maxlength="3000"${r}></textarea>`;
 return lab+`<input id="${id}" name="${id}" type="${o.type||'text'}" maxlength="200"${r}${o.min?` min="${o.min}"`:''}>`};
const photoIn=()=>`<label for="photos">${T.photos}</label><input id="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple>`;
const hp=()=>'<input name="website" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true">';
const addrHT=()=>fld('a_department',T.dept,{opts:DEPT.map(d=>[d,d])})+['commune','section','street','number','landmark','directions'].map(k=>fld('a_'+k,T[k])).join('');
const addrDO=()=>['province','municipality','sector','street','number','unit','landmark','directions'].map(k=>fld('a_'+k,T[k])).join('');
let geo=null;
function mapsUrl(f){const v=f.elements.map_link?.value.trim();if(v&&MAP.test(v))return v;if(geo)return`https://www.google.com/maps/search/?api=1&query=${geo.lat},${geo.lng}`;
 const parts=[...f.querySelectorAll('#addr [name^=a_]')].map(i=>i.value.trim()).filter(Boolean);parts.push(f.elements.country.value==='HT'?'Haiti':f.elements.country.value==='DO'?'República Dominicana':'');
 return`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parts.filter(Boolean).join(', '))}`}
function locBlock(){return`<div id="addr"></div><div id="loc" hidden>${fld('map_link',T.mapLink,{type:'url'})}<p><button type="button" class="b s" id="gps">${T.useLoc}</button> <span id="gpsr" role="status"></span></p><p><a class="b s" id="mo" target="_blank" rel="noopener">${T.mapOpen}</a></p></div>`}
function wireLoc(f){const c=f.elements.country;const upd=()=>{$('#loc').hidden=!c.value;$('#addr').innerHTML=c.value==='HT'?addrHT():c.value==='DO'?addrDO():''};c.onchange=upd;
 $('#mo').onclick=e=>{const m=f.elements.map_link.value.trim();if(m&&!MAP.test(m)){e.preventDefault();$('#gpsr').textContent=T.mapBad;return}$('#mo').href=mapsUrl(f)};
 $('#gps').onclick=()=>navigator.geolocation?navigator.geolocation.getCurrentPosition(p=>{geo={lat:p.coords.latitude,lng:p.coords.longitude};$('#gpsr').textContent=T.locOk},()=>$('#gpsr').textContent=T.locNo):$('#gpsr').textContent=T.locNo}
async function send(e,type,okMsg){e.preventDefault();const f=e.target,res=$('#res');if(!f.reportValidity())return;if(!sb){res.textContent=T.cfg;return}
 if(f.elements.map_link?.value&&!MAP.test(f.elements.map_link.value.trim())){res.textContent=T.mapBad;return}
 const fd=Object.fromEntries(new FormData(f)),data={lang:L},address={};
 for(const[k,v]of Object.entries(fd)){if(k==='website')continue;const t=String(v).trim();if(k.startsWith('a_')){if(t)address[k.slice(2)]=t}else if(t)data[k]=t}
 if(type!=='review'){data.address=address;if(geo){data.lat=geo.lat;data.lng=geo.lng}}
 const b=f.querySelector('button.r');b.disabled=true;res.textContent='…';
 const ph=f.querySelector('#photos')?.files;
 if(ph&&ph.length){const fl=[...ph];if(fl.length>3||fl.some(x=>!/^image\/(jpeg|png|webp)$/.test(x.type)||x.size>5242880)){res.textContent=T.photoBad;b.disabled=false;return}
  const{data:sg,error:se}=await sb.functions.invoke('submit',{body:{type:'sign',data:{types:fl.map(x=>x.type)}}});
  if(se||!sg?.ok){res.textContent=T.err;b.disabled=false;return}
  for(let i=0;i<fl.length;i++){const{error:ue}=await sb.storage.from('reference-uploads').uploadToSignedUrl(sg.files[i].path,sg.files[i].token,fl[i]);if(ue){res.textContent=T.err;b.disabled=false;return}}
  data.attachments=sg.files.map(x=>x.path)}
 const{data:r,error}=await sb.functions.invoke('submit',{body:{type,data,hp:fd.website||''}});b.disabled=false;
 if(error||!r?.ok){res.textContent=T.err;return}
 const sv=f.elements.service_id?.selectedOptions?.[0]?.text||'',co=f.elements.country?.selectedOptions?.[0]?.value?f.elements.country.selectedOptions[0].text:'';
 track('form_'+type);f.outerHTML=`<div class="card" role="status"><p>${okMsg}</p><a class="b g" href="${waUrl([sv,co].filter(x=>x&&x!=='—').join(', '))}">${T.waBtn}</a></div>`}
async function formPage(type){if(!sb)return app.innerHTML=T.cfg;const sv=await services(),so=sv.map(x=>[x.id,nm(x,'name')]);
 const co={req:type!=='contact',opts:[['HT',T.haiti],['DO',T.dr]]},lg={opts:[['ht',T.ht],['es',T.es]]};
 const F={contact:()=>fld('name',T.name,{req:1})+fld('phone',T.phone,{req:1,type:'tel'})+fld('whatsapp',T.whatsapp,{type:'tel'})+fld('email',T.email,{type:'email'})+fld('lang',T.lang,lg)+fld('subject',T.subject)+fld('message',T.message,{type:'textarea',req:1})+fld('country',T.countryQ,co)+locBlock(),
 quote:()=>fld('name',T.name,{req:1})+fld('phone',T.phone,{req:1,type:'tel'})+fld('email',T.email,{type:'email'})+fld('lang',T.lang,lg)+fld('service_id',T.service,{opts:so}).replace('name="service_id"','name="service_id"')+fld('country',T.countryQ,co)+locBlock()+fld('description',T.desc,{type:'textarea',req:1})+fld('size_text',T.size)+fld('start_date',T.start,{type:'date'})+fld('budget_text',T.budget)+photoIn(),
 appointment:()=>fld('service_id',T.service,{opts:so})+fld('country',T.countryQ,co)+locBlock()+fld('name',T.name,{req:1})+fld('phone',T.phone,{req:1,type:'tel'})+fld('email',T.email,{type:'email'})+fld('description',T.desc,{type:'textarea'})+fld('pref_date',T.date,{type:'date',req:1,min:new Date().toISOString().slice(0,10)})+fld('pref_time',T.time,{type:'time',req:1})+photoIn()+`<p>${T.okA}</p>`}[type]();
 app.innerHTML=`<form id="f" novalidate>${F}${hp()}<button class="b r">${T.send}</button><p id="res" role="status"></p></form>`;const f=$('#f');
 if(f.elements.service_id&&qs.get('service'))f.elements.service_id.value=qs.get('service');
 wireLoc(f);f.onsubmit=e=>send(e,type,type==='appointment'?T.okA:T.ok)}
async function biz(){if(!sb)return;const{data}=await sb.from('site_settings').select('value').eq('key','business').maybeSingle();BIZ=data?.value||{};
 if(page==='contact'&&app){const x=[];if(BIZ.hours)x.push(`<p><b>${T.hours}:</b> ${esc(BIZ.hours)}</p>`);if(BIZ.address)x.push(`<p><b>${T.addr}:</b> ${esc(BIZ.address)}</p>`);(BIZ.phones||[]).forEach(p=>x.push(`<p>${esc(p.country)}: <a href="https://wa.me/${String(p.number).replace(/\D/g,'')}">${esc(p.number)}</a></p>`));app.insertAdjacentHTML('beforebegin',x.join(''))}
 const id=/^G-[A-Z0-9]{4,14}$/.test(BIZ.ga4||'')?BIZ.ga4:null;if(!id)return;const c=localStorage.getItem('kv_consent');
 const load=()=>{window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',id,{anonymize_ip:true});const s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+id;document.head.appendChild(s)};
 if(c==='yes')load();else if(!c){const d=document.createElement('div');d.className='cons';d.innerHTML=`<p>${T.cons}</p><button class="b r" id="cy">${T.yes}</button> <button class="b s" id="cn">${T.no}</button>`;document.body.appendChild(d);$('#cy').onclick=()=>{localStorage.setItem('kv_consent','yes');d.remove();load()};$('#cn').onclick=()=>{localStorage.setItem('kv_consent','no');d.remove()}}}
document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;if(/wa\.me/.test(a.href))track('whatsapp_click');else if(a.hasAttribute('hreflang'))track('language_select',{language:a.getAttribute('hreflang')});else if(/\/projets\/\?id=/.test(a.href))track('project_open')});
biz();
({home,services:servicesPage,projets:projectsPage,faq:faqPage,avis:reviewsPage,contact:()=>formPage('contact'),devis:()=>formPage('quote'),'rendez-vous':()=>formPage('appointment')})[page]?.();
if('serviceWorker'in navigator)navigator.serviceWorker.register('/sw.js').catch(()=>{});
})();
