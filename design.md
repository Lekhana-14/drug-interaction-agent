# Drug Interaction Checker — Mobile App Design

## App Overview
A mobile health-safety application that lets patients photograph prescriptions, stores their full medication history, and warns about dangerous drug-to-drug interactions before harm occurs.

---

## Screen List

### 1. Home Screen (Main Tab)
- **Primary Content**: Welcome header, quick stats (total medicines, active prescriptions count, last check date)
- **Functionality**: Big "Scan Prescription" button (camera), "Add Medicine Manually" button, "Check Interactions" button
- **Layout**: Clean card-based layout with action buttons, a brief status summary at top

### 2. My Medications (Tab 2)
- **Primary Content**: FlatList of all medicines in the patient profile — each shows drug name, dosage, doctor/specialty, date added, and a severity badge
- **Functionality**: Swipe to delete, tap to view details, edit dosage/doctor info
- **Layout**: Full-width list with cards, filter by doctor or category at top

### 3. Scan / Add Prescription Screen (Modal/Navigated)
- **Primary Content**: Camera viewfinder overlay with OCR processing indicator, OR a text input form for manual entry
- **Functionality**: Capture prescription photo → OCR extracts medicine names → fuzzy match against drug database → user confirms/adds each medicine
- **Layout**: Camera takes full screen, results appear as a bottom sheet with checkable medicine items

### 4. Interaction Results Screen (Modal)
- **Primary Content**: Severity-rated interaction cards — each showing the two drugs, severity level (Severe/Moderate/Mild), description, and recommended action
- **Functionality**: Filter by severity, tap for detailed explanation, share report button
- **Layout**: Color-coded cards (red = severe, orange = moderate, yellow = mild), summary header with total count

### 5. Report Screen
- **Primary Content**: Shareable summary — patient medication list, flagged interactions, generated date
- **Functionality**: Share via system share sheet (WhatsApp, email, etc.), copy to clipboard
- **Layout**: Clean formatted document-style view with "Share Report" floating button

### 6. Profile / Settings (Tab 3)
- **Primary Content**: App info, about section, how it works explanation
- **Functionality**: View app credits, clear data, toggle dark mode
- **Layout**: Settings-style grouped list

---

## Key User Flows

### Flow 1: Scan Prescription → Check Interactions
1. User taps "Scan Prescription" on Home
2. Camera opens → user photographs prescription
3. OCR extracts text → fuzzy matching identifies medicines
4. Each identified medicine is added to patient profile
5. Interaction engine runs automatically → results screen shows flagged interactions
6. User can share report with doctor

### Flow 2: Manual Add Medicine → Check Interactions
1. User taps "Add Medicine" on Home
2. Search bar appears → user types medicine name
3. Fuzzy matching suggests matches from drug database
4. User selects drug, enters dosage and doctor info
5. Interaction check runs → results shown

### Flow 3: View & Share Report
1. User taps "Check Interactions" or navigates from results
2. Full report generated with all medications and interactions
3. User taps "Share" → system share sheet opens
4. Report shared with doctor via WhatsApp/email

---

## Color Choices

| Token | Light Mode | Dark Mode | Purpose |
|-------|-----------|-----------|---------|
| `primary` | `#2563EB` (Blue-600) | `#3B82F6` (Blue-500) | Trust, medical, action buttons |
| `background` | `#F8FAFC` | `#0F172A` | Clean clinical feel |
| `foreground` | `#1E293B` | `#F1F5F9` | Primary text |
| `muted` | `#64748B` | `#94A3B8` | Secondary text |
| `surface` | `#FFFFFF` | `#1E293B` | Card backgrounds |
| `border` | `#E2E8F0` | `#334155` | Dividers |
| `success` | `#16A34A` | `#22C55E` | Safe / no interaction |
| `warning` | `#F59E0B` | `#FBBF24` | Moderate interaction |
| `error` | `#DC2626` | `#EF4444` | Severe interaction |
| `severe` | `#DC2626` | `#EF4444` | Custom: severe severity |
| `moderate` | `#EA580C` | `#F97316` | Custom: moderate severity |
| `mild` | `#CA8A04` | `#EAB308` | Custom: mild severity |

## Design Language
- Clean, clinical, trustworthy — inspired by medical apps (Doximity, Epocrates)
- Rounded corners (rounded-2xl), generous spacing, subtle shadows
- Color-coded severity system for instant comprehension
- iOS-first feel with Material Icons fallback for Android/web
