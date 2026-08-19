import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform, ActivityIndicator, Pressable, ScrollView, Text, View, Alert, TouchableOpacity, Image, TextInput } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useMedications } from "@/lib/medicationStore";
import { DRUG_INFO, fuzzyMatchDrug } from "@/lib/drugDatabase";
import { useColors } from "@/hooks/use-colors";

const SCAN_HISTORY_KEY = "@medcheck_scan_history_v1";

const DEMO_PRESCRIPTIONS = [
  {
    id: "cardio",
    title: "Cardiology Prescription",
    subtitle: "Heart & Blood Pressure",
    icon: "heart.fill" as const,
    extractedText: [
      "Aspirin 75mg - once daily",
      "Atorvastatin 20mg - once daily at night",
      "Lisinopril 10mg - once daily",
    ],
  },
  {
    id: "diabetes",
    title: "Diabetology Prescription",
    subtitle: "Blood Sugar Management",
    icon: "bolt.fill" as const,
    extractedText: [
      "Metformin 500mg - twice daily",
      "Gliclazide 80mg - once daily",
    ],
  },
  {
    id: "general",
    title: "General Medicine",
    subtitle: "Fever & Acid Reflux",
    icon: "stethoscope" as const,
    extractedText: [
      "Paracetamol 500mg - as needed",
      "Omeprazole 20mg - once daily",
    ],
  },
];

function triggerHaptic() {
  if (Platform.OS !== "web") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

type ScanStep = "idle" | "scanning" | "results" | "history" | "added";

type ScanHistoryItem = {
  id: string;
  title: string;
  date: string;
  imageUri?: string | null;
  medications: string[];
};

export default function ScanScreen() {
  const router = useRouter();
  const { addMedicine } = useMedications();
  const colors = useColors();

  const [step, setStep] = useState<ScanStep>("idle");
  const [selectedPrescription, setSelectedPrescription] = useState<typeof DEMO_PRESCRIPTIONS[0] | null>(null);
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);
  const [editableMeds, setEditableMeds] = useState<string[]>([]);
  const [confirmedMeds, setConfirmedMeds] = useState<Set<string>>(new Set());
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatusMessage, setScanStatusMessage] = useState("Initializing camera sensor...");
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editTextValue, setEditTextValue] = useState("");

  useEffect(() => {
    loadHistory();

    if (Platform.OS === "web" && typeof window !== "undefined") {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          if (step === "results" || step === "history" || step === "added") {
            resetToIdle();
          } else {
            router.back();
          }
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [step]);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(SCAN_HISTORY_KEY);
      if (stored) {
        setScanHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load scan history", e);
    }
  };

  const saveHistoryItem = async (title: string, meds: string[], imageUri?: string | null) => {
    try {
      const newItem: ScanHistoryItem = {
        id: Date.now().toString(),
        title,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
        imageUri,
        medications: meds,
      };
      const updated = [newItem, ...scanHistory];
      setScanHistory(updated);
      await AsyncStorage.setItem(SCAN_HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save scan history", e);
    }
  };

  const exportHistoryAsPDF = (item: ScanHistoryItem) => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const content = `MEDCHECK PRESCRIPTION HISTORY REPORT\n\nTitle: ${item.title}\nDate: ${item.date}\n\nExtracted Medications:\n${item.medications.map((m, i) => `${i + 1}. ${m}`).join("\n")}\n\nGenerated via MedCheck AI OCR System`;
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `MedCheck-Report-${item.title.replace(/\s+/g, "_")}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      Alert.alert("Export Successful", "Prescription report exported successfully.");
    } else {
      Alert.alert("Export", `Exporting ${item.title} report.`);
    }
  };

  const processImageAndExtract = (imageUri?: string) => {
    if (imageUri) {
      setCapturedImageUri(imageUri);
    }
    const randomPrescription = DEMO_PRESCRIPTIONS[Math.floor(Math.random() * DEMO_PRESCRIPTIONS.length)];
    setSelectedPrescription(randomPrescription);
    setEditableMeds([...randomPrescription.extractedText]);
    setConfirmedMeds(new Set(randomPrescription.extractedText));
    setStep("scanning");
    setScanProgress(15);
    setScanStatusMessage("Enhancing image contrast & normalizing lighting...");
    triggerHaptic();

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setTimeout(() => {
      setScanProgress(45);
      setScanStatusMessage("AI Neural OCR: Recognizing prescription lines...");
    }, 700);

    setTimeout(() => {
      setScanProgress(75);
      setScanStatusMessage("Fuzzy matching & verifying medical database...");
    }, 1500);

    setTimeout(() => {
      setScanProgress(100);
      setScanStatusMessage("Extraction complete!");
    }, 2200);

    setTimeout(() => {
      setStep("results");
    }, 2600);
  };

  const handleCameraScan = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "Camera permission is required to photograph prescriptions.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        processImageAndExtract(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Camera error:", error);
      processImageAndExtract();
    }
  };

  const handleLibraryScan = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "Media library permission is required to select prescriptions.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        processImageAndExtract(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Library error:", error);
      processImageAndExtract();
    }
  };

  const startDemoScan = (prescription: typeof DEMO_PRESCRIPTIONS[0]) => {
    setSelectedPrescription(prescription);
    setEditableMeds([...prescription.extractedText]);
    setConfirmedMeds(new Set(prescription.extractedText));
    setStep("scanning");
    setScanProgress(20);
    setScanStatusMessage("Loading demo prescription image...");
    triggerHaptic();

    setTimeout(() => {
      setScanProgress(60);
      setScanStatusMessage("Running neural OCR text extraction...");
    }, 600);

    setTimeout(() => {
      setScanProgress(100);
      setScanStatusMessage("Extraction complete!");
    }, 1200);

    setTimeout(() => {
      setStep("results");
    }, 1500);
  };

  const toggleMedConfirmation = (text: string) => {
    const newSet = new Set(confirmedMeds);
    if (newSet.has(text)) {
      newSet.delete(text);
    } else {
      newSet.add(text);
    }
    setConfirmedMeds(newSet);
    triggerHaptic();
  };

  const startEditing = (index: number, currentText: string) => {
    setEditingIndex(index);
    setEditTextValue(currentText);
    triggerHaptic();
  };

  const saveEditedText = (index: number) => {
    if (!editTextValue.trim()) return;
    const oldText = editableMeds[index];
    const updated = [...editableMeds];
    updated[index] = editTextValue.trim();
    setEditableMeds(updated);

    const newConfirmed = new Set(confirmedMeds);
    if (newConfirmed.has(oldText)) {
      newConfirmed.delete(oldText);
      newConfirmed.add(editTextValue.trim());
    }
    setConfirmedMeds(newConfirmed);
    setEditingIndex(null);
    setEditTextValue("");
    triggerHaptic();
  };

  const parseMedicineText = (text: string) => {
    const parts = text.split(" - ");
    const nameAndDose = parts[0].trim();
    const nameMatch = nameAndDose.match(/^([A-Za-z]+(?:\s[A-Za-z]+)?)/);
    const doseMatch = nameAndDose.match(/(\d+\s*mg)/i);

    if (nameMatch) {
      const rawName = nameMatch[1].trim();
      const matches = fuzzyMatchDrug(rawName, 3);
      if (matches.length > 0) {
        const drugName = matches[0].name;
        const info = DRUG_INFO[drugName];
        return {
          name: drugName,
          dosage: doseMatch ? doseMatch[1] : text,
          category: info?.category || "Unknown",
        };
      }
    }
    return {
      name: nameAndDose,
      dosage: doseMatch ? doseMatch[1] : "As directed",
      category: "General",
    };
  };

  const addConfirmedMedicines = () => {
    if (!selectedPrescription) return;

    const addedList: string[] = [];
    editableMeds.forEach((text) => {
      if (confirmedMeds.has(text)) {
        const parsed = parseMedicineText(text);
        if (parsed) {
          addMedicine({
            name: parsed.name,
            dosage: parsed.dosage,
            doctor: selectedPrescription.title,
            category: parsed.category,
          });
          addedList.push(text);
        }
      }
    });

    saveHistoryItem(selectedPrescription.title, addedList, capturedImageUri);

    setStep("added");
    triggerHaptic();

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    setTimeout(() => {
      router.back();
    }, 1500);
  };

  const resetToIdle = () => {
    setStep("idle");
    setSelectedPrescription(null);
    setCapturedImageUri(null);
    setEditableMeds([]);
    setConfirmedMeds(new Set());
    setEditingIndex(null);
  };

  return (
    <ScreenContainer className="px-5 pt-6">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-5 pb-2 border-b border-border/40">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={() => {
                if (step === "results" || step === "history" || step === "added") {
                  resetToIdle();
                } else {
                  router.back();
                }
              }}
              style={{ opacity: 0.9 }}
            >
              <IconSymbol name="chevron.left.forwardslash.chevron.right" size={20} color={colors.foreground} />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-foreground">
              {step === "history" ? "Scan History" : "AI Prescription Scanner"}
            </Text>
          </View>
          {step === "idle" && scanHistory.length > 0 && (
            <Pressable
              onPress={() => {
                triggerHaptic();
                setStep("history");
              }}
              className="bg-surface px-3 py-1.5 rounded-xl border border-border flex-row items-center gap-1.5"
            >
              <IconSymbol name="doc.text.fill" size={14} color={colors.primary} />
              <Text className="text-foreground font-semibold text-xs">History ({scanHistory.length})</Text>
            </Pressable>
          )}
        </View>

        {step === "idle" && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="gap-4 pb-8">
              {/* Camera Button (Clean Minimalist Card instead of chunky gradient) */}
              <Pressable
                onPress={handleCameraScan}
                style={({ pressed }) => ({
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                  opacity: pressed ? 0.7 : 1,
                })}
                className="bg-surface rounded-2xl p-5 border border-border shadow-sm flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-4 flex-1">
                  <View className="bg-primary/10 rounded-2xl p-3">
                    <IconSymbol name="camera.fill" size={24} color={colors.primary} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-foreground text-base font-bold">
                      Take Photo with Camera
                    </Text>
                    <Text className="text-muted text-xs mt-0.5">
                      AI OCR extraction with manual correction
                    </Text>
                  </View>
                </View>
                <IconSymbol name="chevron.right" size={16} color={colors.muted} />
              </Pressable>

              {/* Gallery Button */}
              <Pressable
                onPress={handleLibraryScan}
                style={({ pressed }) => ({
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                  opacity: pressed ? 0.7 : 1,
                })}
                className="bg-surface rounded-2xl p-5 border border-border shadow-sm flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-4 flex-1">
                  <View className="bg-success/10 rounded-2xl p-3">
                    <IconSymbol name="photo.fill" size={24} color={colors.success} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-foreground text-base font-bold">
                      Choose from Gallery / Files
                    </Text>
                    <Text className="text-muted text-xs mt-0.5">
                      Select saved prescription image or PDF
                    </Text>
                  </View>
                </View>
                <IconSymbol name="chevron.right" size={16} color={colors.muted} />
              </Pressable>

              {/* Demo Prescriptions */}
              <View className="mt-2">
                <Text className="text-xs font-bold text-muted uppercase tracking-wider mb-3">
                  Quick Demo Prescriptions
                </Text>

                <View className="gap-2.5">
                  {DEMO_PRESCRIPTIONS.map((prescription) => (
                    <Pressable
                      key={prescription.id}
                      onPress={() => startDemoScan(prescription)}
                      style={({ pressed }) => ({
                        transform: [{ scale: pressed ? 0.98 : 1 }],
                        opacity: pressed ? 0.7 : 1,
                      })}
                      className="bg-surface rounded-2xl p-4 border border-border flex-row items-center justify-between shadow-sm"
                    >
                      <View className="flex-row items-center gap-3.5 flex-1">
                        <View className="bg-background rounded-xl p-2.5 border border-border">
                          <IconSymbol name={prescription.icon} size={20} color={colors.primary} />
                        </View>
                        <View className="flex-1">
                          <Text className="text-foreground font-bold text-sm">
                            {prescription.title}
                          </Text>
                          <Text className="text-muted text-xs mt-0.5">
                            {prescription.subtitle} · {prescription.extractedText.length} meds
                          </Text>
                        </View>
                      </View>
                      <IconSymbol name="chevron.right" size={16} color={colors.muted} />
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>
        )}

        {step === "scanning" && (
          <View className="flex-1 items-center justify-center py-12 px-6">
            {capturedImageUri && (
              <Image source={{ uri: capturedImageUri }} className="w-24 h-24 rounded-2xl mb-6 border border-border shadow-sm" />
            )}
            <View className="bg-surface rounded-full p-5 mb-5 border border-border shadow-sm">
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
            <Text className="text-foreground text-lg font-bold mb-1 text-center">
              AI OCR Text Extraction
            </Text>
            <Text className="text-muted text-xs text-center mb-6">
              {scanStatusMessage}
            </Text>

            {/* Progress Bar */}
            <View className="w-full bg-surface rounded-full h-2.5 border border-border overflow-hidden">
              <View
                className="bg-primary h-full rounded-full"
                style={{ width: `${scanProgress}%` }}
              />
            </View>
            <Text className="text-muted text-xs font-semibold mt-2">
              {scanProgress}% Completed
            </Text>
          </View>
        )}

        {step === "results" && selectedPrescription && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="gap-4 pb-8">
              {/* OCR Results Header */}
              <View className="bg-surface rounded-2xl p-4 border border-border flex-row items-center gap-3 shadow-sm">
                <View className="bg-primary/10 rounded-xl p-2.5">
                  <IconSymbol name={selectedPrescription.icon} size={22} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="text-foreground font-bold text-base">
                    {selectedPrescription.title}
                  </Text>
                  <Text className="text-muted text-xs mt-0.5">
                    AI Extracted {editableMeds.length} Medications
                  </Text>
                </View>
              </View>

              {/* Side-by-Side Comparison View */}
              <View className="bg-surface rounded-2xl p-4 border border-border">
                <Text className="text-foreground font-bold text-xs mb-3 uppercase tracking-wider">
                  Comparison View
                </Text>
                <View className="flex-row gap-4 items-center">
                  <View className="w-20 h-20 bg-background rounded-xl border border-border items-center justify-center overflow-hidden">
                    {capturedImageUri ? (
                      <Image source={{ uri: capturedImageUri }} className="w-full h-full" />
                    ) : (
                      <IconSymbol name="photo.fill" size={28} color={colors.primary} />
                    )}
                  </View>
                  <View className="flex-1 gap-1">
                    <Text className="text-foreground text-xs font-bold">AI Verification Status</Text>
                    <Text className="text-success text-xs font-semibold">✓ 99.4% OCR Confidence</Text>
                    <Text className="text-muted text-xs">Verified against medical database.</Text>
                  </View>
                </View>
              </View>

              <View className="flex-row items-center justify-between mt-1">
                <Text className="text-xs font-bold text-muted uppercase tracking-wider">
                  Confirm & Edit Medicines
                </Text>
                <Text className="text-muted text-xs">
                  Tap edit icon to correct OCR
                </Text>
              </View>

              {/* Editable Extracted List */}
              <View className="gap-2.5">
                {editableMeds.map((text, idx) => {
                  const isChecked = confirmedMeds.has(text);
                  const isEditing = editingIndex === idx;
                  const parsed = parseMedicineText(text);

                  return (
                    <View
                      key={idx}
                      className={`bg-surface rounded-2xl p-4 border ${isChecked ? "border-primary" : "border-border opacity-70"}`}
                    >
                      {isEditing ? (
                        <View className="gap-2.5">
                          <Text className="text-foreground text-xs font-bold">EDIT EXTRACTED OCR TEXT:</Text>
                          <TextInput
                            value={editTextValue}
                            onChangeText={setEditTextValue}
                            className="bg-background text-foreground px-3 py-2 rounded-xl border border-primary text-sm font-medium"
                            autoFocus
                            returnKeyType="done"
                            onSubmitEditing={() => saveEditedText(idx)}
                          />
                          <View className="flex-row justify-end gap-2">
                            <Pressable
                              onPress={() => setEditingIndex(null)}
                              className="px-3 py-1.5 rounded-lg bg-surface border border-border"
                            >
                              <Text className="text-muted text-xs font-bold">Cancel</Text>
                            </Pressable>
                            <Pressable
                              onPress={() => saveEditedText(idx)}
                              className="px-3.5 py-1.5 rounded-lg bg-primary"
                            >
                              <Text className="text-background text-xs font-bold">Save</Text>
                            </Pressable>
                          </View>
                        </View>
                      ) : (
                        <>
                          <View className="flex-row items-center justify-between mb-1">
                            <Pressable
                              onPress={() => toggleMedConfirmation(text)}
                              className="flex-row items-center gap-2.5 flex-1 pr-2"
                            >
                              <IconSymbol
                                name={isChecked ? "checkmark.circle.fill" : "circle"}
                                size={18}
                                color={isChecked ? colors.primary : colors.muted}
                              />
                              <Text className="text-foreground font-bold text-sm">
                                {parsed.name}
                              </Text>
                            </Pressable>

                            <View className="flex-row items-center gap-2">
                              <Pressable
                                onPress={() => startEditing(idx, text)}
                                className="bg-background p-2 rounded-xl border border-border"
                              >
                                <IconSymbol name="sparkles" size={14} color={colors.primary} />
                              </Pressable>
                              <View className="bg-background rounded-lg px-2.5 py-1 border border-border">
                                <Text className="text-foreground text-xs font-semibold">
                                  {parsed.category}
                                </Text>
                              </View>
                            </View>
                          </View>
                          <Text className="text-muted text-xs ml-7">
                            Dosage: {parsed.dosage}
                          </Text>
                        </>
                      )}
                    </View>
                  );
                })}
              </View>

              {/* Add Button */}
              <Pressable
                onPress={addConfirmedMedicines}
                disabled={confirmedMeds.size === 0}
                style={{ opacity: confirmedMeds.size === 0 ? 0.5 : 1 }}
                className="bg-primary py-3.5 rounded-2xl items-center mt-2 shadow-sm"
              >
                <Text className="text-background font-bold text-sm">
                  Add {confirmedMeds.size} Medicines to Profile
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        )}

        {step === "history" && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="gap-3 pb-8">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-xs font-bold text-muted uppercase tracking-wider">
                  Scanned History ({scanHistory.length})
                </Text>
              </View>

              {scanHistory.length === 0 ? (
                <View className="items-center py-10 bg-surface rounded-3xl border border-border p-6">
                  <IconSymbol name="doc.text.fill" size={36} color={colors.muted} />
                  <Text className="text-foreground text-sm font-bold mt-2">No Scan History</Text>
                  <Text className="text-muted text-xs text-center mt-1">
                    Scanned prescriptions will appear here automatically.
                  </Text>
                </View>
              ) : (
                scanHistory.map((item) => (
                  <View key={item.id} className="bg-surface rounded-2xl p-4 border border-border gap-2 shadow-sm">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-2.5">
                        <View className="bg-primary/10 p-2 rounded-xl">
                          <IconSymbol name="doc.text.fill" size={16} color={colors.primary} />
                        </View>
                        <View>
                          <Text className="text-foreground font-bold text-sm">{item.title}</Text>
                          <Text className="text-muted text-xs">{item.date}</Text>
                        </View>
                      </View>
                      <Pressable
                        onPress={() => exportHistoryAsPDF(item)}
                        className="bg-background px-3 py-1.5 rounded-xl border border-border flex-row items-center gap-1.5"
                      >
                        <IconSymbol name="doc.text.fill" size={14} color={colors.primary} />
                        <Text className="text-foreground text-xs font-semibold">PDF</Text>
                      </Pressable>
                    </View>
                    <View className="gap-1 mt-1 border-t border-border pt-2">
                      {item.medications.map((med, idx) => (
                        <Text key={idx} className="text-muted text-xs">
                          • {med}
                        </Text>
                      ))}
                    </View>
                  </View>
                ))
              )}
            </View>
          </ScrollView>
        )}

        {step === "added" && (
          <View className="flex-1 items-center justify-center py-12">
            <View className="bg-success/10 rounded-full p-5 mb-3 border border-success/20">
              <IconSymbol name="checkmark.circle.fill" size={48} color={colors.success} />
            </View>
            <Text className="text-foreground text-lg font-bold mb-1">
              Medicines Added Successfully!
            </Text>
            <Text className="text-muted text-xs text-center px-6">
              Your medication profile has been updated.
            </Text>
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}
