import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import TurkeyMap from '../components/TurkeyMap';
import { LAYERS, KIND_STYLE, GeoFeature } from '../constants/geoFeatures';

export default function HaritaScreen() {
  const { colors, isDark } = useTheme();
  const [layerId, setLayerId] = useState(LAYERS[0].id);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [feature, setFeature] = useState<GeoFeature | null>(null);

  const layer = LAYERS.find((l) => l.id === layerId) || LAYERS[0];

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
        <View style={[styles.streak, { backgroundColor: colors.surface }]}>
          <Ionicons name="flame" size={16} color="#eaa93c" />
          <Text style={[styles.streakNum, { color: colors.text }]}>42</Text>
          <Text style={[styles.streakLbl, { color: colors.textSecondary }]}>Seri</Text>
        </View>
      </View>

      {/* Katman çipleri */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {LAYERS.map((l) => {
            const on = l.id === layerId;
            return (
              <TouchableOpacity
                key={l.id}
                activeOpacity={0.85}
                onPress={() => setLayerId(l.id)}
                style={[
                  styles.chip,
                  { backgroundColor: on ? l.color : colors.surface, borderColor: colors.border },
                ]}
              >
                <Ionicons name={l.icon as any} size={14} color={on ? '#fff' : colors.textSecondary} />
                <Text style={[styles.chipText, { color: on ? '#fff' : colors.text }]}>{l.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* İpucu / seçili il */}
      <View style={styles.hintRow}>
        <Ionicons name="hand-left" size={13} color={colors.textSecondary} />
        <Text style={[styles.hint, { color: colors.textSecondary }]}>
          {selectedProvince
            ? `${selectedProvince} seçildi · bir simgeye dokun`
            : 'Bir ile, dağa ya da nehre dokunarak keşfet'}
        </Text>
      </View>

      {/* Harita */}
      <ScrollView contentContainerStyle={styles.mapScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.mapCard}>
          <TurkeyMap
            visibleKinds={layer.kinds}
            selectedProvince={selectedProvince}
            selectedFeatureId={feature?.id}
            onSelectProvince={(name) => {
              setSelectedProvince(name);
              setFeature(null);
            }}
            onSelectFeature={(f) => setFeature(f)}
          />
        </View>
      </ScrollView>

      {/* Dokun & Öğren kartı */}
      {feature && (
        <Pressable style={styles.backdrop} onPress={() => setFeature(null)}>
          <Pressable style={[styles.sheet, { backgroundColor: colors.surface }]} onPress={() => {}}>
            <View style={styles.grabber} />
            <View style={styles.sheetHead}>
              <View
                style={[styles.sheetIcon, { backgroundColor: KIND_STYLE[feature.kind].color }]}
              >
                <Ionicons name={KIND_STYLE[feature.kind].icon as any} size={20} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.sheetTitle, { color: colors.text }]}>{feature.name}</Text>
                <Text style={[styles.sheetSub, { color: colors.textSecondary }]}>
                  {feature.subtitle}
                </Text>
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

            {/* Bilgiler */}
            <View style={styles.facts}>
              {feature.facts.map((f) => (
                <View key={f.label} style={[styles.fact, { backgroundColor: colors.surfaceLight }]}>
                  <Text style={[styles.factLabel, { color: colors.textMuted }]}>{f.label}</Text>
                  <Text style={[styles.factValue, { color: colors.text }]}>{f.value}</Text>
                </View>
              ))}
            </View>

            {/* Hızlı eylemler */}
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

            {/* KPSS notu */}
            <View style={[styles.note, { backgroundColor: colors.surfaceLight }]}>
              <Text style={[styles.noteTitle, { color: colors.text }]}>KPSS Notları</Text>
              <Text style={[styles.noteBody, { color: colors.textSecondary }]}>{feature.note}</Text>
            </View>

            {/* CTA */}
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
  logo: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#3c7548',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: { fontSize: 17, fontWeight: '800', letterSpacing: -0.3 },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  streakNum: { fontSize: 15, fontWeight: '800' },
  streakLbl: { fontSize: 11, fontWeight: '700' },

  chips: { paddingHorizontal: 16, paddingBottom: 6, gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipText: { fontSize: 13, fontWeight: '700' },

  hintRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 18, paddingVertical: 8 },
  hint: { fontSize: 12.5, fontWeight: '600' },

  mapScroll: { padding: 12, paddingBottom: 40 },
  mapCard: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#0e343c',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 18,
    paddingBottom: 34,
    gap: 14,
  },
  grabber: {
    alignSelf: 'center',
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(128,128,128,0.4)',
    marginBottom: 2,
  },
  sheetHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sheetIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  sheetTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.4 },
  sheetSub: { fontSize: 12.5, fontWeight: '600', marginTop: 1 },
  tag: { backgroundColor: '#d9f0e1', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999 },
  tagText: { color: '#2f7d55', fontSize: 10.5, fontWeight: '800' },

  facts: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  fact: { width: '48%', borderRadius: 12, padding: 10 },
  factLabel: { fontSize: 9.5, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3 },
  factValue: { fontSize: 14, fontWeight: '700', marginTop: 2 },

  quick: { flexDirection: 'row', gap: 8 },
  q: { flex: 1, borderRadius: 13, paddingVertical: 12, alignItems: 'center', gap: 5 },
  qLabel: { fontSize: 10.5, fontWeight: '700' },

  note: { borderRadius: 14, padding: 13 },
  noteTitle: { fontSize: 13, fontWeight: '800', marginBottom: 4 },
  noteBody: { fontSize: 12.5, lineHeight: 18.5, fontWeight: '500' },

  cta: { flexDirection: 'row', gap: 10 },
  ctaBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 13,
    borderRadius: 14,
  },
  ctaText: { color: '#fff', fontSize: 13, fontWeight: '800' },
});
