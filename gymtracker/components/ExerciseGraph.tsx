import React, { useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Svg, { Line, Path, Text as SvgText } from 'react-native-svg';

import type { WorkoutEntry } from '@/utils/workoutStorage';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

type Props = {
  title: string;
  entries: WorkoutEntry[];
  height?: number;
};

const PADDING_X = 12;
const PADDING_TOP = 10;
const PADDING_BOTTOM = 22; // room for date labels

export function ExerciseGraph({ title, entries, height = 140 }: Props) {
  const [width, setWidth] = useState(0);

  const cleaned = useMemo(() => {
    // Sort by date ASC and parse numbers
    const sorted = [...entries]
      .map((e) => ({
        ...e,
        weightNum: parseFloat(String(e.weight).replace(',', '.')),
        dateObj: new Date(e.date),
      }))
      .filter((e) => !Number.isNaN(e.weightNum) && e.dateObj.toString() !== 'Invalid Date')
      .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
    return sorted;
  }, [entries]);

  const onLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  };

  const content = useMemo(() => {
    if (width === 0 || cleaned.length === 0) return null;

    const innerWidth = Math.max(0, width - PADDING_X * 2);
    const innerHeight = Math.max(0, height - PADDING_TOP - PADDING_BOTTOM);

    const minDate = cleaned[0].dateObj.getTime();
    const maxDate = cleaned[cleaned.length - 1].dateObj.getTime();
    const dateSpan = Math.max(1, maxDate - minDate);

    let minVal = Math.min(...cleaned.map((p) => p.weightNum));
    let maxVal = Math.max(...cleaned.map((p) => p.weightNum));
    if (minVal === maxVal) {
      // add small padding so a flat line is visible
      minVal = minVal - 1;
      maxVal = maxVal + 1;
    }
    const valSpan = maxVal - minVal;

    const points = cleaned.map((p) => {
      const x = PADDING_X + ((p.dateObj.getTime() - minDate) / dateSpan) * innerWidth;
      const y = PADDING_TOP + (1 - (p.weightNum - minVal) / valSpan) * innerHeight;
      return { x, y, label: p.dateObj };
    });

    const d = points
      .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`)
      .join(' ');

    const formatLabel = (d: Date) => {
      // short date: e.g., 8/21 or 21 Aug depending on locale; keep compact
      const month = d.getMonth() + 1;
      const day = d.getDate();
      return `${month}/${day}`;
    };

    return { points, d, formatLabel };
  }, [cleaned, height, width]);

  return (
    <ThemedView style={styles.card}>
      <ThemedText type="subtitle" style={styles.title}>{title}</ThemedText>
      <View style={{ height }} onLayout={onLayout}>
        {width > 0 && content ? (
          <Svg width="100%" height={height}>
            {/* vertical guide lines */}
            {content.points.map((pt, idx) => (
              <Line
                key={`g-${idx}`}
                x1={pt.x}
                y1={0}
                x2={pt.x}
                y2={height}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={1}
              />
            ))}
            {/* weight line */}
            <Path d={content.d} stroke="#4DA3FF" strokeWidth={2} fill="none" />
            {/* date labels at bottom */}
            {content.points.map((pt, idx) => (
              <SvgText
                key={`t-${idx}`}
                x={pt.x}
                y={height - 6}
                fontSize={10}
                fill="#aaa"
                textAnchor="middle"
              >
                {content.formatLabel(pt.label)}
              </SvgText>
            ))}
          </Svg>
        ) : (
          <ThemedText style={styles.placeholder}>No data</ThemedText>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#222',
    marginBottom: 12,
  },
  title: {
    marginBottom: 8,
    color: '#fff',
    fontWeight: '600',
  },
  placeholder: {
    textAlign: 'center',
    color: '#888',
    paddingVertical: 24,
  },
});

export default ExerciseGraph;
