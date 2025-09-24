import React, { useState, useEffect, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

export default function Step3Checklist({ data, setData, next, back }: any) {
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
    setTimestamp(now.toLocaleString());
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
      <tr>
        <td className="border p-3 text-sm">{label}</td>
        <td className="border p-3 text-center">
          <label 
            className={`cursor-pointer p-2 rounded ${
              value === "uygun" ? 'bg-green-100' : ''
            }`}
            onClick={() => handleRadioClick("uygun")}
          >
            <input
              type="radio"
              name={`control_${index}`}
              checked={value === "uygun"}
              onChange={() => {}}
              className="sr-only"
            />
            <div className={`w-5 h-5 rounded border-2 mx-auto flex items-center justify-center ${
              value === "uygun" ? 'border-green-500 bg-green-500' : 'border-gray-400'
            }`}>
              {value === "uygun" && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </label>
        </td>
        <td className="border p-3 text-center">
          <label 
            className={`cursor-pointer p-2 rounded ${
              value === "uygunsuz" ? 'bg-red-100' : ''
            }`}
            onClick={() => handleRadioClick("uygunsuz")}
          >
            <input
              type="radio"
              name={`control_${index}`}
              checked={value === "uygunsuz"}
              onChange={() => {}}
              className="sr-only"
            />
            <div className={`w-5 h-5 rounded border-2 mx-auto flex items-center justify-center ${
              value === "uygunsuz" ? 'border-red-500 bg-red-500' : 'border-gray-400'
            }`}>
              {value === "uygunsuz" && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </label>
        </td>
        <td className="border p-3">
          <input 
            type="text" 
            className="border border-gray-300 w-full p-2 rounded focus:ring-2 focus:ring-blue-500" 
            placeholder="Açıklama" 
            value={aciklama}
            onChange={(e) => onAciklamaChange(e.target.value)}
          />
        </td>
      </tr>
    );
  };

  const handleNext = () => {
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

    // Veriyi kaydet
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

    next();
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="font-bold text-xl mb-4">Araç Fiziki ve Zula Kontrolü</h2>

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

      {/* Fiziki Kontrol */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Araç Fiziki Kontrolü</h3>
          <button 
            onClick={applyFizikiUygun}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Hepsi Uygun
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="table-auto border border-gray-300 w-full bg-white rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left">Kontrol</th>
                <th className="border border-gray-300 p-3">Uygun ✔</th>
                <th className="border border-gray-300 p-3">Uygun Değil ✖</th>
                <th className="border border-gray-300 p-3">Açıklama</th>
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
      <div className="bg-yellow-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Araç Zula Kontrolü</h3>
          <button 
            onClick={applyZulaUygun}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Hepsi Uygun
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="table-auto border border-gray-300 w-full bg-white rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left">Kontrol</th>
                <th className="border border-gray-300 p-3">Uygun ✔</th>
                <th className="border border-gray-300 p-3">Uygun Değil ✖</th>
                <th className="border border-gray-300 p-3">Açıklama</th>
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
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-3">Genel Kontrol Sonucu</h3>
        <div className="flex gap-4 mb-4">
          <label 
            className={`flex items-center space-x-2 cursor-pointer p-3 rounded-lg border ${
              genelSonuc === "uygun" ? 'border-green-500 bg-green-50' : 'border-gray-300'
            }`}
            onClick={() => applyGenelSonuc(genelSonuc === "uygun" ? "" : "uygun")}
          >
            <input
              type="radio"
              checked={genelSonuc === "uygun"}
              onChange={() => {}}
              className="sr-only"
            />
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              genelSonuc === "uygun" ? 'border-green-500' : 'border-gray-400'
            }`}>
              {genelSonuc === "uygun" && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
            </div>
            <span>Uygun ✔</span>
          </label>
          <label 
            className={`flex items-center space-x-2 cursor-pointer p-3 rounded-lg border ${
              genelSonuc === "uygunsuz" ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            onClick={() => setGenelSonuc(genelSonuc === "uygunsuz" ? null : "uygunsuz")}
          >
            <input
              type="radio"
              checked={genelSonuc === "uygunsuz"}
              onChange={() => {}}
              className="sr-only"
            />
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              genelSonuc === "uygunsuz" ? 'border-red-500' : 'border-gray-400'
            }`}>
              {genelSonuc === "uygunsuz" && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
            </div>
            <span>Uygun Değil ✖</span>
          </label>
        </div>
        <button 
          onClick={handleClear} 
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Tümünü Temizle
        </button>
      </div>

      {/* Kontrolü Gerçekleştiren */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-3">Kontrolü Gerçekleştiren</h3>
        <input
          className="border border-gray-300 p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Adı Soyadı"
          value={adiSoyadi}
          onChange={(e) => setAdiSoyadi(e.target.value)}
        />
        <div className="mb-4">
          <p className="font-medium mb-2">İmza:</p>
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
              className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-2 rounded-lg transition-colors"
            >
              Temizle
            </button>
            <button 
              onClick={saveSignature} 
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors"
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
        <p className="text-sm text-gray-600">Tarih & Saat: {timestamp}</p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button 
          onClick={back} 
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
        >
          ← Geri
        </button>
        <button 
          onClick={handleNext} 
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
        >
          İleri →
        </button>
      </div>
    </div>
  );
}