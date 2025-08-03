import { useState, useEffect } from "react";

import { Camera,  User } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";


import { useApp } from "../context/AppContext";

const LiveDetectionPage = () => {
  const [isDetectionActive, setIsDetectionActive] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [detectionData, setDetectionData] = useState({
    smokingDetected: false,
    faceDetected: false,
    identifiedPerson: null,
    confidence: 0,
  });
  const { addDetection, students } = useApp();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isDetectionActive) {
      const interval = setInterval(() => {
        // Simulate detection results
        const smokingDetected = Math.random() > 0.8;
        const faceDetected = Math.random() > 0.6;
        const confidence = Math.floor(Math.random() * 40) + 60;

        // Select a random student from the database or create unknown person
        const identifiedPerson = faceDetected
          ? students.length > 0
            ? students[Math.floor(Math.random() * students.length)]
            : {
                name: "Unknown Person",
                rollNo: "UNKNOWN",
                department: "Unknown",
              }
          : null;

        setDetectionData({
          smokingDetected,
          faceDetected,
          identifiedPerson,
          confidence,
        });

        // Log detection to backend
        if (faceDetected || smokingDetected) {
          addDetection({
            name: identifiedPerson?.name || "Unknown Person",
            rollNo: identifiedPerson?.rollNo || "UNKNOWN",
            image:
              identifiedPerson?.image ||
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
            smokingDetected,
            faceDetected,
            confidence,
            actionTaken: smokingDetected
              ? alertsEnabled
                ? "Alert sent"
                : "No action"
              : "No action",
          });
        }

        if (smokingDetected && alertsEnabled) {
          toast.error("Smoking violation detected!");
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isDetectionActive, alertsEnabled, addDetection, students]);



  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl mb-2 sm:mb-4 text-green-400">
            Live Detection
          </h1>
          <p className="text-gray-300 text-sm sm:text-base">
            Real-time smoking violation detection and face recognition
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 ">
          {/* Camera Feed */}
          <div className="xl:col-span-2">
            <div className="bg-gray-800 border-gray-700 rounded-xl px-5 py-6">
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <span className="flex items-center text-white text-lg sm:text-xl">
                    <Camera className="mr-2 h-5 w-5" />
                    Camera Feed
                  </span>
                  <button
                    variant={isDetectionActive ? "destructive" : "default"}
                    onClick={() => setIsDetectionActive(!isDetectionActive)}
                    className={`w-full px-4 py-1 rounded-xl cursor-pointer text-white sm:w-auto ${
                      isDetectionActive
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {isDetectionActive ? "Stop Detection" : "Start Detection"}
                  </button>
                </div>
              </div>
              <div>
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-gray-500 text-center">
                      <Camera className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-sm sm:text-base">
                        {isDetectionActive
                          ? "Camera feed active..."
                          : "Camera feed stopped"}
                      </p>
                    </div>
                  </div>

                  {/* Detection Overlays */}
                  {isDetectionActive && detectionData.faceDetected && (
                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 w-20 h-28 sm:w-32 sm:h-40 border-2 border-green-400 rounded">
                      <button className="absolute -top-4 sm:-top-6 left-0 bg-green-600 text-xs">
                        Face Detected
                      </button>
                    </div>
                  )}

                  {isDetectionActive && detectionData.smokingDetected && (
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 w-16 h-12 sm:w-24 sm:h-16 border-2 border-red-400 rounded">
                      <button className="absolute -top-4 sm:-top-6 right-0 bg-red-600 text-xs">
                        Cigarette
                      </button>
                    </div>
                  )}

                  {/* Status Indicator */}
                  <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4">
                    <div
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                        isDetectionActive ? "bg-green-400" : "bg-gray-500"
                      } animate-pulse`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detection Panel */}
          <div className="space-y-4 sm:space-y-6">
            {/* Detection Status */}
            <div className="bg-gray-800 border-gray-700 px-4 py-6 rounded-lg">
              <div className="mb-4">
                <div className="text-white text-lg sm:text-xl">
                  Detection Status
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm sm:text-base">
                    Smoking Status
                  </span>
                  <button
                    variant={
                      detectionData.smokingDetected
                        ? "destructive"
                        : "secondary"
                    }
                    className="text-xs bg-white px-2 py-1  rounded-2xl"
                  >
                    {detectionData.smokingDetected ? "Detected" : "Clear"}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm sm:text-base">
                    Face Detection
                  </span>
                  <button
                    variant={
                      detectionData.faceDetected ? "default" : "secondary"
                    }
                    className="text-xs bg-white px-2 py-1  rounded-2xl"
                  >
                    {detectionData.faceDetected ? "Active" : "None"}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm sm:text-base">
                    Confidence
                  </span>
                  <span className="text-green-400 text-sm sm:text-base font-semibold">
                    {detectionData.confidence}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm sm:text-base">
                    Timestamp
                  </span>
                  <span className="text-gray-400 text-xs sm:text-sm">
                    {currentTime.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Identified Person */}
            {detectionData.identifiedPerson && (
              <div className="bg-gray-800 border-gray-700 px-4 py-6">
                <div className="mb-4">
                  <div className="flex items-center text-white text-lg sm:text-xl">
                    <User className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Identified Person
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300 text-sm sm:text-base">
                      Name:
                    </span>
                    <span className="text-white text-sm sm:text-base font-medium">
                      {detectionData.identifiedPerson.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300 text-sm sm:text-base">
                      ID:
                    </span>
                    <span className="text-white text-sm sm:text-base font-medium">
                      {detectionData.identifiedPerson.rollNo}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300 text-sm sm:text-base">
                      Department:
                    </span>
                    <span className="text-white text-sm sm:text-base font-medium">
                      {detectionData.identifiedPerson.department}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDetectionPage;
