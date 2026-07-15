/**
 * StatCard - Summary card for dashboard metrics
 */
export default function StatCard({ title, value, icon: Icon, color, bgColor, borderColor }) {
  return (
    <div className={`bg-white rounded-xl shadow-card border ${borderColor || 'border-gray-100'} p-6 flex items-center gap-4 hover:shadow-card-hover transition-shadow duration-200`}>
      <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}
