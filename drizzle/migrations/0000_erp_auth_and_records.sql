CREATE TYPE public.app_role AS ENUM ('yonetici', 'satis', 'depo', 'muhasebe');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  ad_soyad text NOT NULL DEFAULT '',
  sube text NOT NULL DEFAULT 'Merkez Şube',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles readable by signed-in users" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, ad_soyad)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'ad_soyad', NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, CASE WHEN NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'yonetici') THEN 'yonetici'::public.app_role ELSE 'satis'::public.app_role END);
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.kayitlar (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  modul text NOT NULL,
  durum text NOT NULL DEFAULT 'Taslak',
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX kayitlar_modul_idx ON public.kayitlar (modul, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.kayitlar TO authenticated;
GRANT ALL ON public.kayitlar TO service_role;
ALTER TABLE public.kayitlar ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in users read records" ON public.kayitlar FOR SELECT TO authenticated USING (true);
CREATE POLICY "Signed-in users add records" ON public.kayitlar FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "Signed-in users update records" ON public.kayitlar FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Signed-in users delete records" ON public.kayitlar FOR DELETE TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.fmt_tl(x numeric) RETURNS text LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT '₺ ' || translate(to_char(x, 'FM999,999,990.00'), ',.', '.,')
$$;

WITH m(slug, kind) AS (VALUES
('urun-listesi','stok'),('yeni-urun','stok'),('kategoriler','stok'),('stok-hareketleri','stok'),('stok-sayimi','stok'),('satis-faturalari','belge'),('teklifler','belge'),('siparisler','belge'),('perakende-satis-pos','belge'),('iadeler','belge'),('satinalma-siparisleri','belge'),('alis-faturalari','belge'),('tedarikciler','belge'),('talepler','belge'),('depolar','stok'),('mal-kabul','stok'),('sevk-irsaliye','stok'),('depo-transferi','stok'),('cari-listesi','cari'),('yeni-cari','cari'),('cari-ekstre','cari'),('cari-limitler','cari'),('kasalar','belge'),('banka-hesaplari','belge'),('tahsilatlar','belge'),('odemeler','belge'),('pos-hesaplari','belge'),('e-fatura','belge'),('e-arsiv','belge'),('e-irsaliye','belge'),('gelen-belgeler','belge'),('alinan-cekler','cari'),('verilen-cekler','cari'),('senetler','cari'),('portfoy','cari'),('fiyat-listeleri','stok'),('kampanyalar','stok'),('iskontolar','stok'),('satis-raporlari','belge'),('stok-raporlari','belge'),('cari-raporlari','belge'),('kar-zarar','belge'),('kullanicilar','yonetim'),('yetkiler','yonetim'),('subeler','yonetim'),('onay-akislari','yonetim'),('ayarlar','yonetim')),
f AS (SELECT ARRAY['ABC İnşaat Ltd. Şti.','XYZ Yapı Malzemeleri A.Ş.','Karadeniz Yapı','Ege Tesisat','Anadolu Hırdavat','Marmara Boya','Yıldız Seramik','Demirtaş Metal'] AS firms,
  ARRAY['Çimento 50 kg','Demir Ø12','Seramik Yapıştırıcı 25 kg','Alçıpan 12,5 mm','İzolasyon Levhası','Tuğla 13,5''luk','Plastik Boya 15 L','PVC Boru 100 mm'] AS products,
  ARRAY['Onaylandı','Bekliyor','Taslak','İptal'] AS st,
  ARRAY['Ahmet Yılmaz','Ayşe Demir','Mehmet Kaya','Fatma Şahin','Ali Çelik','Zeynep Arslan','Murat Koç'] AS people)
INSERT INTO public.kayitlar (modul, durum, data, created_at)
SELECT m.slug,
  CASE WHEN m.kind = 'yonetim' THEN f.st[i % 2 + 1] ELSE f.st[i % 4 + 1] END,
  CASE m.kind
    WHEN 'stok' THEN jsonb_build_object('kod', 'STK-' || (1000 + i * 7), 'ad', f.products[i % 8 + 1], 'kat', (ARRAY['Kaba Yapı','Demir','Seramik','Alçı','Yalıtım'])[i % 5 + 1], 'depo', (ARRAY['Merkez','Şube 2','Açık Alan'])[i % 3 + 1], 'mik', ((i * 37 + length(m.slug) * 13) % 400)::text, 'fiyat', public.fmt_tl(((i * 53 + length(m.slug) * 29) % 900) + 50))
    WHEN 'cari' THEN jsonb_build_object('kod', 'CR-' || (200 + i), 'ad', f.firms[i % 8 + 1], 'tel', '0 (5' || (30 + i) || ') 4' || i || '2 1' || i || ' ' || (20 + i), 'il', (ARRAY['İstanbul','Ankara','İzmir','Trabzon','Bursa'])[i % 5 + 1], 'borc', public.fmt_tl((i * 4177 + length(m.slug) * 911) % 90000), 'alacak', public.fmt_tl((i * 2731 + length(m.slug) * 577) % 60000))
    WHEN 'yonetim' THEN jsonb_build_object('ad', f.people[i + 1], 'eposta', 'kullanici' || (i + 1) || '@insaatcevrem.com', 'rol', (ARRAY['Yönetici','Satış','Depo','Muhasebe'])[i % 4 + 1], 'sube', (ARRAY['Merkez','Şube 2'])[i % 2 + 1], 'son', lpad((10 - i % 9)::text, 2, '0') || '.10.2024 1' || i || ':2' || i)
    ELSE jsonb_build_object('no', '#' || upper(left(m.slug, 2)) || '2024-' || lpad((120 - i)::text, 4, '0'), 'tarih', lpad((10 - i % 9)::text, 2, '0') || '.10.2024', 'cari', f.firms[i % 8 + 1], 'aciklama', f.products[(i + 3) % 8 + 1], 'tutar', public.fmt_tl(((i * 3361 + length(m.slug) * 1237) % 75000) + 500))
  END,
  now() - make_interval(hours => i)
FROM m CROSS JOIN f CROSS JOIN generate_series(0, 21) AS i
WHERE m.kind <> 'yonetim' OR i < 7;