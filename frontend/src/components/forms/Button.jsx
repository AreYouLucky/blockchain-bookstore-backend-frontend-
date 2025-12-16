export default function Button({
  children = "Default",
  type = "button",
  onClick,
  className = "",
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-brand box-border border cursor-pointer
        hover:bg-brand-strong
        focus:ring-4 focus:ring-brand-medium
        shadow-sm font-medium leading-5 text-sm px-4 py-2
        focus:outline-none
        disabled:opacity-50 disabled:cursor-not-allowed hover:text-white
        hover:bg-[#9de5ff]
        rounded-lg hover:scale-105 duration-200
        ${className}
      `}
    >
      {children}
    </button>
  );
}
