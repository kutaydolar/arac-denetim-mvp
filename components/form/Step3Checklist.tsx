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
    "ç / dış kapılar",
    "Sürücü depoları",
    "Hava depoları",
    "Çatı",
    "Soğutma ünitesi"
  ];

  // State
  const [fiziki, setFiziki] = useState<(string | null)[]>(Array(fizikiRows.length).fill(null));
  const [zula, setZula] = useState<(string | null)[]>(Array(zulaRows.length).fill(null));
  const [genelSonuc, setGenelSonuc] = useState<string | null>(null);
  const [adiSoyadi, setAdiSoyadi] = useState("");
  const sigRef = useRef<SignatureCanvas>(null);
  const [imzaData, setImzaData] = useState<string>("");

  // Tarih & Saat
  const [timestamp, setTimestamp] = useState("");
  useEffect(() => {
    const now = new Date();
    setTimestamp(now.toLocaleString());
  }, []);

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
    setGenelSonuc(null);
    setAdiSoyadi("");
    setImzaData("");
    sigRef.current?.clear();
  };

  // mza kaydet
  const saveSignature = () => {
    if (sigRef.current) {
      setImzaData(sigRef.current.getTrimmedCanvas().toDataURL("image/png"));
    }
  };

  return (
    <div className="p-4">
      <h2 className="font-bold text-lg mb-2">Araç Fiziki Kontrolü</h2>
      <table className="table-auto border w-full mb-4">
        <thead>
          <tr>
            <th className="border p-2">Kontrol</th>
            <th className="border p-2">Uygun ✔</th>
            <th className="border p-2">Uygun Değil ✖</th>
            <th className="border p-2">Açıklama</th>
          </tr>
        </thead>
        <tbody>
          {fizikiRows.map((row, idx) => (
            <tr key={idx}>
              <td className="border p-2">{row}</td>
              <td className="border p-2 text-center">
                <input
                  type="radio"
                  name={`fiziki_${idx}`}
                  checked={fiziki[idx] === "uygun"}
                  onChange={() => setFiziki(fiziki.map((v, i) => (i === idx ? "uygun" : v)))}
                />
              </td>
              <td className="border p-2 text-center">
                <input
                  type="radio"
                  name={`fiziki_${idx}`}
                  checked={fiziki[idx] === "uygunsuz"}
                  onChange={() => setFiziki(fiziki.map((v, i) => (i === idx ? "uygunsuz" : v)))}
                />
              </td>
              <td className="border p-2">
                <input type="text" className="border w-full p-1" placeholder="Açıklama" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="font-bold text-lg mb-2">Araç Zula Kontrolü</h2>
      <table className="table-auto border w-full mb-4">
        <thead>
          <tr>
            <th className="border p-2">Kontrol</th>
            <th className="border p-2">Uygun ✔</th>
            <th className="border p-2">Uygun Değil ✖</th>
            <th className="border p-2">Açıklama</th>
          </tr>
        </thead>
        <tbody>
          {zulaRows.map((row, idx) => (
            <tr key={idx}>
              <td className="border p-2">{row}</td>
              <td className="border p-2 text-center">
                <input
                  type="radio"
                  name={`zula_${idx}`}
                  checked={zula[idx] === "uygun"}
                  onChange={() => setZula(zula.map((v, i) => (i === idx ? "uygun" : v)))}
                />
              </td>
              <td className="border p-2 text-center">
                <input
                  type="radio"
                  name={`zula_${idx}`}
                  checked={zula[idx] === "uygunsuz"}
                  onChange={() => setZula(zula.map((v, i) => (i === idx ? "uygunsuz" : v)))}
                />
              </td>
              <td className="border p-2">
                <input type="text" className="border w-full p-1" placeholder="Açıklama" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Genel Sonuç */}
      <div className="my-4">
        <h3 className="font-semibold">Genel Kontrol Sonucu</h3>
        <label className="mr-4">
          <input
            type="radio"
            checked={genelSonuc === "uygun"}
            onChange={() => applyGenelSonuc("uygun")}
          />{" "}
          Uygun ✔
        </label>
        <label className="mr-4">
          <input
            type="radio"
            checked={genelSonuc === "uygunsuz"}
            onChange={() => setGenelSonuc("uygunsuz")}
          />{" "}
          Uygun Değil ✖
        </label>
        <button onClick={handleClear} className="ml-4 bg-gray-400 text-white px-3 py-1 rounded">
          Temizle
        </button>
      </div>

      {/* Kontrolü Gerçekleştiren */}
      <div className="border p-4 mt-4">
        <h3 className="font-semibold mb-2">Kontrolü Gerçekleştiren</h3>
        <input
          className="border p-2 w-full mb-2"
          placeholder="Adı Soyadı"
          value={adiSoyadi}
          onChange={(e) => setAdiSoyadi(e.target.value)}
        />
        <div>
          <p>mza:</p>
          <SignatureCanvas
            ref={sigRef}
            penColor="black"
            canvasProps={{ width: 400, height: 150, className: "border" }}
          />
          <div className="mt-2">
            <button onClick={() => sigRef.current?.clear()} className="mr-2 bg-gray-400 text-white px-2 py-1 rounded">
              Temizle
            </button>
            <button onClick={saveSignature} className="bg-blue-500 text-white px-2 py-1 rounded">
              Kaydet
            </button>
          </div>
        </div>
        <p className="mt-2">Tarih & Saat: {timestamp}</p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button onClick={back} className="bg-gray-500 text-white px-4 py-2 rounded">Geri</button>
        <button onClick={next} className="bg-blue-500 text-white px-4 py-2 rounded">leri</button>
      </div>
    </div>
  );
}
