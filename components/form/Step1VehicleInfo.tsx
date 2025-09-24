"use client";
import { useState } from "react";

export default function Step1VehicleInfo({ data, setData, next }: any) {
  const [tasiyici, setTasiyici] = useState(data?.tasiyiciFirma || "");
  const [aracTuru, setAracTuru] = useState(data?.aracTuru || "");
  const [sevk, setSevk] = useState(data?.sevkDurumu || "");
  const [muhur, setMuhur] = useState(data?.muhurDurumu || "");
  const [soforSayisi, setSoforSayisi] = useState(data?.soforSayisi || 1);

  const handleNext = () => {
    setData({
      ...data,
      tasiyiciFirma: tasiyici,
      aracTuru,
      sevkDurumu: sevk,
      muhurDurumu: muhur,
      soforSayisi,
    });
    next();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Araç Bilgileri</h2>

      {/* Taşıyıcı Ünvanı */}
      <div>
        <label className="block">Taşıyıcı Ünvanı</label>
        <select
          value={tasiyici}
          onChange={(e) => setTasiyici(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">Seçiniz</option>
          <option value="XYZ Taşımacılık">XYZ Taşımacılık</option>
          <option value="ABC Lojistik">ABC Lojistik</option>
          <option value="DEF Nakliyat">DEF Nakliyat</option>
        </select>
      </div>

      {/* Araç Türü */}
      <div>
        <label className="block">Araç Türü</label>
        <select
          value={aracTuru}
          onChange={(e) => setAracTuru(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">Seçiniz</option>
          <option value="Yari Römork/Kamyon Römork">Yarı Römork/Kamyon Römork</option>
          <option value="Konteyner">Konteyner</option>
          <option value="Kamyon/Minivan">Kamyon/Minivan</option>
        </select>
      </div>

      {/* Sevk Durumu */}
      <div>
        <label className="block">Araç farklı bir gümrükten sevkli mi geldi?</label>
        <div className="flex gap-4">
          <label><input type="radio" value="Evet" checked={sevk === "Evet"} onChange={() => setSevk("Evet")} /> Evet</label>
          <label><input type="radio" value="Hayır" checked={sevk === "Hayır"} onChange={() => setSevk("Hayır")} /> Hayır</label>
        </div>
      </div>

      {/* Mühür Durumu */}
      <div>
        <label className="block">Araç üzerinde gümrük/fabrika mührü var mı?</label>
        <div className="flex gap-4">
          <label><input type="radio" value="Evet" checked={muhur === "Evet"} onChange={() => setMuhur("Evet")} /> Evet</label>
          <label><input type="radio" value="Hayır" checked={muhur === "Hayır"} onChange={() => setMuhur("Hayır")} /> Hayır</label>
        </div>
      </div>

      {/* Şoför Sayısı */}
      <div>
        <label className="block">Şoför Sayısı</label>
        <select
          value={soforSayisi}
          onChange={(e) => setSoforSayisi(Number(e.target.value))}
          className="border p-2 w-full"
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
        </select>
      </div>

      <button onClick={handleNext} className="bg-blue-500 text-white px-4 py-2 rounded">
        Devam →
      </button>
    </div>
  );
}
