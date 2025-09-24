import React, { useState, useEffect, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

interface Step3Props {
  data: any;
  setData: (data: any) => void;
  back: () => void;
  onComplete: () => void;
  isCompleting: boolean;
}

export default function Step3Checklist({ data, setData, back, onComplete, isCompleting }: Step3Props) {
  // Fiziki Kontrol Satırları
  const fizikiRows = [
    "Genel fiziki sağlamlığı ve bütünlüğü",
    "Herhangi bir zarar, yırtılma, sökülme veya parçalanma durumu yok",
    "Kapıların mekanizmalarının sağlamlığı",
    "Mühür ve kilit mekanizmalarının sağlamlığı",
    "Araç konteyner ise 7 nokta kontrolü (ön, sağ, sol, zemin, tavan, iç/dış kapılar)"
  ];

  // Zula Kontrol Satırları
  const zulaRows = [
    "Tamponlar",
    "Motor",
    "Far arkası kontrol",
    "Lastikler",
    "Tekerlek üstü kontrol",
    "Yedek lastik",
    "Yakıt depoları",
    "Egzoz",
    "Sürüş mili",
    "Çekici & Dorse içi / zemin kontrol",
    "Çekici & Dorse altı genel kontrol",
    "Yan duvarlar",
    "Ön duvar",
    "İç / dış kapılar",
    "Sürücü depoları",
    "Hava depoları",
    "Çatı",
    "Soğutma ünitesi"
  ];

  // State
  const [fiziki, setFiziki] = useState<(string | null)[]>(
    data.fizikiKontrol || Array(fizikiRows.length).fill(null)
  );
  const [zula, setZula] = useState<(string | null)[]>(
    data.zulaKontrol || Array(zulaRows.length).fill(null)
  );
  const [fizikiAciklama, setFizikiAciklama] = useState<string[]>(
    data.fizikiAciklama || Array(fizikiRows.length).fill("")
  );
  const [zulaAciklama, setZulaAciklama] = useState<string[]>(
    data.zulaAciklama || Array(zulaRows.length).fill("")
  );
  const [genelSonuc, setGenelSonuc] = useState<string | null>(data.genelSonuc || null);
  const [adiSoyadi, setAdiSoyadi] = useState(data.kontrolEdenAd || "");
  const sigRef = useRef<SignatureCanvas>(null);
  const [imzaData, setImzaData] = useState<string>(data.kontrolEdenImza || "");
  const [errors, setErrors] = useState<string[]>([]);

  // Tarih & Saat
  const [timestamp, setTimestamp] = useState("");
  useEffect(() => {
    const now = new Date();
    setTimestamp(now.toLocaleString('tr-TR'));
  }, []);

  // Fiziki kontrol için hepsi uygun
  const applyFizikiUygun = () => {
    setFiziki(Array(fizikiRows.length).fill("uygun"));
  };

  // Zula kontrol için hepsi uygun
  const applyZulaUygun = () => {
    setZula(Array(zulaRows.length).fill("uygun"));
  };

  // Genel kontrol seçilince tüm satırlar işaretlensin
  const applyGenelSonuc = (value: string) => {
    setGenelSonuc(value);
    if (value === "uygun") {
      setFiziki(Array(fizikiRows.length).fill("uygun"));
      setZula(Array(zulaRows.length).fill("uygun"));
    }
  };

  // Temizle butonu
  const handleClear = () => {
    setFiziki(Array(fizikiRows.length).fill(null));
    setZula(Array(zulaRows.length).fill(null));
    setFizikiAciklama(Array(fizikiRows.length).fill(""));
    setZulaAciklama(Array(zulaRows.length).fill(""));
    setGenelSonuc(null);
  };

  // İmza kaydet
  const saveSignature = () => {
    if (sigRef.current) {
      const signature = sigRef.current.getTrimmedCanvas().toDataURL("image/png");
      setImzaData(signature);
    }
  };

  // Form tamamla
  const handleComplete = () => {
    const newErrors: string[] = [];

    // Fiziki kontrol zorunlu
    const fizikiEmpty = fiziki.every(item => item === null);
    if (fizikiEmpty) {
      newErrors.push("Fiziki kontrol alanları doldurulmalıdır");
    }

    // Zula kontrol zorunlu
    const zulaEmpty = zula.every(item => item === null);
    if (zulaEmpty) {
      newErrors.push("Zula kontrol alanları doldurulmalıdır");
    }

    if (!adiSoyadi.trim()) {
      newErrors.push("Kontrolü gerçekleştiren kişinin adı soyadı girilmelidir");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    // Veriyi kaydet ve tamamla
    setData({
      ...data,
      fizikiKontrol: fiziki,
      zulaKontrol: zula,
      fizikiAciklama,
      zulaAciklama,
      genelSonuc,
      kontrolEdenAd: adiSoyadi,
      kontrolEdenImza: imzaData,
      timestamp
    });

    // Form tamamlama işlemini başlat
    onComplete();
  };

  // Kontrol satırı bileşeni
  const ControlRow = ({ 
    value, 
    onChange, 
    aciklama, 
    onAciklamaChange, 
    label, 
    index 
  }: {
    value: string | null;
    onChange: (val: string | null) => void;
    aciklama: string;
    onAciklamaChange: (val: string) => void;
    label: string;
    index: number;
  }) => {
    const handleRadioClick = (newValue: string) => {
      if (value === newValue) {
        onChange(null); // Seçimi kaldır
      } else {
        onChange(newValue);
      }
    };

    return (
      <tr className="hover:bg-blue-50/30 transition-colors">
        <td className="border border-gray-200 p-4 text-sm font-medium text-gray-700">{label}</td>
        <td className="border border-gray-200 p-4 text-center">
          <div 
            className={`cursor-pointer p-2 rounded-lg transition-all ${
              value === "uygun" ? 'bg-green-100 border-2 border-green-500' : 'hover:bg-green-50'
            }`}
            onClick={() => handleRadioClick("uygun")}
          >
            <div className={`w-6 h-6 rounded border-2 mx-auto flex items-center justify-center ${
              value === "uygun" ? 'border-green-500 bg-green-500' : 'border-gray-400'
            }`}>
              {value === "uygun" && (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
        </td>
        <td className="border border-gray-200 p-4 text-center">
          <div 
            className={`cursor-pointer p-2 rounded-lg transition-all ${
              value === "uygunsuz" ? 'bg-red-100 border-2 border-red-500' : 'hover:bg-red-50'
            }`}
            onClick={() => handleRadioClick("uygunsuz")}
          >
            <div className={`w-6 h-6 rounded border-2 mx-auto flex items-center justify-center ${
              value === "uygunsuz" ? 'border-red-500 bg-red-500' : 'border-gray-400'
            }`}>
              {value === "uygunsuz" && (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
        </td>
        <td className="border border-gray-200 p-4">
          <input 
            type="text" 
            className="oregon-input w-full" 
            placeholder="Açıklama (opsiyonel)" 
            value={aciklama}
            onChange={(e) => onAciklamaChange(e.target.value)}
          />
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-6 mt-6">
      <div className="oregon-card p-6">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 oregon-gradient rounded-full flex items-center justify-center text-white font-bold mr-3">
            3
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Fiziki ve Zula Kontrolü</h2>
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

        {/* Fiziki Kontrol */}
        <div className="oregon-card p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-800">🔧 Araç Fiziki Kontrolü</h3>
            <button 
              onClick={applyFizikiUygun}
              className="oregon-button-primary px-4 py-2"
            >
              Hepsi Uygun ✓
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="oregon-table w-full bg-white rounded-lg">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-4 text-left">Kontrol Noktası</th>
                  <th className="border border-gray-300 p-4">Uygun ✔</th>
                  <th className="border border-gray-300 p-4">Uygun Değil ✖</th>
                  <th className="border border-gray-300 p-4">Açıklama</th>
                </tr>
              </thead>
              <tbody>
                {fizikiRows.map((row, idx) => (
                  <ControlRow
                    key={`fiziki_${idx}`}
                    value={fiziki[idx]}
                    onChange={(val) => {
                      const newFiziki = [...fiziki];
                      newFiziki[idx] = val;
                      setFiziki(newFiziki);
                    }}
                    aciklama={fizikiAciklama[idx]}
                    onAciklamaChange={(val) => {
                      const newAciklama = [...fizikiAciklama];
                      newAciklama[idx] = val;
                      setFizikiAciklama(newAciklama);
                    }}
                    label={row}
                    index={idx}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Zula Kontrol */}
        <div className="oregon-card p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-800">🔍 Araç Zula Kontrolü</h3>
            <button 
              onClick={applyZulaUygun}
              className="oregon-button-primary px-4 py-2"
            >
              Hepsi Uygun ✓
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="oregon-table w-full bg-white rounded-lg">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-4 text-left">Kontrol Noktası</th>
                  <th className="border border-gray-300 p-4">Uygun ✔</th>
                  <th className="border border-gray-300 p-4">Uygun Değil ✖</th>
                  <th className="border border-gray-300 p-4">Açıklama</th>
                </tr>
              </thead>
              <tbody>
                {zulaRows.map((row, idx) => (
                  <ControlRow
                    key={`zula_${idx}`}
                    value={zula[idx]}
                    onChange={(val) => {
                      const newZula = [...zula];
                      newZula[idx] = val;
                      setZula(newZula);
                    }}
                    aciklama={zulaAciklama[idx]}
                    onAciklamaChange={(val) => {
                      const newAciklama = [...zulaAciklama];
                      newAciklama[idx] = val;
                      setZulaAciklama(newAciklama);
                    }}
                    label={row}
                    index={idx + fizikiRows.length}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Genel Sonuç */}
        <div className="oregon-card p-4 mb-6">
          <h3 className="font-semibold text-lg text-gray-800 mb-4">📋 Genel Kontrol Sonucu</h3>
          <div className="flex gap-4 mb-4">
            <div 
              className={`oregon-radio-card flex-1 ${genelSonuc === "uygun" ? 'selected' : ''}`}
              onClick={() => applyGenelSonuc(genelSonuc === "uygun" ? "" : "uygun")}
            >
              <div className="flex items-center justify-center space-x-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  genelSonuc === "uygun" ? 'border-green-500' : 'border-gray-400'
                }`}>
                  {genelSonuc === "uygun" && <div className="w-3 h-3 rounded-full bg-green-500"></div>}
                </div>
                <span className="font-medium">Uygun ✔</span>
              </div>
            </div>
            <div 
              className={`oregon-radio-card flex-1 ${genelSonuc === "uygunsuz" ? 'selected' : ''}`}
              onClick={() => setGenelSonuc(genelSonuc === "uygunsuz" ? null : "uygunsuz")}
            >
              <div className="flex items-center justify-center space-x-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  genelSonuc === "uygunsuz" ? 'border-red-500' : 'border-gray-400'
                }`}>
                  {genelSonuc === "uygunsuz" && <div className="w-3 h-3 rounded-full bg-red-500"></div>}
                </div>
                <span className="font-medium">Uygun Değil ✖</span>
              </div>
            </div>
          </div>
          <button 
            onClick={handleClear} 
            className="oregon-button-secondary px-4 py-2"
          >
            Tümünü Temizle
          </button>
        </div>

        {/* Kontrolü Gerçekleştiren */}
        <div className="oregon-card p-4 mb-6">
          <h3 className="font-semibold text-lg text-gray-800 mb-4">👤 Kontrolü Gerçekleştiren</h3>
          <input
            className="oregon-input w-full mb-4"
            placeholder="Adı Soyadı"
            value={adiSoyadi}
            onChange={(e) => setAdiSoyadi(e.target.value)}
          />
          <div className="mb-4">
            <p className="font-medium text-gray-700 mb-2">İmza:</p>
            <div className="border-2 border-gray-300 rounded-lg bg-white">
              <SignatureCanvas
                ref={sigRef}
                penColor="black"
                canvasProps={{ width: 600, height: 200, className: "rounded-lg" }}
              />
            </div>
            <div className="mt-3 flex gap-2">
              <button 
                onClick={() => sigRef.current?.clear()} 
                className="oregon-button-secondary px-3 py-2"
              >
                Temizle
              </button>
              <button 
                onClick={saveSignature} 
                className="oregon-button-primary px-3 py-2"
              >
                Kaydet
              </button>
            </div>
            {imzaData && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Kaydedilen İmza:</p>
                <img src={imzaData} alt="imza" className="border rounded max-w-xs" />
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600">📅 Tarih & Saat: {timestamp}</p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button 
            onClick={back} 
            className="oregon-button-secondary px-6 py-3"
            disabled={isCompleting}
          >
            ← Geri
          </button>
          <button 
            onClick={handleComplete} 
            className={`oregon-success px-6 py-3 rounded-lg font-semibold ${
              isCompleting ? 'oregon-loading' : ''
            }`}
            disabled={isCompleting}
          >
            {isCompleting ? 'PDF Oluşturuluyor...' : 'Formu Tamamla ✓'}
          </button>
        </div>
      </div>
    </div>
  );
}