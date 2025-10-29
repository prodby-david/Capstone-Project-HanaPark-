import React, { useState, useRef, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { CameraIcon } from "@heroicons/react/24/outline";

const QRScanner = ({ onScanSuccess }) => {
  const [scannerVisible, setScannerVisible] = useState(false);
  const readerRef = useRef(null);
  const scannerRef = useRef(null);

  const startScanner = () => setScannerVisible(true);

  const closeScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch((err) => console.error(err));
      scannerRef.current = null;
    }
    setScannerVisible(false);
  };

  useEffect(() => {
    if (scannerVisible && readerRef.current && !scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(readerRef.current.id, {
        fps: 10,
        qrbox: 350,
        aspectRatio: 1,
      });

      const onSuccess = (decodedText) => {
        onScanSuccess(decodedText);
        closeScanner();
      };

      scannerRef.current.render(onSuccess, (error) =>
        console.warn("QR scan error:", error)
      );
    }
  }, [scannerVisible, onScanSuccess]);

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={startScanner}
        className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition mb-2"
      >
        <CameraIcon className="w-5 h-5" />
        Scan QR
      </button>

      {scannerVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative bg-white p-1 rounded shadow-lg">
            <div
              id="reader"
              ref={readerRef}
              className="w-[300px] h-[300px] mx-auto"
            />
            <button
              onClick={closeScanner}
              className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
