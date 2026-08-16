/**
 * «Ζωντανά γεγονότα» του παγκόσμιου χάρτη: εμφανίζονται τυχαία σε
 * πραγματικές γεωγραφικές θέσεις· το πάτημα ανοίγει μίνι-πρόκληση
 * για τη χώρα τους και ξεκλειδώνει τη φιγούρα της αν απαντηθεί σωστά.
 */

export interface MapEvent {
  id: string;
  emoji: string;
  /** Γεωγραφικό μήκος/πλάτος (lon, lat) — προβάλλονται στον χάρτη */
  lon: number;
  lat: number;
  iso2: string;
  textGreek: string;
}

export const MAP_EVENTS: MapEvent[] = [
  { id: 'balloon', emoji: '🎈', lon: -55, lat: -10, iso2: 'br', textGreek: 'Ένα αερόστατο πετάει πάνω από τη Βραζιλία!' },
  { id: 'ship', emoji: '🚢', lon: 24.5, lat: 36.2, iso2: 'gr', textGreek: 'Ένα καράβι ταξιδεύει στο Αιγαίο!' },
  { id: 'panda', emoji: '🐼', lon: 103, lat: 31, iso2: 'cn', textGreek: 'Ένα πάντα μασουλάει μπαμπού στην Κίνα!' },
  { id: 'kangaroo', emoji: '🦘', lon: 135, lat: -25, iso2: 'au', textGreek: 'Ένα καγκουρό χοροπηδάει στην Αυστραλία!' },
  { id: 'lion', emoji: '🦁', lon: 37, lat: 0.6, iso2: 'ke', textGreek: 'Ένα λιοντάρι βρυχάται στη σαβάνα της Κένυας!' },
  { id: 'camel', emoji: '🐫', lon: 28, lat: 26, iso2: 'eg', textGreek: 'Μια καμήλα περπατάει στην έρημο της Αιγύπτου!' },
  { id: 'penguin', emoji: '🐧', lon: -73, lat: -51, iso2: 'cl', textGreek: 'Ένας πιγκουίνος κάνει βόλτα στην παγωμένη Χιλή!' },
  { id: 'elephant', emoji: '🐘', lon: 78, lat: 22, iso2: 'in', textGreek: 'Ένας ελέφαντας κάνει μπάνιο στην Ινδία!' },
  { id: 'snowman', emoji: '⛄', lon: -110, lat: 60, iso2: 'ca', textGreek: 'Ένας χιονάνθρωπος χαμογελά στον Καναδά!' },
  { id: 'volcano', emoji: '🌋', lon: -18.5, lat: 64.8, iso2: 'is', textGreek: 'Ένα ηφαίστειο καπνίζει στην Ισλανδία!' },
  { id: 'torii', emoji: '⛩️', lon: 138, lat: 36.5, iso2: 'jp', textGreek: 'Μια κόκκινη πύλη λάμπει στην Ιαπωνία!' },
  { id: 'rocket', emoji: '🚀', lon: -80.6, lat: 28.5, iso2: 'us', textGreek: 'Ένας πύραυλος εκτοξεύεται από τις ΗΠΑ!' },
  { id: 'football', emoji: '⚽', lon: -64, lat: -34.5, iso2: 'ar', textGreek: 'Μια μπάλα ποδοσφαίρου σκάει γκολ στην Αργεντινή!' },
  { id: 'castle', emoji: '🏰', lon: 10.3, lat: 49, iso2: 'de', textGreek: 'Ένα παραμυθένιο κάστρο ξεπροβάλλει στη Γερμανία!' },
  { id: 'parrot', emoji: '🦜', lon: -73, lat: 4, iso2: 'co', textGreek: 'Ένας παπαγάλος τραγουδά στην Κολομβία!' },
  { id: 'reindeer', emoji: '🦌', lon: 26, lat: 66, iso2: 'fi', textGreek: 'Ένας τάρανδος καλπάζει στη Φινλανδία!' },
  { id: 'pizza', emoji: '🍕', lon: 12.5, lat: 42.5, iso2: 'it', textGreek: 'Μια πίτσα μοσχοβολάει στην Ιταλία!' },
];
