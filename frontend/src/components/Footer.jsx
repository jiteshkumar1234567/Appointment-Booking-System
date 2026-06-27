const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          <div>
            <h1 className="text-2xl font-extrabold">
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
                MediCare+
              </span>
            </h1>

            <p className="text-xs text-gray-500 tracking-[0.2em] uppercase mt-1 mb-5">
              Your Health, Our Priority
            </p>

            <p className="text-gray-600 leading-6 text-sm">
              Book appointments with trusted doctors, manage schedules, and
              access seamless healthcare services through our smart digital
              platform.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              COMPANY
            </h3>

            <ul className="space-y-3 text-gray-600 text-sm">
              {["Home", "About Us", "Doctors", "Contact"].map((item, i) => (
                <li
                  key={i}
                  className="cursor-pointer hover:text-blue-600 transition-all"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              GET IN TOUCH
            </h3>

            <ul className="space-y-3 text-gray-600 text-sm">
              <li className="hover:text-blue-600 transition-all cursor-pointer">
                +91 92568 4****
              </li>

              <li className="hover:text-blue-600 transition-all cursor-pointer">
                medicare@gmail.com
              </li>

              <li className="text-gray-500 text-xs mt-4">
                24/7 Support Available
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-6 text-center">
          <p className="text-sm text-gray-500">
            © 2026{" "}
            <span className="font-semibold text-gray-700">MediCare+</span>. All
            Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
