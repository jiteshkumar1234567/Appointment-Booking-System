import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const { token, setToken, userData } = useContext(AppContext);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(false);
    navigate("/login");
  };

  const closeMenu = () => setShowMenu(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div
              onClick={() => navigate("/")}
              className="cursor-pointer select-none"
            >
              <h1 className="text-2xl sm:text-3xl font-extrabold">
                <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
                  MediCare+
                </span>
              </h1>
              <p className="text-[10px] sm:text-xs text-gray-500 tracking-[0.2em] uppercase -mt-1">
                Your Health, Our Priority
              </p>
            </div>

            <ul className="hidden lg:flex items-center gap-8 font-medium">
              {["/", "/doctors", "/about", "/contact"].map((path, i) => (
                <NavLink
                  key={i}
                  to={path}
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700 hover:text-blue-600"
                  }
                >
                  {["HOME", "ALL DOCTORS", "ABOUT", "CONTACT"][i]}
                </NavLink>
              ))}
            </ul>

            <div className="flex items-center gap-4">
              {token && userData ? (
                <div className="relative">
                  <div
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <img
                      src={userData.image}
                      className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-lg"
                    />
                    <img src={assets.dropdown_icon} className="w-3" />
                  </div>

                  {showDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowDropdown(false)}
                      />

                      <div className="absolute right-0 top-14 bg-white shadow-2xl rounded-2xl min-w-[220px] p-4 flex flex-col gap-4 border z-50">
                        <p
                          onClick={() => {
                            navigate("/my-profile");
                            setShowDropdown(false);
                          }}
                          className="cursor-pointer hover:text-blue-600"
                        >
                          My Profile
                        </p>

                        <p
                          onClick={() => {
                            navigate("/my-appointments");
                            setShowDropdown(false);
                          }}
                          className="cursor-pointer hover:text-blue-600"
                        >
                          My Appointments
                        </p>

                        <p
                          onClick={() => {
                            navigate("/my-prescriptions");
                            setShowDropdown(false);
                          }}
                          className="cursor-pointer hover:text-blue-600"
                        >
                          My Prescriptions
                        </p>

                        <hr />

                        <p
                          onClick={logout}
                          className="cursor-pointer text-red-500 hover:text-red-600"
                        >
                          Logout
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="hidden lg:flex bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:-translate-y-1 transition-all"
                >
                  Create Account
                </button>
              )}

              <button onClick={() => setShowMenu(true)} className="lg:hidden">
                <img src={assets.menu_icon} className="w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[999] transition-all duration-300 ${showMenu ? "visible" : "invisible"}`}
      >
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${showMenu ? "opacity-100" : "opacity-0"}`}
          onClick={closeMenu}
        />

        <div
          className={`absolute right-0 top-0 h-full w-[80%] sm:w-[350px] bg-white shadow-2xl p-6 transform transition-transform duration-300 ${showMenu ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
                  MediCare+
                </span>
              </h1>
              <p className="text-xs text-gray-500">Your Health, Our Priority</p>
            </div>

            <img
              onClick={closeMenu}
              src={assets.cross_icon}
              className="w-6 cursor-pointer"
            />
          </div>

          <div className="mt-10 flex flex-col gap-6 text-lg font-medium">
            <NavLink to="/" onClick={closeMenu} className="hover:text-blue-600">
              HOME
            </NavLink>
            <NavLink
              to="/doctors"
              onClick={closeMenu}
              className="hover:text-blue-600"
            >
              ALL DOCTORS
            </NavLink>
            <NavLink
              to="/about"
              onClick={closeMenu}
              className="hover:text-blue-600"
            >
              ABOUT
            </NavLink>
            <NavLink
              to="/contact"
              onClick={closeMenu}
              className="hover:text-blue-600"
            >
              CONTACT
            </NavLink>

            {token && (
              <NavLink
                to="/my-prescriptions"
                onClick={closeMenu}
                className="hover:text-blue-600"
              >
                MY PRESCRIPTIONS
              </NavLink>
            )}

            {!token && (
              <button
                onClick={() => {
                  navigate("/login");
                  closeMenu();
                }}
                className="mt-6 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 text-white py-3 rounded-full font-semibold"
              >
                Create Account
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
