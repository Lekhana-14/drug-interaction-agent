/**
 * Drug Interaction Database
 * A curated reference dataset of common medicines and their documented interactions.
 */

export type Severity = "severe" | "moderate" | "mild";

export interface DrugInfo {
  name: string;
  category: string;
  commonUses: string;
}

export interface InteractionEntry {
  drug1: string;
  drug2: string;
  severity: Severity;
  mechanism: string;
  description: string;
  recommendation: string;
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  doctor: string;
  category: string;
  addedDate: string;
  prescriptionPhoto?: string;
}

export const DRUG_INFO: Record<string, DrugInfo> = {
  "Aspirin": { name: "Aspirin", category: "NSAID / Antiplatelet", commonUses: "Pain relief, blood thinning" },
  "Warfarin": { name: "Warfarin", category: "Anticoagulant", commonUses: "Prevents blood clots" },
  "Paracetamol": { name: "Paracetamol", category: "Analgesic", commonUses: "Pain and fever relief" },
  "Ibuprofen": { name: "Ibuprofen", category: "NSAID", commonUses: "Pain, inflammation, fever" },
  "Metformin": { name: "Metformin", category: "Antidiabetic", commonUses: "Type 2 diabetes management" },
  "Insulin": { name: "Insulin", category: "Antidiabetic", commonUses: "Diabetes blood sugar control" },
  "Lisinopril": { name: "Lisinopril", category: "ACE Inhibitor", commonUses: "Hypertension, heart failure" },
  "Amlodipine": { name: "Amlodipine", category: "Calcium Channel Blocker", commonUses: "Hypertension, angina" },
  "Metoprolol": { name: "Metoprolol", category: "Beta Blocker", commonUses: "Hypertension, angina, heart failure" },
  "Atorvastatin": { name: "Atorvastatin", category: "Statin", commonUses: "Cholesterol reduction" },
  "Simvastatin": { name: "Simvastatin", category: "Statin", commonUses: "Cholesterol reduction" },
  "Omeprazole": { name: "Omeprazole", category: "Proton Pump Inhibitor", commonUses: "Acid reflux, GERD, ulcers" },
  "Pantoprazole": { name: "Pantoprazole", category: "Proton Pump Inhibitor", commonUses: "Acid reflux, GERD" },
  "Amoxicillin": { name: "Amoxicillin", category: "Antibiotic (Penicillin)", commonUses: "Bacterial infections" },
  "Ciprofloxacin": { name: "Ciprofloxacin", category: "Antibiotic (Fluoroquinolone)", commonUses: "Bacterial infections" },
  "Doxycycline": { name: "Doxycycline", category: "Antibiotic (Tetracycline)", commonUses: "Bacterial infections, acne" },
  "Azithromycin": { name: "Azithromycin", category: "Antibiotic (Macrolide)", commonUses: "Bacterial infections" },
  "Clopidogrel": { name: "Clopidogrel", category: "Antiplatelet", commonUses: "Prevents blood clots" },
  "Heparin": { name: "Heparin", category: "Anticoagulant", commonUses: "Prevents blood clots" },
  "Diclofenac": { name: "Diclofenac", category: "NSAID", commonUses: "Pain, inflammation" },
  "Naproxen": { name: "Naproxen", category: "NSAID", commonUses: "Pain, inflammation" },
  "Prednisolone": { name: "Prednisolone", category: "Corticosteroid", commonUses: "Inflammation, immune suppression" },
  "Furosemide": { name: "Furosemide", category: "Loop Diuretic", commonUses: "Fluid retention, edema" },
  "Spironolactone": { name: "Spironolactone", category: "Potassium-sparing Diuretic", commonUses: "Fluid retention, hypertension" },
  "Digoxin": { name: "Digoxin", category: "Cardiac Glycoside", commonUses: "Heart failure, atrial fibrillation" },
  "Theophylline": { name: "Theophylline", category: "Bronchodilator", commonUses: "Asthma, COPD" },
  "Levothyroxine": { name: "Levothyroxine", category: "Thyroid Hormone", commonUses: "Hypothyroidism" },
  "Alprazolam": { name: "Alprazolam", category: "Benzodiazepine", commonUses: "Anxiety, panic disorder" },
  "Tramadol": { name: "Tramadol", category: "Opioid Analgesic", commonUses: "Moderate to severe pain" },
  "Fluoxetine": { name: "Fluoxetine", category: "SSRI Antidepressant", commonUses: "Depression, anxiety" },
  "Sertraline": { name: "Sertraline", category: "SSRI Antidepressant", commonUses: "Depression, anxiety" },
  "Venlafaxine": { name: "Venlafaxine", category: "SNRI Antidepressant", commonUses: "Depression, anxiety" },
  "Carbamazepine": { name: "Carbamazepine", category: "Anticonvulsant", commonUses: "Epilepsy, neuropathic pain" },
  "Phenytoin": { name: "Phenytoin", category: "Anticonvulsant", commonUses: "Epilepsy" },
  "Methotrexate": { name: "Methotrexate", category: "Immunosuppressant", commonUses: "Rheumatoid arthritis, cancer" },
  "Cyclosporine": { name: "Cyclosporine", category: "Immunosuppressant", commonUses: "Organ transplant, autoimmune" },
  "Lithium": { name: "Lithium", category: "Mood Stabilizer", commonUses: "Bipolar disorder" },
  "Losartan": { name: "Losartan", category: "ARB (Angiotensin Receptor Blocker)", commonUses: "Hypertension" },
  "Ramipril": { name: "Ramipril", category: "ACE Inhibitor", commonUses: "Hypertension, heart failure" },
  "Carvedilol": { name: "Carvedilol", category: "Beta Blocker", commonUses: "Heart failure, hypertension" },
  "Rosuvastatin": { name: "Rosuvastatin", category: "Statin", commonUses: "Cholesterol reduction" },
  "Clarithromycin": { name: "Clarithromycin", category: "Antibiotic (Macrolide)", commonUses: "Bacterial infections" },
  "Erythromycin": { name: "Erythromycin", category: "Antibiotic (Macrolide)", commonUses: "Bacterial infections" },
  "Gliclazide": { name: "Gliclazide", category: "Sulfonylurea (Antidiabetic)", commonUses: "Type 2 diabetes" },
  "Glimepiride": { name: "Glimepiride", category: "Sulfonylurea (Antidiabetic)", commonUses: "Type 2 diabetes" },
  "Sitagliptin": { name: "Sitagliptin", category: "DPP-4 Inhibitor", commonUses: "Type 2 diabetes" },
  "Empagliflozin": { name: "Empagliflozin", category: "SGLT2 Inhibitor", commonUses: "Type 2 diabetes, heart failure" },
  "Gabapentin": { name: "Gabapentin", category: "Anticonvulsant", commonUses: "Neuropathic pain, epilepsy" },
  "Pregabalin": { name: "Pregabalin", category: "Anticonvulsant", commonUses: "Neuropathic pain, anxiety" },
  "Montelukast": { name: "Montelukast", category: "Leukotriene Receptor Antagonist", commonUses: "Asthma, allergies" },
};

export const INTERACTIONS: InteractionEntry[] = [
  // SEVERE
  { drug1: "Aspirin", drug2: "Warfarin", severity: "severe", mechanism: "Additive anticoagulant + antiplatelet effect", description: "Combined use significantly increases the risk of major bleeding, including GI and intracranial hemorrhage. Aspirin's antiplatelet effect combined with Warfarin's anticoagulation creates dangerous synergy.", recommendation: "Avoid combination unless specifically prescribed with close INR monitoring." },
  { drug1: "Warfarin", drug2: "Clopidogrel", severity: "severe", mechanism: "Dual antithrombotic therapy increases bleeding risk", description: "Dual therapy with Warfarin and Clopidogrel significantly increases bleeding risk.", recommendation: "Only use under strict cardiology supervision." },
  { drug1: "Warfarin", drug2: "Heparin", severity: "severe", mechanism: "Additive anticoagulant effect", description: "Concurrent use of two anticoagulants dramatically increases hemorrhage risk.", recommendation: "Only under strict clinical supervision." },
  { drug1: "Metformin", drug2: "Insulin", severity: "severe", mechanism: "Additive hypoglycemic effect", description: "Combined use can cause severe hypoglycemia leading to confusion, seizures, or loss of consciousness.", recommendation: "Requires careful blood glucose monitoring by a diabetologist." },
  { drug1: "Methotrexate", drug2: "Ibuprofen", severity: "severe", mechanism: "NSAID reduces renal clearance of Methotrexate", description: "Ibuprofen reduces renal clearance of Methotrexate, leading to toxic levels. Can cause bone marrow suppression, hepatotoxicity, and renal failure.", recommendation: "Avoid NSAIDs when taking Methotrexate. Use Paracetamol instead." },
  { drug1: "Fluoxetine", drug2: "Tramadol", severity: "severe", mechanism: "Serotonin syndrome risk", description: "Both drugs increase serotonin levels. Combined use can trigger serotonin syndrome — high fever, rapid heart rate, muscle rigidity, and seizures.", recommendation: "Avoid this combination. Consult psychiatrist for alternatives." },
  { drug1: "Sertraline", drug2: "Tramadol", severity: "severe", mechanism: "Serotonin syndrome risk", description: "SSRI + Tramadol can trigger serotonin syndrome.", recommendation: "Avoid combination. Use alternative analgesics." },
  { drug1: "Lisinopril", drug2: "Losartan", severity: "severe", mechanism: "Dual RAS blockade — hyperkalemia and renal impairment", description: "Combining ACE inhibitors with ARBs provides no additional benefit but significantly increases risk of hyperkalemia, renal failure, and hypotension.", recommendation: "Do not combine ACE inhibitors and ARBs. Use one or the other." },
  { drug1: "Lithium", drug2: "Ibuprofen", severity: "severe", mechanism: "NSAIDs reduce lithium renal clearance", description: "Ibuprofen reduces renal excretion of Lithium, leading to toxicity. Symptoms include tremor, confusion, ataxia, and renal failure.", recommendation: "Avoid NSAIDs when taking Lithium. Use Paracetamol." },
  { drug1: "Digoxin", drug2: "Furosemide", severity: "severe", mechanism: "Furosemide-induced hypokalemia increases digoxin toxicity", description: "Furosemide causes potassium loss, increasing heart's sensitivity to Digoxin. Can lead to dangerous arrhythmias.", recommendation: "Monitor potassium levels closely. Potassium supplements may be needed." },
  { drug1: "Ciprofloxacin", drug2: "Theophylline", severity: "severe", mechanism: "CYP1A2 inhibition increases theophylline levels", description: "Ciprofloxacin inhibits metabolism of Theophylline, leading to toxic levels that can cause seizures and cardiac arrhythmias.", recommendation: "Avoid this combination. Use alternative antibiotics." },
  { drug1: "Cyclosporine", drug2: "Rosuvastatin", severity: "severe", mechanism: "Immunosuppressant dramatically increases statin levels", description: "Cyclosporine can increase Rosuvastatin levels 5-10 fold, leading to severe myopathy and rhabdomyolysis.", recommendation: "Avoid this combination." },
  { drug1: "Methotrexate", drug2: "Naproxen", severity: "severe", mechanism: "NSAID reduces renal clearance of Methotrexate", description: "Naproxen reduces renal clearance of Methotrexate, increasing toxicity risk.", recommendation: "Avoid NSAIDs with Methotrexate." },
  { drug1: "Lithium", drug2: "Naproxen", severity: "severe", mechanism: "NSAIDs reduce lithium renal clearance", description: "Naproxen increases lithium blood levels to toxic range.", recommendation: "Avoid NSAIDs with Lithium." },
  { drug1: "Cyclosporine", drug2: "Ibuprofen", severity: "severe", mechanism: "Additive nephrotoxicity", description: "Both are nephrotoxic — combined use can lead to acute kidney injury.", recommendation: "Avoid NSAIDs with Cyclosporine." },

  // MODERATE
  { drug1: "Warfarin", drug2: "Ibuprofen", severity: "moderate", mechanism: "NSAID increases bleeding risk + GI ulceration", description: "Ibuprofen increases anticoagulant effect of Warfarin and independently irritates stomach lining.", recommendation: "Use Paracetamol instead. If NSAID necessary, use lowest dose with GI protection." },
  { drug1: "Warfarin", drug2: "Paracetamol", severity: "moderate", mechanism: "High-dose paracetamol may potentiate warfarin", description: "Regular Paracetamol (>2g/day) can increase INR and bleeding risk.", recommendation: "Occasional use OK. Monitor INR if regular use exceeds 2g/day." },
  { drug1: "Lisinopril", drug2: "Spironolactone", severity: "moderate", mechanism: "Both increase potassium — hyperkalemia risk", description: "ACE inhibitors and potassium-sparing diuretics both increase serum potassium. Risk of dangerous heart rhythm disturbances.", recommendation: "Can be used together with regular potassium monitoring." },
  { drug1: "Metoprolol", drug2: "Amlodipine", severity: "moderate", mechanism: "Additive hypotensive and bradycardic effects", description: "Both lower heart rate and blood pressure. May cause excessive bradycardia.", recommendation: "Common combination but requires careful dose titration." },
  { drug1: "Atorvastatin", drug2: "Clarithromycin", severity: "moderate", mechanism: "CYP3A4 inhibition increases statin levels", description: "Clarithromycin increases Atorvastatin levels and risk of muscle toxicity.", recommendation: "Temporarily stop statin during antibiotic course." },
  { drug1: "Simvastatin", drug2: "Clarithromycin", severity: "moderate", mechanism: "CYP3A4 inhibition — increased statin levels", description: "Clarithromycin significantly increases Simvastatin levels.", recommendation: "Stop Simvastatin during antibiotic course." },
  { drug1: "Omeprazole", drug2: "Clopidogrel", severity: "moderate", mechanism: "PPI inhibits CYP2C19, reducing Clopidogrel activation", description: "Omeprazole reduces Clopidogrel effectiveness, potentially increasing cardiovascular risk.", recommendation: "Use Pantoprazole instead if PPI needed with Clopidogrel." },
  { drug1: "Aspirin", drug2: "Ibuprofen", severity: "moderate", mechanism: "Ibuprofen may reduce aspirin's antiplatelet effect", description: "Ibuprofen interferes with Aspirin's cardioprotective antiplatelet effect.", recommendation: "Take Aspirin 2 hours before or 8 hours after Ibuprofen." },
  { drug1: "Prednisolone", drug2: "Ibuprofen", severity: "moderate", mechanism: "Additive GI ulceration risk", description: "Both irritate stomach lining. Combined use significantly increases GI bleeding risk.", recommendation: "Use gastroprotective agent (PPI) if both necessary." },
  { drug1: "Ramipril", drug2: "Lisinopril", severity: "moderate", mechanism: "Duplicate ACE inhibitor therapy", description: "Two ACE inhibitors should not be used together.", recommendation: "Use only one ACE inhibitor." },
  { drug1: "Fluoxetine", drug2: "Venlafaxine", severity: "moderate", mechanism: "Serotonin syndrome risk from dual serotonergic drugs", description: "Combining two antidepressants increases serotonin syndrome risk.", recommendation: "Do not combine without psychiatrist supervision." },
  { drug1: "Gabapentin", drug2: "Pregabalin", severity: "moderate", mechanism: "Duplicate gabapentinoid therapy", description: "Both act on same target — no additional benefit, increased side effects.", recommendation: "Use one or the other." },
  { drug1: "Doxycycline", drug2: "Warfarin", severity: "moderate", mechanism: "Doxycycline may enhance anticoagulant effect", description: "Doxycycline can enhance Warfarin's effect, increasing bleeding risk.", recommendation: "Monitor INR during and after antibiotic course." },

  // MILD
  { drug1: "Metformin", drug2: "Gliclazide", severity: "mild", mechanism: "Complementary antidiabetic action", description: "Commonly combined for Type 2 diabetes. Risk of mild hypoglycemia.", recommendation: "Standard combination — monitor blood glucose." },
  { drug1: "Lisinopril", drug2: "Amlodipine", severity: "mild", mechanism: "Additive blood pressure lowering", description: "Commonly combined for hypertension. Generally well-tolerated.", recommendation: "Standard combination — monitor blood pressure." },
  { drug1: "Omeprazole", drug2: "Aspirin", severity: "mild", mechanism: "PPI protects against aspirin-induced GI damage", description: "PPI actually protects against aspirin's GI effects. Safe combination.", recommendation: "Beneficial combination." },
  { drug1: "Atorvastatin", drug2: "Amlodipine", severity: "mild", mechanism: "Mild increase in statin levels", description: "Commonly prescribed together in cardiovascular patients.", recommendation: "Standard combination — safe at usual doses." },
  { drug1: "Lisinopril", drug2: "Furosemide", severity: "mild", mechanism: "Additive blood pressure reduction", description: "Commonly used together in heart failure.", recommendation: "Standard combination — monitor blood pressure." },
  { drug1: "Alprazolam", drug2: "Tramadol", severity: "mild", mechanism: "Additive CNS depression", description: "Both cause drowsiness. Combined use may increase sedation.", recommendation: "Avoid activities requiring alertness." },
  { drug1: "Levothyroxine", drug2: "Omeprazole", severity: "mild", mechanism: "PPI may reduce levothyroxine absorption", description: "PPIs can reduce absorption of Levothyroxine.", recommendation: "Separate doses by at least 4 hours." },
  { drug1: "Fluoxetine", drug2: "Sertraline", severity: "moderate", mechanism: "Duplicate SSRI therapy", description: "Two SSRIs should not be used together.", recommendation: "Use only one SSRI." },
  { drug1: "Lithium", drug2: "Furosemide", severity: "moderate", mechanism: "Diuretic-induced fluid changes alter lithium levels", description: "Furosemide can cause dehydration, increasing Lithium reabsorption.", recommendation: "Monitor lithium levels closely." },
  { drug1: "Metoprolol", drug2: "Carvedilol", severity: "moderate", mechanism: "Duplicate beta-blocker therapy", description: "Two beta blockers simultaneously — no additional benefit.", recommendation: "Use only one beta blocker." },
  { drug1: "Azithromycin", drug2: "Simvastatin", severity: "mild", mechanism: "Potential CYP3A4 interaction", description: "Azithromycin may slightly increase statin levels.", recommendation: "Generally safe but monitor for muscle pain." },
  { drug1: "Metformin", drug2: "Sitagliptin", severity: "mild", mechanism: "Complementary antidiabetic mechanism", description: "Standard combination for Type 2 diabetes.", recommendation: "Well-tolerated combination." },
  { drug1: "Gliclazide", drug2: "Insulin", severity: "moderate", mechanism: "Additive hypoglycemic effect", description: "Sulfonylurea + Insulin increases risk of hypoglycemia.", recommendation: "Monitor blood glucose closely." },
  { drug1: "Gabapentin", drug2: "Alprazolam", severity: "mild", mechanism: "Additive CNS depression", description: "Both can cause drowsiness and dizziness.", recommendation: "Use lowest effective doses." },
  { drug1: "Amoxicillin", drug2: "Warfarin", severity: "mild", mechanism: "Antibiotic may alter gut flora affecting vitamin K", description: "Some antibiotics alter gut bacteria producing vitamin K, enhancing Warfarin.", recommendation: "Monitor INR during and after antibiotic course." },
  { drug1: "Pregabalin", drug2: "Alprazolam", severity: "mild", mechanism: "Additive CNS depression", description: "Both drugs cause sedation.", recommendation: "Lowest doses, avoid alcohol." },
];

export const ALL_DRUG_NAMES: string[] = Object.keys(DRUG_INFO);

export function getDrugInfo(name: string): DrugInfo | undefined {
  if (DRUG_INFO[name]) return DRUG_INFO[name];
  const lower = name.toLowerCase();
  const exact = Object.entries(DRUG_INFO).find(([k]) => k.toLowerCase() === lower);
  if (exact) return exact[1];
  const matches = fuzzyMatchDrug(name, 2);
  if (matches.length > 0 && matches[0].distance <= 2) return DRUG_INFO[matches[0].name];
  return undefined;
}

export function getInteraction(drug1: string, drug2: string): InteractionEntry | undefined {
  const d1 = drug1.toLowerCase().trim();
  const d2 = drug2.toLowerCase().trim();
  return INTERACTIONS.find(
    (e) => (e.drug1.toLowerCase() === d1 && e.drug2.toLowerCase() === d2) ||
           (e.drug1.toLowerCase() === d2 && e.drug2.toLowerCase() === d1)
  );
}

export function checkAllInteractions(medicines: { name: string }[]): InteractionEntry[] {
  const results: InteractionEntry[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < medicines.length; i++) {
    for (let j = i + 1; j < medicines.length; j++) {
      const interaction = getInteraction(medicines[i].name, medicines[j].name);
      if (interaction) {
        const key = [interaction.drug1, interaction.drug2].sort().join("|");
        if (!seen.has(key)) { seen.add(key); results.push(interaction); }
      }
    }
  }
  return results;
}

export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) matrix[i][j] = matrix[i - 1][j - 1];
      else matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
    }
  }
  return matrix[b.length][a.length];
}

export function fuzzyMatchDrug(input: string, maxDistance: number = 3): { name: string; distance: number }[] {
  const normalized = input.trim();
  if (!normalized) return [];
  const results = ALL_DRUG_NAMES.map((name) => ({
    name, distance: levenshteinDistance(normalized.toLowerCase(), name.toLowerCase()),
  }));
  return results.filter((r) => r.distance <= maxDistance).sort((a, b) => a.distance - b.distance).slice(0, 5);
}
