"use client";
import { useState } from "react";

export default function Step1VehicleInfo({ data, setData, next }: any) {
  const [tasiyici, setTasiyici] = useState(data?.tasiyiciFirma || "");
  const [aracTuru, setAracTuru] = useState(data?.aracTuru || "");
  const [sevk, setSevk] = useState(data?.sevkDurumu || "");
  const [muhur, setMuhur] = useState(data?.muhurDurumu || "");
  const [soforSayisi, setSoforSayisi] = useState(data?.soforSayisi || 1);
  const [errors, setErrors] = useState<string[]>([]);

  const handleAracTuruSelect = (tur: string) => {
    if (aracTuru === tur) {
      setAracTuru(""); // Seçimi kaldır
    } else {
      setAracTuru(tur);
    }
  };

  const handleNext = () => {
    const newErrors: string[] = [];
    
    if (!tasiyici) newErrors.push("Taşıyıcı ünvanı seçilmelidir");
    if (!aracTuru) newErrors.push("Araç türü seçilmelidir");
    if (!sevk) newErrors.push("Sevk durumu seçilmelidir");
    if (!muhur) newErrors.push("Mühür durumu seçilmelidir");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

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
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-bold">Araç Bilgileri</h2>

      {/* Hata Mesajları */}
      {errors.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <ul className="list-disc list-inside">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Taşıyıcı Ünvanı */}
      <div>
        <label className="block text-sm font-medium mb-2">Taşıyıcı Ünvanı</label>
        <select
          value={tasiyici}
          onChange={(e) => setTasiyici(e.target.value)}
          className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Seçiniz</option>
          <option value="XYZ Taşımacılık">XYZ Taşımacılık</option>
          <option value="ABC Lojistik">ABC Lojistik</option>
          <option value="DEF Nakliyat">DEF Nakliyat</option>
        </select>
      </div>

      {/* Araç Türü - Kutucuk Seçimi */}
      <div>
        <label className="block text-sm font-medium mb-3">Araç Türü</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {["Römork", "Minivan", "Konteyner"].map((tur) => (
            <div
              key={tur}
              onClick={() => handleAracTuruSelect(tur)}
              className={`
                border-2 rounded-lg p-4 cursor-pointer text-center transition-all duration-200
                ${aracTuru === tur 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-300 bg-white hover:border-gray-400'
                }
              `}
            >
              <div className="flex items-center justify-center space-x-2">
                <div className={`
                  w-4 h-4 rounded border-2 flex items-center justify-center
                  ${aracTuru === tur ? 'border-blue-500 bg-blue-500' : 'border-gray-400'}
                `}>
                  {aracTuru === tur && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="font-medium">{tur}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sevk Durumu */}
      <div>
        <label className="block text-sm font-medium mb-3">Araç farklı bir gümrükten sevkli mi geldi?</label>
        <div className="flex gap-4">
          <div 
            className={`flex items-center space-x-2 cursor-pointer p-3 rounded-lg border ${
              sevk === "Evet" ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onClick={() => setSevk(sevk === "Evet" ? "" : "Evet")}
          >
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              sevk === "Evet" ? 'border-blue-500' : 'border-gray-400'
            }`}>
              {sevk === "Evet" && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
            </div>
            <span>Evet</span>
          </div>
          <div 
            className={`flex items-center space-x-2 cursor-pointer p-3 rounded-lg border ${
              sevk === "Hayır" ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onClick={() => setSevk(sevk === "Hayır" ? "" : "Hayır")}
          >
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              sevk === "Hayır" ? 'border-blue-500' : 'border-gray-400'
            }`}>
              {sevk === "Hayır" && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
            </div>
            <span>Hayır</span>
          </div>
        </div>
      </div>

      {/* Mühür Durumu */}
      <div>
        <label className="block text-sm font-medium mb-3">Araç mühürlü mü geldi?</label>
        <div className="flex gap-4">
          <div 
            className={`flex items-center space-x-2 cursor-pointer p-3 rounded-lg border ${
              muhur === "Evet" ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onClick={() => setMuhur(muhur === "Evet" ? "" : "Evet")}
          >
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              muhur === "Evet" ? 'border-blue-500' : 'border-gray-400'
            }`}>
              {muhur === "Evet" && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
            </div>
            <span>Evet</span>
          </div>
          <div 
            className={`flex items-center space-x-2 cursor-pointer p-3 rounded-lg border ${
              muhur === "Hayır" ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onClick={() => setMuhur(muhur === "Hayır" ? "" : "Hayır")}
          >
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              muhur === "Hayır" ? 'border-blue-500' : 'border-gray-400'
            }`}>
              {muhur === "Hayır" && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
            </div>
            <span>Hayır</span>
          </div>
        </div>
      </div>

      {/* Şoför Sayısı */}
      <div>
        <label className="block text-sm font-medium mb-2">Şoför Sayısı</label>
        <select
          value={soforSayisi}
          onChange={(e) => setSoforSayisi(Number(e.target.value))}
          className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
        </select>
      </div>

      <button 
        onClick={handleNext} 
        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
      >
        Devam →
      </button>
    </div>
  );
}