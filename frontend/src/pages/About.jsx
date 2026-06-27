import { assets } from "../assets/assets";

const About = () => {
  return (
    <div className="px-4 md:px-10 lg:px-16">
      <div className="text-center pt-12 pb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          About <span className="text-blue-600">Us</span>
        </h1>
        <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
          Delivering a seamless healthcare experience through technology, trust,
          and convenience.
        </p>
      </div>

      <div className="my-16 flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2">
          <img
            className="
              w-full
              rounded-3xl
              shadow-2xl
              object-cover
              hover:scale-105
              transition-all
              duration-500
            "
            src={assets.about_image}
            alt="About"
          />
        </div>

        <div className="lg:w-1/2 bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-5">
            Your Trusted Healthcare Partner
          </h2>

          <p className="text-gray-600 leading-8 mb-5">
            Welcome to{" "}
            <span className="font-semibold text-blue-600">Prescripto</span>,
            your trusted platform for hassle-free doctor appointment booking. We
            make healthcare more accessible by connecting patients with
            experienced medical professionals quickly and efficiently.
          </p>

          <p className="text-gray-600 leading-8 mb-5">
            Our platform is designed to simplify appointment scheduling, improve
            patient experiences, and help healthcare providers serve their
            patients more effectively. Whether its your first consultation or
            regular follow-up, Prescripto ensures a smooth journey.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-xl mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Our Vision
            </h3>
            <p className="text-gray-600 leading-7">
              To create a future where healthcare services are accessible,
              convenient, and efficient for everyone through innovative digital
              solutions.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800">
          Why Choose <span className="text-blue-600">Us</span>
        </h2>
        <p className="text-gray-500 mt-3">
          Experience healthcare booking like never before.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-24">
        <div
          className="
            bg-white
            rounded-3xl
            p-8
            shadow-lg
            border
            border-gray-100
            hover:-translate-y-3
            hover:shadow-2xl
            transition-all
            duration-500
          "
        >
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-100 mb-5">
            ⚡
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mb-3">Efficiency</h3>

          <p className="text-gray-600 leading-7">
            Streamlined appointment scheduling that saves your time and fits
            perfectly into your busy lifestyle.
          </p>
        </div>

        <div
          className="
            bg-white
            rounded-3xl
            p-8
            shadow-lg
            border
            border-gray-100
            hover:-translate-y-3
            hover:shadow-2xl
            transition-all
            duration-500
          "
        >
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-cyan-100 mb-5">
            🏥
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mb-3">Convenience</h3>

          <p className="text-gray-600 leading-7">
            Connect with trusted doctors and healthcare specialists from the
            comfort of your home.
          </p>
        </div>

        <div
          className="
            bg-white
            rounded-3xl
            p-8
            shadow-lg
            border
            border-gray-100
            hover:-translate-y-3
            hover:shadow-2xl
            transition-all
            duration-500
          "
        >
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-green-100 mb-5">
            ❤️
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Personalization
          </h3>

          <p className="text-gray-600 leading-7">
            Receive tailored recommendations, reminders, and healthcare
            solutions designed around your needs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
