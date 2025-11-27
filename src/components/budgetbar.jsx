const BudgetBar = ({ label, current, target, color, subtext, isSavings = false }) => {
  const percentage = (current / target) * 100;
  const width = Math.min(percentage, 100);
  const isOver = current > target && !isSavings;

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-1">
        <div>
          <h4 className="font-semibold text-sm">{label}</h4>
          <p className="text-xs text-slate-400">{subtext}</p>
        </div>

        <div>
          <span className={`font-bold ${isOver ? "text-red-500" : "text-slate-700"}`}>
            ${current.toLocaleString()}
          </span>
          <span className="text-xs text-slate-400"> / ${target.toLocaleString()}</span>
        </div>
      </div>

      <div className="w-full h-3 bg-slate-200 rounded-full">
        <div
          className={`h-full rounded-full ${isOver ? "bg-red-500" : color}`}
          style={{ width: `${width}%` }}
        ></div>
      </div>

      <div className="flex justify-between text-xs mt-1 text-slate-500">
        <span>{percentage.toFixed(0)}% used</span>
        {isOver && <span className="text-red-500 font-bold">Over Budget!</span>}
      </div>
    </div>
  );
};

export default BudgetBar;
