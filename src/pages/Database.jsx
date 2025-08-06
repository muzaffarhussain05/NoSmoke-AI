import { useState } from "react";
import StudentTable from "../components/StudentTable";
import { Plus, Search, X, Edit, Trash2, Upload, User } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useApp } from "../context/AppContext";

const Database = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const { students, addStudent, updateStudent, deleteStudent } = useApp();

  const [newStudent, setNewStudent] = useState({
    name: "",
    rollNo: "",
    department: "",
    email: "",
    phone: "",
    image: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewStudent((prev) => ({
          ...prev,
          image: reader.result, // Base64 string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredStudents = (students || []).filter((student) => {
    const term = (searchTerm || "").toLowerCase();
    return (
      (student.name || "").toLowerCase().includes(term) ||
      (student.rollNo || "").toLowerCase().includes(term) ||
      (student.department || "").toLowerCase().includes(term)
    );
  });

  const handleAddStudent = async () => {
    if (
      !newStudent.name ||
      !newStudent.rollNo ||
      !newStudent.department ||
      !newStudent.image
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const studentData = {
      ...newStudent,
    };

    const success = await addStudent(studentData);
    if (success) {
      setNewStudent({
        name: "",
        rollNo: "",
        department: "",
        email: "",
        phone: "",
        image: "",
      });
      setOpen(false);
      toast.success("Student added successfully");
    } else {
      toast.error("Failed to add student");
    }
  };

  const handleDeleteStudent = async (rollNo) => {
    const success = await deleteStudent(rollNo);
    if (success) {
      toast.success("Student removed from database");
    } else {
      toast.error("Failed to remove student");
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setNewStudent(student);
    setOpen(true);
  };

  const handleUpdateStudent = async () => {
    if (!editingStudent) return;

    const success = await updateStudent(editingStudent.rollNo, newStudent);
    if (success) {
      setEditingStudent(null);
      setNewStudent({
        name: "",
        rollNo: "",
        department: "",
        email: "",
        phone: "",
        image: "",
      });
      setOpen(false);
      toast.success("Student information updated");
    } else {
      toast.error("Failed to update student");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl mb-2 sm:mb-4 text-green-400">
            Students Database
          </h1>
          <p className="text-gray-300 text-sm sm:text-base">
            Manage student records for face recognition system
          </p>
        </div>

        <div className="bg-gray-800 border-gray-700 px-5 py-6 rounded-lg mb-8">
          <div className="flex justify-between items-center">
            <div>
              <span className="flex items-center text-lg max-sm:text-sm text-white">
                <User className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Student Management
              </span>
            </div>
            <div>
              <button
                className="flex items-center md:text-lg max-sm:text-sm bg-green-600 text-white md:px-3 px-1 py-1.5 rounded-xl cursor-pointer hover:bg-green-700"
                onClick={() => {
                  setOpen(true);
                  setEditingStudent(null);
                  setNewStudent({
                    name: "",
                    rollNo: "",
                    department: "",
                    email: "",
                    phone: "",
                    image: "",
                  });
                }}
              >
                <Plus className="md:mr-2 h-4 w-4" />
                <span className="md:text-lg max-sm:text-[12px]">Add Student</span>
              </button>
            </div>
          </div>

          {open && (
            <div>
              <div
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              />
              <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-gray-800 border border-gray-700 text-white rounded-lg p-6 shadow-lg flex flex-col gap-5">
                <div>
                  <form>
                    <div className="space-y-4">
                      <input
                        value={newStudent.name}
                        onChange={handleInputChange}
                        name="name"
                        placeholder="Full Name"
                        className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded"
                      />
                      <input
                        value={newStudent.rollNo}
                        onChange={handleInputChange}
                        name="rollNo"
                        placeholder="Roll No."
                        className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded"
                      />
                      <input
                        value={newStudent.department}
                        onChange={handleInputChange}
                        name="department"
                        placeholder="Department"
                        className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded"
                      />
                      <input
                        value={newStudent.email}
                        onChange={handleInputChange}
                        name="email"
                        placeholder="Email"
                        className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded"
                      />
                      <input
                        value={newStudent.phone}
                        onChange={handleInputChange}
                        name="phone"
                        placeholder="Phone"
                        className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded"
                      />
                      <input
                        placeholder="upload profile"
                        type="file"
                        name="image"
                        className="bg-gray-600 px-2 py-2 text-gray-300 cursor-pointer hover:border hover:border-gray-100"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>
                  </form>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="bg-red-600 py-1 rounded-sm px-3 cursor-pointer hover:bg-red-700"
                    onClick={() => setOpen(false)}
                  >
                    <X className="h-6 w-5" />
                  </button>
                  {editingStudent ? (
                    <button
                      className="bg-green-600 hover:bg-green-700 py-1 rounded-sm px-3 cursor-pointer"
                      onClick={handleUpdateStudent}
                    >
                      Update Student
                    </button>
                  ) : (
                    <button
                      className="bg-green-600 hover:bg-green-700 py-1 rounded-sm px-3 cursor-pointer"
                      onClick={handleAddStudent}
                    >
                      Add Student
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-7 mt-8 md:px-2 max-sm:flex-col ">
            <div className="bg-gray-700 flex-6 flex items-center justify-items-start max-sm:justify-center w-full relative rounded-2xl border border-gray-600">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-5 md:px-10 pl-6 py-2 max-sm:text-sm text-left md:py-2 rounded-2xl placeholder:text-gray-400 focus:outline-none text-gray-100 focus:border-2 max-sm:placeholder:text-[12px]"
                placeholder="search by name,roll numbers or department..."
              />
              <Search className="absolute max-sm:left-[6px] md:left-3 text-gray-400  max-sm:h-4 max-sm:top-[12px] max-sm:w-3" />
            </div>
            <div className="border-2 border-gray-700 text-white px-2 py-2 rounded-lg">
              {filteredStudents.length} students
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border-gray-700 px-4 py-6 rounded-lg ">
          <div className="p-0">
            <div className="overflow-x-auto">
              <StudentTable
                filteredStudents={filteredStudents}
                handleEditStudent={handleEditStudent}
                handleDeleteStudent={handleDeleteStudent}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Database;
