'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { revenueData } from '@/lib/data/admin'

const LABELS: Record<string, string> = {
  komissiya: 'Komissiya',
  obuna: 'Obuna',
  auktsion: 'Auktsion',
}

export function AdminRevenueChart() {
  return (
    <div
      className="h-64 w-full"
      role="img"
      aria-label="Platforma daromad manbalari oylar kesimida: komissiya, obuna va auktsion to'lovlari"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={revenueData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            formatter={(value, name) => [`${value} mln so'm`, LABELS[String(name)] ?? name]}
            contentStyle={{
              backgroundColor: 'var(--color-popover)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'var(--color-popover-foreground)',
            }}
            cursor={{ fill: 'var(--color-muted)', opacity: 0.4 }}
          />
          <Legend
            formatter={(value: string) => (
              <span style={{ fontSize: 12, color: 'var(--color-muted-foreground)' }}>
                {LABELS[value] ?? value}
              </span>
            )}
          />
          <Bar dataKey="komissiya" stackId="a" fill="var(--color-chart-1)" radius={[0, 0, 0, 0]} />
          <Bar dataKey="obuna" stackId="a" fill="var(--color-chart-2)" />
          <Bar dataKey="auktsion" stackId="a" fill="var(--color-chart-3)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
