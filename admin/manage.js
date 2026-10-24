// Gestion generique: services, demandes, avis, FAQ, zones. Charge apres admin.js.
const ST={q:[['new','Nouvo'],['review','Ap revize'],['info_needed','Bezwen plis enfòmasyon'],['prepared','Devi prepare'],['accepted','Aksepte'],['declined','Refize'],['closed','Fèmen']],
a:[['new','Nouvo'],['pending','Ap tann konfimasyon'],['confirmed','Konfime'],['rescheduling','Chanje dat'],['completed','Fini'],['cancelled','Anile']],
i:[['new','Nouvo'],['in_progress','Ap trete'],['resolved','Rezoud']],r:[['pending','Ap tann'],['approved','Apwouve'],['rejected','Rejte'],['hidden','Kache']]};
const M={
 services:{t:'Sèvis',lab:r=>r.name_ht+(r.active?'':' (inaktif)'),ord:['sort',true],mk:{name_ht:'Nouvo sèvis',name_es:'Nuevo servicio'},f:[['name_ht','Non (Kreyòl)'],['name_es','Nombre (Español)'],['desc_ht','Deskripsyon (Kreyòl)','textarea'],['desc_es','Descripción (Español)','textarea'],['price_text','Pri (opsyonèl, kite vid si pa gen)'],['sort','Lòd','number'],['active','Aktif','check'],['seo_title_ht','SEO tit (Kreyòl)'],['seo_title_es','SEO título (Español)'],['seo_desc_ht','SEO deskripsyon (Kreyòl)','textarea'],['seo_desc_es','SEO descripción (Español)','textarea']]},
 quotes:{t:'Demann devi',lab:r=>`${r.name} · ${r.country} · ${r.status}`,loc:1,f:[['status','Estati','select',ST.q],['admin_notes','Nòt prive','textarea']]},
 appointments:{t:'Randevou',lab:r=>`${r.name} · ${r.pref_date} ${String(r.pref_time).slice(0,5)} · ${r.status}`,loc:1,f:[['status','Estati','select',ST.a],['pref_date','Dat (pou pwopoze yon lòt)','date'],['pref_time','Lè','time'],['admin_notes','Nòt prive','textarea']]},
 inquiries:{t:'Mesaj',lab:r=>`${r.name} · ${r.status}`,loc:1,f:[['status','Estati','select',ST.i],['admin_notes','Nòt prive','textarea']]},
 reviews:{t:'Avi',lab:r=>`${'★'.repeat(r.rating)} ${r.display_name} · ${r.status}`,f:[['status','Estati','select',ST.r],['verified','Verifye (sèlman si verifikasyon reyèl)','check'],['admin_reply','Repons piblik','textarea']]},
 faqs:{t:'FAQ',lab:r=>r.q_ht||r.q_es||'(vid)',ord:['sort',true],mk:{q_ht:'Nouvo kesyon',q_es:'Nueva pregunta'},f:[['q_ht','Kesyon (Kreyòl)'],['q_es','Pregunta (Español)'],['a_ht','Repons (Kreyòl)','textarea'],['a_es','Respuesta (Español)','textarea'],['sort','Lòd','number'],['active','Aktif','check']]},
 service_areas:{t:'Zòn sèvis',lab:r=>`${r.country} · ${r.name}`,mk:{country:'HT',name:'Nouvo zòn'},f:[['country','Peyi','select',[['HT','Ayiti'],['DO','Repiblik Dominikèn']]],['name','Non zòn'],['active','Aktif','check']]}
};
const _home=home;
async function settings(){const{data}=await sb.from('site_settings').select('value').eq('key','business').maybeSingle(),b=data?.value||{};
 app.innerHTML=`<button class="s" id="bk">← Retounen</button><div class="card"><h2>Rejaj sit la</h2><label>ID Google Analytics GA4 (G-XXXXXXXX, opsyonèl)</label><input id="b_ga"><label>Orè</label><input id="b_h"><label>Adrès biwo fizik (sèlman si egziste)</label><input id="b_a"><label>Lòt nimewo WhatsApp pa peyi (yon liy chak: HT|+509... oswa DO|+1...)</label><textarea id="b_p" rows="3"></textarea><button id="sv" class="r">Anrejistre</button></div>`;
 $('#b_ga').value=b.ga4||'';$('#b_h').value=b.hours||'';$('#b_a').value=b.address||'';$('#b_p').value=(b.phones||[]).map(x=>x.country+'|'+x.number).join('\n');$('#bk').onclick=home;
 $('#sv').onclick=async()=>{const ga=$('#b_ga').value.trim();if(ga&&!/^G-[A-Z0-9]{4,14}$/.test(ga))return msg('ID GA4 pa valid.',false);
  const phones=$('#b_p').value.split('\n').map(l=>l.trim()).filter(Boolean).map(l=>{const[c,n]=l.split('|');return{country:(c||'').trim(),number:(n||'').trim()}});if(phones.some(x=>!x.country||!/^\+?[\d\s().-]{6,25}$/.test(x.number)))return msg('Fòma nimewo: PEYI|+509...',false);
  const{error}=await sb.from('site_settings').upsert({key:'business',value:{ga4:ga||null,hours:$('#b_h').value.trim()||null,address:$('#b_a').value.trim()||null,phones}});error?msg(error.message,false):msg('Anrejistre.')}}
home=async function(){await _home();app.insertAdjacentHTML('afterbegin',`<div class="card">${Object.entries(M).map(([k,m])=>`<button data-m="${k}">${m.t}</button>`).join('')}<button id="stg">Rejaj sit la</button></div>`);app.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>list(b.dataset.m));$('#stg').onclick=settings};
function mapsFor(r){const ok=/^https:\/\/(www\.google\.com\/maps|maps\.google\.com|maps\.app\.goo\.gl|goo\.gl\/maps)(\/|\?|$)/;
 if(r.map_link&&ok.test(r.map_link))return r.map_link;if(r.lat!=null&&r.lng!=null)return`https://www.google.com/maps/search/?api=1&query=${r.lat},${r.lng}`;
 const a=Object.values(r.address||{}).filter(Boolean);if(!a.length)return null;a.push(r.country==='HT'?'Haiti':'República Dominicana');return`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a.join(', '))}`}
async function list(k){const m=M[k];app.innerHTML='<p>Chajman...</p>';
 const{data,error}=await sb.from(k).select('*').order(m.ord?m.ord[0]:'created_at',{ascending:m.ord?m.ord[1]:false});if(error)return msg(error.message,false);
 app.innerHTML=`<button class="s" id="bk">← Retounen</button><div class="card"><h2>${m.t}</h2>${m.mk?'<button id="nw" class="r">+ Nouvo</button>':''}${(data||[]).map(r=>`<div class="row"><span>${esc(m.lab(r))}</span><button class="s" data-id="${r.id}">Louvri</button></div>`).join('')||'<p>Pa gen anyen.</p>'}</div>`;
 $('#bk').onclick=home;if(m.mk)$('#nw').onclick=async()=>{const{data:n,error:e}=await sb.from(k).insert(m.mk).select('id').single();e?msg(e.message,false):row(k,n.id)};
 app.querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>row(k,b.dataset.id))}
async function row(k,id){const m=M[k],{data:r}=await sb.from(k).select('*').eq('id',id).single(),ed=m.f.map(x=>x[0]);
 const flat=(v)=>v&&typeof v==='object'?Object.entries(v).map(([a,b])=>`${a}: ${b}`).join(' · '):v;
 const info=m.loc||k==='reviews'?Object.entries(r).filter(([a,b])=>!ed.includes(a)&&!['id','service_id','project_id','attachments'].includes(a)&&b!=null&&b!=='').map(([a,b])=>`<div><b>${a}:</b> ${esc(flat(b))}</div>`).join(''):'';
 const phone=(r.whatsapp||r.phone||'').replace(/\D/g,''),mu=m.loc?mapsFor(r):null;
 app.innerHTML=`<button class="s" id="bk">← Retounen</button><div class="card"><h2>${m.t}</h2>${info}${m.loc?`<p>${phone?`<a href="https://wa.me/${phone}" target="_blank" rel="noopener"><button type="button">Kontakte sou WhatsApp</button></a>`:''}${mu?`<a href="${esc(mu)}" target="_blank" rel="noopener"><button type="button">Louvri sou Google Maps</button></a>`:''}</p>`:''}
 ${m.f.map(([c,l,t,o])=>t==='textarea'?`<label>${l}</label><textarea id="x_${c}" rows="3"></textarea>`:t==='select'?`<label>${l}</label><select id="x_${c}">${o.map(v=>`<option value="${v[0]}">${v[1]}</option>`).join('')}</select>`:t==='check'?`<label><input type="checkbox" id="x_${c}" style="width:auto"> ${l}</label>`:`<label>${l}</label><input id="x_${c}" type="${t||'text'}">`).join('')}
 <button id="sv" class="r">Anrejistre</button><button id="dl" class="s">Efase</button></div>`;
 m.f.forEach(([c,,t])=>{const e=$('#x_'+c);t==='check'?e.checked=!!r[c]:e.value=r[c]??''});
 $('#bk').onclick=()=>list(k);
 if(r.attachments?.length){const{data:su}=await sb.storage.from('reference-uploads').createSignedUrls(r.attachments,3600);$('#bk').insertAdjacentHTML('afterend',`<div class="card"><b>Foto referans</b><div class="m">${(su||[]).filter(x=>x.signedUrl).map(x=>`<a href="${esc(x.signedUrl)}" target="_blank" rel="noopener"><img src="${esc(x.signedUrl)}" alt=""></a>`).join('')}</div></div>`)}
 $('#sv').onclick=async()=>{const u={};m.f.forEach(([c,,t])=>{const e=$('#x_'+c);u[c]=t==='check'?e.checked:t==='number'?Number(e.value||0):e.value||null});
  if(k==='reviews'&&u.status!=='approved')u.verified=false;
  const{error}=await sb.from(k).update(u).eq('id',id);
  error?msg(error.code==='23505'?'Kreno sa a deja konfime pou yon lòt randevou.':'Erè: '+error.message,false):msg('Anrejistre.')};
 $('#dl').onclick=async()=>{if(!confirm('Efase eleman sa a? Aksyon sa pa ka anile.'))return;const{error}=await sb.from(k).delete().eq('id',id);error?msg(error.message,false):(msg('Efase.'),list(k))}}
init();
