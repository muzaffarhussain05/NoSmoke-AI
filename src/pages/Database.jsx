import { useState, useEffect } from "react";

import StudentTable from "../components/StudentTable";

import { Plus, Search, X, Edit, Trash2, Upload, User } from "lucide-react";

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

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.rollNo || !newStudent.department) {
      toast.error("Please fill in all required fields");
      return;
    }

    const studentData = {
      ...newStudent,
      image:
        newStudent.image ||
        `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`,
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
      setIsAddDialogOpen(false);
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
    setIsAddDialogOpen(true);
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
      setIsAddDialogOpen(false);
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

        {/* Search and Add Controls */}
        {/* <div className="bg-gray-800 border-gray-700 mb-6 sm:mb-8">
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white">
              <span className="flex items-center text-lg sm:text-xl">
                <User className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Student Management
              </span>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-sm sm:text-base">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Student
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-lg mx-4 sm:mx-auto">
                  <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">
                      {editingStudent ? "Edit Student" : "Add New Student"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    <div>
                      <label htmlFor="name" className="text-sm">
                        Full Name *
                      </label>
                      <input
                        id="name"
                        value={newStudent.name}
                        onChange={(e) =>
                          setNewStudent({ ...newStudent, name: e.target.value })
                        }
                        className="bg-gray-700 border-gray-600 text-white text-sm"
                        placeholder="Enter student's full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="rollNo" className="text-sm">
                        Roll Number *
                      </label>
                      <input
                        id="rollNo"
                        value={newStudent.rollNo}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            rollNo: e.target.value,
                          })
                        }
                        className="bg-gray-700 border-gray-600 text-white text-sm"
                        placeholder="e.g., ST001"
                      />
                    </div>
                    <div>
                      <label htmlFor="department" className="text-sm">
                        Department *
                      </label>
                      <input
                        id="department"
                        value={newStudent.department}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            department: e.target.value,
                          })
                        }
                        className="bg-gray-700 border-gray-600 text-white text-sm"
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="text-sm">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={newStudent.email}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            email: e.target.value,
                          })
                        }
                        className="bg-gray-700 border-gray-600 text-white text-sm"
                        placeholder="student@university.edu"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="text-sm">
                        Phone
                      </label>
                      <input
                        id="phone"
                        value={newStudent.phone}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            phone: e.target.value,
                          })
                        }
                        className="bg-gray-700 border-gray-600 text-white text-sm"
                        placeholder="+1234567890"
                      />
                    </div>
                    <div>
                      <label htmlFor="image" className="text-sm">
                        Profile Image URL
                      </label>
                      <input
                        id="image"
                        value={newStudent.image}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            image: e.target.value,
                          })
                        }
                        className="bg-gray-700 border-gray-600 text-white text-sm"
                        placeholder="Image URL or upload file"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                      <button
                        variant="outline"
                        onClick={() => {
                          setIsAddDialogOpen(false);
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
                        className="w-full sm:w-auto border-gray-600 text-gray-300 hover:bg-gray-700 text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={
                          editingStudent
                            ? handleUpdateStudent
                            : handleAddStudent
                        }
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-sm"
                      >
                        {editingStudent ? "Update" : "Add"} Student
                      </button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  placeholder="Search by name, roll number, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white text-sm"
                />
              </div>
              <div
                variant="outline"
                className="border-gray-600 text-gray-300 text-sm"
              >
                {filteredStudents.length} students
              </div>
            </div>
          </div>
        </div> */}

        {/* <StudentPage /> */}

        <div className="bg-gray-800 border-gray-700 px-5 py-6 rounded-lg mb-8">
          {/* top start */}
          <div className="flex justify-between items-center">
            <div>
              <span className="flex items-center text-lg max-sm:text-sm text-white">
                <User className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Student Management
              </span>
            </div>
            <div>
              <button
                className="flex items-center  md:text-lg max-sm:text-sm bg-green-600 text-white md:px-3 px-1 py-1.5 rounded-xl cursor-pointer hover:bg-green-700 "
                onClick={() => setOpen(true)}
              >
                <Plus className="md:mr-2 h-4 w-4" />
                <span className="md:text-lg max-sm:text-[12px]">
                  {" "}
                  Add Student
                </span>
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
                  <form action="">
                    <div className="space-y-4">
                      <input
                        placeholder="Full Name"
                        className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded"
                      />
                      <input
                        placeholder="Roll No."
                        className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded"
                      />
                      <input
                        placeholder="Department"
                        className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded"
                      />
                    </div>
                  </form>
                </div>
                <div className="flex  items-center gap-2">
                  <button
                    className="bg-red-600 py-1 rounded-sm px-3 cursor-pointer hover:bg-red-700"
                    onClick={() => setOpen(false)}
                  >
                    <X className="h-6 w-5" />
                  </button>
                  <button className="bg-green-600 hover:bg-green-700 py-1 rounded-sm px-3 cursor-pointer">
                    Add Student
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* top end */}

          {/* search bar */}

          <div className="flex items-center gap-7 mt-8 md:px-2 max-sm:flex-col ">
            <div className="bg-gray-700 flex-6 flex items-center justify-items-start max-sm:justify-center w-full relative rounded-2xl border border-gray-600">
              <input
                type="text"
                className="flex-5 md:px-10 pl-6 py-2 max-sm:text-sm text-left md:py-2 rounded-2xl placeholder:text-gray-400 focus:outline-none text-gray-100 focus:border-2 max-sm:placeholder:text-[12px]"
                placeholder="search by name,roll numbers or department..."
              />
              <Search className="absolute max-sm:left-[6px] md:left-12 text-gray-400  max-sm:h-4 max-sm:top-[16px] max-sm:w-4 " />
            </div>
            <div className="border-2 border-gray-700 text-white px-2 py-2 rounded-lg">
              1 students
            </div>
          </div>
          {/* search bar */}
        </div>

        {/* student manangmet */}
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
        {/* Students Table */}
        {/* <div className="bg-gray-800 border-gray-700">
          <div className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300 text-xs sm:text-sm">
                      Photo
                    </TableHead>
                    <TableHead className="text-gray-300 text-xs sm:text-sm">
                      Name
                    </TableHead>
                    <TableHead className="text-gray-300 text-xs sm:text-sm hidden sm:table-cell">
                      Roll No.
                    </TableHead>
                    <TableHead className="text-gray-300 text-xs sm:text-sm hidden md:table-cell">
                      Department
                    </TableHead>
                    <TableHead className="text-gray-300 text-xs sm:text-sm hidden lg:table-cell">
                      Contact
                    </TableHead>
                    <TableHead className="text-gray-300 text-xs sm:text-sm hidden xl:table-cell">
                      Status
                    </TableHead>
                    <TableHead className="text-gray-300 text-xs sm:text-sm">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow className="border-gray-700">
                      <TableCell
                        colSpan={7}
                        className="text-center text-gray-400 py-8 text-sm"
                      >
                        No students found. Add students to the database for face
                        recognition.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((student) => (
                      <TableRow
                        key={student.id}
                        className="border-gray-700 hover:bg-gray-750"
                      >
                        <TableCell>
                          <ImageWithFallback
                            src={
                              student.image ||
                              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                            }
                            alt={student.name}
                            className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover"
                          />
                        </TableCell>
                        <TableCell className="text-white text-xs sm:text-sm">
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-xs text-gray-400 sm:hidden">
                              {student.rollNo}
                            </div>
                            <div className="text-xs text-gray-400 md:hidden">
                              {student.department}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300 text-xs sm:text-sm hidden sm:table-cell">
                          {student.rollNo}
                        </TableCell>
                        <TableCell className="text-gray-300 text-xs sm:text-sm hidden md:table-cell">
                          {student.department}
                        </TableCell>
                        <TableCell className="text-gray-300 text-xs sm:text-sm hidden lg:table-cell">
                          <div>
                            <div>{student.email}</div>
                            <div className="text-gray-400">{student.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          <div
                            variant={
                              student.status === "Active"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {student.status}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1 sm:space-x-2">
                            <button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditStudent(student)}
                              className="border-gray-600 text-gray-300 hover:bg-gray-700 p-1 sm:p-2"
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                            <button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                handleDeleteStudent(student.rollNo)
                              }
                              className="p-1 sm:p-2"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Database;
