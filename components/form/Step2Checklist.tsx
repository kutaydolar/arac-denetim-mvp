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
  const [yeniMuhurNum, setYeniMuhurNum] = React.useState<string>(data.yeniMuhurNum || "");
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
    
    const handleClick = (newVal: boolean) => {
      if (val === newVal) {
        // Aynı değere tıklanırsa seçimi kaldır
        setMuhur((p) => ({ ...p, [name]: null }));
      } else {
        setMuhur((p) => ({ ...p, [name]: newVal }));
      }
    };

    return (
      <div className="flex items-center gap-4 mb-4 p-4 oregon-card">
        <span className="flex-1 font-medium text-gray-700">{label}</span>
        <div 
          className={`oregon-radio-card cursor-pointer ${
            val === true ? 'selected' : ''
          }`}
          onClick={() => handleClick(true)}
        >
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              val === true ? 'border-green-500' : 'border-gray-400'
            }`}>
              {val === true && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
            </div>
            <span className="text-sm font-medium">Uygun</span>
          </div>
        </div>
        <div 
          className={`oregon-radio-card cursor-pointer ${
            val === false ? 'selected' : ''
          }`}
          onClick={() => handleClick(false)}
        >
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              val === false ? 'border-red-500' : 'border-gray-400'
            }`}>
              {val === false && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
            </div>
            <span className="text-sm font-medium">Uygun Değil</span>
          </div>
        </div>
      </div>
    );
  };

  // Hepsi Uygun butonu
  const handleHepsiUygun = () => {
    setMuhur({
      evrakUyum: true,
      saglamlik: true,
      gerginlik: true,
      kilitUygunluk: true
    });
  };

  const handleNext = () => {
    // İmzaları base64 olarak topla (tuval boşsa mevcut değeri koru)
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
      yeniMuhurNum,
      muhurKontrol: muhur,
      // şoförler
      soforler: withSignatures
    });
    next();
  };

  return (
    <div className="space-y-6 mt-6">
      <div className="oregon-card p-6">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 oregon-gradient rounded-full flex items-center justify-center text-white font-bold mr-3">
            2
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Araç Detayları</h2>
        </div>

        {/* === Plaka Bilgileri === */}
        <div className="oregon-card p-4 mb-6">
          <h3 className="font-semibold text-lg text-gray-800 mb-4">📋 Plaka Bilgileri</h3>
          <div className="space-y-4">
            {data.aracTuru === "Römork" && (
              <>
                <input
                  className="oregon-input w-full"
                  placeholder="Çekici Plakası"
                  value={cekici}
                  onChange={(e) => setCekici(e.target.value)}
                />
                <input
                  className="oregon-input w-full"
                  placeholder="Dorse Plakası"
                  value={dorse}
                  onChange={(e) => setDorse(e.target.value)}
                />
              </>
            )}

            {data.aracTuru === "Konteyner" && (
              <>
                <input
                  className="oregon-input w-full"
                  placeholder="Çekici Plakası"
                  value={cekici}
                  onChange={(e) => setCekici(e.target.value)}
                />
                <input
                  className="oregon-input w-full"
                  placeholder="Dorse Plakası"
                  value={dorse}
                  onChange={(e) => setDorse(e.target.value)}
                />
                <input
                  className="oregon-input w-full"
                  placeholder="Konteyner No"
                  value={konteynerNo}
                  onChange={(e) => setKonteynerNo(e.target.value)}
                />
              </>
            )}

            {data.aracTuru === "Minivan" && (
              <input
                className="oregon-input w-full"
                placeholder="Minivan Plakası"
                value={cekici}
                onChange={(e) => setCekici(e.target.value)}
              />
            )}
          </div>
        </div>

        {/* === Sevk Bilgileri === */}
        {data.sevkDurumu === "Evet" && (
          <div className="oregon-card p-4 mb-6">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">🚛 Sevk Bilgileri</h3>
            <div className="space-y-4">
              <input
                className="oregon-input w-full"
                placeholder="MRN No"
                value={mrn}
                onChange={(e) => setMrn(e.target.value)}
              />
              <input
                className="oregon-input w-full"
                placeholder="Rejim Hak Sahibi Adı"
                value={rejimHak}
                onChange={(e) => setRejimHak(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* === Mühür Bilgileri === */}
        <div className="oregon-card p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-gray-800">🔒 Mühür Kontrolü</h3>
            <button
              type="button"
              className="oregon-button-primary px-4 py-2"
              onClick={handleHepsiUygun}
            >
              Hepsi Uygun ✓
            </button>
          </div>
          
          {/* Mevcut/Yeni Mühür */}
          <div className="mb-6">
            {data.muhurDurumu === "Evet" && (
              <input
                className="oregon-input w-full mb-4"
                placeholder="Mevcut Mühür Numarası"
                value={muhurNum}
                onChange={(e) => setMuhurNum(e.target.value)}
              />
            )}

            {data.muhurDurumu === "Hayır" && (
              <input
                className="oregon-input w-full mb-4"
                placeholder="İzinli Gönderici Tesisinde Takılan Mühür No"
                value={yeniMuhurNum}
                onChange={(e) => setYeniMuhurNum(e.target.value)}
              />
            )}
          </div>

          {/* Mühür Uygunluk Kontrolleri */}
          <div className="space-y-2">
            <MuhurSatiri name="evrakUyum" label="Evraklarla Uyum" />
            <MuhurSatiri name="saglamlik" label="Mührün Sağlamlığı" />
            <MuhurSatiri name="gerginlik" label="Mührün Gerginliği" />
            <MuhurSatiri name="kilitUygunluk" label="Kilit Aksamı Uygunluğu" />
          </div>
        </div>

        {/* === Şoför Bilgileri === */}
        <div className="oregon-card p-4">
          <h3 className="font-semibold text-lg text-gray-800 mb-4">👤 Şoför Bilgileri</h3>
          {Array.from({ length: desiredCount }).map((_, i) => (
            <div key={i} className="oregon-card p-4 mb-4">
              <h4 className="font-medium text-gray-700 mb-4">Şoför {i + 1}</h4>
              <div className="space-y-4">
                <input
                  className="oregon-input w-full"
                  placeholder={`Şoför ${i + 1} Ad Soyad`}
                  value={soforler[i]?.ad || ""}
                  onChange={(e) => updateSofor(i, "ad", e.target.value)}
                />
                <input
                  className="oregon-input w-full"
                  placeholder={`Şoför ${i + 1} Telefon`}
                  value={soforler[i]?.tel || ""}
                  onChange={(e) => updateSofor(i, "tel", e.target.value)}
                />
                <div>
                  <p className="font-medium text-gray-700 mb-2">Şoför {i + 1} İmza</p>
                  <div className="border-2 border-gray-300 rounded-lg bg-white">
                    <SignatureCanvas
                      ref={(el) => (imzaRefs.current[i] = el)}
                      penColor="black"
                      canvasProps={{ width: 600, height: 180, className: "rounded-lg" }}
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      className="oregon-button-secondary px-3 py-1"
                      onClick={() => imzaRefs.current[i]?.clear()}
                    >
                      Temizle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* === Navigasyon === */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            className="oregon-button-secondary px-6 py-3"
            onClick={back}
          >
            ← Geri
          </button>
          <button
            type="button"
            className="oregon-button-primary px-6 py-3"
            onClick={handleNext}
          >
            İleri →
          </button>
        </div>
      </div>
    </div>
  );
}