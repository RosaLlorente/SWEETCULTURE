//Importaciones funcionales
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../main_components/AuthContext";

export const PrivateRoute = ({ children, roles }) => 
{
  const { usuario } = useContext(AuthContext);

  // 1️⃣ Si no hay usuario → redirigir al login
  if (!usuario) return <Navigate to="/inicio" replace />;

  // 2️⃣ Si no existe usuario.rol → redirigir también
  if (!usuario.rol) return <Navigate to="/inicio" replace />;

  // 3️⃣ Si el usuario existe pero su rol NO está permitido
  if (roles && !roles.includes(usuario.rol)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
