/**
 * StatusBadge - Color-coded pill for lead status
 */
const statusStyles = {
  New: 'bg-blue-100 text-blue-700 border border-blue-200',
  Contacted: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  Converted: 'bg-green-100 text-green-700 border border-green-200',
};

export default function StatusBadge({ status }) {
  const style = statusStyles[status] || 'bg-gray-100 text-gray-600 border border-gray-200';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70"></span>
      {status}
    </span>
  );
}
