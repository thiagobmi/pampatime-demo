// src/components/history/HistoryToolbar.jsx
const HistoryToolbar = () => {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
      <div className="text-lg font-medium text-gray-800">
        25/04/2025 - Sexta-feira
      </div>

      <div className="flex items-center gap-4">
        <button className="text-gray-600 hover:text-black">
          2 edições ▾
        </button>
        <button className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded">
          Restaurar versão
        </button>
      </div>
    </div>
  );
};

export default HistoryToolbar;
