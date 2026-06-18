import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages - Auth
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';

// Pages - Admin
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminTickets from './pages/admin/Tickets';
import AdminImport from './pages/admin/Import';
import AdminClasses from './pages/admin/Classes';
import AdminSettings from './pages/admin/Settings';

// Pages - Teacher
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherClasses from './pages/teacher/Classes';
import TeacherMaterials from './pages/teacher/Materials';
import TeacherAssignments from './pages/teacher/Assignments';
import TeacherGrading from './pages/teacher/Grading';
import TeacherReports from './pages/teacher/Reports';
import TeacherAnnouncements from './pages/teacher/Announcements';
import TeacherEditorMock from './pages/teacher/EditorMock';

// Pages - Parent
import ParentDashboard from './pages/parent/Dashboard';
import ParentChildren from './pages/parent/Children';
import ParentGrades from './pages/parent/Grades';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<DashboardLayout role="admin" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="tickets" element={<AdminTickets />} />
          <Route path="import" element={<AdminImport />} />
          <Route path="classes" element={<AdminClasses />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Teacher Routes */}
        <Route path="/teacher" element={<DashboardLayout role="teacher" />}>
          <Route index element={<TeacherDashboard />} />
          <Route path="classes" element={<TeacherClasses />} />
          <Route path="announcements" element={<TeacherAnnouncements />} />
          <Route path="materials" element={<TeacherMaterials />} />
          <Route path="editor" element={<TeacherEditorMock />} />
          <Route path="assignments" element={<TeacherAssignments />} />
          <Route path="grading" element={<TeacherGrading />} />
          <Route path="reports" element={<TeacherReports />} />
        </Route>

        {/* Parent Routes */}
        <Route path="/parent" element={<DashboardLayout role="parent" />}>
          <Route index element={<ParentDashboard />} />
          <Route path="children" element={<ParentChildren />} />
          <Route path="grades" element={<ParentGrades />} />
        </Route>

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
