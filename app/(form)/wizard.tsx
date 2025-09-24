"use client";
import { useState } from "react";
import { FormData, ControlRow, Sofor } from "../../types/form";
import PhotoInput from "../../components/PhotoInput";
import SignatureField from "../../components/SignatureField";
import SealTable from "../../components/SealTable";
import ControlTable from "../../components/ControlTable";

const fizikiSatirlar: ControlRow[] = [
  { label: "Kap�lar�n sa�laml���", uygun: null },
  { label: "Yan paneller", uygun: null },
  { label: "�asi ba�lant�lar�", uygun: null },
];

const zulaSatirlar: ControlRow[] = [
  { label: "Tamponlar", uygun: null },
  { label: "Motor", uygun: null },
  { label: "Lastikler", uygun: null },
];

export default function WizardForm() {
  const [form, setForm] = useState<FormData>({
    aracTuru: "Kamyon/Minivan",
    sevkDurumu: "Hay�r",
    muhurDurumu: "Hay�r",
    muhurler: [],
    soforSayisi: 1,
    soforler: [{ ad: "", soyad: "", telefon: "" }],
    fizikiKontrol: fizikiSatirlar,
    zulaKontrol: zulaSatirlar,
    fotoListesi: [],
    createdAt: new Date().toISOString(),
  });

  const updateSofor = (i: number, field: keyof Sofor, value: string) => {
    const next = form.soforler.map((s, idx) =>
      idx === i ? { ...s, [field]: value } : s
    );
    setForm({ ...form, soforler: next });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Ara� G�venlik Kontrol Formu</h1>

      {/* --- di�er alanlar (ara� t�r�, plakalar, sevk, m�h�r, �of�r, tablolar, foto) yukar�da var --- */}

      {/* Fiziki Kontrol */}
      <ControlTable
        title="Fiziki Kontrol"
        rows={form.fizikiKontrol}
        setRows={(rows) => setForm({ ...form, fizikiKontrol: rows })}
      />

      {/* Zula Kontrol */}
      <ControlTable
        title="Zula Kontrol"
        rows={form.zulaKontrol}
        setRows={(rows) => setForm({ ...form, zulaKontrol: rows })}
      />

      {/* Genel Sonu� */}
      <div className="space-y-2 border p-4 rounded">
        <h2 className="font-semibold">Genel Sonu�</h2>
        <div className="flex gap-4">
          <label>
            <input
              type="radio"
              checked={form.genelSonuc === "Uygun"}
              onChange={() => setForm({ ...form, genelSonuc: "Uygun" })}
            />{" "}
            Uygun
          </label>
          <label>
            <input
              type="radio"
              checked={form.genelSonuc === "Uygun De�il"}
              onChange={() => setForm({ ...form, genelSonuc: "Uygun De�il" })}
            />{" "}
            Uygun De�il
          </label>
        </div>
        <textarea
          placeholder="Genel Not"
          className="border px-2 py-1 w-full"
          value={form.genelNot ?? ""}
          onChange={(e) => setForm({ ...form, genelNot: e.target.value })}
        />
      </div>

      {/* Kontrol� Ger�ekle�tiren */}
      <div className="space-y-2 border p-4 rounded">
        <h2 className="font-semibold">Kontrol� Ger�ekle�tiren</h2>
        <input
          placeholder="Ad Soyad"
          className="border px-2 py-1 w-full"
          value={form.kontroluGerceklestiren ?? ""}
          onChange={(e) =>
            setForm({ ...form, kontroluGerceklestiren: e.target.value })
          }
        />
        <SignatureField
          value={form.kontrolImza}
          onChange={(val) => setForm({ ...form, kontrolImza: val })}
        />
        <p className="text-sm text-gray-600">
          Tarih/Saat: {new Date(form.createdAt).toLocaleString("tr-TR")}
        </p>
      </div>

      {/* Foto�raf */}
      <PhotoInput
        photos={form.fotoListesi}
        setPhotos={(p) => setForm({ ...form, fotoListesi: p })}
      />
    </div>
  );
}
