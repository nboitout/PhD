'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { AXIS_GRID, AXIS_TICK, CHART_PALETTE, TOOLTIP_STYLE } from './chartPalette';

export interface StackedTimePoint {
  date: string;
  [country: string]: number | string;
}

interface Props {
  data: StackedTimePoint[];
  countries: string[];
  /** X-axis label mode: 'date' strips the year from YYYY-MM-DD; 'raw' shows the value as-is. */
  labelMode?: 'date' | 'raw';
  /** X-axis tick interval (recharts). Default shows first & last only. */
  interval?: number | 'preserveStartEnd';
  /** Optional fixed colour per country, so the same country keeps one colour across charts. */
  colorMap?: Record<string, string>;
}

export default function AdminStackedCountryChart({
  data,
  countries,
  labelMode = 'date',
  interval = 'preserveStartEnd',
  colorMap,
}: Props) {
  const tickFormatter = labelMode === 'raw' ? (v: string) => v : (v: string) => v.slice(5);
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -10, bottom: 0 }} barCategoryGap="18%">
        <CartesianGrid strokeDasharray="3 3" stroke={AXIS_GRID} vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: AXIS_TICK, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={tickFormatter}
          interval={interval}
        />
        <YAxis
          tick={{ fill: AXIS_TICK, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          labelStyle={{ color: 'var(--ink-mute)', marginBottom: 6, fontSize: 11 }}
          cursor={{ fill: 'var(--bg-sunk)', fillOpacity: 0.6 }}
        />
        <Legend wrapperStyle={{ fontSize: 11, color: 'var(--ink-mute)', paddingTop: 12 }} />
        {countries.map((country, i) => (
          <Bar
            key={country}
            dataKey={country}
            stackId="a"
            fill={colorMap?.[country] ?? CHART_PALETTE[i % CHART_PALETTE.length]}
            isAnimationActive={false}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
