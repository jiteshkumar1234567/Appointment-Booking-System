import { assets } from "../assets/assets";

const Contact = () => {
  return (
    <div className="px-4 md:px-10 lg:px-16">
      <div className="text-center pt-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          Contact <span className="text-blue-600">Us</span>
        </h1>

        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
          Have questions about appointments, doctors, or healthcare services?
          Our team is always ready to assist you.
        </p>
      </div>

      <div className="my-16 flex flex-col lg:flex-row gap-12 items-center">
        <div className="lg:w-1/2">
          <img
            src={assets.contact_image}
            alt=""
            className="
              w-full
              rounded-3xl
              shadow-2xl
              hover:scale-105
              transition-all
              duration-500
            "
          />
        </div>

        <div className="lg:w-1/2">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Get In Touch
            </h2>

            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl">
                📍
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">Our Office</h3>

                <p className="text-gray-500 mt-1">
                  54709 Willms Station
                  <br />
                  Suite 350, Washington, USA
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-2xl">
                📞
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">Call Us</h3>

                <p className="text-gray-500">+1 (415) 555-0132</p>
              </div>
            </div>

            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 bg-cyan-100 rounded-2xl flex items-center justify-center text-2xl">
                ✉️
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">Email Us</h3>

                <p className="text-gray-500">support@prescripto.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center text-2xl">
                ⏰
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">Working Hours</h3>

                <p className="text-gray-500">
                  Monday - Saturday
                  <br />
                  09:00 AM - 08:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-20">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
          <div className="text-4xl mb-4">🚑</div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            Emergency Support
          </h3>
          <p className="text-gray-500">
            Get immediate healthcare assistance and emergency consultation
            support.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
          <div className="text-4xl mb-4">👨‍⚕️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            Expert Doctors
          </h3>
          <p className="text-gray-500">
            Connect with experienced specialists from multiple healthcare
            fields.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Fast Booking</h3>
          <p className="text-gray-500">
            Schedule appointments instantly without waiting in long queues.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
