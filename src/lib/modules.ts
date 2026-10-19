import { menu, sub, slugify, type Tone } from "@/lib/erp";

export type Col = { k: string; t: string; right?: boolean };

export const titles = new Map<string, { title: string; group: string }>();
for (const [g] of menu) for (const x of sub[g] ?? []) titles.set(slugify(x), { title: x, group: g });
titles.set("ayarlar", { title: "Ayarlar", group: "Sistem" });

export const statuses: [string, Tone][] = [["Onaylandı", "ok"], ["Bekliyor", "warn"], ["Taslak", "brand"], ["İptal", "bad"]];
export const tl = (n: number) => "₺ " + n.toLocaleString("tr-TR", { minimumFractionDigits: 2 });

const firms = ["ABC İnşaat Ltd. Şti.", "XYZ Yapı Malzemeleri A.Ş.", "Karadeniz Yapı", "Ege Tesisat", "Anadolu Hırdavat", "Marmara Boya", "Yıldız Seramik", "Demirtaş Metal"];
const products = ["Çimento 50 kg", "Demir Ø12", "Seramik Yapıştırıcı 25 kg", "Alçıpan 12,5 mm", "İzolasyon Levhası", "Tuğla 13,5'luk", "Plastik Boya 15 L", "PVC Boru 100 mm"];

type Kind = "stok" | "cari" | "yonetim" | "belge";
const kindOf = (group: string): Kind =>
  ["Ürün ve Stok", "Depo", "Fiyatlandırma"].includes(group) ? "stok"
  : ["Cari Hesaplar", "Çek ve Senet"].includes(group) ? "cari"
  : ["Yönetim", "Sistem"].includes(group) ? "yonetim" : "belge";

const COLS: Record<Kind, Col[]> = {
  stok: [{ k: "kod", t: "Stok Kodu" }, { k: "ad", t: "Ürün Adı" }, { k: "kat", t: "Kategori" }, { k: "depo", t: "Depo" }, { k: "mik", t: "Miktar", right: true }, { k: "fiyat", t: "Satış Fiyatı", right: true }],
  cari: [{ k: "kod", t: "Cari Kodu" }, { k: "ad", t: "Ünvan" }, { k: "tel", t: "Telefon" }, { k: "il", t: "İl" }, { k: "borc", t: "Borç", right: true }, { k: "alacak", t: "Alacak", right: true }],
  yonetim: [{ k: "ad", t: "Ad Soyad" }, { k: "eposta", t: "E-posta" }, { k: "rol", t: "Rol" }, { k: "sube", t: "Şube" }, { k: "son", t: "Son Giriş" }],
  belge: [{ k: "no", t: "Belge No" }, { k: "tarih", t: "Tarih" }, { k: "cari", t: "Cari" }, { k: "aciklama", t: "Açıklama" }, { k: "tutar", t: "Tutar", right: true }],
};

export const colsFor = (group: string) => COLS[kindOf(group)];

export function kpisFor(group: string): [string, string][] {
  return {
    stok: [["Toplam Ürün", "2.847"], ["Kritik Stok", "18"], ["Stok Değeri", tl(4825300)], ["Depo Sayısı", "3"]] as [string, string][],
    cari: [["Toplam Cari", "412"], ["Borçlu Cari", "23"], ["Toplam Alacak", tl(532620)], ["Vadesi Geçen", tl(84300)]] as [string, string][],
    yonetim: [["Kullanıcı", "12"], ["Aktif Oturum", "5"], ["Şube", "3"], ["Rol", "6"]] as [string, string][],
    belge: [["Bu Ay Toplam", tl(1254320)], ["Belge Sayısı", "186"], ["Bekleyen", "14"], ["Ortalama Tutar", tl(6743)]] as [string, string][],
  }[kindOf(group)];
}

/** Sample rows used only to generate the seed migration. */
export function seedRows(group: string, slug: string): { data: Record<string, string>; durum: string }[] {
  const seed = slug.length;
  const rnd = (i: number, m: number) => ((i * 9301 + seed * 49297) % 233280) / 233280 * m;
  const date = (i: number) => `${String(10 - (i % 9)).padStart(2, "0")}.10.2024`;
  const st = (i: number) => statuses[i % 4]![0];
  const k = kindOf(group);
  const n = k === "yonetim" ? 7 : 22;
  return Array.from({ length: n }, (_, i) => {
    if (k === "stok") return { durum: st(i), data: { kod: `STK-${1000 + i * 7}`, ad: products[i % 8]!, kat: ["Kaba Yapı", "Demir", "Seramik", "Alçı", "Yalıtım"][i % 5]!, depo: ["Merkez", "Şube 2", "Açık Alan"][i % 3]!, mik: String(Math.round(rnd(i + 1, 400))), fiyat: tl(Math.round(rnd(i + 3, 900)) + 50) } };
    if (k === "cari") return { durum: st(i), data: { kod: `CR-${200 + i}`, ad: firms[i % 8]!, tel: `0 (5${30 + i}) 4${i}2 1${i} ${20 + i}`, il: ["İstanbul", "Ankara", "İzmir", "Trabzon", "Bursa"][i % 5]!, borc: tl(Math.round(rnd(i + 2, 90000))), alacak: tl(Math.round(rnd(i + 5, 60000))) } };
    if (k === "yonetim") return { durum: st(i % 2), data: { ad: ["Ahmet Yılmaz", "Ayşe Demir", "Mehmet Kaya", "Fatma Şahin", "Ali Çelik", "Zeynep Arslan", "Murat Koç"][i]!, eposta: `kullanici${i + 1}@insaatcevrem.com`, rol: ["Yönetici", "Satış", "Depo", "Muhasebe"][i % 4]!, sube: ["Merkez", "Şube 2"][i % 2]!, son: `${date(i)} 1${i}:2${i}` } };
    return { durum: st(i), data: { no: `#${slug.slice(0, 2).toUpperCase()}2024-${String(120 - i).padStart(4, "0")}`, tarih: date(i), cari: firms[i % 8]!, aciklama: products[(i + 3) % 8]!, tutar: tl(Math.round(rnd(i + 4, 75000)) + 500) } };
  });
}
