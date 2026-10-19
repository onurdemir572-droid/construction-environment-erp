import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Download, Filter, Search, Printer, Trash2, X, Loader2 } from "lucide-react";
import { soft } from "@/lib/erp";
import { titles, statuses, colsFor, kpisFor } from "@/lib/modules";
import { supabase } from "@/integrations/supabase/client";

type Row = { id: string; durum: string; data: Record<string, string> };

export const Route = createFileRoute("/_authenticated/modul/$slug")({
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

const tone = (d: string) => statuses.find(([s]) => s === d)?.[1] ?? "brand";

function Modul() {
  const { title, group } = Route.useLoaderData();
  const { slug } = Route.useParams();
  const qc = useQueryClient();
  const key = ["kayitlar", slug];
  const { data: rows = [], isLoading } = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase.from("kayitlar").select("id, durum, data").eq("modul", slug).order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });
  const cols = colsFor(group);
  const kpis = kpisFor(group);
  const [q, setQ] = useState("");
  const [fs, setFs] = useState("Tümü");
  const [page, setPage] = useState(1);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [durum, setDurum] = useState("Taslak");
  const [sel, setSel] = useState<Set<string>>(new Set());
  useEffect(() => { setQ(""); setFs("Tümü"); setPage(1); setSel(new Set()); }, [slug]);

  const add = useMutation({
    mutationFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const { error } = await supabase.from("kayitlar").insert({ modul: slug, durum, data: form, created_by: u.user?.id });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: key }); setShowNew(false); setForm({}); setDurum("Taslak"); setPage(1); toast.success("Kayıt kaydedildi"); },
    onError: () => toast.error("Kayıt kaydedilemedi"),
  });
  const remove = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from("kayitlar").delete().in("id", ids);
      if (error) throw error;
      return ids.length;
    },
    onSuccess: (n) => { qc.invalidateQueries({ queryKey: key }); setSel(new Set()); toast.success(`${n} kayıt silindi`); },
    onError: () => toast.error("Silme başarısız"),
  });
  const setStatus = useMutation({
    mutationFn: async ({ id, d }: { id: string; d: string }) => {
      const { error } = await supabase.from("kayitlar").update({ durum: d }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: key }); toast.success("Durum güncellendi"); },
  });

  const lq = q.toLocaleLowerCase("tr");
  const filtered = rows.filter((r) => (fs === "Tümü" || r.durum === fs) && (!q || cols.some((c) => String(r.data[c.k] ?? "").toLocaleLowerCase("tr").includes(lq))));
  const per = 8;
  const pages = Math.max(1, Math.ceil(filtered.length / per));
  const cur = Math.min(page, pages);
  const shown = filtered.slice((cur - 1) * per, cur * per);
  const exportCsv = () => {
    const lines = [[...cols.map((c) => c.t), "Durum"].join(";"), ...filtered.map((r) => [...cols.map((c) => r.data[c.k] ?? ""), r.durum].join(";"))];
    const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `${slug}.csv`; a.click();
    toast.success("Excel dosyası indirildi");
  };

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
        {[["Kayıt Sayısı", String(rows.length)] as [string, string], ...kpis.slice(1)].map(([k, v]) => (
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
          {sel.size > 0 && <button onClick={() => remove.mutate([...sel])} className="flex items-center gap-2 rounded-lg bg-bad-soft px-3 py-2 text-[13px] text-bad"><Trash2 className="h-4 w-4" />{sel.size} kaydı sil</button>}
          <span className="ml-auto text-[13px] text-muted-foreground">{filtered.length} kayıt</span>
        </div>
        <table className="w-full text-[13px]">
          <thead className="bg-muted text-left text-muted-foreground">
            <tr>
              <th className="w-10 px-4 py-3"><input type="checkbox" checked={shown.length > 0 && shown.every((r) => sel.has(r.id))} onChange={(e) => { const n = new Set(sel); shown.forEach((r) => e.target.checked ? n.add(r.id) : n.delete(r.id)); setSel(n); }} /></th>
              {cols.map((c) => <th key={c.k} className={`px-4 py-3 font-medium ${c.right ? "text-right" : ""}`}>{c.t}</th>)}
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {shown.map((r) => (
              <tr key={r.id} className="text-navy hover:bg-muted/60">
                <td className="px-4 py-3"><input type="checkbox" checked={sel.has(r.id)} onChange={() => { const n = new Set(sel); if (n.has(r.id)) n.delete(r.id); else n.add(r.id); setSel(n); }} /></td>
                {cols.map((c) => <td key={c.k} className={`px-4 py-3 ${c.right ? "text-right tabular-nums" : ""}`}>{r.data[c.k] || "-"}</td>)}
                <td className="px-4 py-3">
                  <select value={r.durum} onChange={(e) => setStatus.mutate({ id: r.id, d: e.target.value })} className={`cursor-pointer rounded px-2 py-0.5 text-xs font-medium outline-none ${soft[tone(r.durum)]}`}>
                    {statuses.map(([s]) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-2"><button onClick={() => remove.mutate([r.id])} title="Sil" className="rounded p-1 text-muted-foreground hover:bg-bad-soft hover:text-bad"><Trash2 className="h-4 w-4" /></button></td>
              </tr>
            ))}
            {isLoading && <tr><td colSpan={cols.length + 3} className="px-4 py-10 text-center text-muted-foreground"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></td></tr>}
            {!isLoading && shown.length === 0 && <tr><td colSpan={cols.length + 3} className="px-4 py-10 text-center text-muted-foreground">Kayıt bulunamadı</td></tr>}
          </tbody>
        </table>
        <div className="flex items-center justify-between border-t p-4 text-[13px] text-muted-foreground">
          <span>Sayfa {cur} / {pages}</span>
          <div className="flex gap-1">{Array.from({ length: pages }, (_, k) => k + 1).map((n) => <button key={n} onClick={() => setPage(n)} className={`grid h-8 w-8 place-items-center rounded-md ${n === cur ? "bg-brand text-primary-foreground" : "border hover:bg-muted"}`}>{n}</button>)}</div>
        </div>
      </div>
      {showNew && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy/40" onClick={() => setShowNew(false)}>
          <form className="w-[520px] rounded-xl bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()} onSubmit={(e) => { e.preventDefault(); add.mutate(); }}>
            <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold text-navy">Yeni Kayıt — {title}</h2><button type="button" onClick={() => setShowNew(false)}><X className="h-5 w-5 text-muted-foreground" /></button></div>
            <div className="grid grid-cols-2 gap-3">
              {cols.map((c, idx) => (
                <label key={c.k} className="text-[13px] text-muted-foreground">{c.t}
                  <input required={idx < 2} value={form[c.k] ?? ""} onChange={(e) => setForm({ ...form, [c.k]: e.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2 text-navy outline-none focus:border-brand" />
                </label>
              ))}
              <label className="text-[13px] text-muted-foreground">Durum
                <select value={durum} onChange={(e) => setDurum(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-navy outline-none">{statuses.map(([s]) => <option key={s}>{s}</option>)}</select>
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setShowNew(false)} className="rounded-lg border px-4 py-2 text-[13px] text-navy hover:bg-muted">Vazgeç</button>
              <button disabled={add.isPending} className="rounded-lg bg-brand px-4 py-2 text-[13px] font-medium text-primary-foreground disabled:opacity-60">{add.isPending ? "Kaydediliyor..." : "Kaydet"}</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
