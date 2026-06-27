import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();

  return (
    <section className="px-4 md:px-8 my-20">
      <div
        className="
                    relative
                    overflow-hidden
                    rounded-[32px]
                    bg-gradient-to-r
                    from-blue-700
                    via-blue-600
                    to-cyan-500
                    shadow-2xl
                "
      >
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-300/20 rounded-full blur-3xl"></div>

        <div className="flex flex-col md:flex-row items-center justify-between px-8 md:px-12 lg:px-16 py-10">
          <div className="md:max-w-xl text-white z-10">
            <span className="inline-block px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm text-sm font-medium mb-4">
              🩺 Trusted Healthcare Network
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Book Appointment
              <br />
              With 100+ Trusted Doctors
            </h2>

            <p className="mt-4 text-blue-100 leading-7">
              Connect with experienced specialists and get quality healthcare
              services with just a few clicks.
            </p>

            <button
              onClick={() => {
                navigate("/login");
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className="
                                mt-7
                                bg-white
                                text-blue-700
                                font-semibold
                                px-8
                                py-3
                                rounded-full
                                shadow-lg
                                hover:shadow-xl
                                hover:scale-105
                                transition-all
                                duration-300
                            "
            >
              Create Account
            </button>
          </div>

          <div className="hidden md:flex justify-center mt-8 md:mt-0">
            <img
              src={assets.appointment_img}
              alt="Doctors"
              className="
                                w-[320px]
                                lg:w-[380px]
                                object-contain
                                drop-shadow-2xl
                                hover:scale-105
                                transition-all
                                duration-500
                            "
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
