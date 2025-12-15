//Importaciones funcionales
import { createContext, useState, useEffect } from "react";

/**
 * Contexto de autenticación para manejar el estado del usuario en la app.
 * Permite acceder y actualizar el usuario desde cualquier componente que lo consuma.
 */
export const AuthContext = createContext();

/**
 * Proveedor de contexto de autenticación.
 *
 * 1. Maneja el estado `usuario` con useState.
 * 2. Carga los datos del usuario almacenados en localStorage al iniciar la aplicación.
 * 3. Proporciona `usuario` y `setUsuario` a todos los componentes hijos.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos que recibirán el contexto.
 */
export const AuthProvider = ({ children }) => 
{
  const [usuario, setUsuario] = useState(null);

  // Cargar usuario desde localStorage al iniciar la app
  useEffect(() => 
  {
    const user = localStorage.getItem("usuario");
    if (user && user !== "undefined") 
    {
      setUsuario(JSON.parse(user));
    }
  }, []);

  console.log(usuario)
  return (
    <AuthContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </AuthContext.Provider>
  );
};
