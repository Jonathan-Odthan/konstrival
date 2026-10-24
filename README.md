# KONSTRIVAL — site + administration (HTML/CSS/JS vanille + Supabase)

## Ce qui est écrit
- Pages /ht/ et /es/ : accueil, services, projets (filtre + détail avec galerie/vidéo), à propos, contact, devis, rendez-vous, avis, FAQ, confidentialité, conditions, 404 (hreflang, canonical, sitemap, robots, JSON-LD sans adresse inventée)
- Formulaires : pays obligatoire (devis, rendez-vous), adresse dynamique Haïti / Rép. dominicaine, lien Google Maps validé, GPS seulement sur clic, bouton « ouvrir sur Google Maps », WhatsApp prérempli
- Enregistrement via Edge Function `submit` (validation serveur, honeypot, limite 5 envois/heure/IP, aucun INSERT anonyme direct)
- /admin : connexion, mot de passe oublié, compteurs, projets, photos/vidéos, bannière, services, devis, rendez-vous (conflits bloqués par index unique), messages, avis (modération + réponse), FAQ, zones, boutons WhatsApp et Google Maps
- PWA : manifest, service worker (jamais /admin), page hors-ligne ; icônes = logo officiel redimensionné sur fond blanc

## Mise en route (dans l'ordre)
1. Supabase : nouveau projet. SQL Editor : exécuter `supabase/migrations/001_schema.sql`, `002_forms_seed.sql` puis `003_attachments_settings.sql`.
2. Authentication > Users > Add user (votre e-mail + mot de passe), puis dans SQL Editor :
   `insert into admins(user_id) select id from auth.users where email='VOTRE_EMAIL';`
3. `admin/config.js` : coller l'URL du projet et la clé **anon** (publique). Jamais la clé service_role.
4. Edge Function : installer la CLI Supabase, puis `supabase functions deploy submit --no-verify-jwt` (la clé service_role est fournie automatiquement à la fonction). Optionnel : `supabase secrets set ALLOWED_ORIGIN=https://VOTRE-DOMAINE`.
5. Supabase > Authentication > URL Configuration : ajouter l'URL du site (pour le mot de passe oublié). Storage > Settings : limite de fichier ≥ 100 Mo.
6. GitHub : New repository > Upload files > glisser tout le contenu. Vercel : Add New > Project > importer > Deploy (aucun build).
7. Domaine : Vercel > Settings > Domains ; le domaine konstrival.odthan.com est une supposition d'après le logo (remplacer dans tools/build.py puis `python3 tools/build.py`).

## Modifier les pages statiques
`python3 tools/build.py` régénère /ht, /es, sitemap.xml et les icônes.

## Utiliser depuis un smartphone
Ouvrir /admin > se connecter > Pwojè > + Nouvo > remplir > Anrejistre > choisir le type (Foto/Avan/Apre/Videyo) > « Voye fichye yo » > ↑↓ pour l'ordre > Estati « Pibliye » > Anrejistre.

## Réglages et options (dans /admin > Rejaj sit la)
GA4 (chargé seulement après consentement du visiteur ; événements sans données personnelles), horaires, adresse de bureau (si elle existe), numéros WhatsApp par pays. Horaires et adresse s'affichent sur la page Contact.
E-mail de notification (optionnel) : `supabase secrets set RESEND_API_KEY=... NOTIFY_EMAIL=... FROM_EMAIL=...` (compte Resend requis ; l'e-mail ne contient aucune donnée client). Sans cela, tout reste visible dans /admin.
Sitemap des projets : `SUPABASE_URL=... SUPABASE_ANON_KEY=... python3 tools/build.py && python3 tools/sitemap_projects.py`.

## Tests réellement exécutés (dans cet environnement)
RÉUSSIS : syntaxe JS (site, admin) ; génération des 22 pages ; pages servies en local (200) ; migrations 001-003 sur PostgreSQL 16 avec un faux schéma auth/storage ; RLS : anonyme ne voit ni demandes, ni admins, ni brouillons, ne peut rien insérer directement ; utilisateur non-admin bloqué ; admin voit tout ; 2e rendez-vous confirmé sur le même créneau refusé ; pays invalide refusé ; formulaires dans jsdom avec un faux Supabase : pays obligatoire, champs d'adresse Haïti/Rép. dominicaine, lien de carte invalide bloqué, charge utile envoyée correcte, textes espagnols.
NON EXÉCUTÉS (identifiants/services absents) : Edge Function (pas de Deno), vraie connexion Supabase Auth, envoi réel de photos/vidéos vers Storage, URLs signées, e-mails, GA4, rendu sur vrais téléphones, Lighthouse, déploiement GitHub/Vercel. Ce n'est pas une preuve que ces parties fonctionnent.

## Limites connues
- Pages projet rendues côté navigateur (le titre/description SEO s'ajustent en JS) : moins bien indexées que du HTML statique
- Pas de géocodage : aucune adresse n'est dite « vérifiée »
- Avis « vérifié » : case manuelle, à cocher seulement après vérification réelle
- Pas de JSON-LD pour horaires/adresse ; JSON-LD de base seulement (nom, téléphone, pays desservis)
- Les téléversements de médias n'ont pas de barre de progression précise
