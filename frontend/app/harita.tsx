import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import TurkeyMap from '../components/TurkeyMap';
import {
  LAYERS,
  KIND_STYLE,
  GeoFeature,
  featuresInProvince,
} from '../constants/geoFeatures';
import { PROVINCE_REGION, REGION_COLOR } from '../constants/provinceRegions';

const REGIONS = Object.keys(REGION_COLOR);

export default function HaritaScreen() {
  const { colors } = useTheme();
  const { width: winW } = useWindowDimensions();
  const [layerId, setLayerId] = useState(LAYERS[0].id);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [feature, setFeature] = useState<GeoFeature | null>(null);
  const [night, setNight] = useState(false);
  const [regionMode, setRegionMode] = useState(false);
  const [zoom, setZoom] = useState(1);

  const layer = LAYERS.find((l) => l.id === layerId) || LAYERS[0];
  const baseW = winW - 24; // yatay marjlar
  const mapW = baseW * zoom;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Başlık */}
      <View style={styles.header}>
        <View style={styles.brand}>
          <View style={styles.logo}>
            <Ionicons name="earth" size={18} color="#fff" />
          </View>
          <Text style={[styles.brandText, { color: colors.text }]}>KPSS Coğrafya</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={[styles.streak, { backgroundColor: colors.surface }]}>
            <Ionicons name="flame" size={15} color="#eaa93c" />
            <Text style={[styles.streakNum, { color: colors.text }]}>42</Text>
          </View>
          <TouchableOpacity
            onPress={() => setRegionMode((v) => !v)}
            style={[
              styles.iconBtn,
              { backgroundColor: regionMode ? colors.primary : colors.surface, borderColor: colors.border },
            ]}
          >
            <Ionicons name="color-palette" size={17} color={regionMode ? '#fff' : colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setNight((v) => !v)}
            style={[styles.iconBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Ionicons name={night ? 'sunny' : 'moon'} size={17} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Katman çipleri */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {LAYERS.map((l) => {
          const on = l.id === layerId;
          return (
            <TouchableOpacity
              key={l.id}
              activeOpacity={0.85}
              onPress={() => setLayerId(l.id)}
              style={[styles.chip, { backgroundColor: on ? l.color : colors.surface, borderColor: colors.border }]}
            >
              <Ionicons name={l.icon as any} size={14} color={on ? '#fff' : colors.textSecondary} />
              <Text style={[styles.chipText, { color: on ? '#fff' : colors.text }]}>{l.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* İpucu / seçili il */}
      <View style={styles.hintRow}>
        <Ionicons name="hand-left" size={13} color={colors.textSecondary} />
        <Text style={[styles.hint, { color: colors.textSecondary }]}>
          {selectedProvince
            ? `${selectedProvince} · ${PROVINCE_REGION[selectedProvince]} Bölgesi`
            : 'Bir ile, dağa ya da nehre dokunarak keşfet'}
        </Text>
      </View>

      {/* Harita + bölge lejantı */}
      <View style={styles.mapArea}>
        <View style={styles.mapCard}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            maximumZoomScale={1}
            contentContainerStyle={{ alignItems: 'center' }}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ justifyContent: 'center', minWidth: baseW }}
            >
              <TurkeyMap
                width={mapW}
                visibleKinds={layer.kinds}
                selectedProvince={selectedProvince}
                selectedFeatureId={feature?.id}
                night={night}
                regionMode={regionMode}
                onSelectProvince={(name) => {
                  setSelectedProvince(name);
                  setFeature(null);
                }}
                onSelectFeature={(f) => setFeature(f)}
              />
            </ScrollView>
          </ScrollView>

          {/* Zoom kontrolleri */}
          <View style={[styles.zoom, { backgroundColor: night ? 'rgba(20,32,27,0.92)' : 'rgba(255,255,255,0.92)' }]}>
            <TouchableOpacity style={styles.zBtn} onPress={() => setZoom((z) => Math.min(4, +(z + 0.5).toFixed(1)))}>
              <Ionicons name="add" size={22} color={night ? '#e8efe6' : '#16261f'} />
            </TouchableOpacity>
            <View style={styles.zDiv} />
            <TouchableOpacity style={styles.zBtn} onPress={() => setZoom((z) => Math.max(1, +(z - 0.5).toFixed(1)))}>
              <Ionicons name="remove" size={22} color={night ? '#e8efe6' : '#16261f'} />
            </TouchableOpacity>
          </View>

          {/* Bölge lejantı */}
          {regionMode && (
            <View style={[styles.legend, { backgroundColor: night ? 'rgba(20,32,27,0.92)' : 'rgba(255,255,255,0.92)' }]}>
              {REGIONS.map((r) => (
                <View key={r} style={styles.legRow}>
                  <View style={[styles.legDot, { backgroundColor: REGION_COLOR[r] }]} />
                  <Text style={[styles.legText, { color: night ? '#e8efe6' : '#16261f' }]}>{r}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Özellik detay kartı */}
      {feature && (
        <Pressable style={styles.backdrop} onPress={() => setFeature(null)}>
          <Pressable style={[styles.sheet, { backgroundColor: colors.surface }]} onPress={() => {}}>
            <View style={styles.grabber} />
            <View style={styles.sheetHead}>
              <View style={[styles.sheetIcon, { backgroundColor: KIND_STYLE[feature.kind].color }]}>
                <Ionicons name={KIND_STYLE[feature.kind].icon as any} size={20} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.sheetTitle, { color: colors.text }]}>{feature.name}</Text>
                <Text style={[styles.sheetSub, { color: colors.textSecondary }]}>{feature.subtitle}</Text>
              </View>
              {feature.important && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Çok önemli</Text>
                </View>
              )}
              <TouchableOpacity onPress={() => setFeature(null)} hitSlop={10}>
                <Ionicons name="close-circle" size={26} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.facts}>
              {feature.facts.map((f) => (
                <View key={f.label} style={[styles.fact, { backgroundColor: colors.surfaceLight }]}>
                  <Text style={[styles.factLabel, { color: colors.textMuted }]}>{f.label}</Text>
                  <Text style={[styles.factValue, { color: colors.text }]}>{f.value}</Text>
                </View>
              ))}
            </View>

            <View style={styles.quick}>
              {[
                { icon: 'film', label: 'Animasyon' },
                { icon: 'bulb', label: 'Hafıza' },
                { icon: 'help-circle', label: `${feature.questionCount} Soru` },
              ].map((q) => (
                <View key={q.label} style={[styles.q, { backgroundColor: colors.surfaceLight }]}>
                  <Ionicons name={q.icon as any} size={20} color={colors.primary} />
                  <Text style={[styles.qLabel, { color: colors.textSecondary }]}>{q.label}</Text>
                </View>
              ))}
            </View>

            <View style={[styles.note, { backgroundColor: colors.surfaceLight }]}>
              <Text style={[styles.noteTitle, { color: colors.text }]}>KPSS Notları</Text>
              <Text style={[styles.noteBody, { color: colors.textSecondary }]}>{feature.note}</Text>
            </View>

            <View style={styles.cta}>
              <TouchableOpacity style={[styles.ctaBtn, { backgroundColor: colors.primary }]}>
                <Ionicons name="book" size={16} color="#fff" />
                <Text style={styles.ctaText}>Konu Anlatımı</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.ctaBtn, { backgroundColor: colors.secondary }]}>
                <Ionicons name="create" size={16} color="#fff" />
                <Text style={styles.ctaText}>{feature.questionCount} Soru Çöz</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      )}

      {/* İl detay kartı */}
      {!feature && selectedProvince && (
        <Pressable style={styles.backdrop} onPress={() => setSelectedProvince(null)}>
          <Pressable style={[styles.sheet, { backgroundColor: colors.surface }]} onPress={() => {}}>
            <View style={styles.grabber} />
            <View style={styles.sheetHead}>
              <View
                style={[
                  styles.sheetIcon,
                  { backgroundColor: REGION_COLOR[PROVINCE_REGION[selectedProvince]] || colors.primary },
                ]}
              >
                <Ionicons name="location" size={20} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.sheetTitle, { color: colors.text }]}>{selectedProvince}</Text>
                <Text style={[styles.sheetSub, { color: colors.textSecondary }]}>
                  {PROVINCE_REGION[selectedProvince]} Bölgesi
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedProvince(null)} hitSlop={10}>
                <Ionicons name="close-circle" size={26} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.sheetSub, { color: colors.textSecondary, marginBottom: 8 }]}>
              Bu ildeki coğrafi özellikler
            </Text>
            {featuresInProvince(selectedProvince).length > 0 ? (
              featuresInProvince(selectedProvince).map((f) => (
                <TouchableOpacity
                  key={f.id}
                  style={[styles.frow, { backgroundColor: colors.surfaceLight }]}
                  onPress={() => setFeature(f)}
                >
                  <View style={[styles.frowIcon, { backgroundColor: KIND_STYLE[f.kind].color }]}>
                    <Ionicons name={KIND_STYLE[f.kind].icon as any} size={16} color="#fff" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.frowTitle, { color: colors.text }]}>{f.name}</Text>
                    <Text style={[styles.frowSub, { color: colors.textSecondary }]}>{f.subtitle}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              ))
            ) : (
              <Text style={[styles.empty, { color: colors.textMuted }]}>
                Bu il için işaretli özellik yok — yakınlaştırıp komşu illeri keşfet.
              </Text>
            )}

            <TouchableOpacity style={[styles.ctaBtn, { backgroundColor: colors.primary, marginTop: 12 }]}>
              <Ionicons name="map" size={16} color="#fff" />
              <Text style={styles.ctaText}>İl Testine Başla</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#3c7548', alignItems: 'center', justifyContent: 'center' },
  brandText: { fontSize: 17, fontWeight: '800', letterSpacing: -0.3 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  streak: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 11, paddingVertical: 7, borderRadius: 999 },
  streakNum: { fontSize: 14, fontWeight: '800' },
  iconBtn: { width: 36, height: 36, borderRadius: 11, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },

  chips: { paddingHorizontal: 16, paddingBottom: 6, gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999, borderWidth: 1 },
  chipText: { fontSize: 13, fontWeight: '700' },

  hintRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 18, paddingVertical: 8 },
  hint: { fontSize: 12.5, fontWeight: '600' },

  mapArea: { flex: 1, padding: 12 },
  mapCard: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#0e343c',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  zoom: { position: 'absolute', right: 12, bottom: 12, borderRadius: 14, overflow: 'hidden' },
  zBtn: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  zDiv: { height: 1, backgroundColor: 'rgba(128,128,128,0.25)' },
  legend: { position: 'absolute', left: 12, bottom: 12, borderRadius: 12, padding: 9, gap: 5, maxWidth: 160 },
  legRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  legDot: { width: 10, height: 10, borderRadius: 3 },
  legText: { fontSize: 10.5, fontWeight: '700' },

  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 18, paddingBottom: 34 },
  grabber: { alignSelf: 'center', width: 42, height: 5, borderRadius: 3, backgroundColor: 'rgba(128,128,128,0.4)', marginBottom: 14 },
  sheetHead: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  sheetIcon: { width: 44, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  sheetTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.4 },
  sheetSub: { fontSize: 12.5, fontWeight: '600', marginTop: 1 },
  tag: { backgroundColor: '#d9f0e1', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999 },
  tagText: { color: '#2f7d55', fontSize: 10.5, fontWeight: '800' },

  facts: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  fact: { width: '48%', borderRadius: 12, padding: 10 },
  factLabel: { fontSize: 9.5, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3 },
  factValue: { fontSize: 14, fontWeight: '700', marginTop: 2 },

  quick: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  q: { flex: 1, borderRadius: 13, paddingVertical: 12, alignItems: 'center', gap: 5 },
  qLabel: { fontSize: 10.5, fontWeight: '700' },

  note: { borderRadius: 14, padding: 13, marginBottom: 12 },
  noteTitle: { fontSize: 13, fontWeight: '800', marginBottom: 4 },
  noteBody: { fontSize: 12.5, lineHeight: 18.5, fontWeight: '500' },

  cta: { flexDirection: 'row', gap: 10 },
  ctaBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingVertical: 13, borderRadius: 14 },
  ctaText: { color: '#fff', fontSize: 13, fontWeight: '800' },

  frow: { flexDirection: 'row', alignItems: 'center', gap: 11, borderRadius: 13, padding: 10, marginBottom: 8 },
  frowIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  frowTitle: { fontSize: 13, fontWeight: '700' },
  frowSub: { fontSize: 11, fontWeight: '600', marginTop: 1 },
  empty: { fontSize: 12, fontWeight: '600', paddingVertical: 4 },
});
