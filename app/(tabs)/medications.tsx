import { Text, View, FlatList, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useMedications } from "@/lib/medicationStore";
import { useColors } from "@/hooks/use-colors";

function triggerHaptic() {
  if (Platform.OS !== "web") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

export default function MedicationsScreen() {
  const router = useRouter();
  const { medicines, removeMedicine, clearAll, isLoading } = useMedications();
  const colors = useColors();

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      "Remove Medicine",
      `Are you sure you want to remove ${name} from your profile?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            removeMedicine(id);
            triggerHaptic();
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Medicines",
      "Are you sure you want to remove all medicines? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => {
            clearAll();
            triggerHaptic();
          },
        },
      ]
    );
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderItem = ({ item }: { item: any }) => (
    <View className="bg-surface rounded-2xl p-4 border border-border mb-3 shadow-sm">
      <View className="flex-row items-center gap-3">
        <LinearGradient
          colors={["#0EA5E9", "#6366F1"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-xl p-2.5"
        >
          <IconSymbol name="pills.fill" size={20} color="#FFFFFF" />
        </LinearGradient>
        <View className="flex-1">
          <Text className="text-foreground font-bold text-sm">
            {item.name}
          </Text>
          <Text className="text-muted text-xs mt-0.5">
            {item.dosage} · {item.doctor}
          </Text>
          <Text className="text-muted text-xs mt-0.5">
            Added: {formatDate(item.addedDate)}
          </Text>
        </View>
        <Pressable
          onPress={() => handleDelete(item.id, item.name)}
          style={({ pressed }) => ({
            opacity: pressed ? 0.6 : 1,
            transform: [{ scale: pressed ? 0.9 : 1 }],
          })}
        >
          <View className="bg-error/10 rounded-xl p-2">
            <IconSymbol name="trash.fill" size={18} color={colors.error} />
          </View>
        </Pressable>
      </View>
      <View className="mt-3">
        <View className="bg-primary/10 rounded-xl px-3 py-1.5 self-start">
          <Text className="text-primary text-xs font-semibold">
            {item.category}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="px-5 pt-6">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-5">
          <View>
            <Text className="text-2xl font-bold text-foreground">
              My Medicines
            </Text>
            <Text className="text-muted text-sm mt-0.5">
              {medicines.length} medication{medicines.length !== 1 ? "s" : ""} tracked
            </Text>
          </View>
          {medicines.length > 0 && (
            <Pressable
              onPress={() => {
                triggerHaptic();
                handleClearAll();
              }}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <IconSymbol name="trash.fill" size={22} color={colors.error} />
            </Pressable>
          )}
        </View>

        {medicines.length === 0 ? (
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
              No Medications Yet
            </Text>
            <Text className="text-muted text-sm text-center px-10 mb-4">
              Add medicines to start tracking and checking for interactions
            </Text>
            <Pressable
              onPress={() => {
                triggerHaptic();
                router.push("/add-medicine");
              }}
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <LinearGradient
                colors={["#0EA5E9", "#6366F1"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="rounded-2xl px-6 py-3 flex-row items-center gap-2"
                style={{ elevation: 4 }}
              >
                <IconSymbol name="plus.circle.fill" size={18} color="#FFFFFF" />
                <Text className="text-white font-bold text-sm">
                  Add Medicine
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={medicines}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </ScreenContainer>
  );
}
