
export default function GuestLayout({children}) {
  return (
    <div className="min-h-screen flex justify-center items-center absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#00aeef_100%)]">
        {children}
    </div>
  );
}
