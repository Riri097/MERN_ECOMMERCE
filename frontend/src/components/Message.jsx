const Message = ({ variant = 'info', children }) => {
  let colorClass = '';

  switch (variant) {
    case 'danger':
      colorClass = 'bg-red-100 text-red-800 border-red-200';
      break;
    case 'success':
      colorClass = 'bg-green-100 text-green-800 border-green-200';
      break;
    case 'warning':
      colorClass = 'bg-yellow-100 text-yellow-800 border-yellow-200';
      break;
    default:
      colorClass = 'bg-blue-100 text-blue-800 border-blue-200';
  }

  return (
    <div className={`p-4 rounded border ${colorClass} mb-4`}>
      {children}
    </div>
  );
};

export default Message;