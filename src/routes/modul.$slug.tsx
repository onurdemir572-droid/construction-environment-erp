import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Download, Filter, Search, Printer, Trash2, X } from "lucide-react";
import { sub, slugify, menu, soft, type Tone } from "@/lib/erp";

type Col = { k: string; t: string; right?: boolean };

const titles = new Map<string, { title: string; group: string }>();
for (const [g] of menu) for (const x of sub[g] ?? []) titles.set(slugify(x), { title: x, group: g });
titles.set("ayarlar", { title: "Ayarlar", group: "Sistem" });

const firms = ["ABC İnşaat Ltd. Şti.", "XYZ Yapı Malzemeleri A.Ş.", "Karadeniz Yapı", "Ege Tesisat", "Anadolu Hırdavat", "Marmara Boya", "Yıldız Seramik", "Demirtaş Metal"];
const products = ["Çimento 50 kg", "Demir Ø12", "Seramik Yapıştırıcı 25 kg", "Alçıpan 12,5 mm", "İzolasyon Levhası", "Tuğla 13,5'luk", "Plastik Boya 15 L", "PVC Boru 100 mm"];
const statuses: [string, Tone][] = [["Onaylandı", "ok"], ["Bekliyor", "warn"], ["Taslak", "brand"], ["İptal", "bad"]];
const tl = (n: number) => "₺ " + n.toLocaleString("tr-TR", { minimumFractionDigits: 2 });

function dataFor(group: string, slug: string): { cols: Col[]; rows: Record<string, React.ReactNode>[]; kpis: [string, string][] } {
  const seed = slug.length;
  const rnd = (i: number, m: number) => ((i * 9301 + seed * 49297) % 233280) / 233280 * m;
  const date = (i: number) => `${String(10 - (i % 9)).padStart(2, "0")}.10.2024`;
  const st = (i: number) => { const [s, t] = statuses[i % 4]!; return <span className={`rounded px-2 py-0.5 text-xs font-medium ${soft[t]}`}>{s}</span>; };
  const R = Array.from({ length: 22 }, (_, i) => i);
  if (group === "Ürün ve Stok" || group === "Depo" || group === "Fiyatlandırma")
    return {
      kpis: [["Toplam Ürün", "2.847"], ["Kritik Stok", "18"], ["Stok Değeri", tl(4825300)], ["Depo Sayısı", "3"]],
      cols: [{ k: "kod", t: "Stok Kodu" }, { k: "ad", t: "Ürün Adı" }, { k: "kat", t: "Kategori" }, { k: "depo", t: "Depo" }, { k: "mik", t: "Miktar", right: true }, { k: "fiyat", t: "Satış Fiyatı", right: true }, { k: "durum", t: "Durum" }],
      rows: R.map((i) => ({ kod: `STK-${1000 + i * 7}`, ad: products[i % 8], kat: ["Kaba Yapı", "Demir", "Seramik", "Alçı", "Yalıtım"][i % 5], depo: ["Merkez", "Şube 2", "Açık Alan"][i % 3], mik: Math.round(rnd(i + 1, 400)), fiyat: tl(Math.round(rnd(i + 3, 900)) + 50), durum: st(i) })),
    };
  if (group === "Cari Hesaplar" || group === "Çek ve Senet")
    return {
      kpis: [["Toplam Cari", "412"], ["Borçlu Cari", "23"], ["Toplam Alacak", tl(532620)], ["Vadesi Geçen", tl(84300)]],
      cols: [{ k: "kod", t: "Cari Kodu" }, { k: "ad", t: "Ünvan" }, { k: "tel", t: "Telefon" }, { k: "il", t: "İl" }, { k: "borc", t: "Borç", right: true }, { k: "alacak", t: "Alacak", right: true }, { k: "durum", t: "Durum" }],
      rows: R.map((i) => ({ kod: `CR-${200 + i}`, ad: firms[i % 8], tel: `0 (5${30 + i}) 4${i}2 1${i} ${20 + i}`, il: ["İstanbul", "Ankara", "İzmir", "Trabzon", "Bursa"][i % 5], borc: tl(Math.round(rnd(i + 2, 90000))), alacak: tl(Math.round(rnd(i + 5, 60000))), durum: st(i) })),
    };
  if (group === "Yönetim" || group === "Sistem")
    return {
      kpis: [["Kullanıcı", "12"], ["Aktif Oturum", "5"], ["Şube", "3"], ["Rol", "6"]],
      cols: [{ k: "ad", t: "Ad Soyad" }, { k: "eposta", t: "E-posta" }, { k: "rol", t: "Rol" }, { k: "sube", t: "Şube" }, { k: "son", t: "Son Giriş" }, { k: "durum", t: "Durum" }],
      rows: R.slice(0, 7).map((i) => ({ ad: ["Ahmet Yılmaz", "Ayşe Demir", "Mehmet Kaya", "Fatma Şahin", "Ali Çelik", "Zeynep Arslan", "Murat Koç"][i], eposta: `kullanici${i + 1}@insaatcevrem.com`, rol: ["Yönetici", "Satış", "Depo", "Muhasebe"][i % 4], sube: ["Merkez", "Şube 2"][i % 2], son: `${date(i)} 1${i}:2${i}`, durum: st(i % 2) })),
    };
  return {
    kpis: [["Bu Ay Toplam", tl(1254320)], ["Belge Sayısı", "186"], ["Bekleyen", "14"], ["Ortalama Tutar", tl(6743)]],
    cols: [{ k: "no", t: "Belge No" }, { k: "tarih", t: "Tarih" }, { k: "cari", t: "Cari" }, { k: "aciklama", t: "Açıklama" }, { k: "tutar", t: "Tutar", right: true }, { k: "durum", t: "Durum" }],
    rows: R.map((i) => ({ no: `#${slug.slice(0, 2).toUpperCase()}2024-${String(120 - i).padStart(4, "0")}`, tarih: date(i), cari: firms[i % 8], aciklama: products[(i + 3) % 8], tutar: tl(Math.round(rnd(i + 4, 75000)) + 500), durum: st(i) })),
  };
}

export const Route = createFileRoute("/modul/$slug")({
  loader: ({ params }) => {
    const m = titles.get(params.slug);
    if (!m) throw notFound();
    return m;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Modül"} — İnşaatÇevrem ERP` },
      { name: "description", content: `İnşaatÇevrem ERP ${loaderData?.title ?? ""} ekranı.` },
      { property: "og:title", content: `${loaderData?.title ?? "Modül"} — İnşaatÇevrem ERP` },
      { property: "og:description", content: `${loaderData?.group ?? ""} modülü: ${loaderData?.title ?? ""}.` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Modul,
});

function Modul() {
  const { title, group } = Route.useLoaderData();
  const { slug } = Route.useParams();
  const base = useMemo(() => dataFor(group, slug), [group, slug]);
  const [rows, setRows] = useState(base.rows);
  const [q, setQ] = useState("");
  const [fs, setFs] = useState<string>("Tümü");
  const [page, setPage] = useState(1);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [sel, setSel] = useState<Set<number>>(new Set());
  useEffect(() => { setRows(base.rows); setQ(""); setFs("Tümü"); setPage(1); setSel(new Set()); }, [base]);
  const { cols, kpis } = base;
  const text = (v: unknown): string => (typeof v === "object" && v && "props" in (v as any) ? String((v as any).props.children) : String(v ?? ""));
  const filtered = rows.map((r, i) => ({ r, i })).filter(({ r }) =>
    (fs === "Tümü" || text(r.durum) === fs) &&
    (!q || cols.some((c) => text(r[c.k]).toLocaleLowerCase("tr").includes(q.toLocaleLowerCase("tr")))));
  const per = 8;
  const pages = Math.max(1, Math.ceil(filtered.length / per));
  const cur = Math.min(page, pages);
  const shown = filtered.slice((cur - 1) * per, cur * per);
  const exportCsv = () => {
    const lines = [cols.map((c) => c.t).join(";"), ...filtered.map(({ r }) => cols.map((c) => text(r[c.k])).join(";"))];
    const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `${slug}.csv`; a.click();
    toast.success("Excel dosyası indirildi");
  };
  const save = () => {
    const r: Record<string, React.ReactNode> = {};
    for (const c of cols) r[c.k] = c.k === "durum" ? <span className={`rounded px-2 py-0.5 text-xs font-medium ${soft.brand}`}>Taslak</span> : form[c.k] || "-";
    setRows([r, ...rows]); setShowNew(false); setForm({}); setPage(1);
    toast.success("Kayıt eklendi");
  };
  const del = () => { setRows(rows.filter((_, i) => !sel.has(i))); toast.success(`${sel.size} kayıt silindi`); setSel(new Set()); };
  return (
    <>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[13px] text-muted-foreground"><Link to="/" className="hover:text-brand">Ana Sayfa</Link> / {group} / <span className="text-navy">{title}</span></div>
          <h1 className="mt-1 text-[26px] font-bold text-navy">{title}</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-[13px] text-navy hover:bg-muted"><Printer className="h-4 w-4" />Yazdır</button>
          <button onClick={exportCsv} className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-[13px] text-navy hover:bg-muted"><Download className="h-4 w-4" />Excel</button>
          <button onClick={() => setShowNew(true)} className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-[13px] font-medium text-primary-foreground hover:opacity-90"><Plus className="h-4 w-4" />Yeni Kayıt</button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {kpis.map(([k, v]) => (
          <div key={k} className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="text-[13px] text-muted-foreground">{k}</div>
            <div className="mt-1 text-xl font-bold text-navy">{v}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="flex items-center gap-3 border-b p-4">
          <label className="flex w-80 items-center gap-2 rounded-lg border px-3 py-2 text-[13px] text-muted-foreground focus-within:border-brand">
            <Search className="h-4 w-4" />
            <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Bu listede ara..." className="w-full bg-transparent text-navy outline-none placeholder:text-muted-foreground" />
          </label>
          <label className="flex items-center gap-2 rounded-lg border px-3 py-2 text-[13px] text-navy">
            <Filter className="h-4 w-4" />
            <select value={fs} onChange={(e) => { setFs(e.target.value); setPage(1); }} className="bg-transparent outline-none">
              {["Tümü", ...statuses.map(([x]) => x)].map((x) => <option key={x}>{x}</option>)}
            </select>
          </label>
          {sel.size > 0 && <button onClick={del} className="flex items-center gap-2 rounded-lg bg-bad-soft px-3 py-2 text-[13px] text-bad"><Trash2 className="h-4 w-4" />{sel.size} kaydı sil</button>}
          <span className="ml-auto text-[13px] text-muted-foreground">{filtered.length} kayıt</span>
        </div>
        <table className="w-full text-[13px]">
          <thead className="bg-muted text-left text-muted-foreground">
            <tr>
              <th className="w-10 px-4 py-3"><input type="checkbox" checked={shown.length > 0 && shown.every(({ i }) => sel.has(i))} onChange={(e) => { const n = new Set(sel); shown.forEach(({ i }) => e.target.checked ? n.add(i) : n.delete(i)); setSel(n); }} /></th>
              {cols.map((c) => <th key={c.k} className={`px-4 py-3 font-medium ${c.right ? "text-right" : ""}`}>{c.t}</th>)}
              <th className="w-10" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {shown.map(({ r, i }) => (
              <tr key={i} className="text-navy hover:bg-muted/60">
                <td className="px-4 py-3"><input type="checkbox" checked={sel.has(i)} onChange={() => { const n = new Set(sel); n.has(i) ? n.delete(i) : n.add(i); setSel(n); }} /></td>
                {cols.map((c) => <td key={c.k} className={`px-4 py-3 ${c.right ? "text-right tabular-nums" : ""}`}>{r[c.k]}</td>)}
                <td className="px-2"><button onClick={() => { setRows(rows.filter((_, j) => j !== i)); toast.success("Kayıt silindi"); }} title="Sil" className="rounded p-1 text-muted-foreground hover:bg-bad-soft hover:text-bad"><Trash2 className="h-4 w-4" /></button></td>
              </tr>
            ))}
            {shown.length === 0 && <tr><td colSpan={cols.length + 2} className="px-4 py-10 text-center text-muted-foreground">Kayıt bulunamadı</td></tr>}
          </tbody>
        </table>
        <div className="flex items-center justify-between border-t p-4 text-[13px] text-muted-foreground">
          <span>Sayfa {cur} / {pages}</span>
          <div className="flex gap-1">{Array.from({ length: pages }, (_, k) => k + 1).map((n) => <button key={n} onClick={() => setPage(n)} className={`grid h-8 w-8 place-items-center rounded-md ${n === cur ? "bg-brand text-primary-foreground" : "border hover:bg-muted"}`}>{n}</button>)}</div>
        </div>
      </div>
      {showNew && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy/40" onClick={() => setShowNew(false)}>
          <div className="w-[520px] rounded-xl bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold text-navy">Yeni Kayıt — {title}</h2><button onClick={() => setShowNew(false)}><X className="h-5 w-5 text-muted-foreground" /></button></div>
            <div className="grid grid-cols-2 gap-3">
              {cols.filter((c) => c.k !== "durum").map((c) => (
                <label key={c.k} className="text-[13px] text-muted-foreground">{c.t}
                  <input value={form[c.k] ?? ""} onChange={(e) => setForm({ ...form, [c.k]: e.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2 text-navy outline-none focus:border-brand" />
                </label>
              ))}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setShowNew(false)} className="rounded-lg border px-4 py-2 text-[13px] text-navy hover:bg-muted">Vazgeç</button>
              <button onClick={save} className="rounded-lg bg-brand px-4 py-2 text-[13px] font-medium text-primary-foreground">Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
