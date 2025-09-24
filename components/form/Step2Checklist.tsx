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
      <div className="flex items-center gap-4 mb-3 p-3 border rounded-lg">
        <span className="flex-1 font-medium">{label}</span>
        <label 
          className={`flex items-center space-x-2 cursor-pointer p-2 rounded border ${
            val === true ? 'border-green-500 bg-green-50' : 'border-gray-300'
          }`}
          onClick={() => handleClick(true)}
        >
          <input
            type="radio"
            name={group}
            checked={val === true}
            onChange={() => {}}
            className="sr-only"
          />
          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
            val === true ? 'border-green-500' : 'border-gray-400'
          }`}>
            {val === true && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
          </div>
          <span>Uygun</span>
        </label>
        <label 
          className={`flex items-center space-x-2 cursor-pointer p-2 rounded border ${
            val === false ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          onClick={() => handleClick(false)}
        >
          <input
            type="radio"
            name={group}
            checked={val === false}
            onChange={() => {}}
            className="sr-only"
          />
          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
            val === false ? 'border-red-500' : 'border-gray-400'
          }`}>
            {val === false && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
          </div>
          <span>Uygun Değil</span>
        </label>
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
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-semibold mb-4">Araç Güvenlik Kontrol Formu</h2>

      {/* === Plaka Bilgileri (araç türüne göre dinamik) === */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-3">Plaka Bilgileri</h3>
        {data.aracTuru === "Römork" && (
          <>
            <input
              className="border border-gray-300 p-3 w-full mb-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Çekici Plakası"
              value={cekici}
              onChange={(e) => setCekici(e.target.value)}
            />
            <input
              className="border border-gray-300 p-3 w-full mb-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Dorse Plakası"
              value={dorse}
              onChange={(e) => setDorse(e.target.value)}
            />
          </>
        )}

        {data.aracTuru === "Konteyner" && (
          <>
            <input
              className="border border-gray-300 p-3 w-full mb-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Çekici Plakası"
              value={cekici}
              onChange={(e) => setCekici(e.target.value)}
            />
            <input
              className="border border-gray-300 p-3 w-full mb-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Dorse Plakası"
              value={dorse}
              onChange={(e) => setDorse(e.target.value)}
            />
            <input
              className="border border-gray-300 p-3 w-full mb-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Konteyner No"
              value={konteynerNo}
              onChange={(e) => setKonteynerNo(e.target.value)}
            />
          </>
        )}

        {data.aracTuru === "Minivan" && (
          <input
            className="border border-gray-300 p-3 w-full mb-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Minivan Plakası"
            value={cekici}
            onChange={(e) => setCekici(e.target.value)}
          />
        )}
      </div>

      {/* === Sevk Bilgileri (Sevk=Evet ise) === */}
      {data.sevkDurumu === "Evet" && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">Sevk Bilgileri</h3>
          <input
            className="border border-gray-300 p-3 w-full mb-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="MRN No"
            value={mrn}
            onChange={(e) => setMrn(e.target.value)}
          />
          <input
            className="border border-gray-300 p-3 w-full mb-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Rejim Hak Sahibi Adı"
            value={rejimHak}
            onChange={(e) => setRejimHak(e.target.value)}
          />
        </div>
      )}

      {/* === Mühür Bilgileri === */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-3">Mühür Kontrolü</h3>
        
        {/* Mevcut Mühür (Evet seçilmişse) */}
        {data.muhurDurumu === "Evet" && (
          <input
            className="border border-gray-300 p-3 w-full mb-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Mevcut Mühür Numarası"
            value={muhurNum}
            onChange={(e) => setMuhurNum(e.target.value)}
          />
        )}

        {/* Yeni Mühür (Hayır seçilmişse) */}
        {data.muhurDurumu === "Hayır" && (
          <input
            className="border border-gray-300 p-3 w-full mb-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="İzinli Gönderici Tesisinde Takılan Mühür No"
            value={yeniMuhurNum}
            onChange={(e) => setYeniMuhurNum(e.target.value)}
          />
        )}

        {/* Mühür Uygunluk Kontrolleri (Her iki durumda da gösterilir) */}
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-3">
            <span className="font-medium">Mühür Uygunluk Kontrolleri</span>
            <button
              type="button"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
              onClick={handleHepsiUygun}
            >
              Hepsi Uygun
            </button>
          </div>
          <MuhurSatiri name="evrakUyum" label="Evraklarla Uyum" />
          <MuhurSatiri name="saglamlik" label="Mührün Sağlamlığı" />
          <MuhurSatiri name="gerginlik" label="Mührün Gerginliği" />
          <MuhurSatiri name="kilitUygunluk" label="Kilit Aksamı Uygunluğu" />
        </div>
      </div>

      {/* === Şoför Bilgileri + İmza === */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-3">Şoför Bilgileri</h3>
        {Array.from({ length: desiredCount }).map((_, i) => (
          <div key={i} className="border border-gray-200 bg-white p-4 mb-4 rounded-lg">
            <h4 className="font-medium mb-3">Şoför {i + 1}</h4>
            <input
              className="border border-gray-300 p-3 w-full mb-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder={`Şoför ${i + 1} Ad Soyad`}
              value={soforler[i]?.ad || ""}
              onChange={(e) => updateSofor(i, "ad", e.target.value)}
            />
            <input
              className="border border-gray-300 p-3 w-full mb-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder={`Şoför ${i + 1} Telefon`}
              value={soforler[i]?.tel || ""}
              onChange={(e) => updateSofor(i, "tel", e.target.value)}
            />
            <p className="font-medium mb-2">Şoför {i + 1} İmza</p>
            <div className="border-2 border-gray-300 rounded-lg">
              <SignatureCanvas
                ref={(el) => (imzaRefs.current[i] = el)}
                penColor="black"
                canvasProps={{ width: 600, height: 180, className: "rounded-lg" }}
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded transition-colors"
                onClick={() => imzaRefs.current[i]?.clear()}
              >
                Temizle
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* === Navigasyon === */}
      <div className="flex justify-between mt-6">
        <button
          type="button"
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
          onClick={back}
        >
          ← Geri
        </button>
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          onClick={handleNext}
        >
          İleri →
        </button>
      </div>
    </div>
  );
}