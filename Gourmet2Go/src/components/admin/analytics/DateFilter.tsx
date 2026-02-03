interface DateFilterProps {
  startDate: string;
  endDate: string;
  onChange: (field: "start" | "end", value: string) => void;
}

export const DateFilter = ({
  startDate,
  endDate,
  onChange,
}: DateFilterProps) => {
  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Start Date
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onChange("start", e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          End Date
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onChange("end", e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>
    </div>
  );
};