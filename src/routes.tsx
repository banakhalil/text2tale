import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoutes";
import { Login } from "@/components/Auth/Login";
import DashboardLayout from "@/layouts/DashboardLayout";
import Statistics from "@/pages/Statistics";
import Subjects from "@/pages/Subjects";
import Users from "@/pages/Users";
import Stories from "@/pages/Stories";

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />

    <Route element={<ProtectedRoute />}>
      <Route element={<DashboardLayout />}>
        <Route index element={<Navigate to="/statistics" replace />} />
        <Route path="statistics" element={<Statistics />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="users" element={<Users />} />
        <Route path="stories" element={<Stories />} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
