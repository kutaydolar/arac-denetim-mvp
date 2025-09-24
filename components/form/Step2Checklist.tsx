"use client";
import React from "react";
import SignatureCanvas from "react-signature-canvas";

type Sofor = { ad?: string; tel?: string; imza?: string };
type MuhurState = {
  evrakUyum?: boolean | null;
  saglamlik?: boolean | null;
  gerginlik?: boolean | null;
  kilitUygunluk?: boolean | null;
};

export default function Step2Checklist({ data, setData, next, back }: any) {
  // Plaka alanları
  const [cekici, setCekici] = React.useState<string>(data.cekici || "");
  const [dorse, setDorse] = React.useState<string>(data.dorse || "");
  const [konteynerNo, setKonteynerNo] = React.useState<string>(data.konteynerNo || "");

  // Sevk bilgileri
  const [mrn, setMrn] = React.useState<string>(data.mrn || "");
  const [rejimHak, setRejimHak] = React.useState<string>(data.rejimHak || "");

  // Mühür bilgileri
  const [muhurNum, setMuhurNum] = React.useState<string>(data.muhurNum || "");
  const [muhur, setMuhur] = React.useState<MuhurState>(
    data.muhurKontrol || {
      evrakUyum: null,
      saglamlik: null,
      gerginlik: null,
      kilitUygunluk: null
    }
  );

  // Şoförler ve imza ref'leri
  const desiredCount = data?.soforSayisi || 1;
  const [soforler, setSoforler] = React.useState<Sofor[]>(
    () => (data.soforler?.length ? data.soforler : Array.from({ length: desiredCount }, () => ({})))
  );
  const imzaRefs = React.useRef<Array<SignatureCanvas | null>>([]);

  // Şoför sayısı değişirse listeyi güvenli şekilde yeniden boyutlandır
  React.useEffect(() => {
    setSoforler((prev) => {
      const copy = Array.from({ length: desiredCount }, (_, i) => prev[i] || {});
      return copy;
    });
  }, [desiredCount]);

  const updateSofor = (i: number, key: keyof Sofor, value: string) => {
    setSoforler((prev) => {
      const copy = [...prev];
      copy[i] = { ...copy[i], [key]: value };
      return copy;
    });
  };

  const MuhurSatiri = ({
    name,
    label
  }: {
    name: keyof MuhurState;
    label: string;
  }) => {
    const val = muhur[name];
    const group = `muhur_${name}`;
    return (
      <div className="flex items-center gap-3 mb-2">
        <span className="w-64">{label}</span>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name={group}
            checked={val === true}
            onChange={() => setMuhur((p) => ({ ...p, [name]: true }))}
          />
          Uygun
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name={group}
            checked={val === false}
            onChange={() => setMuhur((p) => ({ ...p, [name]: false }))}
          />
          Uygun Değil
        </label>
      </div>
    );
  };

  const handleNext = () => {
    // mzaları base64 olarak topla (tuval boşsa mevcut değeri koru)
    const withSignatures = soforler.map((s, i) => {
      const ref = imzaRefs.current[i];
      let imza = s.imza || "";
      try {
        if (ref && !ref.isEmpty()) {
          imza = ref.getTrimmedCanvas().toDataURL("image/png");
        }
      } catch {}
      return { ...s, imza };
    });

    setData({
      ...data,
      // plakalar
      cekici,
      dorse,
      konteynerNo,
      // sevk
      mrn,
      rejimHak,
      // mühür
      muhurNum,
      muhurKontrol: muhur,
      // şoförler
      soforler: withSignatures
    });
    next();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Araç Güvenlik Kontrol Formu</h2>

      {/* === Plaka Bilgileri (araç türüne göre dinamik) === */}
      <h3 className="font-semibold mb-2">Plaka Bilgileri</h3>
      {data.aracTuru === "Yari Römork/Kamyon Römork" && (
        <>
          <input
            className="border p-2 w-full mb-2"
            placeholder="Çekici Plakası"
            value={cekici}
            onChange={(e) => setCekici(e.target.value)}
          />
          <input
            className="border p-2 w-full mb-2"
            placeholder="Dorse Plakası"
            value={dorse}
            onChange={(e) => setDorse(e.target.value)}
          />
        </>
      )}

      {data.aracTuru === "Konteyner" && (
        <>
          <input
            className="border p-2 w-full mb-2"
            placeholder="Çekici Plakası"
            value={cekici}
            onChange={(e) => setCekici(e.target.value)}
          />
          <input
            className="border p-2 w-full mb-2"
            placeholder="Dorse Plakası"
            value={dorse}
            onChange={(e) => setDorse(e.target.value)}
          />
          <input
            className="border p-2 w-full mb-2"
            placeholder="Konteyner No"
            value={konteynerNo}
            onChange={(e) => setKonteynerNo(e.target.value)}
          />
        </>
      )}

      {data.aracTuru === "Kamyon/Minivan" && (
        <input
          className="border p-2 w-full mb-2"
          placeholder="Kamyon/Minivan Plakası"
          value={cekici}
          onChange={(e) => setCekici(e.target.value)}
        />
      )}

      {/* === Sevk Bilgileri (Sevk=Evet ise) === */}
      {data.sevkDurumu === "Evet" && (
        <>
          <h3 className="font-semibold mt-4 mb-2">Sevk Bilgileri</h3>
          <input
            className="border p-2 w-full mb-2"
            placeholder="MRN No"
            value={mrn}
            onChange={(e) => setMrn(e.target.value)}
          />
          <input
            className="border p-2 w-full mb-2"
            placeholder="Rejim Hak Sahibi Adı"
            value={rejimHak}
            onChange={(e) => setRejimHak(e.target.value)}
          />
        </>
      )}

      {/* === Mühür Bilgileri (Mühür=Evet ise) === */}
      {data.muhurDurumu === "Evet" && (
        <>
          <h3 className="font-semibold mt-4 mb-2">Mühür Kontrolü</h3>
          <input
            className="border p-2 w-full mb-3"
            placeholder="Mühür Numarası"
            value={muhurNum}
            onChange={(e) => setMuhurNum(e.target.value)}
          />
          <MuhurSatiri name="evrakUyum" label="Evraklarla Uyum" />
          <MuhurSatiri name="saglamlik" label="Mührün Sağlamlığı" />
          <MuhurSatiri name="gerginlik" label="Mührün Gerginliği" />
          <MuhurSatiri name="kilitUygunluk" label="Kilit Aksamı Uygunluğu" />
        </>
      )}

      {/* === Şoför Bilgileri + mza === */}
      <h3 className="font-semibold mt-6 mb-2">Şoför Bilgileri</h3>
      {Array.from({ length: desiredCount }).map((_, i) => (
        <div key={i} className="border p-3 mb-4">
          <input
            className="border p-2 w-full mb-2"
            placeholder={`Şoför ${i + 1} Ad Soyad`}
            value={soforler[i]?.ad || ""}
            onChange={(e) => updateSofor(i, "ad", e.target.value)}
          />
          <input
            className="border p-2 w-full mb-2"
            placeholder={`Şoför ${i + 1} Telefon`}
            value={soforler[i]?.tel || ""}
            onChange={(e) => updateSofor(i, "tel", e.target.value)}
          />
          <p className="font-medium mb-1">Şoför {i + 1} mza</p>
          <SignatureCanvas
            ref={(el) => (imzaRefs.current[i] = el)}
            penColor="black"
            canvasProps={{ width: 600, height: 180, className: "border mb-2" }}
          />
          <div className="flex gap-2">
            <button
              type="button"
              className="bg-gray-200 px-3 py-1 rounded"
              onClick={() => imzaRefs.current[i]?.clear()}
            >
              Temizle
            </button>
          </div>
        </div>
      ))}

      {/* === Navigasyon === */}
      <div className="flex justify-between mt-4">
        <button
          type="button"
          className="bg-gray-600 text-white px-4 py-2 rounded"
          onClick={back}
        >
          Geri
        </button>
        <button
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleNext}
        >
          leri
        </button>
      </div>
    </div>
  );
}
