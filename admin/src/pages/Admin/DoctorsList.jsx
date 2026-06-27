import { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {

  const { doctors, changeAvailability, aToken, getAllDoctors } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  }, [aToken])

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">

      <h1 className="text-xl font-semibold text-gray-800 mb-4">
        All Doctors
      </h1>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {doctors.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition"
          >

            {/* IMAGE (FIXED HEIGHT SOLUTION) */}
            <div className="w-full h-40 bg-gray-100 overflow-hidden">
              <img
                src={item.image}
                alt=""
                className="w-full h-full object-cover hover:scale-105 transition duration-300"
              />
            </div>

            {/* CONTENT */}
            <div className="p-4">

              <p className="text-gray-800 font-semibold text-lg truncate">
                {item.name}
              </p>

              <p className="text-gray-500 text-sm mt-1">
                {item.speciality}
              </p>

              {/* Availability */}
              <div className="flex items-center justify-between mt-4">

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    onChange={() => changeAvailability(item._id)}
                    type="checkbox"
                    checked={item.available}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span>Available</span>
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    item.available
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-500"
                  }`}
                >
                  {item.available ? "Active" : "Inactive"}
                </span>

              </div>

            </div>

          </div>
        ))}

      </div>
    </div>
  )
}

export default DoctorsList