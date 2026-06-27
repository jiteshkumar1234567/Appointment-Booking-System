import  { useContext, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const Dashboard = () => {

  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  return dashData && (
    <div className="p-4 md:p-6 space-y-6">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50">
            <img className="w-10 h-10" src={assets.doctor_icon} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{dashData.doctors}</p>
            <p className="text-gray-500 text-sm">Doctors</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-50">
            <img className="w-10 h-10" src={assets.appointments_icon} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{dashData.appointments}</p>
            <p className="text-gray-500 text-sm">Appointments</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center gap-4">
          <div className="p-3 rounded-xl bg-green-50">
            <img className="w-10 h-10" src={assets.patients_icon} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{dashData.patients}</p>
            <p className="text-gray-500 text-sm">Patients</p>
          </div>
        </div>

      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="flex items-center gap-2 px-5 py-4 border-b bg-gray-50">
          <img src={assets.list_icon} className="w-5 h-5" />
          <p className="font-semibold text-gray-700">Latest Bookings</p>
        </div>

        <div className="divide-y">

          {dashData.latestAppointments.slice(0, 5).map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-all"
            >

              <div className="flex items-center gap-3 flex-1">
                <img
                  className="w-11 h-11 rounded-full object-cover border"
                  src={item.docData.image}
                />

                <div>
                  <p className="text-gray-800 font-medium">
                    {item.docData.name}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Booking on {slotDateFormat(item.slotDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end sm:justify-center">

                {item.cancelled ? (
                  <span className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-500">
                    Cancelled
                  </span>
                ) : item.isCompleted ? (
                  <span className="text-xs px-3 py-1 rounded-full bg-green-50 text-green-600">
                    Completed
                  </span>
                ) : (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="p-2 rounded-full hover:bg-red-50 transition-all"
                  >
                    <img
                      className="w-8 h-8"
                      src={assets.cancel_icon}
                    />
                  </button>
                )}

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  )
}

export default Dashboard