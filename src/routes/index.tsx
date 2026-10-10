import { createFileRoute } from "@tanstack/react-router";
import {
  Home, Box, ShoppingCart, Truck, Warehouse, Users, Wallet, FileText, CheckSquare, Tag,
  BarChart3, Settings, ChevronRight, ChevronDown, Search, Store, Bell, HelpCircle,
  ArrowUp, ArrowRight, FilePlus, ArrowLeftRight, User, MoreHorizontal, DollarSign,
  Calendar, Receipt, Package, ClipboardList,
} from "lucide-react";
import { useEffect, useState, type ComponentType } from "react";

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

type Ic = ComponentType<{ className?: string }>;
type Tone = "brand" | "ok" | "warn" | "bad" | "violet";
const soft: Record<Tone, string> = {
  brand: "bg-brand-soft text-brand", ok: "bg-ok-soft text-ok", warn: "bg-warn-soft text-warn",
  bad: "bg-bad-soft text-bad", violet: "bg-violet-soft text-violet",
};
const solid: Record<Tone, string> = {
  brand: "bg-brand text-primary-foreground", ok: "bg-ok text-primary-foreground", warn: "bg-warn text-primary-foreground",
  bad: "bg-bad text-primary-foreground", violet: "bg-violet text-primary-foreground",
};

const menu: [string, Ic][] = [
  ["Ürün ve Stok", Box], ["Satış", ShoppingCart], ["Satınalma", Truck], ["Depo", Warehouse],
  ["Cari Hesaplar", Users], ["Kasa ve Banka", Wallet], ["Fatura ve e-Belge", FileText],
  ["Çek ve Senet", CheckSquare], ["Fiyatlandırma", Tag], ["Raporlar", BarChart3], ["Yönetim", Settings],
];

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="whitespace-nowrap text-xl font-bold text-navy">{title}</h3>
        <a className="flex shrink-0 items-center gap-1 whitespace-nowrap text-sm text-brand" href="#">Tümünü Gör <ArrowRight className="h-4 w-4" /></a>
      </div>
      <div className="divide-y">{children}</div>
    </div>
  );
}

function Index() {
  const [zoom, setZoom] = useState(1);
  useEffect(() => {
    const f = () => setZoom(window.innerWidth / 1536);
    f(); window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  return (
    <div className="flex w-[1536px]" style={{ zoom, minHeight: `calc(100vh / ${zoom})` }}>
      <aside className="flex w-64 shrink-0 flex-col border-r bg-sidebar">
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-primary-foreground"><Box className="h-5 w-5" /></div>
          <div>
            <div className="text-xl font-bold leading-5 text-navy">İnşaatÇevrem ERP</div>
            <div className="text-[10px] font-medium tracking-wide text-muted-foreground">YAPI MARKET YÖNETİM SİSTEMİ</div>
          </div>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          <a className="flex items-center gap-3 rounded-lg bg-accent px-3 py-3 text-base font-semibold text-accent-foreground"><Home className="h-5 w-5" />Ana Sayfa</a>
          {menu.map(([t, I]) => (
            <a key={t} className="flex items-center gap-3 rounded-lg px-3 py-3 text-base text-navy hover:bg-muted">
              <I className="h-5 w-5" /><span className="flex-1">{t}</span><ChevronRight className="h-4 w-4 text-muted-foreground" />
            </a>
          ))}
        </nav>
        <div className="mt-auto px-3 pb-4">
          <a className="mb-3 flex items-center gap-3 px-3 py-3 text-base text-navy"><Settings className="h-5 w-5" />Ayarlar</a>
          <div className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-brand-soft text-brand"><Store className="h-6 w-6" /></div>
            <div className="flex-1"><div className="text-sm font-bold text-navy">Demo Yapı Market</div><div className="text-sm text-muted-foreground">Merkez Şube</div></div>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center gap-5 border-b px-6 py-3">
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-lg border bg-card px-4 py-2.5 text-muted-foreground">
            <Search className="h-5 w-5" /><span className="truncate text-base">Ürün, cari, fatura, stok, sipariş ara... (Ctrl + K)</span>
          </div>
          <div className="flex shrink-0 items-center gap-3 rounded-lg border bg-card px-4 py-2.5 text-base text-navy"><Store className="h-5 w-5 text-brand" />Merkez Şube<ChevronDown className="ml-4 h-4 w-4" /></div>
          <div className="relative"><Bell className="h-6 w-6 text-navy" /><span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-bad text-xs text-primary-foreground">3</span></div>
          <HelpCircle className="h-6 w-6 text-navy" />
          <div className="h-8 w-px bg-border" />
          <div className="flex shrink-0 items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-brand font-semibold text-primary-foreground">YK</div><span className="text-base font-semibold text-navy">Yönetici</span><ChevronDown className="h-4 w-4" /></div>
          <div className="ml-6 shrink-0 text-right"><div className="text-lg text-navy">10 Ekim 2024</div><div className="text-sm text-muted-foreground">Perşembe 14:32</div></div>
        </header>

        <main className="space-y-5 p-6">
          <div>
            <h1 className="text-4xl font-bold text-navy">Merhaba, Yönetici Bey</h1>
            <p className="mt-1 text-lg text-muted-foreground">İşletmenizin bugünkü özeti ve önemli işlemler aşağıdadır.</p>
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
                  <div className="flex justify-between text-base text-muted-foreground">{t}<ChevronRight className="h-5 w-5" /></div>
                  <div className="my-1 truncate text-3xl font-bold text-navy">{v}</div>
                  <div className="flex justify-between text-sm">
                    {p ? <span className={`flex items-center gap-1 text-base font-semibold ${up ? "text-ok" : "text-bad"}`}><ArrowUp className="h-4 w-4" />{p}</span> : <span />}
                    <span className="text-muted-foreground">{s}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <h2 className="mb-3 text-xl font-bold text-navy">Hızlı İşlemler</h2>
            <div className="grid grid-cols-6 gap-4">
              {([
                ["Yeni Satış Faturası", FilePlus, "ok"], ["Mal Kabul", Truck, "brand"], ["Sevk / İrsaliye", ArrowLeftRight, "warn"],
                ["Ürün Ekle", Box, "violet"], ["Cari Hesap Aç", User, "bad"], ["Diğer İşlemler", MoreHorizontal, null],
              ] as [string, Ic, Tone | null][]).map(([t, I, tone]) => (
                <div key={t} className={`flex h-28 flex-col justify-between rounded-lg p-4 ${tone ? soft[tone].split(" ")[0] : "bg-muted"}`}>
                  <div className="flex justify-between"><I className={`h-10 w-10 ${tone ? soft[tone].split(" ")[1] : "text-navy"}`} /><ChevronRight className="h-5 w-5 text-navy" /></div>
                  <div className="text-lg leading-tight text-navy">{t}</div>
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
                    <div className="whitespace-nowrap text-sm text-navy">{t} <span className="ml-1">{n}</span></div>
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
                  <div className="min-w-0 flex-1"><div className="whitespace-nowrap text-sm text-navy">{t}</div><div className="text-sm text-muted-foreground">Onay bekliyor</div></div>
                  <span className="grid h-8 w-8 place-items-center rounded-md bg-bad-soft text-base text-bad">{c}</span>
                </div>
              ))}
            </Card>
            <Card title="Stok Uyarıları">
              {([["Çimento 50 kg", 2, "Kritik", "bad"], ["Demir Ø12", 8, "Azalıyor", "warn"], ["Seramik Yapıştırıcı", 5, "Azalıyor", "warn"], ["Alçıpan 12,5 mm", 12, "Normal", "ok"], ["İzolasyon Malzemesi", 25, "Normal", "ok"]] as [string, number, string, Tone][]).map(([t, s, b, tone]) => (
                <div key={t} className="flex items-center gap-3 py-2">
                  <div className="grid h-11 w-11 place-items-center rounded-md bg-muted text-muted-foreground"><Package className="h-6 w-6" /></div>
                  <div className="min-w-0 flex-1"><div className="truncate text-sm text-navy">{t}</div><div className={`text-sm ${tone === "ok" ? "text-ok" : "text-bad"}`}>Stok: {s}</div></div>
                  <span className={`shrink-0 rounded px-2 py-1 text-xs ${soft[tone]}`}>{b}</span><ChevronRight className="h-4 w-4" />
                </div>
              ))}
            </Card>
            <Card title="Yaklaşanlar">
              {([["Ödeme Vadesi (3 cari)", "BUGÜN", "bad"], ["Verilecek Sipariş (8 ürün)", "YARIN", "warn"], ["Stok Sayımı", "12.10.2024", null], ["KDV Beyannamesi", "26.10.2024", null]] as [string, string, Tone | null][]).map(([t, d, tone]) => (
                <div key={t} className="flex items-center gap-3 py-4">
                  <Calendar className={`h-6 w-6 ${tone === "bad" ? "text-bad" : tone === "warn" ? "text-warn" : "text-brand"}`} />
                  <span className="min-w-0 flex-1 whitespace-nowrap text-sm text-navy">{t}</span>
                  <span className={`shrink-0 rounded px-2 py-1 text-sm ${tone ? soft[tone] : "bg-muted text-navy"}`}>{d}</span>
                  {tone && <ChevronRight className="h-4 w-4" />}
                </div>
              ))}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
