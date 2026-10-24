const V='kv1',PRE=['/offline.html','/css/style.css','/assets/logo.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>c.addAll(PRE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);
 if(r.method!=='GET'||u.origin!==location.origin||u.pathname.startsWith('/admin'))return; // jamais d'admin ni de donnees privees en cache
 if(r.mode==='navigate'){e.respondWith(fetch(r).catch(()=>caches.match('/offline.html')));return}
 if(/^\/(assets|css|js)\//.test(u.pathname))e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>{const c=x.clone();caches.open(V).then(k=>k.put(r,c));return x})))});
