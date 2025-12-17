//FUNCIONES DE SANEAMIENTO DE TEXTO

/**
 * Sanitiza un texto general eliminando HTML, símbolos y números,
 * dejando solo letras y espacios.
 * @param {string} value - Texto a sanitizar
 * @returns {string} Texto limpio
 */
export const sanitizeText = (value) => {
  if (!value) return "";
  return value
    .replace(/<[^>]*>/g, "")                    
    .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "")  
    .replace(/\s+/g, " ")                       
    .trim();                                   
};

/**
 * Sanitiza comentarios permitiendo letras, números, signos y espacios.
 * @param {string} value - Comentario a sanitizar
 * @returns {string} Comentario limpio
 */
export const sanitizeComentario = (value) => 
{
  if (!value) return "";
  return value
    .replace(/<[^>]*>/g, "")                             
    .replace(/[^a-zA-Z0-9 áéíóúÁÉÍÓÚñÑ.,!?()\-]/g, "")   
    .replace(/\s+/g, " ")                                 
    .trim();
};

//VALIDACIONES DE USUARIO
/**
 * Valida el inicio de sesión de un usuario.
 * @param {Object} param0 - Objeto con email y contraseña
 * @returns {string|null} Mensaje de error o null si es válido
 */
export const validateInicioSesion = ({ email, contrasena }) => 
{
  if (!email) return "El email es obligatorio";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "El email no es válido";
  if (!contrasena) return "La contraseña es obligatoria";
  return null;
};

/**
 * Valida los campos del registro de usuario.
 * @param {Object} param0 - Campos del registro
 * @returns {string|null} Mensaje de error o null si es válido
 */
export const validateRegistro = ({
  nombre,
  apellidos,
  email,
  telefono,
  contrasena,
  confirmarContrasena,
  fecha_nacimiento,
}) => {
  const nombreLimpio = sanitizeText(nombre);
  const apellidosLimpios = sanitizeText(apellidos);
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

  if (!nombreLimpio || !apellidosLimpios) return "Nombre y apellidos son obligatorios";
  if (!nameRegex.test(nombreLimpio) || !nameRegex.test(apellidosLimpios))
    return "Nombre y apellidos solo pueden contener letras y espacios";
  if (!email) return "El email es obligatorio";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Email no válido";
  if (telefono && !/^\d{9}$/.test(telefono)) return "Teléfono no válido";
  if (!contrasena || contrasena.length < 6) return "La contraseña debe tener al menos 6 caracteres";
  if (contrasena !== confirmarContrasena) return "Las contraseñas no coinciden";
  if (!fecha_nacimiento) return "Fecha de nacimiento obligatoria";

  return null;
};

/**
 * Valida la edición de un perfil de usuario.
 * @param {Object} param0 - Campos a validar
 * @returns {Object} { error, data }
 */
export const validateEditUser = ({ nombre, apellidos, email, contrasena, telefono }) => 
{
  const nombreLimpio = sanitizeText(nombre);
  const apellidosLimpios = sanitizeText(apellidos);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!nombreLimpio) return { error: "El nombre es obligatorio y solo puede contener letras y espacios" };
  if (!apellidosLimpios) return { error: "Los apellidos son obligatorios y solo pueden contener letras y espacios" };
  if (!email) return { error: "El email es obligatorio" };
  if (!emailRegex.test(email)) return { error: "El email no es válido" };
  if (!contrasena || contrasena.length < 6) return { error: "La contraseña es obligatoria y debe tener al menos 6 caracteres" };
  if (!/^\d{9}$/.test(telefono)) return { error: "El teléfono debe tener 9 dígitos" };

  return {
    error: null,
    data: { nombre: nombreLimpio, apellidos: apellidosLimpios, email, contrasena, telefono }
  };
};

//VALIDACIONES DE VALORACIONES
/**
 * Valida la valoración de un producto.
 * @param {Object} param0 - comentario, puntuacion, usuario
 * @returns {string|null} Mensaje de error o null si es válido
 */
export const validateRating = ({ comentario, puntuacion, usuario }) => 
{
  if (!usuario) return "Debes iniciar sesión para valorar";
  if (!puntuacion || puntuacion < 1 || puntuacion > 5)
    return "Debes seleccionar una puntuación válida";
  const comentarioLimpio = sanitizeComentario(comentario);
  if (comentario && comentarioLimpio.length < 5) return "El comentario debe tener al menos 5 caracteres";
  return null;
};

/**
 * Valida la valoración de un servicio.
 * @param {Object} param0 - comentario, puntuacion, usuario
 * @returns {string|null} Mensaje de error o null si es válido
 */
export const validateServiceRating = ({ comentario, puntuacion, usuario }) => 
{
  if (!usuario) return "Debes iniciar sesión para valorar";
  if (!puntuacion || puntuacion < 1 || puntuacion > 5)
    return "Debes seleccionar una puntuación válida (1-5)";
  const comentarioLimpio = sanitizeComentario(comentario);
  if (comentario && comentarioLimpio.length < 5)
    return "El comentario debe tener al menos 5 caracteres válidos";
  return null;
};

// 🔹 VALIDACIONES DE PRODUCTOS

export const validateProductForm = ({ nombre, origen, precio, descripcion, ingredientes, unidades, disponible }) => 
{
  const sanitizeText = (value) => value ? value.replace(/<[^>]*>/g, "").replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "").replace(/\s+/g, " ").trim() : "";
  const sanitizeDescription = (value) => value ? value.replace(/<[^>]*>/g, "").replace(/[^a-zA-Z0-9 áéíóúÁÉÍÓÚñÑ.,!?()\-]/g, "").replace(/\s+/g, " ").trim() : "";

  const nombreLimpio = sanitizeText(nombre);
  const origenLimpio = sanitizeText(origen);
  const descripcionLimpia = sanitizeDescription(descripcion);
  const ingredientesLimpios = sanitizeDescription(ingredientes);

  if (!nombreLimpio) return { error: "El nombre es obligatorio y solo puede contener letras y espacios" };
  if (!origenLimpio) return { error: "El origen es obligatorio y solo puede contener letras y espacios" };
  if (!precio || isNaN(precio) || Number(precio) <= 0) return { error: "El precio debe ser un número positivo" };
  if (!descripcionLimpia || descripcionLimpia.length < 5) return { error: "La descripción debe tener al menos 5 caracteres válidos" };
  if (!ingredientesLimpios || ingredientesLimpios.length < 3) return { error: "Los ingredientes deben tener al menos 3 caracteres válidos" };
  if (disponible && (!unidades || isNaN(unidades) || Number(unidades) < 1)) return { error: "Debes indicar las unidades disponibles" };

  return { error: null, data: { nombre: nombreLimpio, origen: origenLimpio, descripcion: descripcionLimpia, ingredientes: ingredientesLimpios, precio: Number(precio), unidades: disponible ? Number(unidades) : 0, disponible } };
};

export const validateEditProductForm = validateProductForm;

//VALIDACIONES DE OFERTAS
export const validateOffer = ({ nombre, tipo, valor, id_postre, fecha_inicio, fecha_fin }) => 
{
  const nombreLimpio = sanitizeText(nombre);
  if (!nombreLimpio) return { error: "El formato del nombre es incorrecto" };
  if (!tipo) return { error: "Debes seleccionar un tipo de oferta" };
  if (tipo === "descuento") {
    if (!valor) return { error: "Debes indicar el valor del descuento" };
    if (isNaN(valor) || valor < 1 || valor > 100)
      return { error: "El valor del descuento debe ser un número entre 1 y 100" };
  }
  if (!id_postre) return { error: "Debes seleccionar un postre para la oferta" };
  if (!fecha_inicio) return { error: "Debes seleccionar la fecha de inicio" };
  if (!fecha_fin) return { error: "Debes seleccionar la fecha de fin" };
  if (new Date(fecha_fin) < new Date(fecha_inicio))
    return { error: "La fecha de fin no puede ser anterior a la fecha de inicio" };

  return { error: null, data: { nombre: nombreLimpio, tipo, valor: tipo === "descuento" ? Number(valor) : valor, id_postre, fecha_inicio, fecha_fin } };
};

export const validateEditOffer = validateOffer;
