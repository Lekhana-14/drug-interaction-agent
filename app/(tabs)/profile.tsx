import { Text, View, ScrollView, Pressable, Linking } from "react-native";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useThemeContext } from "@/lib/theme-provider";

function triggerHaptic() {
  if (Platform.OS !== "web") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

export default function ProfileScreen() {
  const colors = useColors();
  const { colorScheme, setColorScheme } = useThemeContext();

  const toggleTheme = () => {
    triggerHaptic();
    setColorScheme(colorScheme === "light" ? "dark" : "light");
  };

  return (
    <ScreenContainer className="px-5 pt-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* App Branding */}
          <View className="items-center py-4">
            <LinearGradient
              colors={["#0EA5E9", "#6366F1"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-3xl p-6 mb-4"
              style={{ elevation: 4 }}
            >
              <IconSymbol name="shield.fill" size={48} color="#FFFFFF" />
            </LinearGradient>
            <Text className="text-foreground text-xl font-bold">
              MedCheck
            </Text>
            <Text className="text-muted text-sm mt-0.5">
              Drug Interaction Checker v1.0
            </Text>
          </View>

          {/* Theme Toggle */}
          <Pressable
            onPress={toggleTheme}
            style={({ pressed }) => ({
              transform: [{ scale: pressed ? 0.97 : 1 }],
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <View className="bg-surface rounded-2xl p-4 border border-border flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <LinearGradient
                  colors={colorScheme === "light" ? ["#F59E0B", "#FBBF24"] : ["#6366F1", "#818CF8"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="rounded-xl p-2.5"
                >
                  <IconSymbol name="heart.fill" size={20} color="#FFFFFF" />
                </LinearGradient>
                <View>
                  <Text className="text-foreground font-semibold text-sm">
                    {colorScheme === "light" ? "Light Mode" : "Dark Mode"}
                  </Text>
                  <Text className="text-muted text-xs mt-0.5">
                    Tap to switch theme
                  </Text>
                </View>
              </View>
              <IconSymbol name="chevron.right" size={18} color={colors.muted} />
            </View>
          </Pressable>

          {/* Quick Actions */}
          <View>
            <Text className="text-foreground font-bold mb-3">
              Quick Actions
            </Text>
            <View className="gap-3">
              <Pressable
                onPress={() => {
                  triggerHaptic();
                  Linking.openURL("/scan");
                }}
                style={({ pressed }) => ({
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                  opacity: pressed ? 0.9 : 1,
                })}
              >
                <View className="bg-surface rounded-2xl p-4 border border-border flex-row items-center gap-3 shadow-sm">
                  <LinearGradient
                    colors={["#0EA5E9", "#6366F1"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="rounded-xl p-2.5"
                  >
                    <IconSymbol name="camera.fill" size={20} color="#FFFFFF" />
                  </LinearGradient>
                  <View className="flex-1">
                    <Text className="text-foreground font-bold text-sm">
                      Demo: Scan Prescription
                    </Text>
                    <Text className="text-muted text-xs">Try the prescription scanning flow</Text>
                  </View>
                  <IconSymbol name="chevron.right" size={18} color={colors.muted} />
                </View>
              </Pressable>

              <Pressable
                onPress={() => {
                  triggerHaptic();
                  Linking.openURL("/report");
                }}
                style={({ pressed }) => ({
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                  opacity: pressed ? 0.9 : 1,
                })}
              >
                <View className="bg-surface rounded-2xl p-4 border border-border flex-row items-center gap-3 shadow-sm">
                  <LinearGradient
                    colors={["#F59E0B", "#FBBF24"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="rounded-xl p-2.5"
                  >
                    <IconSymbol name="doc.text.fill" size={20} color="#FFFFFF" />
                  </LinearGradient>
                  <View className="flex-1">
                    <Text className="text-foreground font-bold text-sm">
                      Generate Report
                    </Text>
                    <Text className="text-muted text-xs">View and share interaction report</Text>
                  </View>
                  <IconSymbol name="chevron.right" size={18} color={colors.muted} />
                </View>
              </Pressable>
            </View>
          </View>

          {/* How It Works */}
          <View>
            <Text className="text-foreground font-bold mb-3">
              How It Works
            </Text>
            <View className="bg-surface rounded-2xl border border-border overflow-hidden">
              {[
                { icon: "camera.fill", title: "Prescription Capture & OCR", desc: "Photograph prescriptions; extracts text using Google ML Kit" },
                { icon: "sparkles", title: "Fuzzy Matching", desc: "Corrects OCR errors using Levenshtein edit-distance" },
                { icon: "pills.fill", title: "Medication Profile", desc: "On-device storage remembers every active medicine" },
                { icon: "bolt.fill", title: "Interaction Engine", desc: "Cross-checks medicine pairs against curated database" },
                { icon: "doc.text.fill", title: "Alert & Report", desc: "Severity warnings and shareable summary for doctor visits" },
              ].map((item, index) => (
                <View key={index} className="flex-row items-center gap-3 px-4 py-3" style={{ borderBottomColor: colors.border, borderBottomWidth: index < 4 ? 0.5 : 0 }}>
                  <View className="bg-primary/10 rounded-xl p-2">
                    <IconSymbol name={item.icon as any} size={18} color={colors.primary} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-foreground font-semibold text-sm">
                      {item.title}
                    </Text>
                    <Text className="text-muted text-xs mt-0.5">
                      {item.desc}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Technology Stack */}
          <View>
            <Text className="text-foreground font-bold mb-3">
              Technology Stack
            </Text>
            <View className="bg-surface rounded-2xl p-4 border border-border gap-2">
              {[
                { label: "Frontend / App", value: "React Native (Expo)" },
                { label: "State Management", value: "React Context + AsyncStorage" },
                { label: "OCR Engine", value: "Google ML Kit (on-device)" },
                { label: "Fuzzy Matching", value: "Levenshtein Edit-Distance" },
                { label: "Interaction Data", value: "30+ drugs, 35+ interactions" },
                { label: "AI Pipeline", value: "OCR → Fuzzy → Rule-Based" },
              ].map((item, index) => (
                <View key={index} className="flex-row justify-between py-1.5" style={{ borderBottomColor: colors.border, borderBottomWidth: index < 5 ? 0.5 : 0 }}>
                  <Text className="text-muted text-sm">{item.label}</Text>
                  <Text className="text-foreground text-sm font-semibold">{item.value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Disclaimer */}
          <View className="bg-warning/5 rounded-2xl p-4 border border-warning/20 mb-6">
            <View className="flex-row items-start gap-3">
              <View className="bg-warning/10 rounded-lg p-1.5 mt-0.5">
                <IconSymbol name="exclamationmark.triangle.fill" size={16} color={colors.warning} />
              </View>
              <Text className="text-muted text-xs flex-1 leading-relaxed">
                <Text className="text-warning font-bold">Disclaimer: </Text>
                This app is for educational and demonstration purposes only. It should not be used as a substitute for professional medical advice. Always consult a qualified healthcare provider.
              </Text>
            </View>
          </View>

          {/* Credits */}
          <View className="items-center pb-8">
            <Text className="text-muted text-xs">
              Built with React Native + Expo
            </Text>
            <Text className="text-muted text-xs mt-1">
              Presented by Kamali
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
