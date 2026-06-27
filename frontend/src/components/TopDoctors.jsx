import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  return (
    <section className="relative py-24 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10"></div>

      <div className="text-center mb-16">
        <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
          Healthcare Experts
        </span>

        <h1 className="text-4xl md:text-5xl font-bold text-slate-800">
          Top Doctors To Book
        </h1>

        <p className="max-w-2xl mx-auto mt-4 text-slate-500 leading-7">
          Consult with experienced specialists and receive quality healthcare
          services tailored to your needs.
        </p>
      </div>

      <div
        className="
          grid
          gap-8
          justify-center
          [grid-template-columns:repeat(auto-fit,minmax(280px,320px))]
          max-w-7xl
          mx-auto
        "
      >
        {doctors.slice(0, 10).map((item) => (
          <div
            key={item._id}
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            className="
              group
              bg-white
              rounded-3xl
              overflow-hidden
              border
              border-slate-100
              shadow-lg
              hover:shadow-2xl
              hover:-translate-y-3
              transition-all
              duration-500
              cursor-pointer
              w-full
              max-w-[320px]
              mx-auto
            "
          >
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-100">
              <img
                src={item.image}
                alt={item.name}
                className="
                  w-full
                  h-[280px]
                  object-cover
                  group-hover:scale-110
                  transition-transform
                  duration-700
                "
              />

              <div className="absolute top-4 left-4">
                <span
                  className={`
                    px-3 py-1
                    rounded-full
                    text-xs
                    font-semibold
                    shadow-md
                    ${
                      item.available
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }
                  `}
                >
                  {item.available ? "● Available" : "● Unavailable"}
                </span>
              </div>
            </div>

            <div className="p-5">
              <h2 className="text-xl font-bold text-slate-800">{item.name}</h2>

              <p className="text-slate-500 mt-1">{item.speciality}</p>

              <div className="grid grid-cols-3 gap-3 mt-5">
                <div className="bg-slate-50 rounded-xl py-3 text-center">
                  <p className="text-xs text-gray-400">Experience</p>
                  <p className="font-semibold text-slate-700">
                    {item.experience || "5+"}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl py-3 text-center">
                  <p className="text-xs text-gray-400">Fee</p>
                  <p className="font-semibold text-slate-700">
                    ₹{item.fees || 500}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl py-3 text-center">
                  <p className="text-xs text-gray-400">Rating</p>
                  <p className="font-semibold text-yellow-500">
                    ★ {item.averageRating ? item.averageRating : "0.0"}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {item.totalReviews || 0} reviews
                  </p>
                </div>
              </div>

              <button
                className="
                  mt-6
                  w-full
                  bg-gradient-to-r
                  from-blue-600
                  to-cyan-500
                  text-white
                  py-3
                  rounded-xl
                  font-semibold
                  shadow-md
                  hover:shadow-xl
                  hover:scale-[1.02]
                  transition-all
                  duration-300
                "
              >
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-16">
        <button
          onClick={() => {
            navigate("/doctors");
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
          className="
            px-10
            py-4
            rounded-full
            bg-gradient-to-r
            from-blue-600
            to-cyan-500
            text-white
            font-semibold
            shadow-lg
            hover:shadow-2xl
            hover:scale-105
            transition-all
            duration-300
          "
        >
          View All Doctors
        </button>
      </div>
    </section>
  );
};

export default TopDoctors;