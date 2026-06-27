import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'

const Doctors = () => {

  const { speciality } = useParams()

  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)

  const navigate = useNavigate()

  const { doctors } = useContext(AppContext)

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(
        doctors.filter((doc) => doc.speciality === speciality)
      )
    } else {
      setFilterDoc(doctors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  const specialities = [
    'General physician',
    'Gynecologist',
    'Dermatologist',
    'Pediatricians',
    'Neurologist',
    'Gastroenterologist'
  ]

  return (
    <div className="px-4 md:px-8 lg:px-12 py-8">

      <p className="text-gray-600 text-base md:text-lg mb-6">
        Browse through our trusted doctors and find the right specialist.
      </p>

      <button
        onClick={() => setShowFilter(!showFilter)}
        className={`
          sm:hidden
          mb-5
          px-5
          py-2.5
          border
          border-gray-300
          rounded-lg
          font-medium
          transition-all
          duration-300
          ${showFilter
            ? 'bg-primary text-white'
            : 'bg-white text-gray-700'}
        `}
      >
        {showFilter ? 'Hide Filters' : 'Show Filters'}
      </button>

      <div className="flex flex-col lg:flex-row gap-6">

        <div
          className={`
            ${showFilter ? 'flex' : 'hidden sm:flex'}
            flex-col
            gap-3
            w-full
            sm:w-64
            shrink-0
          `}
        >

          {specialities.map((item, index) => (

            <div
              key={index}
              onClick={() =>
                speciality === item
                  ? navigate('/doctors')
                  : navigate(`/doctors/${item}`)
              }
              className={`
                w-full
                sm:w-56
                px-4
                py-3
                border
                rounded-xl
                cursor-pointer
                transition-all
                duration-300
                hover:bg-[#EAEFFF]
                hover:border-primary
                ${speciality === item
                  ? 'bg-[#E2E5FF] text-black font-semibold border-primary'
                  : 'text-gray-600'}
              `}
            >
              {item}
            </div>

          ))}

        </div>

        <div
          className="
            w-full
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-5
          "
        >

          {filterDoc.map((item) => (

            <div
              key={item._id}
              onClick={() => {
                navigate(`/appointment/${item._id}`)
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                })
              }}
              className="
                bg-white
                border
                border-[#C9D8FF]
                rounded-2xl
                overflow-hidden
                cursor-pointer
                shadow-sm
                hover:shadow-xl
                hover:-translate-y-2
                transition-all
                duration-300
              "
            >

              <div className="overflow-hidden">
                <img
                  className="
                    w-full
                    h-52
                    sm:h-60
                    lg:h-64
                    object-cover
                    bg-[#EAEFFF]
                    hover:scale-105
                    transition-transform
                    duration-500
                  "
                  src={item.image}
                  alt={item.name}
                />
              </div>

              <div className="p-5">

                <div
                  className={`
                    flex
                    items-center
                    gap-2
                    text-sm
                    ${item.available
                      ? 'text-green-500'
                      : 'text-red-500'}
                  `}
                >

                  <span
                    className={`
                      w-2.5
                      h-2.5
                      rounded-full
                      ${item.available
                        ? 'bg-green-500'
                        : 'bg-red-500'}
                    `}
                  ></span>

                  <span>
                    {item.available
                      ? 'Available'
                      : 'Not Available'}
                  </span>

                </div>

                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mt-3">
                  {item.name}
                </h3>

                <p className="text-gray-500 mt-1">
                  {item.speciality}
                </p>

              </div>

            </div>

          ))}

          {filterDoc.length === 0 && (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500 text-lg">
                No doctors found for this speciality.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  )
}

export default Doctors