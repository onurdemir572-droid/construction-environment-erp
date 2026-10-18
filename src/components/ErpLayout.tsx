import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { toast } from "sonner";
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
  const navigate = useNavigate();
  const [pop, setPop] = useState<string | null>(null);
  const [unread, setUnread] = useState(3);
  const [branch, setBranch] = useState("Merkez Şube");
  const [q, setQ] = useState("");
  const hits = q ? Object.values(sub).flat().filter((x) => x.toLocaleLowerCase("tr").includes(q.toLocaleLowerCase("tr"))).slice(0, 6) : [];
  const [zoom, setZoom] = useState(1);
  const [open, setOpen] = useState<string | null>(() => Object.keys(sub).find((k) => (sub[k] ?? []).some((x) => path === "/modul/" + slugify(x))) ?? null);
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
            <div className="flex-1"><div className="text-sm font-bold text-navy">Demo Yapı Market</div><div className="text-sm text-muted-foreground">{branch}</div></div>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center gap-5 border-b px-6 py-3">
          <div className="relative flex min-w-0 flex-1 items-center gap-3 rounded-lg border bg-card px-4 py-2.5 text-muted-foreground focus-within:border-brand">
            <Search className="h-5 w-5" /><input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && hits[0]) { navigate({ to: "/modul/$slug", params: { slug: slugify(hits[0]) } }); setQ(""); } }} placeholder="Ürün, cari, fatura, stok, sipariş ara... (Ctrl + K)" className="w-full bg-transparent text-[14px] text-navy outline-none placeholder:text-muted-foreground" />
            {q && (
              <div className="absolute left-0 right-0 top-12 z-40 rounded-xl border bg-card p-1 shadow-xl">
                {hits.length ? hits.map((h) => <Link key={h} to="/modul/$slug" params={{ slug: slugify(h) }} onClick={() => setQ("")} className="block rounded-lg px-3 py-2 text-[13px] text-navy hover:bg-muted">{h}</Link>) : <div className="px-3 py-2 text-[13px] text-muted-foreground">Sonuç bulunamadı</div>}
              </div>
            )}
          </div>
          <label className="flex shrink-0 items-center gap-3 rounded-lg border bg-card px-4 py-2.5 text-[14px] text-navy"><Store className="h-5 w-5 text-brand" /><select value={branch} onChange={(e) => { setBranch(e.target.value); toast.success(e.target.value + " seçildi"); }} className="bg-transparent outline-none">{["Merkez Şube", "Şube 2", "Açık Alan Depo"].map((b) => <option key={b}>{b}</option>)}</select></label>
          <div className="relative">
            <button onClick={() => setPop(pop === "bell" ? null : "bell")} className="relative block"><Bell className="h-6 w-6 text-navy" />{unread > 0 && <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-bad text-xs text-primary-foreground">{unread}</span>}</button>
            {pop === "bell" && (
              <div className="absolute right-0 top-10 z-40 w-80 rounded-xl border bg-card p-2 shadow-xl">
                <div className="flex items-center justify-between px-2 py-1"><b className="text-sm text-navy">Bildirimler</b><button onClick={() => setUnread(0)} className="text-xs text-brand">Tümünü okundu say</button></div>
                {["Çimento 50 kg kritik stok seviyesinde", "3 carinin ödeme vadesi bugün", "4 satınalma siparişi onay bekliyor"].map((n) => <div key={n} className="rounded-lg px-2 py-2 text-[13px] text-navy hover:bg-muted">{n}</div>)}
              </div>
            )}
          </div>
          <HelpCircle className="h-6 w-6 text-navy" />
          <div className="h-8 w-px bg-border" />
          <div className="relative">
            <button onClick={() => setPop(pop === "user" ? null : "user")} className="flex shrink-0 items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-brand font-semibold text-primary-foreground">YK</div><span className="text-[14px] font-semibold text-navy">Yönetici</span><ChevronDown className="h-4 w-4" /></button>
            {pop === "user" && (
              <div className="absolute right-0 top-12 z-40 w-48 rounded-xl border bg-card p-1 shadow-xl">
                {[["Profilim", "kullanicilar"], ["Ayarlar", "ayarlar"], ["Yetkiler", "yetkiler"]].map(([t, sl]) => <Link key={t} to="/modul/$slug" params={{ slug: sl! }} onClick={() => setPop(null)} className="block rounded-lg px-3 py-2 text-[13px] text-navy hover:bg-muted">{t}</Link>)}
                <button onClick={() => { setPop(null); toast("Oturum kapatıldı"); }} className="block w-full rounded-lg px-3 py-2 text-left text-[13px] text-bad hover:bg-bad-soft">Çıkış Yap</button>
              </div>
            )}
          </div>
          <div className="ml-6 shrink-0 text-right"><div className="text-[15px] text-navy">{now ? now.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }) : ""}</div><div className="text-sm text-muted-foreground">{now ? now.toLocaleDateString("tr-TR", { weekday: "long" }) + " " + now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) : ""}</div></div>
        </header>
        <main className="space-y-5 p-6">{children}</main>
      </div>
    </div>
  );
}
