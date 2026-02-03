interface KpiCardProps {
  label: string;
  value: string | number;
}

export const KpiCard = ({ label, value }: KpiCardProps) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-center items-center hover:shadow-xl transition">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
  );
};