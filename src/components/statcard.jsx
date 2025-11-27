const StatCard = ({ title, amount, icon, bg, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow flex items-center justify-between border">
    <div>
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="text-2xl font-bold">${amount.toLocaleString()}</h3>
    </div>
    <div className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center ${color}`}>
      {icon}
    </div>
  </div>
);

export default StatCard;
