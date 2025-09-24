"use client";
import { useState, useEffect } from "react";
import WelcomeScreen from "../WelcomeScreen";
import Step1VehicleInfo from "./Step1VehicleInfo";
import Step2Checklist from "./Step2Checklist";
import Step3Checklist from "./Step3Checklist";
import FormHistory from "./FormHistory";
import { FormData, FormStorageManager } from "../../lib/formStorage";
import { generateAndSavePDF } from "../../lib/pdfForm";

export default function FormWizard() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentFormId, setCurrentFormId] = useState<string | null>(null);

  // Otomatik taslak kaydetme
  useEffect(() => {
    const autoSave = async () => {
      if (step > 1 && Object.keys(formData).length > 0) {
        try {
          const formId = await FormStorageManager.saveDraft(formData);
          if (!currentFormId) {
            setCurrentFormId(formId);
            setFormData(prev => ({ ...prev, id: formId }));
          }
        } catch (error) {
          console.warn('Otomatik kaydetme hatası:', error);
        }
      }
    };

    const timeoutId = setTimeout(autoSave, 2000); // 2 saniye sonra kaydet
    return () => clearTimeout(timeoutId);
  }, [formData, step, currentFormId]);

  // Mevcut formu yükle
  const loadExistingForm = async (formId: string) => {
    try {
      setIsLoading(true);
      const existingForm = await FormStorageManager.getForm(formId);
      
      if (existingForm) {
        setFormData(existingForm);
        setCurrentFormId(formId);
        setShowHistory(false);
        setShowWelcome(false);
        
        // Form durumuna göre adımı belirle
        if (existingForm.status === 'completed') {
          setStep(3); // Tamamlanmış formları son adımda göster
        } else {
          setStep(1); // Taslakları baştan başlat
        }
      }
    } catch (error) {
      console.error('Form yüklenirken hata:', error);
      alert('Form yüklenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  // PDF oluştur ve kaydet
  const handleCompleteForm = async () => {
    try {
      setIsLoading(true);

      // Form validasyonu
      const validation = FormStorageManager.validateForm(formData);
      if (!validation.isValid) {
        alert('Lütfen tüm zorunlu alanları doldurun:\n' + validation.errors.join('\n'));
        return;
      }

      // PDF oluştur
      const { downloadUrl, supabaseUrl } = await generateAndSavePDF(formData);

      // Formu tamamlanmış olarak kaydet
      const formId = await FormStorageManager.saveCompleted(formData, supabaseUrl);

      // Başarı mesajı göster
      alert('Form başarıyla tamamlandı ve PDF oluşturuldu!');

      // PDF'i indir
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `arac-kontrol-${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();

      // Formu sıfırla
      setFormData({});
      setCurrentFormId(null);
      setStep(1);
      setShowWelcome(true);

    } catch (error) {
      console.error('Form tamamlanırken hata:', error);
      alert('Form tamamlanırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen oregon-gradient flex items-center justify-center">
        <div className="oregon-card p-8 text-center">
          <div className="oregon-loading w-16 h-16 mx-auto mb-4 rounded-full"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">İşleniyor...</h2>
          <p className="text-gray-600">Lütfen bekleyin</p>
        </div>
      </div>
    );
  }

  if (showWelcome) {
    return (
      <WelcomeScreen 
        onStart={() => setShowWelcome(false)}
        onShowHistory={() => {
          setShowWelcome(false);
          setShowHistory(true);
        }}
      />
    );
  }

  if (showHistory) {
    return (
      <FormHistory
        onBack={() => {
          setShowHistory(false);
          setShowWelcome(true);
        }}
        onLoadForm={loadExistingForm}
        onNewForm={() => {
          setShowHistory(false);
          setShowWelcome(false);
          setFormData({});
          setCurrentFormId(null);
          setStep(1);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="oregon-gradient p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between text-white mb-4">
            <div className="text-lg font-semibold">Oregon Araç Denetim</div>
            <div className="flex items-center gap-4">
              <div className="text-sm">Adım {step}/3</div>
              {currentFormId && (
                <div className="text-xs bg-white/20 px-2 py-1 rounded">
                  Taslak Kaydedildi ✓
                </div>
              )}
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {step === 1 && (
          <Step1VehicleInfo
            data={formData}
            setData={setFormData}
            next={() => setStep(2)}
            onBack={() => {
              setShowWelcome(true);
              setStep(1);
            }}
          />
        )}
        {step === 2 && (
          <Step2Checklist
            data={formData}
            setData={setFormData}
            back={() => setStep(1)}
            next={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <Step3Checklist
            data={formData}
            setData={setFormData}
            back={() => setStep(2)}
            onComplete={handleCompleteForm}
            isCompleting={isLoading}
          />
        )}
      </div>
    </div>
  );
}