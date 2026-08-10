type StatusFilterProps = {
  value: string;
  onChange: (value: string) => void;
};

const statuses = [
  "All",
  "Open",
  "In Progress",
  "Resolved",
];

export default function StatusFilter({
  value,
  onChange,
}: StatusFilterProps) {
  return (
    <div className="flex gap-3 mb-6 flex-wrap">
      {statuses.map((status) => (
        <button
          key={status}
          onClick={() => onChange(status)}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            value === status
              ? "bg-green-600 text-white"
              : "bg-slate-800 text-white hover:bg-slate-700"
          }`}
        >
          {status}
        </button>
      ))}
    </div>
  );
}