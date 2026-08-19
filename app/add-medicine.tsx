import { Text, View, TextInput, FlatList, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useState, useMemo } from "react";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useMedications } from "@/lib/medicationStore";
import { DRUG_INFO, fuzzyMatchDrug } from "@/lib/drugDatabase";
import { useColors } from "@/hooks/use-colors";

function triggerHaptic() {
  if (Platform.OS !== "web") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

export default function AddMedicineScreen() {
  const router = useRouter();
  const { addMedicine } = useMedications();
  const colors = useColors();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDrug, setSelectedDrug] = useState<string | null>(null);
  const [dosage, setDosage] = useState("");
  const [doctor, setDoctor] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const searchResults = useMemo(() => {
    if (searchQuery.length < 1) return [];
    return fuzzyMatchDrug(searchQuery, 5);
  }, [searchQuery]);

  const drugInfo = selectedDrug ? DRUG_INFO[selectedDrug] : null;

  const selectDrug = (name: string) => {
    setSelectedDrug(name);
    setSearchQuery("");
    triggerHaptic();
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleAdd = () => {
    if (!selectedDrug) return;

    addMedicine({
      name: selectedDrug,
      dosage: dosage || "As prescribed",
      doctor: doctor || "Not specified",
      category: drugInfo?.category || "Unknown",
    });

    setShowSuccess(true);
    triggerHaptic();

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    setTimeout(() => {
      router.back();
    }, 1500);
  };

  return (
    <ScreenContainer className="px-5 pt-6">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center gap-3 mb-5">
          <Pressable onPress={() => router.back()} style={{ opacity: 0.9 }}>
            <IconSymbol name="chevron.left.forwardslash.chevron.right" size={24} color={colors.primary} />
          </Pressable>
          <View className="flex-1">
            <Text className="text-xl font-bold text-foreground">
              Add Medicine
            </Text>
            <Text className="text-muted text-sm">
              Search from our drug database
            </Text>
          </View>
        </View>

        {/* Success State */}
        {showSuccess ? (
          <View className="flex-1 items-center justify-center">
            <LinearGradient
              colors={["#10B981", "#34D399"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-full p-8 mb-4"
            >
              <IconSymbol name="checkmark.circle.fill" size={56} color="#FFFFFF" />
            </LinearGradient>
            <Text className="text-foreground text-lg font-bold mb-1">
              Medicine Added!
            </Text>
            <Text className="text-muted text-sm">
              {selectedDrug} has been added to your profile
            </Text>
            <Text className="text-primary text-sm font-semibold mt-3">
              Returning to Medications...
            </Text>
          </View>
        ) : (
          <View className="flex-1 gap-4">
            {/* Search Bar */}
            <View className="flex-row items-center bg-surface rounded-2xl px-4 py-3 border border-border shadow-sm">
              <IconSymbol name="magnifyingglass" size={20} color={colors.muted} />
              <TextInput
                placeholder="Search for a medicine..."
                placeholderTextColor={colors.muted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 ml-3 text-foreground"
                style={{ fontSize: 16 }}
                autoCapitalize="words"
                returnKeyType="done"
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => { setSearchQuery(""); setSelectedDrug(null); }} style={{ opacity: 0.8 }}>
                  <IconSymbol name="xmark.circle.fill" size={18} color={colors.muted} />
                </Pressable>
              )}
            </View>

            {/* Selected Drug Card */}
            {selectedDrug && drugInfo && (
              <LinearGradient
                colors={["#0EA5E9", "#6366F1"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="rounded-2xl p-4"
                style={{ elevation: 4 }}
              >
                <View className="flex-row items-center gap-3">
                  <View className="bg-white/20 rounded-xl p-2">
                    <IconSymbol name="pills.fill" size={22} color="#FFFFFF" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-bold text-base">
                      {drugInfo.name}
                    </Text>
                    <Text className="text-white/80 text-xs mt-0.5">
                      {drugInfo.category}
                    </Text>
                  </View>
                  <Pressable onPress={() => setSelectedDrug(null)} style={{ opacity: 0.9 }}>
                    <IconSymbol name="xmark.circle.fill" size={22} color="#FFFFFF" />
                  </Pressable>
                </View>
                <Text className="text-white/70 text-xs mt-2">
                  {drugInfo.commonUses}
                </Text>
              </LinearGradient>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && !selectedDrug && (
              <View className="bg-surface rounded-2xl border border-border overflow-hidden">
                <FlatList
                  data={searchResults}
                  keyExtractor={(item) => item.name}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => selectDrug(item.name)}
                      style={({ pressed }) => ({
                        transform: [{ scale: pressed ? 0.97 : 1 }],
                        opacity: pressed ? 0.8 : 1,
                        padding: 14,
                        borderBottomColor: colors.border,
                        borderBottomWidth: 0.5,
                      })}
                    >
                      <View className="flex-row items-center gap-3">
                        <View className="bg-primary/10 rounded-xl p-2">
                          <IconSymbol name="pills.fill" size={18} color={colors.primary} />
                        </View>
                        <View className="flex-1">
                          <Text className="text-foreground font-bold text-sm">
                            {item.name}
                          </Text>
                          <Text className="text-muted text-xs mt-0.5">
                            {DRUG_INFO[item.name]?.category || "Unknown"}
                          </Text>
                        </View>
                        <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: item.distance === 0 ? "#10B98115" : "#F59E0B15" }}>
                          <Text style={{ fontSize: 10, fontWeight: "600", color: item.distance === 0 ? "#10B981" : "#F59E0B" }}>
                            {item.distance === 0 ? "Exact" : `~${item.distance}`}
                          </Text>
                        </View>
                        <IconSymbol name="arrow.right.circle.fill" size={18} color={colors.primary} />
                      </View>
                    </Pressable>
                  )}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}

            {searchQuery.length > 0 && searchResults.length === 0 && !selectedDrug && (
              <View className="items-center py-6">
                <IconSymbol name="magnifyingglass" size={32} color={colors.muted} />
                <Text className="text-muted text-sm mt-2 text-center">
                  No medicines found for "{searchQuery}"
                </Text>
              </View>
            )}

            {/* Dosage & Doctor Form */}
            {selectedDrug && (
              <View className="gap-4">
                <View>
                  <Text className="text-muted text-xs font-bold mb-2">
                    DOSAGE
                  </Text>
                  <View className="bg-surface rounded-2xl px-4 py-3 border border-border">
                    <TextInput
                      placeholder="e.g. 500mg, 1 tablet"
                      placeholderTextColor={colors.muted}
                      value={dosage}
                      onChangeText={setDosage}
                      className="text-foreground"
                      style={{ fontSize: 15 }}
                      returnKeyType="done"
                    />
                  </View>
                </View>

                <View>
                  <Text className="text-muted text-xs font-bold mb-2">
                    PRESCRIBED BY
                  </Text>
                  <View className="bg-surface rounded-2xl px-4 py-3 border border-border">
                    <TextInput
                      placeholder="Doctor's name or specialty"
                      placeholderTextColor={colors.muted}
                      value={doctor}
                      onChangeText={setDoctor}
                      className="text-foreground"
                      style={{ fontSize: 15 }}
                      returnKeyType="done"
                    />
                  </View>
                </View>

                {/* Add Button */}
                <Pressable
                  onPress={handleAdd}
                  disabled={!selectedDrug}
                  style={({ pressed }) => ({
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                    opacity: pressed ? 0.9 : 1,
                  })}
                >
                  <LinearGradient
                    colors={["#0EA5E9", "#6366F1"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="rounded-2xl p-4 flex-row items-center justify-center gap-3"
                    style={{ elevation: 4 }}
                  >
                    <IconSymbol name="plus.circle.fill" size={22} color="#FFFFFF" />
                    <Text className="text-white font-bold text-base">
                      Add Medicine to Profile
                    </Text>
                  </LinearGradient>
                </Pressable>
              </View>
            )}
          </View>
        )}
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
