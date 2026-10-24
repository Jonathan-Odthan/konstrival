create table rate_limits(id bigserial primary key,ip_hash text not null,at timestamptz not null default now());
create index on rate_limits(ip_hash,at);
alter table rate_limits enable row level security; -- aucune policy: seule la Edge Function (service role) y accede
insert into services(name_ht,name_es,sort) values
('Poze seramik ak kaloraj','Instalación de cerámica y azulejos',1),('Poze sheetrock','Instalación de sheetrock',2),('Poze plafon','Instalación de techos',3),
('Penti andedan ak deyò','Pintura interior y exterior',4),('Fini andedan','Acabados interiores',5),('Renovasyon kay','Renovación de viviendas',6),
('Renovasyon apatman','Renovación de apartamentos',7),('Renovasyon pwopriyete komèsyal','Renovación de locales comerciales',8),('Konstriksyon jeneral','Construcción general',9);
