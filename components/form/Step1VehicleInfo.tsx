"use client";
import { useState } from "react";

interface Step1Props {
  data: any;
  setData: (data: any) => void;
  next: () => void;
  onBack?: () => void;
}

export default function Step1VehicleInfo({ data, setData, next, onBack }: Step1Props) {
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

  const handleSevkSelect = (durum: string) => {
    if (sevk === durum) {
      setSevk(""); // Seçimi kaldır
    } else {
      setSevk(durum);
    }
  };

  const handleMuhurSelect = (durum: string) => {
    if (muhur === durum) {
      setMuhur(""); // Seçimi kaldır
    } else {
      setMuhur(durum);
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
    <div className="oregon-card p-6 mt-6">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 oregon-gradient rounded-full flex items-center justify-center text-white font-bold mr-3">
          1
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Araç Bilgileri</h2>
      </div>

      {/* Hata Mesajları */}
      {errors.length > 0 && (
        <div className="oregon-error rounded-lg p-4 mb-6">
          <div className="font-semibold mb-2">⚠️ Lütfen aşağıdaki alanları kontrol edin:</div>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-6">
        {/* Taşıyıcı Ünvanı */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Taşıyıcı Ünvanı
          </label>
          <select
            value={tasiyici}
            onChange={(e) => setTasiyici(e.target.value)}
            className="oregon-input w-full"
          >
            <option value="">Seçiniz</option>
            <option value="Oregon Lojistik">Oregon Lojistik</option>
            <option value="XYZ Taşımacılık">XYZ Taşımacılık</option>
            <option value="ABC Lojistik">ABC Lojistik</option>
            <option value="DEF Nakliyat">DEF Nakliyat</option>
          </select>
        </div>

        {/* Araç Türü - Oregon Tarzı Kutucuklar */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            Araç Türü
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Römork", "Minivan", "Konteyner"].map((tur) => (
              <div
                key={tur}
                onClick={() => handleAracTuruSelect(tur)}
                className={`oregon-select-card ${aracTuru === tur ? 'selected' : ''}`}
              >
                <div className="flex items-center justify-center space-x-3">
                  <div className={`
                    w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                    ${aracTuru === tur ? 'border-oregon-blue bg-oregon-blue' : 'border-gray-400'}
                  `}>
                    {aracTuru === tur && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="font-semibold text-gray-700">{tur}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sevk Durumu */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            Araç farklı bir gümrükten sevkli mi geldi?
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div 
              className={`oregon-radio-card ${sevk === "Evet" ? 'selected' : ''}`}
              onClick={() => handleSevkSelect("Evet")}
            >
              <div className="flex items-center justify-center space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  sevk === "Evet" ? 'border-oregon-blue' : 'border-gray-400'
                }`}>
                  {sevk === "Evet" && <div className="w-2 h-2 rounded-full bg-oregon-blue"></div>}
                </div>
                <span className="font-medium">Evet</span>
              </div>
            </div>
            <div 
              className={`oregon-radio-card ${sevk === "Hayır" ? 'selected' : ''}`}
              onClick={() => handleSevkSelect("Hayır")}
            >
              <div className="flex items-center justify-center space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  sevk === "Hayır" ? 'border-oregon-blue' : 'border-gray-400'
                }`}>
                  {sevk === "Hayır" && <div className="w-2 h-2 rounded-full bg-oregon-blue"></div>}
                </div>
                <span className="font-medium">Hayır</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mühür Durumu */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            Araç mühürlü mü geldi?
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div 
              className={`oregon-radio-card ${muhur === "Evet" ? 'selected' : ''}`}
              onClick={() => handleMuhurSelect("Evet")}
            >
              <div className="flex items-center justify-center space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  muhur === "Evet" ? 'border-oregon-blue' : 'border-gray-400'
                }`}>
                  {muhur === "Evet" && <div className="w-2 h-2 rounded-full bg-oregon-blue"></div>}
                </div>
                <span className="font-medium">Evet</span>
              </div>
            </div>
            <div 
              className={`oregon-radio-card ${muhur === "Hayır" ? 'selected' : ''}`}
              onClick={() => handleMuhurSelect("Hayır")}
            >
              <div className="flex items-center justify-center space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  muhur === "Hayır" ? 'border-oregon-blue' : 'border-gray-400'
                }`}>
                  {muhur === "Hayır" && <div className="w-2 h-2 rounded-full bg-oregon-blue"></div>}
                </div>
                <span className="font-medium">Hayır</span>
              </div>
            </div>
          </div>
        </div>

        {/* Şoför Sayısı */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Şoför Sayısı
          </label>
          <select
            value={soforSayisi}
            onChange={(e) => setSoforSayisi(Number(e.target.value))}
            className="oregon-input w-full"
          >
            <option value={1}>1 Şoför</option>
            <option value={2}>2 Şoför</option>
          </select>
        </div>

        <div className="flex justify-between mt-8">
          {onBack && (
            <button 
              onClick={onBack} 
              className="oregon-button-secondary px-6 py-3"
            >
              ← Ana Sayfa
            </button>
          )}
          <button 
            onClick={handleNext} 
            className="w-full oregon-button-primary text-lg py-4 mt-8"
          >
            Devam Et →
          </button>
        </div>
      </div>
    </div>
  );
}