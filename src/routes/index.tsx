import { createFileRoute } from "@tanstack/react-router";
import {
  ShoppingCart, Truck, ChevronRight, ArrowUp, FilePlus, ArrowLeftRight, User, MoreHorizontal, DollarSign,
  Calendar, Receipt, Package, ClipboardList, Box, Tag,
} from "lucide-react";
import { soft, solid, Card, type Tone } from "@/lib/erp";
import type { ComponentType } from "react";
type Ic = ComponentType<{ className?: string }>;
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "İnşaatÇevrem ERP — Yapı Market Yönetim Sistemi" },
      { name: "description", content: "İnşaatÇevrem ERP ile satış, stok, cari, fatura ve depo yönetimi tek panelde." },
      { property: "og:title", content: "İnşaatÇevrem ERP" },
      { property: "og:description", content: "Yapı market yönetim sistemi ana paneli." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});


function Index() {
  return (
    <>
        <div className="space-y-5">
          <div>
            <h1 className="text-[28px] font-bold text-navy">Merhaba, Yönetici Bey</h1>
            <p className="mt-1 text-[15px] text-muted-foreground">İşletmenizin bugünkü özeti ve önemli işlemler aşağıdadır.</p>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {([
              ["Toplam Satış", "₺ 1.254.320", "%12", "Bu ay", ShoppingCart, "brand", true],
              ["Tahsilat", "₺ 872.450", "%18", "Bu ay", DollarSign, "ok", true],
              ["Açık Cari Hesap", "₺ 532.620", "%3", "23 cari", User, "warn", false],
              ["Stoktaki Ürün", "2.847", "", "Toplam ürün", Box, "violet", true],
            ] as [string, string, string, string, Ic, Tone, boolean][]).map(([t, v, p, s, I, tone, up]) => (
              <div key={t} className="flex items-center gap-5 rounded-xl border bg-card p-5 shadow-sm">
                <div className={`grid h-16 w-16 shrink-0 place-items-center rounded-full ${soft[tone]}`}><I className="h-9 w-9" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between text-[14px] text-muted-foreground">{t}<ChevronRight className="h-5 w-5" /></div>
                  <div className="my-1 truncate text-2xl font-bold text-navy">{v}</div>
                  <div className="flex justify-between text-sm">
                    {p ? <span className={`flex items-center gap-1 text-[14px] font-semibold ${up ? "text-ok" : "text-bad"}`}><ArrowUp className="h-4 w-4" />{p}</span> : <span />}
                    <span className="text-muted-foreground">{s}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <h2 className="mb-3 text-[17px] font-bold text-navy">Hızlı İşlemler</h2>
            <div className="grid grid-cols-6 gap-4">
              {([
                ["Yeni Satış Faturası", FilePlus, "ok"], ["Mal Kabul", Truck, "brand"], ["Sevk / İrsaliye", ArrowLeftRight, "warn"],
                ["Ürün Ekle", Box, "violet"], ["Cari Hesap Aç", User, "bad"], ["Diğer İşlemler", MoreHorizontal, null],
              ] as [string, Ic, Tone | null][]).map(([t, I, tone]) => (
                <div key={t} className={`flex h-28 flex-col justify-between rounded-lg p-4 ${tone ? soft[tone].split(" ")[0] : "bg-muted"}`}>
                  <div className="flex justify-between"><I className={`h-10 w-10 ${tone ? soft[tone].split(" ")[1] : "text-navy"}`} /><ChevronRight className="h-5 w-5 text-navy" /></div>
                  <div className="text-[15px] leading-tight text-navy">{t}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4" style={{ gridTemplateColumns: "minmax(0,1.05fr) minmax(0,1fr) minmax(0,0.95fr) minmax(0,1fr)" }}>
            <Card title="Son İşlemler">
              {([
                ["Satış Faturası", "#SF2024-0012", "ABC İnşaat Ltd. Şti.", "14:21", Receipt, "bad", ""],
                ["Mal Kabul", "#MK2024-0045", "XYZ Yapı Malzemeleri A.Ş.", "13:58", Truck, "brand", ""],
                ["Tahsilat", "#TAH-0128", "ABC İnşaat", "13:32", DollarSign, "ok", "₺ 28.450"],
                ["Sevk İrsaliyesi", "#İR2024-0078", "Karadeniz Yapı", "12:45", ArrowLeftRight, "warn", ""],
                ["Ürün Ekleme", "", "Seramik Yapıştırıcı 25 kg", "11:23", Box, "violet", ""],
              ] as [string, string, string, string, Ic, Tone, string][]).map(([t, n, s, h, I, tone, amt]) => (
                <div key={t} className="flex items-center gap-3 py-2.5">
                  <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg ${solid[tone]}`}><I className="h-5 w-5" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm leading-tight text-navy">{t} <span className="ml-1">{n}</span></div>
                    <div className="text-sm text-muted-foreground">{s}{amt && <span className="ml-5 font-semibold text-ok">{amt}</span>}</div>
                  </div>
                  <span className="text-sm text-muted-foreground">{h}</span>
                </div>
              ))}
            </Card>
            <Card title="Bekleyen Onaylar">
              {([["Satınalma Siparişi", 4, ClipboardList, "violet"], ["Fiyat Listesi Değişikliği", 2, DollarSign, "warn"], ["Cari Limit Artış Talebi", 1, User, "warn"], ["Kampanya Onayı", 3, Tag, "ok"]] as [string, number, Ic, Tone][]).map(([t, c, I, tone]) => (
                <div key={t} className="flex items-center gap-4 py-3.5">
                  <div className={`grid h-11 w-11 place-items-center rounded-lg ${soft[tone]}`}><I className="h-5 w-5" /></div>
                  <div className="min-w-0 flex-1"><div className="text-sm leading-tight text-navy">{t}</div><div className="text-sm text-muted-foreground">Onay bekliyor</div></div>
                  <span className="grid h-8 w-8 place-items-center rounded-md bg-bad-soft text-[14px] text-bad">{c}</span>
                </div>
              ))}
            </Card>
            <Card title="Stok Uyarıları">
              {([["Çimento 50 kg", 2, "Kritik", "bad"], ["Demir Ø12", 8, "Azalıyor", "warn"], ["Seramik Yapıştırıcı", 5, "Azalıyor", "warn"], ["Alçıpan 12,5 mm", 12, "Normal", "ok"], ["İzolasyon Malzemesi", 25, "Normal", "ok"]] as [string, number, string, Tone][]).map(([t, s, b, tone]) => (
                <div key={t} className="flex items-center gap-3 py-2">
                  <div className="grid h-11 w-11 place-items-center rounded-md bg-muted text-muted-foreground"><Package className="h-6 w-6" /></div>
                  <div className="min-w-0 flex-1"><div className="text-sm leading-tight text-navy">{t}</div><div className={`text-sm ${tone === "ok" ? "text-ok" : "text-bad"}`}>Stok: {s}</div></div>
                  <span className={`shrink-0 rounded px-2 py-1 text-xs ${soft[tone]}`}>{b}</span><ChevronRight className="h-4 w-4" />
                </div>
              ))}
            </Card>
            <Card title="Yaklaşanlar">
              {([["Ödeme Vadesi (3 cari)", "BUGÜN", "bad"], ["Verilecek Sipariş (8 ürün)", "YARIN", "warn"], ["Stok Sayımı", "12.10.2024", null], ["KDV Beyannamesi", "26.10.2024", null]] as [string, string, Tone | null][]).map(([t, d, tone]) => (
                <div key={t} className="flex items-center gap-3 py-4">
                  <Calendar className={`h-6 w-6 ${tone === "bad" ? "text-bad" : tone === "warn" ? "text-warn" : "text-brand"}`} />
                  <span className="min-w-0 flex-1 text-sm leading-tight text-navy">{t}</span>
                  <span className={`shrink-0 rounded px-2 py-1 text-sm ${tone ? soft[tone] : "bg-muted text-navy"}`}>{d}</span>
                  {tone && <ChevronRight className="h-4 w-4" />}
                </div>
              ))}
            </Card>
          </div>
        </div>
    </>
  );
}
