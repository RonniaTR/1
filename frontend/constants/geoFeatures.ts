// Interaktif harita üzerindeki coğrafi özellikler (dağ, nehir, göl, ova...).
// Konumlar gerçek enlem/boylam; harita ile aynı projeksiyona `project()` ile oturur.
import { project } from './turkeyMap';

export type FeatureKind = 'mountain' | 'river' | 'lake' | 'plain' | 'city' | 'industry';

export interface GeoFeature {
  id: string;
  kind: FeatureKind;
  name: string;
  subtitle: string;
  lon: number;
  lat: number;
  important?: boolean;
  facts: { label: string; value: string }[];
  note: string;
  questionCount: number;
}

// Her özelliğe göre pin rengi ve ikon (Ionicons adı).
export const KIND_STYLE: Record<FeatureKind, { color: string; icon: string; label: string }> = {
  mountain: { color: '#6b4a34', icon: 'triangle', label: 'Dağlar' },
  river: { color: '#37b6e6', icon: 'water', label: 'Akarsular' },
  lake: { color: '#2f8ee0', icon: 'ellipse', label: 'Göller' },
  plain: { color: '#4aa564', icon: 'leaf', label: 'Ovalar' },
  city: { color: '#7b62d6', icon: 'business', label: 'Şehirler' },
  industry: { color: '#eaa93c', icon: 'construct', label: 'Sanayi' },
};

export const GEO_FEATURES: GeoFeature[] = [
  {
    id: 'agri', kind: 'mountain', name: 'Ağrı Dağı', subtitle: "Türkiye'nin en yüksek dağı",
    lon: 44.298, lat: 39.702, important: true,
    facts: [
      { label: 'Yükseklik', value: '5.137 m' },
      { label: 'Bölge', value: 'Doğu Anadolu' },
      { label: 'İl', value: 'Ağrı / Iğdır' },
      { label: 'Oluşum', value: 'Volkanik' },
    ],
    note: "Doğu Anadolu'da tek başına yükselen volkanik bir dağdır. Ülkemizin en yüksek noktasıdır; Nuh'un Gemisi efsanesiyle de bilinir.",
    questionCount: 21,
  },
  {
    id: 'erciyes', kind: 'mountain', name: 'Erciyes Dağı', subtitle: 'İç Anadolu\'nun sönmüş volkanı',
    lon: 35.45, lat: 38.53,
    facts: [
      { label: 'Yükseklik', value: '3.917 m' },
      { label: 'Bölge', value: 'İç Anadolu' },
      { label: 'İl', value: 'Kayseri' },
      { label: 'Oluşum', value: 'Volkanik' },
    ],
    note: "Kayseri'nin güneyinde yükselen sönmüş bir volkandır. Çevresindeki peribacalarının oluşumunda tüf tabakaları etkilidir.",
    questionCount: 14,
  },
  {
    id: 'kackar', kind: 'mountain', name: 'Kaçkar Dağları', subtitle: 'Karadeniz\'in çatısı',
    lon: 41.16, lat: 40.83,
    facts: [
      { label: 'Yükseklik', value: '3.937 m' },
      { label: 'Bölge', value: 'Karadeniz' },
      { label: 'İl', value: 'Rize / Artvin' },
      { label: 'Oluşum', value: 'Kıvrım (orojenik)' },
    ],
    note: "Doğu Karadeniz'de kıyıya paralel uzanır. Yükseltisi ve buzul aşındırmasıyla oluşan sirk göller ile tanınır; bol yağış alır.",
    questionCount: 11,
  },
  {
    id: 'uludag', kind: 'mountain', name: 'Uludağ', subtitle: 'Bursa\'nın kış turizmi merkezi',
    lon: 29.22, lat: 40.07,
    facts: [
      { label: 'Yükseklik', value: '2.543 m' },
      { label: 'Bölge', value: 'Marmara' },
      { label: 'İl', value: 'Bursa' },
      { label: 'Oluşum', value: 'Kırılma (horst)' },
    ],
    note: "Antik adı Mysia Olimposu'dur. Kırıklı yapısıyla horst niteliğindedir; kış turizmi ve buzul izleriyle önemlidir.",
    questionCount: 8,
  },
  {
    id: 'firat', kind: 'river', name: 'Fırat Nehri', subtitle: 'Türkiye\'nin en uzun akarsuyu',
    lon: 39.22, lat: 38.67,
    facts: [
      { label: 'Uzunluk (TR)', value: '~1.263 km' },
      { label: 'Döküldüğü yer', value: 'Basra Körfezi' },
      { label: 'Kaynak', value: 'Erzurum-Karasu' },
      { label: 'Barajlar', value: 'Keban, Atatürk' },
    ],
    note: "Karasu ve Murat kollarının birleşmesiyle oluşur. GAP kapsamında Atatürk ve Keban barajlarıyla enerji ve sulama sağlar.",
    questionCount: 17,
  },
  {
    id: 'kizilirmak', kind: 'river', name: 'Kızılırmak', subtitle: 'Sınırlarımız içindeki en uzun nehir',
    lon: 34.0, lat: 40.3,
    facts: [
      { label: 'Uzunluk', value: '1.355 km' },
      { label: 'Döküldüğü yer', value: 'Karadeniz' },
      { label: 'Kaynak', value: 'Sivas-Kızıldağ' },
      { label: 'Delta', value: 'Bafra Ovası' },
    ],
    note: "Tamamı Türkiye sınırları içinde kalan en uzun akarsudur. Bir yay çizerek Karadeniz'e dökülür ve Bafra deltasını oluşturur.",
    questionCount: 15,
  },
  {
    id: 'van', kind: 'lake', name: 'Van Gölü', subtitle: 'Türkiye\'nin en büyük gölü',
    lon: 42.9, lat: 38.63, important: true,
    facts: [
      { label: 'Alan', value: '~3.713 km²' },
      { label: 'Bölge', value: 'Doğu Anadolu' },
      { label: 'Su özelliği', value: 'Sodalı (acı)' },
      { label: 'Oluşum', value: 'Set (volkanik)' },
    ],
    note: "Nemrut volkanının lavlarının vadiyi kapatmasıyla oluşan set gölüdür. Suyu sodalıdır; içinde inci kefali yaşar.",
    questionCount: 12,
  },
  {
    id: 'tuz', kind: 'lake', name: 'Tuz Gölü', subtitle: 'İç Anadolu\'nun tuz kaynağı',
    lon: 33.38, lat: 38.72,
    facts: [
      { label: 'Alan', value: '~1.500 km²' },
      { label: 'Bölge', value: 'İç Anadolu' },
      { label: 'Derinlik', value: 'Çok sığ (~1-2 m)' },
      { label: 'Oluşum', value: 'Tektonik çukur' },
    ],
    note: "Kapalı havzada yer alan sığ bir tuz gölüdür. Yazın büyük ölçüde kurur; Türkiye'nin tuz ihtiyacının önemli bölümünü karşılar.",
    questionCount: 9,
  },
  {
    id: 'cukurova', kind: 'plain', name: 'Çukurova', subtitle: 'Türkiye\'nin en büyük deltası',
    lon: 35.3, lat: 36.98,
    facts: [
      { label: 'Bölge', value: 'Akdeniz' },
      { label: 'İl', value: 'Adana / Mersin' },
      { label: 'Oluşum', value: 'Delta ovası' },
      { label: 'Tarım', value: 'Pamuk, narenciye' },
    ],
    note: "Seyhan ve Ceyhan nehirlerinin alüvyonlarıyla oluşmuş verimli delta ovasıdır. Pamuk ve turunçgil üretiminde başı çeker.",
    questionCount: 10,
  },
  {
    id: 'kocaeli', kind: 'industry', name: 'Kocaeli Sanayi Bölgesi', subtitle: 'Türkiye\'nin sanayi kalbi',
    lon: 29.92, lat: 40.77,
    facts: [
      { label: 'Bölge', value: 'Marmara' },
      { label: 'Öne çıkan', value: 'Otomotiv, petrokimya' },
      { label: 'Avantaj', value: 'Liman + ulaşım' },
      { label: 'Nüfus yoğun', value: 'Yüksek' },
    ],
    note: "Ulaşım ağı ve limanları sayesinde otomotiv ve petrokimya sanayisinin yoğunlaştığı bölgedir. İç göç alan illerdendir.",
    questionCount: 7,
  },
];

// Katman çipleri: haritada hangi türlerin gösterileceğini seçer.
export interface Layer { id: string; label: string; icon: string; kinds: FeatureKind[]; color: string; }
export const LAYERS: Layer[] = [
  { id: 'fiziki', label: 'Fiziki', icon: 'earth', kinds: ['mountain', 'river', 'lake', 'plain'], color: '#4f8f56' },
  { id: 'daglar', label: 'Dağlar', icon: 'triangle', kinds: ['mountain'], color: '#6b4a34' },
  { id: 'sular', label: 'Sular', icon: 'water', kinds: ['river', 'lake'], color: '#37b6e6' },
  { id: 'ovalar', label: 'Ovalar', icon: 'leaf', kinds: ['plain'], color: '#4aa564' },
  { id: 'sanayi', label: 'Sanayi', icon: 'construct', kinds: ['industry', 'city'], color: '#eaa93c' },
];

// Hangi özellik hangi ilde — il kartında "bu ildeki özellikler" için.
export const FEATURE_PROVINCE: Record<string, string> = {
  agri: 'Ağrı', erciyes: 'Kayseri', kackar: 'Rize', uludag: 'Bursa', firat: 'Elazığ',
  kizilirmak: 'Çorum', van: 'Van', tuz: 'Aksaray', cukurova: 'Adana', kocaeli: 'Kocaeli',
};

export function featuresInProvince(name: string) {
  return GEO_FEATURES.filter((f) => FEATURE_PROVINCE[f.id] === name);
}

export function projectedFeatures() {
  return GEO_FEATURES.map((f) => {
    const [x, y] = project(f.lon, f.lat);
    return { ...f, x, y };
  });
}
