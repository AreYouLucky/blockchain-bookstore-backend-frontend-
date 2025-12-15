import { forwardRef, useEffect, useImperativeHandle, useRef, memo } from 'react';

const Input = forwardRef(function Input(
  { type = 'text', className = '', isFocused = false, ...props },
  ref,
) {
  const localRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => localRef.current?.focus(),
  }));

  useEffect(() => {
    if (isFocused) {
      localRef.current?.focus();
    }
  }, [isFocused]);

  return (
    <input
      {...props}
      type={type}
      className={`roboto-regular bg-gray-50 border border-gray-400 text-gray-900 text-sm rounded-lg 
        focus:ring-[#00aeef] focus:border-[#00aeef] block w-full p-2.5 
        ${props.disabled ? "bg-slate-400 text-gray-500 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed" : ""} 
        ${className}`}
      ref={localRef}
      disabled={props.disabled}
    />
  );
});

export default memo(Input);
