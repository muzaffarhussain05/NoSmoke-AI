import { useState, useEffect, useRef } from "react";
import { Camera, User, Users, Download, Image as ImageIcon, AlertTriangle } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

import { useApp } from "../context/AppContext";

const LiveDetectionPage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const wsRef = useRef(null);
  const streamRef = useRef(null);
  const sendIntervalRef = useRef(null);

  const [isDetectionActive, setIsDetectionActive] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [detectionData, setDetectionData] = useState({
    smokingDetected: false,
    confidence: 0,
    recognizedStudents: [],
    faceRecognitionEnabled: false,
    screenshotSaved: false,
    screenshotPath: null,
    detectionType: "none" // none, recognized, unknown
  });

  const { addDetection } = useApp();

  // ⏰ Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 🟢 Start detection
  const startDetection = async () => {
    try {
      // Start webcam
      streamRef.current = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      videoRef.current.srcObject = streamRef.current;

      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play();
        console.log("🎥 Video ready:", videoRef.current.videoWidth, videoRef.current.videoHeight);
      };

      // Start WebSocket
      wsRef.current = new WebSocket("ws://localhost:8000/ws/detect");

      wsRef.current.onopen = () => {
        console.log("🔌 WebSocket connected, starting frame sender...");

        // Send frames every 500ms
        sendIntervalRef.current = setInterval(() => {
          if (
            videoRef.current &&
            videoRef.current.videoWidth > 0 &&
            wsRef.current &&
            wsRef.current.readyState === WebSocket.OPEN
          ) {
            const canvas = document.createElement("canvas");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            const dataURL = canvas.toDataURL("image/jpeg");
            wsRef.current.send(dataURL);
          }
        }, 500);
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("📨 Received data:", data);

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw detections
        data.detections.forEach((det) => {
          const [x1, y1, x2, y2] = det.bbox;
          ctx.strokeStyle = det.class === "person" ? "blue" : "red";
          ctx.lineWidth = 2;
          ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

          ctx.fillStyle = det.class === "person" ? "blue" : "red";
          ctx.font = "14px Arial";
          ctx.fillText(`${det.class} ${Math.round(det.confidence * 100)}%`, x1, y1 - 5);
        });

        // 🚬 Smoking detection logic
        const cigaretteDetections = data.detections.filter((d) => d.class === "cigarette");
        const hasCigarette = cigaretteDetections.length > 0;
        const maxConfidence = Math.max(...cigaretteDetections.map((c) => c.confidence * 100), 0);

        // Update detection data with all info
        setDetectionData({
          smokingDetected: hasCigarette,
          confidence: maxConfidence,
          recognizedStudents: data.recognized_students || [],
          faceRecognitionEnabled: data.face_recognition_enabled || false,
          screenshotSaved: data.screenshot_saved || false,
          screenshotPath: data.screenshot_path || null,
          detectionType: data.detection_type || "none"
        });

        // Auto-add detection when cigarette is detected (both recognized and unknown)
        if (hasCigarette) {
          if (data.recognized_students && data.recognized_students.length > 0) {
            // Recognized students
            data.recognized_students.forEach((student) => {
              const detectionRecord = {
                name: student.name,
                rollNo: student.rollNo,
                department: student.department,
                image: "https://via.placeholder.com/100",
                smokingDetected: true,
                faceDetected: true,
                confidence: student.confidence * 100,
                actionTaken: alertsEnabled ? "Alert sent - Auto-detected via facial recognition" : "No action",
                screenshotPath: data.screenshot_path,
                screenshotSaved: data.screenshot_saved,
                detectionType: "recognized"
              };

              addDetection(detectionRecord);

              if (alertsEnabled) {
                toast.success(
                  <div>
                    <div>🚭 Smoking violation detected!</div>
                    <div><strong>Student:</strong> {student.name} ({student.rollNo})</div>
                    <div><strong>Confidence:</strong> {Math.round(student.confidence * 100)}%</div>
                    <div><strong>Status:</strong> ✅ Identified</div>
                    {data.screenshot_saved && <div>📸 Evidence screenshot saved</div>}
                  </div>,
                  { autoClose: 6000 }
                );
              }
            });
          } else {
            // Unknown person
            const detectionRecord = {
              name: "Unknown",
              rollNo: "N/A",
              department: "Unknown",
              image: data.screenshot_path,
              smokingDetected: true,
              faceDetected: false,
              confidence: maxConfidence,
              actionTaken: alertsEnabled ? "Alert sent - Unknown person" : "No action",
              screenshotPath: data.screenshot_path,
              screenshotSaved: data.screenshot_saved,
              detectionType: "unknown"
            };

            addDetection(detectionRecord);

            if (alertsEnabled) {
              toast.warning(
                <div>
                  <div>🚭 Smoking violation detected!</div>
                  <div><strong>Person:</strong> 🔍 Unknown (Facial recognition required)</div>
                  <div><strong>Confidence:</strong> {maxConfidence.toFixed(2)}%</div>
                  <div><strong>Status:</strong> ⚠️ Unidentified</div>
                  {data.screenshot_saved && <div>📸 Evidence screenshot saved for investigation</div>}
                </div>,
                { autoClose: 6000 }
              );
            }
          }
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        toast.error("WebSocket connection error");
      };

    } catch (error) {
      console.error("❌ Error starting detection:", error);
      toast.error("Failed to start detection");
    }
  };

  // 🔴 Stop detection
  const stopDetection = () => {
    // Stop webcam
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Stop sending frames
    if (sendIntervalRef.current) {
      clearInterval(sendIntervalRef.current);
      sendIntervalRef.current = null;
    }

    // Close WebSocket
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // Clear canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    setDetectionData({ 
      smokingDetected: false, 
      confidence: 0, 
      recognizedStudents: [],
      faceRecognitionEnabled: false,
      screenshotSaved: false,
      screenshotPath: null,
      detectionType: "none"
    });
  };

  // Download screenshot function
  const downloadScreenshot = async () => {
    if (!detectionData.screenshotPath) {
      toast.error("No screenshot available to download");
      return;
    }

    try {
      // Extract filename from path and download
      const filename = detectionData.screenshotPath.split('/').pop();
      const response = await fetch(`http://localhost:8000/screenshots/${filename}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success("Evidence screenshot downloaded successfully");
      } else {
        toast.error("Failed to download screenshot");
      }
    } catch (error) {
      console.error("Error downloading screenshot:", error);
      toast.error("Error downloading screenshot");
    }
  };

  // 🔄 Handle start/stop toggle
  useEffect(() => {
    if (isDetectionActive) {
      startDetection();
    } else {
      stopDetection();
    }

    return () => stopDetection(); // cleanup on unmount
  }, [isDetectionActive, alertsEnabled]);

  return (
    <div className="min-h-screen bg-gray-900">
      <ToastContainer />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl mb-2 sm:mb-4 text-green-400">Live Detection</h1>
          <p className="text-gray-300 text-sm sm:text-base">
            Real-time cigarette smoking violation detection with facial recognition and evidence collection
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          {/* Camera Feed */}
          <div className="xl:col-span-2">
            <div className="bg-gray-800 border-gray-700 rounded-xl px-5 py-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <span className="flex items-center text-white text-lg sm:text-xl">
                  <Camera className="mr-2 h-5 w-5" />
                  Camera Feed
                </span>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setAlertsEnabled(!alertsEnabled)}
                    className={`px-4 py-1 rounded-xl cursor-pointer text-white ${
                      alertsEnabled ? "bg-yellow-600 hover:bg-yellow-700" : "bg-gray-600 hover:bg-gray-700"
                    }`}
                  >
                    Alerts: {alertsEnabled ? "ON" : "OFF"}
                  </button>
                  <button
                    onClick={() => setIsDetectionActive(!isDetectionActive)}
                    className={`px-4 py-1 rounded-xl cursor-pointer text-white ${
                      isDetectionActive
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {isDetectionActive ? "Stop Detection" : "Start Detection"}
                  </button>
                </div>
              </div>

              <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <canvas
                  ref={canvasRef}
                  width={640}
                  height={480}
                  className="absolute top-0 left-0 w-full h-full"
                />

                {/* Status overlay */}
                <div className="absolute top-2 left-2 flex gap-2 flex-wrap">
                  <div className={`px-2 py-1 rounded text-xs font-bold ${
                    isDetectionActive ? "bg-green-500" : "bg-gray-500"
                  }`}>
                    {isDetectionActive ? "LIVE" : "OFF"}
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-bold ${
                    detectionData.faceRecognitionEnabled ? "bg-blue-500" : "bg-yellow-500"
                  }`}>
                    Face Rec: {detectionData.faceRecognitionEnabled ? "ON" : "NO DATA"}
                  </div>
                  {detectionData.screenshotSaved && (
                    <div className={`px-2 py-1 rounded text-xs font-bold ${
                      detectionData.detectionType === "recognized" ? "bg-green-500" : "bg-orange-500"
                    }`}>
                      📸 {detectionData.detectionType.toUpperCase()} EVIDENCE SAVED
                    </div>
                  )}
                </div>

                {/* Recognized students overlay */}
                {detectionData.recognizedStudents.length > 0 && (
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 p-2 rounded">
                    <div className="text-white text-sm font-bold mb-1">✅ Identified:</div>
                    {detectionData.recognizedStudents.map((student, index) => (
                      <div key={index} className="text-green-300 text-xs">
                        {student.name} ({student.rollNo}) - {Math.round(student.confidence * 100)}%
                      </div>
                    ))}
                  </div>
                )}

                {/* Unknown person overlay */}
                {detectionData.smokingDetected && detectionData.recognizedStudents.length === 0 && (
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 p-2 rounded">
                    <div className="text-orange-300 text-sm font-bold mb-1 flex items-center">
                      <AlertTriangle size={14} className="mr-1" />
                      ⚠️ Unknown Person
                    </div>
                    <div className="text-orange-200 text-xs">
                      Smoking detected - Facial recognition required
                    </div>
                  </div>
                )}
              </div>

              {/* Screenshot Download Button */}
              {detectionData.screenshotSaved && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={downloadScreenshot}
                    className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity ${
                      detectionData.detectionType === "recognized" ? "bg-green-600" : "bg-orange-600"
                    }`}
                  >
                    <Download size={16} />
                    Download {detectionData.detectionType === "recognized" ? "Identified" : "Unknown"} Evidence
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Detection Panel */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gray-800 border-gray-700 px-4 py-6 rounded-lg">
              <div className="mb-4 text-white text-lg sm:text-xl">Detection Status</div>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm sm:text-base">Smoking Status</span>
                  <button className={`text-xs px-2 py-1 rounded-2xl ${
                    detectionData.smokingDetected ? "bg-red-500 text-white" : "bg-green-500 text-white"
                  }`}>
                    {detectionData.smokingDetected ? "DETECTED" : "CLEAR"}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm sm:text-base">Detection Type</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    detectionData.detectionType === "recognized" ? "bg-green-500" : 
                    detectionData.detectionType === "unknown" ? "bg-orange-500" : "bg-gray-500"
                  }`}>
                    {detectionData.detectionType === "recognized" ? "IDENTIFIED" : 
                     detectionData.detectionType === "unknown" ? "UNKNOWN" : "NONE"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm sm:text-base">Confidence</span>
                  <span className="text-green-400 text-sm sm:text-base font-semibold">
                    {detectionData.confidence.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm sm:text-base">Faces Recognized</span>
                  <span className="text-blue-400 text-sm sm:text-base font-semibold">
                    {detectionData.recognizedStudents.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm sm:text-base">Evidence Saved</span>
                  <span className={`text-sm font-semibold ${
                    detectionData.screenshotSaved ? "text-green-400" : "text-gray-400"
                  }`}>
                    {detectionData.screenshotSaved ? "✅ SAVED" : "❌ NOT SAVED"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm sm:text-base">Timestamp</span>
                  <span className="text-gray-400 text-xs sm:text-sm">
                    {currentTime.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Recognized Students Panel */}
            {detectionData.recognizedStudents.length > 0 && (
              <div className="bg-gray-800 border-gray-700 px-4 py-6 rounded-lg">
                <div className="flex items-center mb-4 text-white text-lg sm:text-xl">
                  <Users className="mr-2 h-5 w-5" />
                  Identified Students
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {detectionData.recognizedStudents.map((student, index) => (
                    <div key={index} className="bg-green-900 bg-opacity-30 p-3 rounded-lg border border-green-600">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-white font-semibold">✅ {student.name}</div>
                          <div className="text-green-300 text-sm">{student.rollNo}</div>
                          <div className="text-green-400 text-xs">{student.department}</div>
                        </div>
                        <div className="text-green-400 text-sm font-semibold">
                          {Math.round(student.confidence * 100)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Unknown Detection Panel */}
            {detectionData.smokingDetected && detectionData.recognizedStudents.length === 0 && (
              <div className="bg-gray-800 border-gray-700 px-4 py-6 rounded-lg">
                <div className="flex items-center mb-4 text-white text-lg sm:text-xl">
                  <AlertTriangle className="mr-2 h-5 w-5 text-orange-400" />
                  Unknown Detection
                </div>
                <div className="bg-orange-900 bg-opacity-30 p-4 rounded-lg border border-orange-600">
                  <div className="text-orange-300 font-semibold">⚠️ Investigation Required</div>
                  <div className="text-orange-200 text-sm mt-2">
                    Smoking detected but person could not be identified. Evidence has been saved for further investigation.
                  </div>
                </div>
              </div>
            )}

            {/* System Status Panel */}
            <div className="bg-gray-800 border-gray-700 px-4 py-6 rounded-lg">
              <div className="mb-4 text-white text-lg sm:text-xl">System Status</div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm sm:text-base">Face Recognition</span>
                  <span className={`text-sm font-semibold ${
                    detectionData.faceRecognitionEnabled ? "text-green-400" : "text-yellow-400"
                  }`}>
                    {detectionData.faceRecognitionEnabled ? "ACTIVE" : "NO STUDENT DATA"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm sm:text-base">Alerts</span>
                  <span className={`text-sm font-semibold ${
                    alertsEnabled ? "text-green-400" : "text-gray-400"
                  }`}>
                    {alertsEnabled ? "ENABLED" : "DISABLED"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm sm:text-base">Connection</span>
                  <span className={`text-sm font-semibold ${
                    isDetectionActive ? "text-green-400" : "text-gray-400"
                  }`}>
                    {isDetectionActive ? "CONNECTED" : "DISCONNECTED"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDetectionPage;