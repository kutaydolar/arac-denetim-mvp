"use client";
import { useState } from "react";
import Step1VehicleInfo from "./Step1VehicleInfo";
import Step2Checklist from "./Step2Checklist";
import Step3Checklist from "./Step3Checklist";

export default function FormWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({});

  return (
    <div>
      {step === 1 && (
        <Step1VehicleInfo
          data={formData}
          setData={setFormData}
          next={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <Step2Checklist
          step1Data={formData}
          data={formData}
          setData={setFormData}
          back={() => setStep(1)}
          next={() => setStep(3)}
        />
      )}
      {step === 3 && (
        <Step3Checklist
          data={formData}
          back={() => setStep(2)}
        />
      )}
    </div>
  );
}
