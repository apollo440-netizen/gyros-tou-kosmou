/**
 * Διάσημα μνημεία για τη λειτουργία «Μνημεία του Κόσμου».
 * Κάθε μνημείο δένεται με χώρα μέσω iso2· η εικονογράφηση είναι
 * διαδικαστικό SVG (LandmarkArt) — κανένα εξωτερικό αρχείο.
 */

export interface Landmark {
  id: string;
  iso2: string;
  nameGreek: string;
  /** Πού βρίσκεται (πόλη/περιοχή) — εμφανίζεται στην αποκάλυψη */
  placeGreek?: string;
}

export const LANDMARKS: Landmark[] = [
  { id: 'eiffel', iso2: 'fr', nameGreek: 'Πύργος του Άιφελ', placeGreek: 'Παρίσι' },
  { id: 'colosseum', iso2: 'it', nameGreek: 'Κολοσσαίο', placeGreek: 'Ρώμη' },
  { id: 'acropolis', iso2: 'gr', nameGreek: 'Ακρόπολη', placeGreek: 'Αθήνα' },
  { id: 'greatwall', iso2: 'cn', nameGreek: 'Σινικό Τείχος', placeGreek: 'Κίνα' },
  { id: 'liberty', iso2: 'us', nameGreek: 'Άγαλμα της Ελευθερίας', placeGreek: 'Νέα Υόρκη' },
  { id: 'pyramids', iso2: 'eg', nameGreek: 'Πυραμίδες της Γκίζας', placeGreek: 'Γκίζα' },
  { id: 'bigben', iso2: 'gb', nameGreek: 'Μπιγκ Μπεν', placeGreek: 'Λονδίνο' },
  { id: 'tajmahal', iso2: 'in', nameGreek: 'Ταζ Μαχάλ', placeGreek: 'Άγκρα' },
  { id: 'redeemer', iso2: 'br', nameGreek: 'Χριστός Λυτρωτής', placeGreek: 'Ρίο ντε Τζανέιρο' },
  { id: 'opera', iso2: 'au', nameGreek: 'Όπερα του Σίδνεϊ', placeGreek: 'Σίδνεϊ' },
  { id: 'stbasil', iso2: 'ru', nameGreek: 'Ναός του Αγίου Βασιλείου', placeGreek: 'Μόσχα' },
  { id: 'fuji', iso2: 'jp', nameGreek: 'Όρος Φούτζι', placeGreek: 'Ιαπωνία' },
  { id: 'windmill', iso2: 'nl', nameGreek: 'Ανεμόμυλοι', placeGreek: 'Ολλανδία' },
  { id: 'chichen', iso2: 'mx', nameGreek: 'Τσιτσέν Ιτζά', placeGreek: 'Γιουκατάν' },
  { id: 'machu', iso2: 'pe', nameGreek: 'Μάτσου Πίτσου', placeGreek: 'Άνδεις' },
  { id: 'petra', iso2: 'jo', nameGreek: 'Πέτρα', placeGreek: 'Ιορδανία' },
  { id: 'burj', iso2: 'ae', nameGreek: 'Μπουρτζ Χαλίφα', placeGreek: 'Ντουμπάι' },
  { id: 'hagia', iso2: 'tr', nameGreek: 'Αγία Σοφία', placeGreek: 'Κωνσταντινούπολη' },
  { id: 'brandenburg', iso2: 'de', nameGreek: 'Πύλη του Βρανδεμβούργου', placeGreek: 'Βερολίνο' },
  { id: 'sagrada', iso2: 'es', nameGreek: 'Σαγράδα Φαμίλια', placeGreek: 'Βαρκελώνη' },
  { id: 'cntower', iso2: 'ca', nameGreek: 'Πύργος CN', placeGreek: 'Τορόντο' },
  { id: 'moai', iso2: 'cl', nameGreek: 'Μοάι', placeGreek: 'Νησί του Πάσχα' },
  { id: 'angkor', iso2: 'kh', nameGreek: 'Ανγκόρ Βατ', placeGreek: 'Καμπότζη' },
  { id: 'matterhorn', iso2: 'ch', nameGreek: 'Μάτερχορν', placeGreek: 'Άλπεις' },
];

export const LANDMARKS_BY_ISO2 = new Map<string, Landmark[]>();
for (const lm of LANDMARKS) {
  const list = LANDMARKS_BY_ISO2.get(lm.iso2) ?? [];
  list.push(lm);
  LANDMARKS_BY_ISO2.set(lm.iso2, list);
}

export const LANDMARK_BY_ID = new Map<string, Landmark>(LANDMARKS.map((l) => [l.id, l]));

export function getRandomLandmarkForCountry(iso2: string): Landmark | undefined {
  const list = LANDMARKS_BY_ISO2.get(iso2);
  if (!list || list.length === 0) return undefined;
  return list[Math.floor(Math.random() * list.length)];
}
