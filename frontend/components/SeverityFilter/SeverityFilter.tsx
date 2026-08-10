type SeverityFilterProps = {
  value: string;
  onChange: (value: string) => void;
};

const severities = [
  "All",
  "Critical",
  "High",
  "Medium",
  "Low",
];

export default function SeverityFilter({
  value,
  onChange,
}: SeverityFilterProps) {
  return (
    <div className="flex gap-3 mb-6 flex-wrap">
      {severities.map((severity) => (
        <button
          key={severity}
          onClick={() => onChange(severity)}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            value === severity
              ? "bg-cyan-500 text-black"
              : "bg-slate-800 text-white hover:bg-slate-700"
          }`}
        >
          {severity}
        </button>
      ))}
    </div>
  );
}