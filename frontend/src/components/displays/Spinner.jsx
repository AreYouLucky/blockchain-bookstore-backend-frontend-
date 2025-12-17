import { TbLoader3 } from "react-icons/tb";

function Spinner({ className, ...props }) {

  return (
    <TbLoader3
      role="status"
      aria-label="Loading"
      className={
        "animate-spin text-current"+
        className
      }
      {...props}
    />
  )
}

export { Spinner }
