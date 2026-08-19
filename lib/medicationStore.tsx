/**
 * Medication Store — Context + AsyncStorage persistence
 */
import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Medicine } from "./drugDatabase";

const STORAGE_KEY = "@medcheck_medications";

type Action =
  | { type: "LOAD"; payload: Medicine[] }
  | { type: "ADD"; payload: Medicine }
  | { type: "UPDATE"; payload: Medicine }
  | { type: "REMOVE"; payload: string }
  | { type: "CLEAR_ALL" };

function medicationReducer(state: Medicine[], action: Action): Medicine[] {
  switch (action.type) {
    case "LOAD": return action.payload;
    case "ADD": return [...state, action.payload];
    case "UPDATE": return state.map((m) => m.id === action.payload.id ? action.payload : m);
    case "REMOVE": return state.filter((m) => m.id !== action.payload);
    case "CLEAR_ALL": return [];
    default: return state;
  }
}

interface MedicationContextType {
  medicines: Medicine[];
  addMedicine: (medicine: Omit<Medicine, "id" | "addedDate">) => void;
  updateMedicine: (medicine: Medicine) => void;
  removeMedicine: (id: string) => void;
  clearAll: () => void;
  isLoading: boolean;
}

const MedicationContext = createContext<MedicationContextType | null>(null);

function generateId(): string {
  return `med_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function MedicationProvider({ children }: { children: React.ReactNode }) {
  const [medicines, dispatch] = useReducer(medicationReducer, []);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) dispatch({ type: "LOAD", payload: JSON.parse(stored) });
      } catch (e) { console.error("Failed to load medications:", e); }
      finally { setIsLoading(false); }
    })();
  }, []);

  const saveToStorage = useCallback(async (meds: Medicine[]) => {
    try { await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(meds)); }
    catch (e) { console.error("Failed to save:", e); }
  }, []);

  useEffect(() => { if (!isLoading) saveToStorage(medicines); }, [medicines, isLoading, saveToStorage]);

  const addMedicine = useCallback((medicine: Omit<Medicine, "id" | "addedDate">) => {
    dispatch({ type: "ADD", payload: { ...medicine, id: generateId(), addedDate: new Date().toISOString() } });
  }, []);

  const updateMedicine = useCallback((medicine: Medicine) => { dispatch({ type: "UPDATE", payload: medicine }); }, []);
  const removeMedicine = useCallback((id: string) => { dispatch({ type: "REMOVE", payload: id }); }, []);
  const clearAll = useCallback(() => { dispatch({ type: "CLEAR_ALL" }); }, []);

  return (
    <MedicationContext.Provider value={{ medicines, addMedicine, updateMedicine, removeMedicine, clearAll, isLoading }}>
      {children}
    </MedicationContext.Provider>
  );
}

export function useMedications() {
  const context = useContext(MedicationContext);
  if (!context) throw new Error("useMedications must be used within MedicationProvider");
  return context;
}
