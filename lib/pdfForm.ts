import { PDFDocument, PDFForm, PDFTextField, PDFCheckBox, PDFRadioGroup } from 'pdf-lib';
import { supabase } from './supabase';

export interface FormData {
  // Temel bilgiler
  tasiyiciFirma?: string;
  aracTuru?: string;
  sevkDurumu?: string;
  muhurDurumu?: string;
  soforSayisi?: number;

  // Plaka bilgileri
  cekici?: string;
  dorse?: string;
  konteynerNo?: string;

  // Sevk bilgileri
  mrn?: string;
  rejimHak?: string;

  // Mühür bilgileri
  muhurNum?: string;
  yeniMuhurNum?: string;
  muhurKontrol?: {
    evrakUyum?: boolean | null;
    saglamlik?: boolean | null;
    gerginlik?: boolean | null;
    kilitUygunluk?: boolean | null;
  };

  // Şoför bilgileri
  soforler?: Array<{
    ad?: string;
    tel?: string;
    imza?: string;
  }>;

  // Fiziki kontrol
  fizikiKontrol?: Array<string | null>;
  fizikiAciklama?: Array<string>;

  // Zula kontrol
  zulaKontrol?: Array<string | null>;
  zulaAciklama?: Array<string>;

  // Genel sonuç
  genelSonuc?: string | null;
  kontrolEdenAd?: string;
  kontrolEdenImza?: string;
  timestamp?: string;

  // Meta veriler
  id?: string;
  status?: 'draft' | 'completed';
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

export class PDFFormGenerator {
  private pdfDoc: PDFDocument | null = null;
  private form: PDFForm | null = null;

  async loadTemplate(): Promise<void> {
    try {
      // PDF şablonunu public klasöründen yükle
      const response = await fetch('/ARAÇ GÜVENLİK KONTROL FORMU copy.pdf');
      if (!response.ok) {
        throw new Error('PDF şablonu yüklenemedi');
      }
      
      const pdfBytes = await response.arrayBuffer();
      this.pdfDoc = await PDFDocument.load(pdfBytes);
      this.form = this.pdfDoc.getForm();
    } catch (error) {
      console.error('PDF şablonu yüklenirken hata:', error);
      throw error;
    }
  }

  async fillForm(data: FormData): Promise<Uint8Array> {
    if (!this.pdfDoc || !this.form) {
      await this.loadTemplate();
    }

    try {
      // Temel bilgileri doldur
      this.setTextField('tasiyici_firma', data.tasiyiciFirma || '');
      this.setTextField('arac_turu', data.aracTuru || '');
      this.setTextField('sevk_durumu', data.sevkDurumu || '');
      this.setTextField('muhur_durumu', data.muhurDurumu || '');

      // Plaka bilgileri
      this.setTextField('cekici_plaka', data.cekici || '');
      this.setTextField('dorse_plaka', data.dorse || '');
      this.setTextField('konteyner_no', data.konteynerNo || '');

      // Sevk bilgileri
      if (data.sevkDurumu === 'Evet') {
        this.setTextField('mrn_no', data.mrn || '');
        this.setTextField('rejim_hak', data.rejimHak || '');
      }

      // Mühür bilgileri
      if (data.muhurDurumu === 'Evet') {
        this.setTextField('muhur_no', data.muhurNum || '');
      } else {
        this.setTextField('yeni_muhur_no', data.yeniMuhurNum || '');
      }

      // Mühür kontrol sonuçları
      if (data.muhurKontrol) {
        this.setCheckBox('muhur_evrak_uyum', data.muhurKontrol.evrakUyum === true);
        this.setCheckBox('muhur_saglamlik', data.muhurKontrol.saglamlik === true);
        this.setCheckBox('muhur_gerginlik', data.muhurKontrol.gerginlik === true);
        this.setCheckBox('muhur_kilit', data.muhurKontrol.kilitUygunluk === true);
      }

      // Şoför bilgileri
      if (data.soforler) {
        data.soforler.forEach((sofor, index) => {
          this.setTextField(`sofor_${index + 1}_ad`, sofor.ad || '');
          this.setTextField(`sofor_${index + 1}_tel`, sofor.tel || '');
          
          // İmza varsa PDF'e ekle (base64 string olarak)
          if (sofor.imza) {
            this.setTextField(`sofor_${index + 1}_imza`, '[İmza Mevcut]');
          }
        });
      }

      // Fiziki kontrol sonuçları
      if (data.fizikiKontrol) {
        data.fizikiKontrol.forEach((sonuc, index) => {
          if (sonuc === 'uygun') {
            this.setCheckBox(`fiziki_${index + 1}_uygun`, true);
          } else if (sonuc === 'uygunsuz') {
            this.setCheckBox(`fiziki_${index + 1}_uygunsuz`, true);
          }
          
          if (data.fizikiAciklama?.[index]) {
            this.setTextField(`fiziki_${index + 1}_aciklama`, data.fizikiAciklama[index]);
          }
        });
      }

      // Zula kontrol sonuçları
      if (data.zulaKontrol) {
        data.zulaKontrol.forEach((sonuc, index) => {
          if (sonuc === 'uygun') {
            this.setCheckBox(`zula_${index + 1}_uygun`, true);
          } else if (sonuc === 'uygunsuz') {
            this.setCheckBox(`zula_${index + 1}_uygunsuz`, true);
          }
          
          if (data.zulaAciklama?.[index]) {
            this.setTextField(`zula_${index + 1}_aciklama`, data.zulaAciklama[index]);
          }
        });
      }

      // Genel sonuç
      if (data.genelSonuc === 'uygun') {
        this.setCheckBox('genel_uygun', true);
      } else if (data.genelSonuc === 'uygunsuz') {
        this.setCheckBox('genel_uygunsuz', true);
      }

      // Kontrolü gerçekleştiren
      this.setTextField('kontrol_eden_ad', data.kontrolEdenAd || '');
      this.setTextField('tarih_saat', data.timestamp || new Date().toLocaleString('tr-TR'));

      // Kontrolü gerçekleştiren imza
      if (data.kontrolEdenImza) {
        this.setTextField('kontrol_eden_imza', '[İmza Mevcut]');
      }

      // PDF'i flatten et (form alanlarını düz metne çevir)
      this.form!.flatten();

      // PDF bytes'ını döndür
      return await this.pdfDoc!.save();
    } catch (error) {
      console.error('PDF doldurulurken hata:', error);
      throw error;
    }
  }

  private setTextField(fieldName: string, value: string): void {
    try {
      const field = this.form!.getTextField(fieldName);
      field.setText(value);
    } catch (error) {
      // Alan bulunamazsa sessizce devam et
      console.warn(`PDF alan bulunamadı: ${fieldName}`);
    }
  }

  private setCheckBox(fieldName: string, checked: boolean): void {
    try {
      const field = this.form!.getCheckBox(fieldName);
      if (checked) {
        field.check();
      } else {
        field.uncheck();
      }
    } catch (error) {
      // Alan bulunamazsa sessizce devam et
      console.warn(`PDF checkbox bulunamadı: ${fieldName}`);
    }
  }

  private setRadioGroup(groupName: string, value: string): void {
    try {
      const radioGroup = this.form!.getRadioGroup(groupName);
      radioGroup.select(value);
    } catch (error) {
      // Alan bulunamazsa sessizce devam et
      console.warn(`PDF radio group bulunamadı: ${groupName}`);
    }
  }
}

// PDF oluşturma ve kaydetme fonksiyonu
export async function generateAndSavePDF(formData: FormData): Promise<{
  pdfBytes: Uint8Array;
  downloadUrl: string;
  supabaseUrl?: string;
}> {
  try {
    const generator = new PDFFormGenerator();
    const pdfBytes = await generator.fillForm(formData);

    // PDF'i Supabase Storage'a kaydet
    const fileName = `arac-kontrol-${Date.now()}.pdf`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('pdfs')
      .upload(fileName, pdfBytes, {
        contentType: 'application/pdf',
        upsert: false
      });

    if (uploadError) {
      console.error('PDF Supabase\'e yüklenirken hata:', uploadError);
    }

    // Download URL oluştur
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const downloadUrl = URL.createObjectURL(blob);

    // Supabase public URL
    let supabaseUrl;
    if (uploadData) {
      const { data: urlData } = supabase.storage
        .from('pdfs')
        .getPublicUrl(uploadData.path);
      supabaseUrl = urlData.publicUrl;
    }

    return {
      pdfBytes,
      downloadUrl,
      supabaseUrl
    };
  } catch (error) {
    console.error('PDF oluşturulurken hata:', error);
    throw error;
  }
}