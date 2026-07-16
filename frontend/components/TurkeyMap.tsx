import React, { useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, LayoutChangeEvent } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Line, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { TR_PROVINCES, TR_VIEWBOX } from '../constants/turkeyMap';
import { PROVINCE_REGION, REGION_COLOR } from '../constants/provinceRegions';
import { projectedFeatures, KIND_STYLE, FeatureKind, GeoFeature } from '../constants/geoFeatures';

type ProjFeature = GeoFeature & { x: number; y: number };

interface Props {
  visibleKinds: FeatureKind[];
  selectedProvince?: string | null;
  selectedFeatureId?: string | null;
  night?: boolean;
  regionMode?: boolean;
  /** Sabit genişlik (yakınlaştırma için). Verilmezse konteyner genişliği kullanılır. */
  width?: number;
  onSelectProvince?: (name: string) => void;
  onSelectFeature?: (f: GeoFeature) => void;
}

const PALETTE = {
  day: { sea: ['#1a5763', '#123f47', '#0e343c'], land: ['#8cbd74', '#4f8f56', '#2f5f3d'], stroke: 'rgba(255,255,255,0.35)', grid: 'rgba(255,255,255,0.05)' },
  night: { sea: ['#0a2831', '#071d24', '#05151b'], land: ['#3f6b4b', '#2c5238', '#1c3626'], stroke: 'rgba(255,255,255,0.18)', grid: 'rgba(255,255,255,0.04)' },
};

export default function TurkeyMap({
  visibleKinds,
  selectedProvince,
  selectedFeatureId,
  night = false,
  regionMode = false,
  width: fixedWidth,
  onSelectProvince,
  onSelectFeature,
}: Props) {
  const [measured, setMeasured] = useState(0);
  const width = fixedWidth ?? measured;
  const { width: vbW, height: vbH } = TR_VIEWBOX;
  const height = width * (vbH / vbW);
  const features = useMemo(() => projectedFeatures(), []);
  const visible = features.filter((f) => visibleKinds.includes(f.kind)) as ProjFeature[];
  const pal = night ? PALETTE.night : PALETTE.day;

  const onLayout = (e: LayoutChangeEvent) => setMeasured(e.nativeEvent.layout.width);

  return (
    <View style={[styles.wrap, fixedWidth ? { width: fixedWidth } : null]} onLayout={onLayout}>
      {width > 0 && (
        <>
          <Svg width={width} height={height} viewBox={`0 0 ${vbW} ${vbH}`}>
            <Defs>
              <LinearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={pal.sea[0]} />
                <Stop offset="0.5" stopColor={pal.sea[1]} />
                <Stop offset="1" stopColor={pal.sea[2]} />
              </LinearGradient>
              <LinearGradient id="land" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={pal.land[0]} />
                <Stop offset="0.55" stopColor={pal.land[1]} />
                <Stop offset="1" stopColor={pal.land[2]} />
              </LinearGradient>
              <LinearGradient id="landSel" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#ffe6a8" />
                <Stop offset="1" stopColor="#eaa93c" />
              </LinearGradient>
            </Defs>

            {/* deniz zemini + koordinat ızgarası */}
            <Path d={`M0 0H${vbW}V${vbH}H0Z`} fill="url(#sea)" />
            <G stroke={pal.grid} strokeWidth={1}>
              {[0.25, 0.5, 0.75].map((p) => (
                <Line key={`h${p}`} x1={0} y1={vbH * p} x2={vbW} y2={vbH * p} />
              ))}
              {[0.25, 0.5, 0.75].map((p) => (
                <Line key={`v${p}`} x1={vbW * p} y1={0} x2={vbW * p} y2={vbH} />
              ))}
            </G>

            {/* iller */}
            {TR_PROVINCES.map((p) => {
              const sel = p.name === selectedProvince;
              const fill = sel
                ? 'url(#landSel)'
                : regionMode
                ? REGION_COLOR[PROVINCE_REGION[p.name]] || 'url(#land)'
                : 'url(#land)';
              return (
                <Path
                  key={p.name}
                  d={p.d}
                  fill={fill}
                  stroke={sel ? '#b9791a' : pal.stroke}
                  strokeWidth={sel ? 1.4 : 0.7}
                  onPress={() => onSelectProvince?.(p.name)}
                />
              );
            })}
          </Svg>

          {/* pin katmanı (dokunulabilir) */}
          {visible.map((f) => {
            const st = KIND_STYLE[f.kind];
            const active = f.id === selectedFeatureId;
            const left = (f.x / vbW) * width;
            const top = (f.y / vbH) * height;
            const size = f.important ? 34 : 30;
            return (
              <TouchableOpacity
                key={f.id}
                activeOpacity={0.8}
                onPress={() => onSelectFeature?.(f)}
                style={[
                  styles.pin,
                  { left, top, width: size, height: size, marginLeft: -size / 2, marginTop: -size },
                ]}
              >
                <View
                  style={[
                    styles.bubble,
                    {
                      width: size,
                      height: size,
                      backgroundColor: st.color,
                      borderColor: active ? '#fff' : 'rgba(255,255,255,0.85)',
                      borderWidth: active ? 3 : 2,
                    },
                  ]}
                >
                  <Ionicons name={st.icon as any} size={size * 0.5} color="#fff" />
                </View>
                <View style={[styles.tip, { borderTopColor: st.color }]} />
              </TouchableOpacity>
            );
          })}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', position: 'relative' },
  pin: { position: 'absolute', alignItems: 'center', justifyContent: 'flex-start' },
  bubble: {
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  tip: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },
});
