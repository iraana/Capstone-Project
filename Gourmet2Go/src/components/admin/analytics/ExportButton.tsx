interface ExportButtonProps {
  onExport: () => void;
}

export const ExportButton = ({ onExport }: ExportButtonProps) => {
  return (
    <button
      onClick={onExport}
      className="bg-[#00659B] text-white px-4 py-2 rounded hover:bg-[#005082]"
    >
      Export Report (CSV)
    </button>
  );
};