import { Text, View, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useMedications } from "@/lib/medicationStore";
import { checkAllInteractions, type InteractionEntry, type Severity } from "@/lib/drugDatabase";
import { useColors } from "@/hooks/use-colors";

function triggerHaptic() {
  if (Platform.OS !== "web") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

type FilterType = "all" | Severity;

const SEVERITY_CONFIG = {
  severe: { gradient: ["#DC2626", "#F87171"], bg: "#FEF2F2", text: "#DC2626" },
  moderate: { gradient: ["#EA580C", "#FB923C"], bg: "#FFF7ED", text: "#EA580C" },
  mild: { gradient: ["#CA8A04", "#FACC15"], bg: "#FEFCE8", text: "#CA8A04" },
};

export default function InteractionsScreen() {
  const router = useRouter();
  const { medicines } = useMedications();
  const colors = useColors();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");

  const allInteractions = checkAllInteractions(medicines);
  const filteredInteractions = filter === "all"
    ? allInteractions
    : allInteractions.filter((i) => i.severity === filter);

  const severeCount = allInteractions.filter((i) => i.severity === "severe").length;
  const moderateCount = allInteractions.filter((i) => i.severity === "moderate").length;
  const mildCount = allInteractions.filter((i) => i.severity === "mild").length;
  const totalIssues = severeCount + moderateCount + mildCount;

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    triggerHaptic();
  };

  const InteractionCard = ({ interaction }: { interaction: InteractionEntry }) => {
    const config = SEVERITY_CONFIG[interaction.severity];
    const isExpanded = expandedId === `${interaction.drug1}-${interaction.drug2}`;
    const severityLabel = interaction.severity.charAt(0).toUpperCase() + interaction.severity.slice(1);

    return (
      <Pressable
        onPress={() => toggleExpand(`${interaction.drug1}-${interaction.drug2}`)}
        style={({ pressed }) => ({
          transform: [{ scale: pressed ? 0.97 : 1 }],
          opacity: pressed ? 0.85 : 1,
          marginBottom: 10,
        })}
      >
        <View style={{ borderRadius: 16, overflow: "hidden", borderWidth: 0.5, borderColor: config.bg + "80" }}>
          {/* Top gradient bar */}
          <LinearGradient
            colors={config.gradient as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: 3 }}
          />
          <View style={{ backgroundColor: colors.surface, padding: 16 }}>
            {/* Header Row */}
            <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
              <View style={{ backgroundColor: config.bg, padding: 8, borderRadius: 10 }}>
                <IconSymbol
                  name={interaction.severity === "severe" ? "xmark.circle.fill" : interaction.severity === "moderate" ? "exclamationmark.triangle.fill" : "info.circle.fill"}
                  size={20}
                  color={config.text}
                />
              </View>
              <View className="flex-1">
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <Text className="text-foreground font-bold text-sm">
                    {interaction.drug1}
                  </Text>
                  <View style={{ backgroundColor: config.bg, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 }}>
                    <Text style={{ color: config.text, fontSize: 10, fontWeight: "700" }}>+</Text>
                  </View>
                  <Text className="text-foreground font-bold text-sm">
                    {interaction.drug2}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 }}>
                  <LinearGradient
                    colors={config.gradient as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="rounded-full px-3 py-0.5"
                  >
                    <Text style={{ color: "#FFFFFF", fontSize: 11, fontWeight: "700" }}>
                      {severityLabel}
                    </Text>
                  </LinearGradient>
                  <Text className="text-muted text-xs" numberOfLines={1}>
                    {interaction.mechanism}
                  </Text>
                </View>
              </View>
              <View style={{ transform: [{ rotate: isExpanded ? "90deg" : "0deg" }] }}>
                <IconSymbol name="chevron.right" size={18} color={colors.muted} />
              </View>
            </View>

            {/* Expanded Details */}
            {isExpanded && (
              <View style={{ marginTop: 14, borderTopColor: colors.border, borderTopWidth: 0.5, paddingTop: 12, gap: 12 }}>
                <View>
                  <Text className="text-muted text-xs font-bold mb-1">
                    DESCRIPTION
                  </Text>
                  <Text className="text-foreground text-sm" style={{ lineHeight: 20 }}>
                    {interaction.description}
                  </Text>
                </View>
                <View>
                  <Text className="text-muted text-xs font-bold mb-1">
                    RECOMMENDATION
                  </Text>
                  <View style={{ backgroundColor: config.bg, padding: 12, borderRadius: 12, borderLeftWidth: 3, borderLeftColor: config.text }}>
                    <Text style={{ color: config.text, fontSize: 13, fontWeight: "500", lineHeight: 20 }}>
                      {interaction.recommendation}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <ScreenContainer className="px-5 pt-6">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center gap-3 mb-4">
          <Pressable onPress={() => router.back()} style={{ opacity: 0.9 }}>
            <IconSymbol name="chevron.left.forwardslash.chevron.right" size={24} color={colors.primary} />
          </Pressable>
          <View className="flex-1">
            <Text className="text-xl font-bold text-foreground">
              Interactions
            </Text>
            <Text className="text-muted text-sm">
              {allInteractions.length > 0
                ? `${totalIssues} interaction${totalIssues > 1 ? "s" : ""} found`
                : "No interactions found"}
            </Text>
          </View>
          <LinearGradient
            colors={totalIssues > 0 ? ["#EF4444", "#F87171"] : ["#10B981", "#34D399"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-xl px-3 py-1.5"
          >
            <Text className="text-white text-xs font-bold">
              {totalIssues > 0 ? `${totalIssues}` : "OK"}
            </Text>
          </LinearGradient>
        </View>

        {/* Severity Summary */}
        {allInteractions.length > 0 && (
          <View className="flex-row gap-3 mb-4">
            {severeCount > 0 && (
              <LinearGradient
                colors={SEVERITY_CONFIG.severe.gradient as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="flex-1 rounded-xl p-3 items-center"
              >
                <Text className="text-white text-xl font-bold">{severeCount}</Text>
                <Text className="text-white/80 text-xs font-semibold mt-0.5">Severe</Text>
              </LinearGradient>
            )}
            {moderateCount > 0 && (
              <LinearGradient
                colors={SEVERITY_CONFIG.moderate.gradient as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="flex-1 rounded-xl p-3 items-center"
              >
                <Text className="text-white text-xl font-bold">{moderateCount}</Text>
                <Text className="text-white/80 text-xs font-semibold mt-0.5">Moderate</Text>
              </LinearGradient>
            )}
            {mildCount > 0 && (
              <LinearGradient
                colors={SEVERITY_CONFIG.mild.gradient as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="flex-1 rounded-xl p-3 items-center"
              >
                <Text className="text-white text-xl font-bold">{mildCount}</Text>
                <Text className="text-white/80 text-xs font-semibold mt-0.5">Mild</Text>
              </LinearGradient>
            )}
          </View>
        )}

        {/* Filter Tabs */}
        {allInteractions.length > 0 && (
          <View className="flex-row gap-2 mb-4">
            {(["all", "severe", "moderate", "mild"] as FilterType[]).map((f) => {
              const count = f === "severe" ? severeCount : f === "moderate" ? moderateCount : f === "mild" ? mildCount : allInteractions.length;
              return (
                <Pressable
                  key={f}
                  onPress={() => setFilter(f)}
                  style={({ pressed }) => ({
                    transform: [{ scale: pressed ? 0.95 : 1 }],
                    opacity: pressed ? 0.8 : 1,
                    paddingVertical: 6,
                    paddingHorizontal: 14,
                    borderRadius: 20,
                    backgroundColor: filter === f ? colors.primary : colors.surface,
                    borderWidth: 0.5,
                    borderColor: filter === f ? colors.primary : colors.border,
                  })}
                >
                  <Text style={{ fontSize: 12, fontWeight: "600", color: filter === f ? "#FFFFFF" : colors.muted }}>
                    {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                    {f !== "all" && ` (${count})`}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Content */}
        {medicines.length < 2 ? (
          <View className="flex-1 items-center justify-center py-12">
            <LinearGradient
              colors={["#0EA5E920", "#6366F120"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-full p-8 mb-4"
            >
              <IconSymbol name="pills.fill" size={48} color={colors.primary} />
            </LinearGradient>
            <Text className="text-foreground text-base font-bold mb-1">
              Add More Medicines
            </Text>
            <Text className="text-muted text-sm text-center px-8">
              You need at least 2 medicines to check for interactions
            </Text>
          </View>
        ) : filteredInteractions.length === 0 ? (
          <View className="flex-1 items-center justify-center py-12">
            <LinearGradient
              colors={["#10B981", "#34D399"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-full p-8 mb-4"
            >
              <IconSymbol name="checkmark.seal.fill" size={48} color="#FFFFFF" />
            </LinearGradient>
            <Text className="text-foreground text-base font-bold mb-1">
              No Interactions Found
            </Text>
            <Text className="text-muted text-sm text-center px-8">
              Your current medicines don't have known interactions
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredInteractions}
            renderItem={({ item }) => <InteractionCard interaction={item} />}
            keyExtractor={(item) => `${item.drug1}-${item.drug2}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </ScreenContainer>
  );
}
