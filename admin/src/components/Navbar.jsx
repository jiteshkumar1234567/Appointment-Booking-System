import { useContext } from "react";
import { DoctorContext } from "../context/DoctorContext";
import { AdminContext } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { dToken, setDToken } = useContext(DoctorContext);
  const { aToken, setAToken } = useContext(AdminContext);

  const navigate = useNavigate();

  const logout = () => {
    navigate("/");

    if (dToken) {
      setDToken("");
      localStorage.removeItem("dToken");
    }

    if (aToken) {
      setAToken("");
      localStorage.removeItem("aToken");
    }
  };

  const role = aToken ? "Admin" : "Doctor";

  const handleLogoClick = () => {
    if (aToken) {
      navigate("/admin-dashboard");
    } else if (dToken) {
      navigate("/doctor-dashboard");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm">
      <div className="flex justify-between items-center px-4 sm:px-10 py-4">
        <div
          className="flex items-center gap-4 cursor-pointer"
          onClick={handleLogoClick}
        >
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold">
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
                MediCare+
              </span>
            </h1>

            <p className="text-[10px] sm:text-xs text-gray-500 tracking-[0.2em] uppercase -mt-1">
              {aToken ? "Admin Dashboard" : "Doctor Dashboard"}
            </p>
          </div>

          <span className="px-3 py-1 text-xs font-medium rounded-full border bg-gray-50 text-gray-600">
            {role}
          </span>
        </div>

        <button
          onClick={logout}
          className="
            bg-gradient-to-r from-red-500 to-pink-500
            text-white text-sm font-medium
            px-6 sm:px-10 py-2.5
            rounded-full
            shadow-md
            hover:shadow-xl
            hover:-translate-y-0.5
            transition-all duration-300
          "
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;