# Ajoute les projets publies au sitemap :  SUPABASE_URL=... SUPABASE_ANON_KEY=... python3 tools/build.py && python3 tools/sitemap_projects.py
import os,json,urllib.request
D='https://konstrival.odthan.com';U=os.environ['SUPABASE_URL'];K=os.environ['SUPABASE_ANON_KEY']
r=urllib.request.Request(U+'/rest/v1/projects?status=eq.published&select=id',headers={'apikey':K,'Authorization':'Bearer '+K})
ids=[x['id'] for x in json.load(urllib.request.urlopen(r))]
add=''.join(f'<url><loc>{D}/ht/projets/?id={i}</loc><xhtml:link rel="alternate" hreflang="ht" href="{D}/ht/projets/?id={i}"/><xhtml:link rel="alternate" hreflang="es" href="{D}/es/projets/?id={i}"/></url><url><loc>{D}/es/projets/?id={i}</loc><xhtml:link rel="alternate" hreflang="ht" href="{D}/ht/projets/?id={i}"/><xhtml:link rel="alternate" hreflang="es" href="{D}/es/projets/?id={i}"/></url>' for i in ids)
s=open('sitemap.xml').read().replace('</urlset>',add+'</urlset>');open('sitemap.xml','w').write(s);print(len(ids),'projets ajoutes')
