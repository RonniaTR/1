import React, { useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, LayoutChangeEvent } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Line, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { TR_PROVINCES, TR_VIEWBOX } from '../constants/turkeyMap';
import { projectedFeatures, KIND_STYLE, FeatureKind, GeoFeature } from '../constants/geoFeatures';

type ProjFeature = GeoFeature & { x: number; y: number };

interface Props {
  visibleKinds: FeatureKind[];
  selectedProvince?: string | null;
  selectedFeatureId?: string | null;
  onSelectProvince?: (name: string) => void;
  onSelectFeature?: (f: GeoFeature) => void;
}

export default function TurkeyMap({
  visibleKinds,
  selectedProvince,
  selectedFeatureId,
  onSelectProvince,
  onSelectFeature,
}: Props) {
  const [width, setWidth] = useState(0);
  const { width: vbW, height: vbH } = TR_VIEWBOX;
  const height = width * (vbH / vbW);
  const features = useMemo(() => projectedFeatures(), []);
  const visible = features.filter((f) => visibleKinds.includes(f.kind)) as ProjFeature[];

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  return (
    <View style={styles.wrap} onLayout={onLayout}>
      {width > 0 && (
        <>
          <Svg width={width} height={height} viewBox={`0 0 ${vbW} ${vbH}`}>
            <Defs>
              <LinearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#1a5763" />
                <Stop offset="0.5" stopColor="#123f47" />
                <Stop offset="1" stopColor="#0e343c" />
              </LinearGradient>
              <LinearGradient id="land" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#8cbd74" />
                <Stop offset="0.55" stopColor="#4f8f56" />
                <Stop offset="1" stopColor="#2f5f3d" />
              </LinearGradient>
              <LinearGradient id="landSel" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#ffe6a8" />
                <Stop offset="1" stopColor="#eaa93c" />
              </LinearGradient>
            </Defs>

            {/* deniz zemini + koordinat ızgarası */}
            <Path d={`M0 0H${vbW}V${vbH}H0Z`} fill="url(#sea)" />
            <G stroke="rgba(255,255,255,0.05)" strokeWidth={1}>
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
              return (
                <Path
                  key={p.name}
                  d={p.d}
                  fill={sel ? 'url(#landSel)' : 'url(#land)'}
                  stroke={sel ? '#b9791a' : 'rgba(255,255,255,0.35)'}
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
  pin: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
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
