"use client";
import { useState } from "react";
import WelcomeScreen from "../WelcomeScreen";
import Step1VehicleInfo from "./Step1VehicleInfo";
import Step2Checklist from "./Step2Checklist";
import Step3Checklist from "./Step3Checklist";

export default function FormWizard() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({});

  if (showWelcome) {
    return <WelcomeScreen onStart={() => setShowWelcome(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="oregon-gradient p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between text-white mb-4">
            <div className="text-lg font-semibold">Oregon Araç Denetim</div>
            <div className="text-sm">Adım {step}/3</div>
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
          />
        )}
      </div>
    </div>
  );
}