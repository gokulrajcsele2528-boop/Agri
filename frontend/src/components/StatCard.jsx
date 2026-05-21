export default function StatCard({ icon: Icon, label, value, sub, color = 'forest' }) {
  const colors = {
    forest: 'bg-forest-50 text-forest-700 border-forest-100',
    earth: 'bg-earth-50 text-earth-700 border-earth-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
  };
  return (
    <div className={`card border ${colors[color]?.split(' ')[2] || 'border-forest-100'}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-1 font-display text-2xl font-bold text-gray-900">{value}</p>
          {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
        </div>
        {Icon && (
          <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${colors[color]}`}>
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
    </div>
  );
}
