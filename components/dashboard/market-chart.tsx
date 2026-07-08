'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const data = [
  { month: 'Avg', narx: 10.9 },
  { month: 'Sen', narx: 11.1 },
  { month: 'Okt', narx: 11.4 },
  { month: 'Noy', narx: 11.3 },
  { month: 'Dek', narx: 11.8 },
  { month: 'Yan', narx: 12.0 },
  { month: 'Fev', narx: 12.3 },
  { month: 'Mar', narx: 12.2 },
  { month: 'Apr', narx: 12.6 },
  { month: 'May', narx: 12.9 },
  { month: 'Iyn', narx: 13.0 },
  { month: 'Iyl', narx: 13.1 },
]

export function MarketChart() {
  return (
    <div className="h-64 w-full" role="img" aria-label="Toshkent shahri o'rtacha m² narx dinamikasi, so'nggi 12 oy">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="narxFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.25} />
              <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
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
            width={36}
            domain={['dataMin - 0.3', 'dataMax + 0.3']}
            tickFormatter={(v: number) => `${v}`}
          />
          <Tooltip
            formatter={(value) => [`${value} mln so'm/m²`, "O'rtacha narx"]}
            contentStyle={{
              backgroundColor: 'var(--color-popover)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'var(--color-popover-foreground)',
            }}
          />
          <Area
            type="monotone"
            dataKey="narx"
            stroke="var(--color-chart-1)"
            strokeWidth={2}
            fill="url(#narxFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
