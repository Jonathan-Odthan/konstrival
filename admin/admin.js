const C=window.KONSTRIVAL_CONFIG,$=s=>document.querySelector(s),app=$('#app');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sb=supabase.createClient(C.url,C.anon),BUCKET='public-media';
const TYPES={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','video/mp4':'mp4','video/webm':'webm'};
const MAX={image:10*1048576,video:100*1048576};
function msg(t,ok=true){const m=$('#msg');m.textContent=t;m.className=ok?'ok':'er';m.style.display='block';clearTimeout(msg.t);msg.t=setTimeout(()=>m.style.display='none',5000)}
const url=p=>sb.storage.from(BUCKET).getPublicUrl(p).data.publicUrl;
async function init(){
 const {data:{session}}=await sb.auth.getSession();
 if(!session)return login();
 const {data,error}=await sb.from('admins').select('user_id').eq('user_id',session.user.id);
 if(error||!data?.length){await sb.auth.signOut();login();return msg('Aksè refize: kont sa a pa administratè.',false)}
 $('#out').hidden=false;home();
}
$('#out').onclick=async()=>{await sb.auth.signOut();$('#out').hidden=true;login()};
function login(){
 app.innerHTML=`<div class="card"><h2>Koneksyon</h2><label>Imèl</label><input id="e" type="email" autocomplete="username"><label>Modpas</label><input id="p" type="password" autocomplete="current-password"><button id="go">Konekte</button><button id="rs" class="s">Modpas bliye</button></div>`;
 $('#go').onclick=async()=>{const {error}=await sb.auth.signInWithPassword({email:$('#e').value.trim(),password:$('#p').value});error?msg('Imèl oswa modpas pa kòrèk.',false):init()};
 $('#rs').onclick=async()=>{const e=$('#e').value.trim();if(!e)return msg('Antre imèl ou anvan.',false);const {error}=await sb.auth.resetPasswordForEmail(e,{redirectTo:location.href});error?msg('Erè pandan voye imèl la.',false):msg('Si kont lan egziste, yon imèl voye.')}
}
async function count(t,col,val){const q=sb.from(t).select('*',{count:'exact',head:true});const {count:n,error}=await q.eq(col,val);return error?'?':n}
async function home(){
 app.innerHTML='<p>Chajman...</p>';
 const [a,b,c,d,e]=await Promise.all([count('projects','status','published'),count('inquiries','status','new'),count('quotes','status','new'),count('appointments','status','new'),count('reviews','status','approved')]);
 const {data:ps}=await sb.from('projects').select('id,title_ht,status').order('created_at',{ascending:false});
 app.innerHTML=`<div class="stats"><div><b>${a}</b>Pwojè pibliye</div><div><b>${b}</b>Mesaj nouvo</div><div><b>${c}</b>Demann devi</div><div><b>${d}</b>Randevou nouvo</div><div><b>${e}</b>Avi pibliye</div></div>
 <div class="card" style="margin-top:14px"><h2>Pwojè</h2><button id="new" class="r">+ Nouvo pwojè</button>${(ps||[]).map(p=>`<div class="row"><span>${esc(p.title_ht)} <small>(${p.status==='published'?'pibliye':'bouyon'})</small></span><button class="s" data-id="${p.id}">Modifye</button></div>`).join('')||'<p>Poko gen pwojè.</p>'}</div>
 <div class="card"><h2>Bannyè paj dakèy</h2><input id="bn" type="file" accept="image/jpeg,image/png,image/webp"><button id="bu">Ranplase bannyè a</button></div>`;
 $('#new').onclick=newProject;app.querySelectorAll('button[data-id]').forEach(b=>b.onclick=()=>edit(b.dataset.id));$('#bu').onclick=banner;
}
async function banner(){
 const f=$('#bn').files[0];if(!f)return msg('Chwazi yon imaj.',false);
 if(!TYPES[f.type]||f.type.startsWith('video'))return msg('Fòma pa aksepte (JPEG, PNG, WebP).',false);
 if(f.size>MAX.image)return msg('Imaj la twò gwo (maks 10 MB).',false);
 const path=`site/hero-${Date.now()}.${TYPES[f.type]}`;
 let r=await sb.storage.from(BUCKET).upload(path,f,{contentType:f.type});if(r.error)return msg('Echèk telechajman: '+r.error.message,false);
 r=await sb.from('site_settings').upsert({key:'hero_image',value:{path}});r.error?msg('Echèk anrejistreman.',false):msg('Bannyè anrejistre.');
}
async function newProject(){
 const {data,error}=await sb.from('projects').insert({title_ht:'Nouvo pwojè',title_es:'Nuevo proyecto'}).select('id').single();
 error?msg('Erè: '+error.message,false):edit(data.id);
}
async function edit(id){
 const [{data:p},{data:sv},{data:md}]=await Promise.all([sb.from('projects').select('*').eq('id',id).single(),sb.from('services').select('id,name_ht').order('sort'),sb.from('project_media').select('*').eq('project_id',id).order('sort')]);
 const f=(k,l,t='input',ty='text')=>`<label>${l}</label><${t} id="f_${k}"${t==='input'?` type="${ty}"`:''}>${t==='textarea'?esc(p[k]):''}${t==='textarea'?'</textarea>':'>'}`;
 app.innerHTML=`<button class="s" id="bk">← Retounen</button><div class="card"><h2>Enfòmasyon pwojè</h2>
 ${f('title_ht','Tit (Kreyòl)')}${f('title_es','Título (Español)')}${f('desc_ht','Deskripsyon (Kreyòl)','textarea')}${f('desc_es','Descripción (Español)','textarea')}
 ${f('public_location','Kote (piblik, opsyonèl — pa mete adrès kliyan)')}${f('completed_on','Dat fini (opsyonèl)','input','date')}${f('testimonial','Temwayaj kliyan (opsyonèl)','textarea')}${f('seo_title','SEO tit')}${f('seo_desc','SEO deskripsyon','textarea')}<label><input type="checkbox" id="f_featured" style="width:auto"> Pwojè an vedèt (paj dakèy)</label>
 <label>Kategori sèvis</label><select id="f_service_id"><option value="">—</option>${(sv||[]).map(s=>`<option value="${s.id}" ${s.id===p.service_id?'selected':''}>${esc(s.name_ht)}</option>`).join('')}</select>
 <label>Peyi</label><select id="f_country"><option value="">—</option><option value="HT" ${p.country==='HT'?'selected':''}>Ayiti / Haití</option><option value="DO" ${p.country==='DO'?'selected':''}>Repiblik Dominikèn</option></select>
 <label>Estati</label><select id="f_status"><option value="draft" ${p.status==='draft'?'selected':''}>Bouyon</option><option value="published" ${p.status==='published'?'selected':''}>Pibliye</option></select>
 <button id="sv" class="r">Anrejistre</button><button id="dl" class="s">Efase pwojè</button></div>
 <div class="card"><h2>Foto ak videyo</h2><label>Tip</label><select id="kind"><option value="photo">Foto</option><option value="before">Avan</option><option value="after">Apre</option><option value="video">Videyo</option></select>
 <input id="fl" type="file" multiple accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"><button id="up">Voye fichye yo</button><div id="prog"></div>
 ${(md||[]).map((m,i)=>`<div class="m">${m.kind==='video'?`<video src="${url(m.path)}" preload="metadata" controls></video>`:`<img src="${url(m.path)}" alt="" loading="lazy">`}<span>${m.kind}</span><button class="s" data-up="${i}">↑</button><button class="s" data-dn="${i}">↓</button><button class="s r" data-rm="${i}">✕</button></div>`).join('')||'<p>Poko gen media.</p>'}</div>`;
 $('#bk').onclick=home;
 $('#sv').onclick=async()=>{const u={};['title_ht','title_es','desc_ht','desc_es','service_id','country','status','public_location','completed_on','testimonial','seo_title','seo_desc'].forEach(k=>u[k]=$('#f_'+k).value||null);u.featured=$('#f_featured').checked;
  if(!u.title_ht||!u.title_es)return msg('Tit yo obligatwa nan de lang yo.',false);
  const {error}=await sb.from('projects').update(u).eq('id',id);error?msg('Erè: '+error.message,false):msg('Anrejistre.')};
 $('#dl').onclick=async()=>{if(!confirm('Efase pwojè sa a ak tout media li yo? Aksyon sa pa ka anile.'))return;
  if(md?.length)await sb.storage.from(BUCKET).remove(md.map(m=>m.path));
  const {error}=await sb.from('projects').delete().eq('id',id);error?msg('Erè: '+error.message,false):(msg('Efase.'),home())};
 $('#up').onclick=async()=>{
  const files=[...$('#fl').files],kind=$('#kind').value;if(!files.length)return msg('Chwazi fichye.',false);
  let n=md?.length||0,ok=0;
  for(const [i,fl] of files.entries()){
   const ext=TYPES[fl.type],t=ext&&(fl.type.startsWith('video')?'video':'image');
   if(!ext){msg(`${fl.name}: fòma pa aksepte.`,false);continue}
   if(fl.size>MAX[t]){msg(`${fl.name}: twò gwo (maks ${MAX[t]/1048576} MB).`,false);continue}
   if((kind==='video')!==(t==='video')){msg(`${fl.name}: tip pa koresponn ak chwa a.`,false);continue}
   $('#prog').textContent=`Ap voye ${i+1}/${files.length}...`;
   const path=`projects/${id}/${crypto.randomUUID()}.${ext}`;
   const r=await sb.storage.from(BUCKET).upload(path,fl,{contentType:fl.type});
   if(r.error){msg(`${fl.name}: ${r.error.message}`,false);continue}
   const q=await sb.from('project_media').insert({project_id:id,kind,path,sort:n++});
   if(q.error){await sb.storage.from(BUCKET).remove([path]);msg(`${fl.name}: erè baz done.`,false)}else ok++;
  }
  if(ok)msg(`${ok} fichye voye.`);edit(id);
 };
 app.querySelectorAll('[data-rm]').forEach(b=>b.onclick=async()=>{const m=md[b.dataset.rm];if(!confirm('Efase media sa a?'))return;
  await sb.storage.from(BUCKET).remove([m.path]);await sb.from('project_media').delete().eq('id',m.id);edit(id)});
 const swap=async(i,j)=>{if(j<0||j>=md.length)return;await Promise.all([sb.from('project_media').update({sort:j}).eq('id',md[i].id),sb.from('project_media').update({sort:i}).eq('id',md[j].id)]);edit(id)};
 app.querySelectorAll('[data-up]').forEach(b=>b.onclick=()=>swap(+b.dataset.up,+b.dataset.up-1));
 app.querySelectorAll('[data-dn]').forEach(b=>b.onclick=()=>swap(+b.dataset.dn,+b.dataset.dn+1));
 ['title_ht','title_es','public_location','completed_on','testimonial','seo_title','seo_desc'].forEach(k=>$('#f_'+k).value=p[k]||'');$('#f_featured').checked=!!p.featured;
}
