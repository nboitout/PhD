'use client';

import { useRouter } from 'next/navigation';

interface Props {
  days: string[];
  selected: string;
  today: string;
}

export default function DaySelect({ days, selected, today }: Props) {
  const router = useRouter();
  return (
    <select
      value={selected}
      onChange={(e) => router.push(`/admin?day=${e.target.value}`, { scroll: false })}
      className="adm-day-select"
    >
      {days.map((d) => (
        <option key={d} value={d}>
          {d === today ? `${d} (today)` : d}
        </option>
      ))}
    </select>
  );
}
