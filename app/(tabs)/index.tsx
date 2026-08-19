import { Text, View, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useMedications } from "@/lib/medicationStore";
import { checkAllInteractions } from "@/lib/drugDatabase";
import { useColors } from "@/hooks/use-colors";
import { useThemeContext } from "@/lib/theme-provider";

function triggerHaptic() {
  if (Platform.OS !== "web") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

export default function HomeScreen() {
  const router = useRouter();
  const { medicines, isLoading } = useMedications();
  const colors = useColors();
  const { colorScheme, setColorScheme } = useThemeContext();

  const toggleTheme = () => {
    triggerHaptic();
    setColorScheme(colorScheme === "light" ? "dark" : "light");
  };

  const interactions = medicines.length >= 2
    ? checkAllInteractions(medicines)
    : [];
  const severeCount = interactions.filter((i) => i.severity === "severe").length;
  const moderateCount = interactions.filter((i) => i.severity === "moderate").length;
  const mildCount = interactions.filter((i) => i.severity === "mild").length;
  const totalIssues = severeCount + moderateCount + mildCount;

  const lastCheckDate = medicines.length > 0
    ? new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "No medications yet";

  return (
    <ScreenContainer className="px-5 pt-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* Header */}
          <View className="flex-row items-center justify-between pb-2 border-b border-border/40">
            <View>
              <Text className="text-muted text-[11px] font-bold uppercase tracking-widest">Health Dashboard</Text>
              <Text className="text-2xl font-black text-foreground mt-0.5 tracking-tight">
                MedCheck
              </Text>
            </View>
            <View className="flex-row items-center gap-2.5">
              <Pressable
                onPress={toggleTheme}
                style={({ pressed }) => ({
                  transform: [{ scale: pressed ? 0.94 : 1 }],
                  opacity: pressed ? 0.7 : 1,
                })}
                className="bg-surface rounded-full p-2.5 border border-border"
              >
                <IconSymbol
                  name={colorScheme === "light" ? "sparkles" : "moon.fill" as any}
                  size={18}
                  color={colors.foreground}
                />
              </Pressable>
            </View>
          </View>

          {/* Minimalist Status Card (Replacing chunky gradient box) */}
          <View className="bg-surface rounded-2xl p-5 border border-border shadow-sm">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2">
                <View className={`w-2.5 h-2.5 rounded-full ${totalIssues > 0 ? "bg-error" : "bg-success"}`} />
                <Text className="text-foreground text-xs font-bold uppercase tracking-wider">
                  {totalIssues > 0 ? "Action Required" : "All Clear & Safe"}
                </Text>
              </View>
              <Text className="text-muted text-xs font-medium">
                {lastCheckDate}
              </Text>
            </View>

            <View className="mb-3">
              <Text className="text-foreground text-2xl font-black tracking-tight">
                {medicines.length} {medicines.length === 1 ? "Medication" : "Medications"}
              </Text>
              <Text className="text-muted text-xs mt-1 leading-relaxed">
                {medicines.length >= 2
                  ? totalIssues > 0
                    ? `${totalIssues} interaction warning${totalIssues > 1 ? "s" : ""} detected in your profile.`
                    : "Zero dangerous drug interactions found across your medications."
                  : "Add at least 2 medications to enable automated safety analysis."}
              </Text>
            </View>

            {medicines.length >= 2 && (
              <View className="flex-row gap-2 pt-3 border-t border-border">
                <View className="flex-1 bg-background rounded-xl p-2.5 items-center border border-border">
                  <Text className="text-foreground text-base font-black">{severeCount}</Text>
                  <Text className="text-muted text-[10px] font-bold mt-0.5">Severe</Text>
                </View>
                <View className="flex-1 bg-background rounded-xl p-2.5 items-center border border-border">
                  <Text className="text-foreground text-base font-black">{moderateCount}</Text>
                  <Text className="text-muted text-[10px] font-bold mt-0.5">Moderate</Text>
                </View>
                <View className="flex-1 bg-background rounded-xl p-2.5 items-center border border-border">
                  <Text className="text-foreground text-base font-black">{mildCount}</Text>
                  <Text className="text-muted text-[10px] font-bold mt-0.5">Mild</Text>
                </View>
              </View>
            )}
          </View>

          {/* Quick Actions - Clean Minimalist Rows (Replacing chunky colored blocks) */}
          <View>
            <Text className="text-xs font-bold text-muted uppercase tracking-wider mb-3">
              Quick Actions
            </Text>
            <View className="gap-2.5">
              {/* Scan Prescription */}
              <Pressable
                onPress={() => {
                  triggerHaptic();
                  router.push("/scan");
                }}
                style={({ pressed }) => ({
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                  opacity: pressed ? 0.7 : 1,
                })}
                className="bg-surface rounded-2xl p-4 border border-border flex-row items-center justify-between shadow-sm"
              >
                <View className="flex-row items-center gap-3.5 flex-1">
                  <View className="bg-primary/10 rounded-xl p-2.5">
                    <IconSymbol name="camera.fill" size={20} color={colors.primary} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-foreground text-sm font-bold">
                      Scan Prescription
                    </Text>
                    <Text className="text-muted text-xs mt-0.5">
                      Capture photo or AI OCR extraction
                    </Text>
                  </View>
                </View>
                <IconSymbol name="chevron.right" size={16} color={colors.muted} />
              </Pressable>

              {/* Add Medicine */}
              <Pressable
                onPress={() => {
                  triggerHaptic();
                  router.push("/add-medicine");
                }}
                style={({ pressed }) => ({
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                  opacity: pressed ? 0.7 : 1,
                })}
                className="bg-surface rounded-2xl p-4 border border-border flex-row items-center justify-between shadow-sm"
              >
                <View className="flex-row items-center gap-3.5 flex-1">
                  <View className="bg-success/10 rounded-xl p-2.5">
                    <IconSymbol name="plus.circle.fill" size={20} color={colors.success} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-foreground text-sm font-bold">
                      Add Medicine
                    </Text>
                    <Text className="text-muted text-xs mt-0.5">
                      Search and add manually from database
                    </Text>
                  </View>
                </View>
                <IconSymbol name="chevron.right" size={16} color={colors.muted} />
              </Pressable>

              {/* Check Interactions */}
              <Pressable
                onPress={() => {
                  triggerHaptic();
                  router.push("/interactions");
                }}
                style={({ pressed }) => ({
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                  opacity: pressed ? 0.7 : 1,
                })}
                className="bg-surface rounded-2xl p-4 border border-border flex-row items-center justify-between shadow-sm"
              >
                <View className="flex-row items-center gap-3.5 flex-1">
                  <View className="bg-warning/10 rounded-xl p-2.5">
                    <IconSymbol name="bolt.fill" size={20} color={colors.warning} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-foreground text-sm font-bold">
                      Check Interactions
                    </Text>
                    <Text className="text-muted text-xs mt-0.5">
                      Analyze warnings & safety risks instantly
                    </Text>
                  </View>
                </View>
                <IconSymbol name="chevron.right" size={16} color={colors.muted} />
              </Pressable>
            </View>
          </View>

          {/* Active Medications Preview */}
          {medicines.length > 0 && (
            <View>
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-xs font-bold text-muted uppercase tracking-wider">
                  Active Medications
                </Text>
                {medicines.length > 3 && (
                  <Pressable
                    onPress={() => {
                      triggerHaptic();
                      router.push("/medications");
                    }}
                  >
                    <Text className="text-primary text-xs font-bold">
                      View All →
                    </Text>
                  </Pressable>
                )}
              </View>
              {medicines.slice(-3).reverse().map((med) => (
                <View
                  key={med.id}
                  className="bg-surface rounded-2xl p-3.5 border border-border mb-2.5 shadow-sm flex-row justify-between items-center"
                >
                  <View className="flex-1 pr-3">
                    <Text className="text-foreground font-bold text-sm">
                      {med.name}
                    </Text>
                    <Text className="text-muted text-xs mt-0.5">
                      {med.dosage} · Dr. {med.doctor}
                    </Text>
                  </View>
                  <View className="bg-background rounded-lg px-2.5 py-1 border border-border">
                    <Text className="text-foreground text-xs font-semibold">
                      {med.category}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Empty State */}
          {medicines.length === 0 && (
            <View className="items-center py-8 bg-surface rounded-3xl border border-border p-6">
              <View className="bg-background rounded-full p-4 mb-3 border border-border">
                <IconSymbol name="pills.fill" size={32} color={colors.muted} />
              </View>
              <Text className="text-foreground text-base font-bold mb-1 text-center">
                No Medications Yet
              </Text>
              <Text className="text-muted text-xs text-center px-4 leading-relaxed">
                Tap 'Scan Prescription' or 'Add Medicine' above to start tracking your medications and checking for safety interactions.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
