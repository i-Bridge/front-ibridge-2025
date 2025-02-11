"use client";

import { useDateStore } from "@/store/date/dateStore";

export default function DateSelector() {
  const { selectedDate, setSelectedDate } = useDateStore();

  const handleChange = (type: "year" | "month" | "day", value: number) => {
    const [year, month, day] = selectedDate.split("-").map(Number);
    const newDate = {
      year: type === "year" ? value : year,
      month: type === "month" ? value : month,
      day: type === "day" ? value : day,
    };
    setSelectedDate(`${newDate.year}-${String(newDate.month).padStart(2, "0")}-${String(newDate.day).padStart(2, "0")}`);
  };

  const [year, month, day] = selectedDate.split("-").map(Number);

  return (
    <div className="flex space-x-2">
      <select value={year} onChange={(e) => handleChange("year", parseInt(e.target.value))}>
        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>

      <select value={month} onChange={(e) => handleChange("month", parseInt(e.target.value))}>
        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      <select value={day} onChange={(e) => handleChange("day", parseInt(e.target.value))}>
        {Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => i + 1).map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
    </div>
  );
}
