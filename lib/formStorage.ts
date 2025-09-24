import { supabase } from './supabase';
import { FormData } from './pdfForm';

export interface StoredForm extends FormData {
  id: string;
  status: 'draft' | 'completed';
  createdAt: string;
  updatedAt: string;
  userId?: string;
  pdfUrl?: string;
}

export class FormStorageManager {
  // Taslak formu kaydet
  static async saveDraft(formData: Partial<FormData>): Promise<string> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const draftData = {
        ...formData,
        status: 'draft' as const,
        updatedAt: new Date().toISOString(),
        userId: user?.id || null
      };

      if (formData.id) {
        // Mevcut taslağı güncelle
        const { error } = await supabase
          .from('forms')
          .update(draftData)
          .eq('id', formData.id);

        if (error) throw error;
        return formData.id;
      } else {
        // Yeni taslak oluştur
        const { data, error } = await supabase
          .from('forms')
          .insert({
            ...draftData,
            createdAt: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;
        return data.id;
      }
    } catch (error) {
      console.error('Taslak kaydedilirken hata:', error);
      throw error;
    }
  }

  // Formu tamamlanmış olarak kaydet
  static async saveCompleted(formData: FormData, pdfUrl?: string): Promise<string> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const completedData = {
        ...formData,
        status: 'completed' as const,
        updatedAt: new Date().toISOString(),
        userId: user?.id || null,
        pdfUrl: pdfUrl || null
      };

      if (formData.id) {
        // Mevcut formu güncelle
        const { error } = await supabase
          .from('forms')
          .update(completedData)
          .eq('id', formData.id);

        if (error) throw error;
        return formData.id;
      } else {
        // Yeni tamamlanmış form oluştur
        const { data, error } = await supabase
          .from('forms')
          .insert({
            ...completedData,
            createdAt: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;
        return data.id;
      }
    } catch (error) {
      console.error('Form kaydedilirken hata:', error);
      throw error;
    }
  }

  // Kullanıcının formlarını getir
  static async getUserForms(): Promise<StoredForm[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Kullanıcı oturumu bulunamadı');
      }

      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .eq('userId', user.id)
        .order('updatedAt', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Formlar getirilirken hata:', error);
      throw error;
    }
  }

  // Belirli bir formu getir
  static async getForm(formId: string): Promise<StoredForm | null> {
    try {
      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .eq('id', formId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Form bulunamadı
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Form getirilirken hata:', error);
      throw error;
    }
  }

  // Formu sil
  static async deleteForm(formId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('forms')
        .delete()
        .eq('id', formId);

      if (error) throw error;
    } catch (error) {
      console.error('Form silinirken hata:', error);
      throw error;
    }
  }

  // Form validasyonu - zorunlu alanları kontrol et
  static validateForm(formData: FormData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Temel bilgiler zorunlu
    if (!formData.tasiyiciFirma) {
      errors.push('Taşıyıcı firma seçilmelidir');
    }
    if (!formData.aracTuru) {
      errors.push('Araç türü seçilmelidir');
    }
    if (!formData.sevkDurumu) {
      errors.push('Sevk durumu seçilmelidir');
    }
    if (!formData.muhurDurumu) {
      errors.push('Mühür durumu seçilmelidir');
    }

    // Fiziki kontrol zorunlu
    if (!formData.fizikiKontrol || formData.fizikiKontrol.every(item => item === null)) {
      errors.push('Fiziki kontrol alanları doldurulmalıdır');
    }

    // Zula kontrol zorunlu
    if (!formData.zulaKontrol || formData.zulaKontrol.every(item => item === null)) {
      errors.push('Zula kontrol alanları doldurulmalıdır');
    }

    // Kontrolü gerçekleştiren zorunlu
    if (!formData.kontrolEdenAd?.trim()) {
      errors.push('Kontrolü gerçekleştiren kişinin adı soyadı girilmelidir');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Otomatik taslak kaydetme
  static async autoSaveDraft(formData: Partial<FormData>): Promise<void> {
    try {
      // Sadece önemli veriler varsa kaydet
      const hasImportantData = formData.tasiyiciFirma || 
                              formData.aracTuru || 
                              formData.cekici || 
                              formData.soforler?.some(s => s.ad);

      if (hasImportantData) {
        await this.saveDraft(formData);
      }
    } catch (error) {
      // Otomatik kaydetme hatası sessizce loglanır
      console.warn('Otomatik taslak kaydetme hatası:', error);
    }
  }
}