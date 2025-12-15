export default function ParentCard({className,children}) {
  return (
    <div className={`max-w-sm p-6 border border-gray-300 rounded-md shadow-sm bg-white ${className}`}>
      {children}
    </div>
  );
}
