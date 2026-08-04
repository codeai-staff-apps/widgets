import akasaka from './assets/37231-akasaka.jpg';
import wheatField from './assets/436535-wheat-field-with-cypresses.jpg';
import quail from './assets/45734-quail-and-millet.jpg';
import coffin from './assets/546303-coffin-of-ukhhotep.jpg';
import temple from './assets/786829-temple-of-solomon.jpg';
import breadPlate from './assets/1000-bread-plate.jpg';

export interface Artwork {
  objectID: number;
  title: string;
  artistDisplayName: string;
  objectDate: string;
  medium: string;
  dimensions: string;
  classification: string;
  objectName: string;
  department: string;
  culture: string;
  period: string;
  dynasty: string;
  country: string;
  region: string;
  /** Vendored Met "web-large" file. The Met publishes these under CC0. */
  image: string;
  objectURL: string;
  keywords: readonly string[];
}

/**
 * The whole catalogue. Six real Met open-access records, standing in for a
 * search API so the app can teach the search-then-lookup shape with no
 * network. Blank fields are blank in the museum's own record and render as
 * "Not specified".
 */
export const COLLECTION: readonly Artwork[] = [
  {
    objectID: 436535,
    title: 'Wheat Field with Cypresses',
    artistDisplayName: 'Vincent van Gogh',
    objectDate: '1889',
    medium: 'Oil on canvas',
    dimensions: '28 7/8 x 36 3/4 in. (73.2 x 93.4 cm)',
    classification: 'Paintings',
    objectName: 'Painting',
    department: 'European Paintings',
    culture: '',
    period: '',
    dynasty: '',
    country: '',
    region: '',
    image: wheatField,
    objectURL: 'https://www.metmuseum.org/art/collection/search/436535',
    keywords: [
      'painting',
      'landscape',
      'post-impressionism',
      'dutch',
      'france',
      'cypress',
      'wheat',
      'van gogh',
    ],
  },
  {
    objectID: 45734,
    title: 'Quail and Millet',
    artistDisplayName: 'Kiyohara Yukinobu',
    objectDate: 'Edo period (1615–1868)',
    medium: 'Hanging scroll; ink and color on silk',
    dimensions: '',
    classification: 'Paintings',
    objectName: 'Hanging scroll',
    department: 'Asian Art',
    culture: 'Japan',
    period: 'Edo period (1615–1868)',
    dynasty: '',
    country: 'Japan',
    region: '',
    image: quail,
    objectURL: 'https://www.metmuseum.org/art/collection/search/45734',
    keywords: ['painting', 'japan', 'japanese', 'scroll', 'bird', 'edo', 'asian art'],
  },
  {
    objectID: 37231,
    title: 'Akasaka',
    artistDisplayName: 'Utagawa Hiroshige',
    objectDate: 'Edo period (1615–1868)',
    medium: 'Woodblock print; ink and color on paper',
    dimensions: '8 3/4 x 13 3/4 in. (22.2 x 34.9 cm)',
    classification: 'Prints',
    objectName: 'Print',
    department: 'Asian Art',
    culture: 'Japan',
    period: 'Edo period (1615–1868)',
    dynasty: '',
    country: 'Japan',
    region: '',
    image: akasaka,
    objectURL: 'https://www.metmuseum.org/art/collection/search/37231',
    keywords: ['print', 'japan', 'japanese', 'woodblock', 'hiroshige', 'edo', 'asian art'],
  },
  {
    objectID: 1000,
    title: 'Bread Plate',
    artistDisplayName: '',
    objectDate: '1785–90',
    medium: 'Porcelain',
    dimensions: '',
    classification: 'Ceramics',
    objectName: 'Bread plate',
    department: 'The American Wing',
    culture: 'Chinese, for American market',
    period: '',
    dynasty: '',
    country: '',
    region: '',
    image: breadPlate,
    objectURL: 'https://www.metmuseum.org/art/collection/search/1000',
    keywords: ['porcelain', 'plate', 'ceramics', 'chinese', 'american wing', 'export'],
  },
  {
    objectID: 786829,
    title: 'Architectural Model of the Temple of King Solomon in Jerusalem',
    artistDisplayName: 'Thomas Newberry',
    objectDate: '1883',
    medium: 'Gilded wood, gilded carton pierre; gilded silver, gilded bronze; enamel, linen',
    dimensions: 'Temple alone: H. 26 in. (66 cm); W. 46 in. (117 cm); D. 48 in. (122 cm)',
    classification: '',
    objectName: 'Architectural Model',
    department: 'European Sculpture and Decorative Arts',
    culture: '',
    period: '',
    dynasty: '',
    country: '',
    region: '',
    image: temple,
    objectURL: 'https://www.metmuseum.org/art/collection/search/786829',
    keywords: ['model', 'architecture', 'temple', 'jerusalem', 'sculpture', 'decorative arts'],
  },
  {
    objectID: 546303,
    title: 'Coffin of Ukhhotep, son of Hedjpu',
    artistDisplayName: '',
    objectDate: 'ca. 1981–1802 B.C.',
    medium: 'Wood (Abies sp. or Cedrus sp.)',
    dimensions: 'Box: L. 213.6 cm (84 1/8 in); W. 56 cm (22 1/16 in); H. 58 cm (22 13/16 in)',
    classification: '',
    objectName: 'Coffin',
    department: 'Egyptian Art',
    culture: 'Egyptian',
    period: 'Middle Kingdom',
    dynasty: 'Dynasty 12',
    country: 'Egypt',
    region: 'Middle Egypt, Meir',
    image: coffin,
    objectURL: 'https://www.metmuseum.org/art/collection/search/546303',
    keywords: ['egypt', 'egyptian', 'coffin', 'ancient', 'middle kingdom', 'wood', 'tomb'],
  },
];
