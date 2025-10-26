import React, { useEffect, useState } from "react";
import UserAPI from "../../lib/inteceptors/userInterceptor";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const UserViolations = ({ userId }) => {
  const [violations, setViolations] = useState([]);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const fetchViolations = async () => {
      try {
        const res = await UserAPI.get(`/violations/${userId}`);
        setViolations(res.data.violations);
        setIsLocked(res.data.isLocked);
      } catch (err) {
        console.error(err);
      }
    };
    fetchViolations();
  }, [userId]);

  return (
    <div className="rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-color mb-4 flex items-center gap-2">
        <ExclamationTriangleIcon className="w-6 h-6 text-color-3" />
        Account Violations
      </h2>

      {isLocked && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 mb-4 animate-pulse-slow">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mt-0.5" />
          <p className="text-red-600 text-sm leading-relaxed">
            <strong>Warning:</strong> Your account is currently <strong>locked</strong> due to a violation.
          </p>
        </div>
      )}

      {violations.length > 0 ? (
        <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">

          <ul className="divide-y divide-gray-200">
            {violations.map((v, index) => (
              <li
                key={index}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 px-2 hover:bg-gray-50 rounded-md transition-all duration-200"
              >
                <span className="text-gray-700 text-sm sm:text-base font-medium">
                  {v.reason}
                </span>
                <span className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-0">
                  {new Date(v.date).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center py-6">
          <ExclamationTriangleIcon className="w-8 h-8 mx-auto text-gray-300 mb-2" />
          <p className="text-gray-400 text-sm">No violations recorded.</p>
        </div>
      )}
    </div>
  );
};

export default UserViolations;
