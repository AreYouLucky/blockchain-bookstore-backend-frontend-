import NavBar from "../components/displays/NavBar";
export default function AuthenticatedLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#00aeef_100%)]">
            <NavBar></NavBar>
            <div className="w-full py-3 px-5">
                {children}
            </div>
        </div>
    );
}
