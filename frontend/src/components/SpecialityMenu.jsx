import { specialityData } from "../assets/assets";
import { Link } from "react-router-dom";

const SpecialityMenu = () => {
  return (
    <section id="speciality" className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 -z-10"></div>

      <div className="text-center mb-14">
        <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
          Medical Categories
        </span>

        <h1 className="text-4xl md:text-5xl font-bold text-slate-800">
          Find By Speciality
        </h1>

        <p className="max-w-2xl mx-auto mt-4 text-slate-500 leading-7">
          Connect with experienced doctors across multiple specialties and
          schedule appointments effortlessly.
        </p>
      </div>

      <div className="flex sm:justify-center gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {specialityData.map((item, index) => (
          <Link
            key={index}
            to={`/doctors/${item.speciality}`}
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="group flex-shrink-0"
          >
            <div
              className="
                                bg-white
                                rounded-3xl
                                p-6
                                w-40
                                shadow-md
                                hover:shadow-2xl
                                border border-slate-100
                                transition-all
                                duration-500
                                hover:-translate-y-3
                                text-center
                            "
            >
              <div
                className="
                                    w-24
                                    h-24
                                    mx-auto
                                    rounded-full
                                    bg-gradient-to-br
                                    from-blue-50
                                    to-cyan-100
                                    flex
                                    items-center
                                    justify-center
                                    overflow-hidden
                                    mb-4
                                    group-hover:scale-110
                                    transition-all
                                    duration-500
                                "
              >
                <img
                  className="w-14 h-14 object-contain"
                  src={item.image}
                  alt={item.speciality}
                />
              </div>

              <h3
                className="
                                    text-slate-700
                                    font-semibold
                                    text-sm
                                    group-hover:text-blue-600
                                    transition-all
                                "
              >
                {item.speciality}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SpecialityMenu;
