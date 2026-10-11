import type { ComponentType, ReactNode } from "react";
import {
  Box, ShoppingCart, Truck, Warehouse, Users, Wallet, FileText, CheckSquare, Tag, BarChart3, Settings, ArrowRight,
} from "lucide-react";

export type Ic = ComponentType<{ className?: string }>;
export type Tone = "brand" | "ok" | "warn" | "bad" | "violet";
export const soft: Record<Tone, string> = {
  brand: "bg-brand-soft text-brand", ok: "bg-ok-soft text-ok", warn: "bg-warn-soft text-warn",
  bad: "bg-bad-soft text-bad", violet: "bg-violet-soft text-violet",
};
export const solid: Record<Tone, string> = {
  brand: "bg-brand text-primary-foreground", ok: "bg-ok text-primary-foreground", warn: "bg-warn text-primary-foreground",
  bad: "bg-bad text-primary-foreground", violet: "bg-violet text-primary-foreground",
};

export const menu: [string, Ic][] = [
  ["Ürün ve Stok", Box], ["Satış", ShoppingCart], ["Satınalma", Truck], ["Depo", Warehouse],
  ["Cari Hesaplar", Users], ["Kasa ve Banka", Wallet], ["Fatura ve e-Belge", FileText],
  ["Çek ve Senet", CheckSquare], ["Fiyatlandırma", Tag], ["Raporlar", BarChart3], ["Yönetim", Settings],
];

export const sub: Record<string, string[]> = {
  "Ürün ve Stok": ["Ürün Listesi", "Yeni Ürün", "Kategoriler", "Stok Hareketleri", "Stok Sayımı"],
  "Satış": ["Satış Faturaları", "Teklifler", "Siparişler", "Perakende Satış (POS)", "İadeler"],
  "Satınalma": ["Satınalma Siparişleri", "Alış Faturaları", "Tedarikçiler", "Talepler"],
  "Depo": ["Depolar", "Mal Kabul", "Sevk / İrsaliye", "Depo Transferi"],
  "Cari Hesaplar": ["Cari Listesi", "Yeni Cari", "Cari Ekstre", "Cari Limitler"],
  "Kasa ve Banka": ["Kasalar", "Banka Hesapları", "Tahsilatlar", "Ödemeler", "POS Hesapları"],
  "Fatura ve e-Belge": ["e-Fatura", "e-Arşiv", "e-İrsaliye", "Gelen Belgeler"],
  "Çek ve Senet": ["Alınan Çekler", "Verilen Çekler", "Senetler", "Portföy"],
  "Fiyatlandırma": ["Fiyat Listeleri", "Kampanyalar", "İskontolar"],
  "Raporlar": ["Satış Raporları", "Stok Raporları", "Cari Raporları", "Kâr / Zarar"],
  "Yönetim": ["Kullanıcılar", "Yetkiler", "Şubeler", "Onay Akışları"],
};

export function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="whitespace-nowrap text-[17px] font-bold text-navy">{title}</h3>
        <a className="flex shrink-0 items-center gap-1 whitespace-nowrap text-sm text-brand" href="#">Tümünü Gör <ArrowRight className="h-4 w-4" /></a>
      </div>
      <div className="divide-y">{children}</div>
    </div>
  );
}


export const slugify = (s: string) => s.toLocaleLowerCase("tr").replace(/ç/g,"c").replace(/ğ/g,"g").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ş/g,"s").replace(/ü/g,"u").replace(/â/g,"a").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
