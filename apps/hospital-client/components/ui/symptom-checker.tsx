import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "framer-motion";

export interface SymptomData {
  selectedSymptoms: Record<string, boolean>;
  duration: number;
  severity: string;
  notes: string;
}

interface SymptomCheckerProps {
  onComplete: (data: SymptomData) => void;
  initialData?: SymptomData;
}

export default function SymptomChecker({ onComplete, initialData }: SymptomCheckerProps) {
  const [step, setStep] = useState<number>(1);
  const [symptoms, setSymptoms] = useState<Record<string, boolean>>(
    initialData?.selectedSymptoms || {
      Fever: false,
      Cough: false,
      "Shortness of breath": false,
      Headache: false,
      Rash: false,
      Nausea: false,
    }
  );
  const [days, setDays] = useState<number>(initialData?.duration || 1);
  const [severity, setSeverity] = useState<string>(initialData?.severity || "");
  const [notes, setNotes] = useState<string>(initialData?.notes || "");

  const toggleSymptom = (s: string) => {
    setSymptoms({ ...symptoms, [s]: !symptoms[s] });
  };

  const handleComplete = () => {
    onComplete({
      selectedSymptoms: symptoms,
      duration: days,
      severity,
      notes,
    });
  };

  return (
    <Card className="w-full shadow-lg rounded-2xl border border-gray-200 overflow-visible flex flex-col">
      {/* Progress Tracker */}
      <div className="flex justify-between items-center bg-[rgb(41,46,145)] text-white p-3 text-sm font-medium">
        {["Step 1", "Step 2", "Step 3", "Confirm"].map((label, idx) => (
          <div
            key={label}
            className={`flex-1 text-center ${step === idx + 1 ? "font-bold underline" : "opacity-70"}`}
          >
            {label}
          </div>
        ))}
      </div>

      <CardContent className="p-6 space-y-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              <p className="font-medium sticky top-0 bg-white py-2">Which symptoms are you experiencing?</p>
              {Object.keys(symptoms).map((s) => (
                <label key={s} className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={symptoms[s]}
                    onChange={() => toggleSymptom(s)}
                    className="accent-[rgb(41,46,145)]"
                  />
                  <span>{s}</span>
                </label>
              ))}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              <div>
                <p className="font-medium">How long have you had these symptoms?</p>
                <div className="flex items-center space-x-2">
                  <span className="text-xl">📅</span>
                  <Input
                    type="number"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-20"
                    min={1}
                  />
                  <span>days</span>
                </div>
              </div>

              <div>
                <p className="font-medium">How bad are the symptoms?</p>
                <div className="space-y-2">
                  {["Mild", "Moderate", "Severe"].map((level) => (
                    <label key={level} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="severity"
                        value={level}
                        checked={severity === level}
                        onChange={(e) => setSeverity(e.target.value)}
                        className="accent-[rgb(41,46,145)]"
                      />
                      <span>{level}</span>
                    </label>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              <p className="font-medium">Anything else we should know?</p>
              <Textarea
                placeholder="e.g., Mostly at night, worse when lying down."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-[rgb(41,46,145)]">Symptom Summary</h3>
              <div className="bg-gray-100 p-4 rounded-xl text-left">
                <p>
                  <strong>Symptoms:</strong> {Object.keys(symptoms).filter((s) => symptoms[s]).join(", ")}
                </p>
                <p>
                  <strong>Duration:</strong> {days} days
                </p>
                <p>
                  <strong>Severity:</strong> {severity}
                </p>
                <p>
                  <strong>Notes:</strong> {notes || "N/A"}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="rounded-xl"
            >
              Back
            </Button>
          ) : (
            <div />
          )}
          {step < 4 ? (
            <Button
              onClick={() => setStep(step + 1)}
              className="bg-[rgb(41,46,145)] text-white rounded-xl"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              className="bg-[rgb(41,46,145)] text-white rounded-xl"
            >
              Confirm Symptoms
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
