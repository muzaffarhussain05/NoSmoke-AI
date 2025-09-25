import { useState, useMemo } from "react";
import StudentTable from "../components/StudentTable";
import "react-calendar/dist/Calendar.css";
import {
  Plus,
  Search,
  X,
  Edit,
  Trash2,
  Download,
  ChevronDown,
  Upload,
  User,
  Funnel,
  Calendar,
} from "lucide-react";

import { useApp } from "../context/AppContext";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

// normalize any Date / timestamp to local YYYY-MM-DD (not UTC)
function toLocalISODate(value) {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return null;
  const tzOffset = d.getTimezoneOffset() * 60000; // minutes -> ms
  const local = new Date(d.getTime() - tzOffset);
  return local.toISOString().split("T")[0];
}

const History = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const { detections } = useApp();

  // DateRange state (react-date-range)
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [showCalendar, setShowCalendar] = useState(false);
  const [appliedRange, setAppliedRange] = useState(null);
  const [isSingleDay, setIsSingleDay] = useState(false);

  // Apply the current calendar selection as an "applied range"
  const handleSearch = () => {
    setShowCalendar(false);
    const start = toLocalISODate(state[0].startDate);
    const end = toLocalISODate(state[0].endDate);

    if (!start || !end) {
      setAppliedRange(null);
      setIsSingleDay(false);
      return;
    }

    setAppliedRange({ start, end });
    setIsSingleDay(start === end);
  };

  // Memoize detectionHistory mapping
  const detectionHistory = useMemo(() => {
  return (detections || []).map((detection) => {
    const timestamp = detection?.timestamp || new Date().toISOString();
    const dateObj = new Date(timestamp);

    return {
      _id: detection._id, // use DB _id
      timestamp: detection.timestamp,
      time: dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }),
      date: toLocalISODate(dateObj),
      image: detection.image, // or leave blank if you load from backend
      name: detection.name || "Unknown",
      rollNo: detection.rollNo || null,
      department: detection.department || "",
      email: detection.email || "",
      phone: detection.phone || "",
      smokingDetected: !!detection.smokingDetected,
      faceDetected: !!detection.faceDetected,
      actionTaken: detection.actionTaken || "No action",
      confidence: detection.confidence != null ? Math.round(detection.confidence * 100) : 0,
    };
  });
}, [detections]);

  // Memoize filteredHistory (search + status + date-range / single-day)
  const filteredHistory = useMemo(() => {
    const term = (searchTerm || "").toLowerCase().trim();

    return detectionHistory.filter((record) => {
      const matchesSearch =
        (record.name || "").toLowerCase().includes(term) ||
        (record.id_number || "").toLowerCase().includes(term) ||
        (record.rollNo || "").toString().toLowerCase().includes(term) ||
        (record.department || "").toLowerCase().includes(term) ||
        (record.email || "").toLowerCase().includes(term) ||
        (record.phone || "").toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "smoking" && record.smokingDetected) ||
        (statusFilter === "clear" && !record.smokingDetected);

      // date matching using appliedRange (inclusive)
      let matchesDate = true;
      const recordDate = toLocalISODate(record.timestamp ?? record.date);

      if (appliedRange?.start && appliedRange?.end) {
        matchesDate =
          recordDate >= appliedRange.start && recordDate <= appliedRange.end;
      } else if (dateFilter && dateFilter !== "all") {
        matchesDate = recordDate === dateFilter;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [detectionHistory, searchTerm, statusFilter, dateFilter, appliedRange]);

  const exportToCsv = () => {
    const csvContent = [
      [
        "Time",
        "Date",
        "Name",
        "ID",
        "Smoking Detected",
        "Action Taken",
        "Confidence",
      ].join(","),
      ...filteredHistory.map((record) =>
        [
          record.time,
          record.date,
          record.name,
          record.id_number,
          record.smokingDetected ? "Yes" : "No",
          record.actionTaken,
          `${record.confidence}%`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "detection_history.csv";
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl mb-2 sm:mb-4 text-green-400">
            Detection History
          </h1>
          <p className="text-gray-300 text-sm sm:text-base">
            View and manage smoking violation detection logs
          </p>
        </div>

        <div className="bg-gray-800 border-gray-700 px-5 py-6 rounded-lg mb-8">
          <div className="flex justify-between items-center">
            <div>
              <span className="flex items-center text-lg max-sm:text-sm text-white">
                <Funnel className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Filter & Search
              </span>
            </div>
            <div>
              <button
                className="flex items-center md:text-lg max-sm:text-sm bg-green-600 text-white md:px-3 px-1 py-1.5 rounded-xl cursor-pointer hover:bg-green-700"
                onClick={exportToCsv}
              >
                <Download className="md:mr-2 h-4 w-4" />
                <span className="md:text-lg max-sm:text-[12px]">
                  Export CSV
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-6 md:gap-17 mt-8 md:px-2 max-sm:flex-col">
            <div className="bg-gray-700 flex items-center justify-items-start max-sm:justify-center flex-1 relative rounded-2xl border border-gray-600 md:px-12 hover:border-1 hover:border-gray-400">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="text"
                className="md:px-3 py-2 max-sm:text-sm text-left md:py-2 rounded-2xl placeholder:text-gray-400 focus:outline-none text-gray-100 max-sm:placeholder:pl-8 max-sm:placeholder:text-[12px]"
                placeholder="search by name, roll number or department..."
              />
              <Search className="absolute max-sm:left-[6px] md:left-3 text-gray-400 max-sm:h-4 max-sm:w-4" />
            </div>

            <div className="bg-gray-700 gap-13 px-4 justify-around flex items-center max-sm:justify-center relative rounded-2xl border border-gray-600 flex-1 text-white py-2">
              <span>Date Range Picker</span>
              <ChevronDown
                className="text-gray-500 cursor-pointer hover:border-1 hover:border-gray-400"
                onClick={() => setShowCalendar((prev) => !prev)}
              />
              {showCalendar && (
                <div className="absolute top-12 z-20 bg-gray-300 flex flex-col items-center gap-2 py-3 px-2 justify-center rounded">
                  <DateRange
                    editableDateInputs={true}
                    onChange={(item) => setState([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={state}
                    className="rounded-md"
                  />

                  <p className="text-black text-center text-[14px] font-bold ">
                    Selected: {state[0].startDate.toDateString()} -{" "}
                    {state[0].endDate.toDateString()}
                  </p>

                  <div className="flex gap-2">
                    <button
                      className="flex gap-1 items-center bg-green-600 px-2 rounded py-1 cursor-pointer hover:bg-green-900"
                      onClick={handleSearch}
                    >
                      <Search />
                      Search
                    </button>
                    <button
                      className="flex gap-1 items-center bg-red-600 px-2 rounded py-1 cursor-pointer hover:bg-red-800"
                      onClick={() => {
                        setAppliedRange(null);
                        setIsSingleDay(false);
                        setShowCalendar(false);
                      }}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="text-white px-2 py-2 rounded-lg flex gap-2 items-center flex-1">
              <Calendar /> {filteredHistory.length} records found
            </div>
          </div>

          {/* show applied range */}
          {appliedRange && (
            <div className="mt-3 text-sm text-gray-300 flex items-center gap-3">
              {isSingleDay ? (
                <span>
                  Showing records for <strong>{appliedRange.start}</strong>
                </span>
              ) : (
                <span>
                  Showing records from <strong>{appliedRange.start}</strong> to{" "}
                  <strong>{appliedRange.end}</strong>
                </span>
              )}
              <button
                onClick={() => {
                  setAppliedRange(null);
                  setIsSingleDay(false);
                }}
                className="text-xs underline ml-2"
              >
                Clear range
              </button>
            </div>
          )}
        </div>

        <div className="bg-gray-800 border-gray-700 px-4 py-6 rounded-lg ">
          <div className="p-0">
            <div className="overflow-x-auto">
              <StudentTable
                filteredHistory={filteredHistory}
                detectionHistory={detectionHistory}
                history={true}
                detections={detections}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
