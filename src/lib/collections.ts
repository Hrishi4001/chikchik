/** Lighter collections: one source for shop filters, navigation, sitemap and per-collection SEO. */
export interface Collection {
  id: string;
  label: string;
  /** Page heading on the shop page */
  heading: string;
  /** <title> without the brand suffix */
  seoTitle: string;
  /** Meta description, kept under ~160 characters */
  description: string;
  /** Short intro paragraph shown under the heading */
  intro: string;
}

export const ALL_COLLECTION: Collection = {
  id: 'all',
  label: 'All',
  heading: 'All Designer Lighters',
  seoTitle: 'Designer Lighters Online in India | Retro Jet & Flip-Top Lighters',
  description: 'Shop designer lighters inspired by vintage Indian matchbox labels. Refillable jet-flame and flip-top lighters, gift-boxed and shipped across India.',
  intro: 'Every Chikchik lighter wears a piece of 90s India: matchbox labels, filmy posters and kirana-shop graphics printed on a solid metal body. Pick one to carry, or a few to collect.'
};

export const COLLECTIONS: Collection[] = [
  {
    id: '90s-nostalgia',
    label: "90's Nostalgia",
    heading: "90's Nostalgia Lighters",
    seoTitle: "90's Nostalgia Lighters | Retro Designer Jet Lighters",
    description: 'Retro designer lighters inspired by 90s India: filmy matchbox labels and bazaar graphics on refillable jet-flame lighters. Gift-boxed, shipped across India.',
    intro: 'Cassette tapes, Sunday Doordarshan and matchboxes from the corner shop. This collection puts those memories on a lighter you can carry every day.'
  },
  {
    id: 'rogg',
    label: 'Rogg',
    heading: 'The Rogg Collection',
    seoTitle: 'Rogg Collection | Bold Matchbox Art Designer Lighters',
    description: 'The Rogg collection: kings, tigers and evil-eye charms from vintage matchbox art on solid metal designer lighters. Gift-boxed, shipped across India.',
    intro: 'Loud colours, big characters and the boldest labels from the matchbox archive. Rogg is for the lighter that gets noticed on every table.'
  }
];

export const SHOP_COLLECTIONS = [ALL_COLLECTION, ...COLLECTIONS];

export const getCollection = (id?: string | null) => SHOP_COLLECTIONS.find((c) => c.id === id) ?? ALL_COLLECTION;
