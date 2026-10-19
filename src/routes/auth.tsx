import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Box } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import "@lovable.dev/cloud-auth-js/styles.css";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Giriş Yap — İnşaatÇevrem ERP" },
      { name: "description", content: "İnşaatÇevrem ERP sistemine giriş yapın veya hesap oluşturun." },
      { property: "og:title", content: "Giriş Yap — İnşaatÇevrem ERP" },
      { property: "og:description", content: "İnşaatÇevrem yapı market yönetim sistemine giriş." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [ad, setAd] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) navigate({ to: "/", replace: true }); });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
      setBusy(false);
      if (error) return toast.error("Giriş başarısız: e-posta veya şifre hatalı");
      navigate({ to: "/", replace: true });
    } else {
      const { error } = await supabase.auth.signUp({ email, password: pw, options: { emailRedirectTo: window.location.origin, data: { ad_soyad: ad } } });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Hesap oluşturuldu. E-postanıza gelen bağlantı ile hesabınızı onaylayın.");
      setMode("in");
    }
  };

  const oauth = async (p: "google" | "lovable") => {
    const r = await lovable.auth.signInWithOAuth(p, { redirect_uri: window.location.origin });
    if (r.error) return toast.error("Giriş yapılamadı");
    if (r.redirected) return;
    navigate({ to: "/", replace: true });
  };

  const inp = "mt-1 w-full rounded-lg border bg-card px-3 py-2.5 text-[14px] text-navy outline-none focus:border-brand";
  return (
    <div className="grid min-h-screen place-items-center bg-muted px-4">
      <div className="w-full max-w-[420px] rounded-2xl border bg-card p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-brand text-primary-foreground"><Box className="h-6 w-6" /></div>
          <div>
            <div className="text-[19px] font-bold text-navy">İnşaatÇevrem ERP</div>
            <div className="text-[11px] font-medium tracking-wide text-muted-foreground">YAPI MARKET YÖNETİM SİSTEMİ</div>
          </div>
        </div>
        <h1 className="text-[22px] font-bold text-navy">{mode === "in" ? "Giriş Yap" : "Hesap Oluştur"}</h1>
        <form onSubmit={submit} className="mt-4 flex flex-col gap-3">
          {mode === "up" && <label className="text-[13px] text-muted-foreground">Ad Soyad<input required value={ad} onChange={(e) => setAd(e.target.value)} className={inp} /></label>}
          <label className="text-[13px] text-muted-foreground">E-posta<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inp} /></label>
          <label className="text-[13px] text-muted-foreground">Şifre<input required type="password" minLength={6} value={pw} onChange={(e) => setPw(e.target.value)} className={inp} /></label>
          <button disabled={busy} className="mt-2 rounded-lg bg-brand py-2.5 text-[14px] font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60">{busy ? "Lütfen bekleyin..." : mode === "in" ? "Giriş Yap" : "Kayıt Ol"}</button>
        </form>
        <div className="my-4 flex items-center gap-3 text-[12px] text-muted-foreground"><div className="h-px flex-1 bg-border" />veya<div className="h-px flex-1 bg-border" /></div>
        <div className="flex flex-col gap-2">
          <button type="button" onClick={() => oauth("google")} className="rounded-lg border py-2.5 text-[14px] text-navy hover:bg-muted">Google ile devam et</button>
          <button type="button" className="lovable-auth-button" onClick={() => oauth("lovable")}>Continue with Lovable</button>
        </div>
        <p className="mt-5 text-center text-[13px] text-muted-foreground">
          {mode === "in" ? "Hesabınız yok mu? " : "Zaten hesabınız var mı? "}
          <button type="button" onClick={() => setMode(mode === "in" ? "up" : "in")} className="font-medium text-brand hover:underline">{mode === "in" ? "Kayıt olun" : "Giriş yapın"}</button>
        </p>
      </div>
    </div>
  );
}
