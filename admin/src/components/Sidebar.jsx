import { useContext } from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";
import { DoctorContext } from "../context/DoctorContext";
import { AdminContext } from "../context/AdminContext";

const Sidebar = () => {
  const { dToken } = useContext(DoctorContext);
  const { aToken } = useContext(AdminContext);

  const linkClass = ({ isActive }) =>
    `
      flex items-center justify-start
      gap-3
      px-3 md:px-4
      py-3
      mx-2 md:mx-3
      rounded-lg
      text-sm
      transition-all duration-200
      group
      ${
        isActive
          ? "bg-blue-200 text-white-900 font-medium "
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }
    `;

  const iconClass = "w-5 h-5 object-contain shrink-0";

  return (
    <aside
      className="
        w-20 md:w-64
        min-h-screen
        bg-white
        border-r border-gray-200
        sticky top-0
      "
    >
      <div className="mt-5 space-y-1">
        {aToken && (
          <>
            <NavLink to="/admin-dashboard" className={linkClass}>
              <img className={iconClass} src={assets.home_icon} />
              <span className="hidden md:block">Dashboard</span>
            </NavLink>

            <NavLink to="/all-appointments" className={linkClass}>
              <img className={iconClass} src={assets.appointment_icon} />
              <span className="hidden md:block">Appointments</span>
            </NavLink>

            <NavLink to="/add-doctor" className={linkClass}>
              <img className={iconClass} src={assets.add_icon} />
              <span className="hidden md:block">Add Doctor</span>
            </NavLink>

            <NavLink to="/doctor-list" className={linkClass}>
              <img className={iconClass} src={assets.people_icon} />
              <span className="hidden md:block">Doctors</span>
            </NavLink>
          </>
        )}

        {dToken && (
          <>
            <NavLink to="/doctor-dashboard" className={linkClass}>
              <img className={iconClass} src={assets.home_icon} />
              <span className="hidden md:block">Dashboard</span>
            </NavLink>

            <NavLink to="/doctor-appointments" className={linkClass}>
              <img className={iconClass} src={assets.appointment_icon} />
              <span className="hidden md:block">Appointments</span>
            </NavLink>

            <NavLink to="/doctor-profile" className={linkClass}>
              <img className={iconClass} src={assets.people_icon} />
              <span className="hidden md:block">Profile</span>
            </NavLink>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
