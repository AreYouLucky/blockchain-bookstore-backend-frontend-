import Button from "../forms/Button";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function NavBar() {
  const location = useLocation();
  const currentPage = location.pathname;
  const [open, setOpen] = useState(false);

  function logoutWallet() {
    localStorage.removeItem("walletAddress");
    window.location.reload();
  }

  const navLinkClass = (path) =>
    `block py-2 px-3 rounded md:p-0  text-[14px] ${
      currentPage === path
        ? "text-[#00aeef] "
        : " hover:text-[#00aeef] text-gray-500"
    }`;

  return (
    <nav className="bg-neutral-primary w-full z-20 top-0 start-0 border-b border-gray-200 shadow-sm">
      <div className="flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/images/logo.png" className="h-7" alt="Logo" />
        </Link>

        <div className="flex md:order-2 space-x-3 rtl:space-x-reverse">
          <Button
            className="text-sm border border-gray-200 hover:text-white"
            onClick={logoutWallet}
          >
            Logout
          </Button>

          <button
            onClick={() => setOpen(!open)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
                d="M5 7h14M5 12h14M5 17h14"
              />
            </svg>
          </button>
        </div>

        <div
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
            open ? "block" : "hidden"
          }`}
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-default rounded-base bg-neutral-secondary-soft md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-neutral-primary">
            <li>
              <Link to="/" className={navLinkClass("/")}>
                Book List
              </Link>
            </li>
            <li>
              <Link to="/owned-books" className={navLinkClass("/owned-books")}>
                Owned Books
              </Link>
            </li>
            <li>
              <Link to="/about" className={navLinkClass("/about")}>
                About
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
