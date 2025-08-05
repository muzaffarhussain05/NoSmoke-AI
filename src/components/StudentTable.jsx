import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

export default function StudentTable({ filteredStudents, handleEditStudent, handleDeleteStudent ,history}) {
  return (
    <div className="bg-gray-800 border-gray-700">
      <div className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
              {   history &&  <TableHead className="text-gray-300 text-xs sm:text-sm hidden lg:table-cell">Time</TableHead>}
                <TableHead className="text-gray-300 text-xs sm:text-sm">Photo</TableHead>
                <TableHead className="text-gray-300 text-xs sm:text-sm">Name</TableHead>
                <TableHead className="text-gray-300 text-xs sm:text-sm hidden sm:table-cell">Roll No.</TableHead>
                <TableHead className="text-gray-300 text-xs sm:text-sm hidden md:table-cell">Department</TableHead>
                <TableHead className="text-gray-300 text-xs sm:text-sm hidden lg:table-cell">Contact</TableHead>
           
                <TableHead className="text-gray-300 text-xs sm:text-sm hidden xl:table-cell">Status</TableHead>
                <TableHead className="text-gray-300 text-xs sm:text-sm">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow className="border-gray-700">
                  <TableCell colSpan={7} className="text-center text-gray-400 py-8 text-sm">
                    No students found. Add students to the database for face recognition.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student.id} className="border-gray-700 hover:bg-gray-750">
                    {history &&  <TableCell className="text-gray-300 text-xs sm:text-sm hidden lg:table-cell">
                      <div>
                        <div>{student.email}</div>
                        <div className="text-gray-400">{student.phone}</div>
                      </div>
                    </TableCell>}
                    <TableCell>
                      <img
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
                        <div className="text-xs text-gray-400 sm:hidden">{student.rollNo}</div>
                        <div className="text-xs text-gray-400 md:hidden">{student.department}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300 text-xs sm:text-sm hidden sm:table-cell">{student.rollNo}</TableCell>
                    <TableCell className="text-gray-300 text-xs sm:text-sm hidden md:table-cell">{student.department}</TableCell>
                    <TableCell className="text-gray-300 text-xs sm:text-sm hidden lg:table-cell">
                      <div>
                        <div>{student.email}</div>
                        <div className="text-gray-400">{student.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell text-xs text-green-600 font-bold">
                      {student.status}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1 sm:space-x-2">
                        <button
                          onClick={() => handleEditStudent(student)}
                          className="border border-gray-600 text-gray-300 hover:bg-gray-900 p-1 sm:p-2 rounded cursor-pointer "
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student.rollNo)}
                          className="text-red-500 hover:bg-gray-900 p-1 sm:p-2 rounded cursor-pointer "
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
    </div>
  );
}

// Basic Table Components (No external dependencies)
function Table({ className = '', ...props }) {
  return (
    <div className="relative w-full overflow-x-auto">
      <table className={`w-full caption-bottom text-sm ${className}`} {...props} />
    </div>
  );
}

function TableHeader({ className = '', ...props }) {
  return <thead className={`[&_tr]:border-b ${className}`} {...props} />;
}

function TableBody({ className = '', ...props }) {
  return <tbody className={`[&_tr:last-child]:border-0 ${className}`} {...props} />;
}

function TableRow({ className = '', ...props }) {
  return <tr className={`border-b hover:bg-gray-700 transition-colors ${className}`} {...props} />;
}

function TableHead({ className = '', ...props }) {
  return <th className={`h-10 px-2 text-left font-medium whitespace-nowrap ${className}`} {...props} />;
}

function TableCell({ className = '', ...props }) {
  return <td className={`p-2 align-middle whitespace-nowrap ${className}`} {...props} />;
}
