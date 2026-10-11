import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Box, Settings, ChevronRight, ChevronDown, Search, Store, Bell, HelpCircle } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { menu, sub, slugify } from "@/lib/erp";

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => { setNow(new Date()); const i = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(i); }, []);
  return now;
}

export function ErpLayout({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const now = useNow();
  const [zoom, setZoom] = useState(1);
  const [open, setOpen] = useState<string | null>(() => Object.keys(sub).find((k) => sub[k].some((x) => path === "/modul/" + slugify(x))) ?? null);
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
            <div className="text-[17px] font-bold leading-5 text-navy">İnşaatÇevrem ERP</div>
            <div className="text-[10px] font-medium tracking-wide text-muted-foreground">YAPI MARKET YÖNETİM SİSTEMİ</div>
          </div>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          <Link to="/" className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] ${path === "/" ? "bg-accent font-semibold text-accent-foreground" : "text-navy hover:bg-muted"}`}><Home className="h-5 w-5" />Ana Sayfa</Link>
          {menu.map(([t, I]) => (
            <div key={t}>
              <button onClick={() => setOpen(open === t ? null : t)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[14px] text-navy hover:bg-muted ${open === t ? "bg-muted" : ""}`}>
                <I className="h-5 w-5" /><span className="flex-1">{t}</span>
                <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${open === t ? "rotate-90" : ""}`} />
              </button>
              {open === t && (
                <div className="ml-6 mt-1 flex flex-col border-l pl-4">
                  {(sub[t] ?? []).map((x) => (
                    <Link key={x} to="/modul/$slug" params={{ slug: slugify(x) }} className={`rounded-md px-3 py-1.5 text-[13px] hover:bg-muted ${path === "/modul/" + slugify(x) ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground hover:text-navy"}`}>{x}</Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="mt-auto px-3 pb-4">
          <Link to="/modul/$slug" params={{ slug: "ayarlar" }} className="mb-3 flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] text-navy hover:bg-muted"><Settings className="h-5 w-5" />Ayarlar</Link>
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
            <Search className="h-5 w-5" /><span className="truncate text-[14px]">Ürün, cari, fatura, stok, sipariş ara... (Ctrl + K)</span>
          </div>
          <div className="flex shrink-0 items-center gap-3 rounded-lg border bg-card px-4 py-2.5 text-[14px] text-navy"><Store className="h-5 w-5 text-brand" />Merkez Şube<ChevronDown className="ml-4 h-4 w-4" /></div>
          <div className="relative"><Bell className="h-6 w-6 text-navy" /><span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-bad text-xs text-primary-foreground">3</span></div>
          <HelpCircle className="h-6 w-6 text-navy" />
          <div className="h-8 w-px bg-border" />
          <div className="flex shrink-0 items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-brand font-semibold text-primary-foreground">YK</div><span className="text-[14px] font-semibold text-navy">Yönetici</span><ChevronDown className="h-4 w-4" /></div>
          <div className="ml-6 shrink-0 text-right"><div className="text-[15px] text-navy">{now ? now.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }) : ""}</div><div className="text-sm text-muted-foreground">{now ? now.toLocaleDateString("tr-TR", { weekday: "long" }) + " " + now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) : ""}</div></div>
        </header>
        <main className="space-y-5 p-6">{children}</main>
      </div>
    </div>
  );
}
