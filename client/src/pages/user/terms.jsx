import React from "react";
import Header from "../../components/headers/header";
import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  UserIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  GlobeAltIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

const TermsAndConditions = () => {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center my-10 px-6 lg:px-20 min-h-screen">
        <div className="max-w-5xl bg-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 lg:p-12">
          <h1 className="text-3xl font-bold text-color mb-6 text-center">
            Terms and Conditions
          </h1>
          <p className="text-gray-600 text-center mb-10">
            Please read these Terms and Conditions carefully before using HanaPark.  
            By accessing or using this platform, you agree to comply with and be bound by the following terms.
          </p>

          <div className="space-y-10">
            {/* Section 1 */}
            <section>
              <div className="flex items-center gap-3 mb-3">
                <BuildingOfficeIcon className="w-8 h-8 text-color-3" />
                <h2 className="text-xl font-semibold text-color-3">1. Overview</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                HanaPark is a smart parking web application developed exclusively for
                <span className="font-semibold text-color-3"> STI College Global City</span>.  
                It provides students and staff with real-time access to parking slot availability, reservations, and activity monitoring for improved campus convenience.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <div className="flex items-center gap-3 mb-3">
                <UserIcon className="w-8 h-8 text-color-3" />
                <h2 className="text-xl font-semibold text-color-3">2. User Eligibility</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Access to HanaPark is limited to authorized users only — specifically, active
                <span className="font-semibold"> STI College Global City</span> students and staff with valid institutional accounts.
                Sharing login credentials, impersonating others, or unauthorized use of the system is strictly prohibited.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <div className="flex items-center gap-3 mb-3">
                <ClockIcon className="w-8 h-8 text-color-3" />
                <h2 className="text-xl font-semibold text-color-3">3. Reservation Policy</h2>
              </div>
              <ul className="list-disc ml-6 text-gray-700 leading-relaxed space-y-2">
                <li>Users may reserve only one parking slot at a time.</li>
                <li>Reservations must be claimed within the specified time period.</li>
                <li>Failure to show up within the allowed time may result in automatic cancellation.</li>
                <li>Repeated no-shows may affect future reservation eligibility.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <div className="flex items-center gap-3 mb-3">
                <ExclamationTriangleIcon className="w-8 h-8 text-color-3" />
                <h2 className="text-xl font-semibold text-color-3">4. Violation and Penalty</h2>
              </div>
              <ul className="list-disc ml-6 text-gray-700 leading-relaxed space-y-2">
                <li>Users who cancel a reservation after admin confirmation will be tagged with a violation.</li>
                <li>Accumulating <span className="font-semibold">three (3)</span> violations may lead to temporary suspension.</li>
                <li>Severe or repeated offenses can result in permanent restriction from the system.</li>
                <li>All violation records are visible in the user’s activity history.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section>
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheckIcon className="w-8 h-8 text-color-3" />
                <h2 className="text-xl font-semibold text-color-3">5. Data Privacy and Security</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                HanaPark prioritizes user privacy and data protection.  
                All personal information, login credentials, and reservation records are encrypted and stored securely.  
                Data is used solely for system operations, monitoring, and campus management purposes in compliance with institutional and data protection policies.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <div className="flex items-center gap-3 mb-3">
                <InformationCircleIcon className="w-8 h-8 text-color-3" />
                <h2 className="text-xl font-semibold text-color-3">6. User Responsibilities</h2>
              </div>
              <ul className="list-disc ml-6 text-gray-700 leading-relaxed space-y-2">
                <li>Users must ensure that their account credentials remain confidential.</li>
                <li>All parking slot reservations must be made honestly and for legitimate use only.</li>
                <li>Users must follow all parking rules and campus security guidelines when entering or exiting the parking area.</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section>
              <div className="flex items-center gap-3 mb-3">
                <GlobeAltIcon className="w-8 h-8 text-color-3" />
                <h2 className="text-xl font-semibold text-color-3">7. System Availability and Updates</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                HanaPark strives to maintain system uptime and accessibility at all times.  
                However, maintenance, updates, or technical issues may occasionally cause downtime.  
                Users will be notified of planned system maintenance through official STI channels.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <div className="flex items-center gap-3 mb-3">
                <CheckCircleIcon className="w-8 h-8 text-color-3" />
                <h2 className="text-xl font-semibold text-color-3">8. Limitation of Liability</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                HanaPark and its administrators shall not be held liable for any damages, losses, or inconveniences resulting from
                misuse of the system, user negligence, or technical failures beyond our control.  
                Users are expected to exercise responsibility and comply with campus rules while using the system.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <div className="flex items-center gap-3 mb-3">
                <CheckCircleIcon className="w-8 h-8 text-color-3" />
                <h2 className="text-xl font-semibold text-color-3">9. Agreement and Modifications</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                By using HanaPark, you acknowledge that you have read, understood, and agreed to all terms and policies stated above.  
                The administrators reserve the right to modify these terms as necessary to improve services or ensure compliance.  
                Updates will be communicated through the official STI College Global City website or announcements.
              </p>
            </section>
          </div>

          <div className="mt-12 text-center border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600">
              Last updated: <span className="font-semibold">October 2025</span>
            </p>
            <p className="text-sm text-gray-600">
              For questions or clarifications, please contact the HanaPark administration.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsAndConditions;
