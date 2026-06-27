import { assets } from "../assets/assets";

const Header = () => {
  return (
    <section className="mt-6 px-4 md:mt-8 md:px-8">
      <div className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-blue-800 via-blue-600 to-cyan-500 shadow-2xl">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/20 blur-3xl"></div>
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/2 h-52 w-52 rounded-full bg-blue-950/20 blur-3xl"></div>

        <div className="relative z-10 flex flex-col items-center justify-between gap-10 px-6 py-10 sm:px-8 md:px-12 lg:flex-row lg:px-16 lg:py-6">
          <div className="max-w-xl text-center text-white lg:w-1/2 lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold text-white shadow-sm backdrop-blur-md md:text-sm">
              🏥 Trusted Healthcare Platform
            </span>

            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-[58px]">
              Book Appointment
              <br />
              <span className="text-cyan-100">With Trusted Doctors</span>
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-7 text-blue-50 md:text-base">
              Find experienced doctors, compare specialists, check availability
              and book appointments instantly from anywhere.
            </p>

            <div className="mt-7 flex flex-col items-center gap-5 sm:flex-row lg:justify-start">
              <a
                href="#speciality"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-blue-700 shadow-xl shadow-blue-950/20 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-blue-50"
              >
                Book Appointment
                <img className="w-3" src={assets.arrow_icon} alt="" />
              </a>

              <div className="flex items-center gap-3">
                <img
                  className="w-28 drop-shadow-md"
                  src={assets.group_profiles}
                  alt=""
                />
                <div>
                  <p className="text-sm font-semibold text-white">
                    10,000+ Happy Patients
                  </p>
                  <p className="text-xs text-blue-100">
                    Trusted by families
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid max-w-md grid-cols-3 gap-3 mx-auto lg:mx-0">
              <div className="rounded-2xl border border-white/20 bg-white/15 p-4 backdrop-blur-md">
                <h3 className="text-xl font-extrabold">24/7</h3>
                <p className="mt-1 text-xs text-blue-100">Booking</p>
              </div>

              <div className="rounded-2xl border border-white/20 bg-white/15 p-4 backdrop-blur-md">
                <h3 className="text-xl font-extrabold">25+</h3>
                <p className="mt-1 text-xs text-blue-100">Doctors At Time</p>
              </div>

              <div className="rounded-2xl border border-white/20 bg-white/15 p-4 backdrop-blur-md">
                <h3 className="text-xl font-extrabold">Easy</h3>
                <p className="mt-1 text-xs text-blue-100">Checkups</p>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center lg:w-1/2">
            <div className="absolute bottom-0 h-64 w-64 rounded-full bg-white/20 blur-3xl"></div>

            <div className="relative rounded-[32px] bg-white/10 p-3 backdrop-blur-sm">
              <img
                className="relative z-10 w-full max-w-[430px] object-contain drop-shadow-2xl"
                src={assets.header_img}
                alt="Doctors"
              />
            </div>

            <div className="absolute -left-2 bottom-8 hidden rounded-2xl border border-white/20 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-md md:block">
              <p className="text-xs font-semibold text-slate-500">
                Appointment
              </p>
              <p className="text-sm font-bold text-slate-900">
                Booked Successfully
              </p>
            </div>

            <div className="absolute right-0 top-10 hidden rounded-2xl border border-white/20 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-md md:block">
              <p className="text-xs font-semibold text-slate-500">
                Specialist
              </p>
              <p className="text-sm font-bold text-blue-700">
                Verified Doctors
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;