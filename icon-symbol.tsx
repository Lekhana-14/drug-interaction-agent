// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type MappedIconName = ComponentProps<typeof MaterialIcons>["name"];

const MAPPING: Record<string, MappedIconName> = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "magnifyingglass": "search",
  "plus.circle.fill": "add-circle",
  "camera.fill": "camera-alt",
  "pills.fill": "medication",
  "person.fill": "person",
  "shield.fill": "verified",
  "xmark.circle.fill": "cancel",
  "checkmark.circle.fill": "check-circle",
  "checkmark.seal.fill": "verified",
  "exclamationmark.triangle.fill": "warning",
  "xmark.circle": "cancel",
  "sparkles": "auto-awesome",
  "doc.text.fill": "description",
  "square.and.arrow.up": "share",
  "trash.fill": "delete",
  "heart.fill": "favorite",
  "star.fill": "star",
  "bolt.fill": "bolt",
  "bell.fill": "notifications",
  "clock.fill": "access-time",
  "cross.case.fill": "local-hospital",
  "brain.head.profile": "psychology",
  "stethoscope": "medical-services",
  "pill.fill": "medication",
  "circle": "radio-button-unchecked",
  "info.circle.fill": "info",
  "arrow.right.circle.fill": "arrow-right-alt",
  "waveform.path.ecg.rectangle.fill": "monitor-heart",
  "heart.text.square.fill": "health-and-safety",
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: SymbolViewProps["name"];
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const iconName = MAPPING[name] || "help";
  return <MaterialIcons color={color} size={size} name={iconName} style={style} />;
}
