
#CREATE DATABASE IF NOT EXISTS SWEETCULTURE;
#USE SWEETCULTURE;
#Drop database SWEETCULTURE;
-- ============================================
-- TABLA DE USUARIOS
-- ============================================
CREATE TABLE IF NOT EXISTS USUARIOS (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  apellidos VARCHAR(100),
  telefono VARCHAR(100),
  fecha_nacimiento DATE,  
  imagen VARCHAR(255),
  imagen_public_id VARCHAR(255), #Para producción
  email VARCHAR(100) UNIQUE,
  contrasena VARCHAR(255),
  informacion_publica BOOLEAN DEFAULT FALSE,  #Si acepta aparecer en estadísticas (gana descuentos)
  rol ENUM('cliente','admin') DEFAULT 'cliente',
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA DE POSTRES
-- ============================================
CREATE TABLE IF NOT EXISTS POSTRES (
  id_postre INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  descripcion TEXT,
  ingredientes TEXT,
  origen VARCHAR(100),
  precio DECIMAL(8,2),
  etiqueta_especial VARCHAR(100),
  imagen VARCHAR(255),
  imagen_public_id VARCHAR(255), #Para producción
  unidades INT,
  disponible BOOLEAN DEFAULT TRUE, #No quedan unidades
  ser_visible BOOLEAN DEFAULT TRUE, #Se ve en el catálogo o no
  -- Tiempos detallados de preparación
  tiempo_preparacion_minutos DECIMAL(8,2) DEFAULT 0,  #Tiempo manual (amasar, decorar, etc.)
  tiempo_horneado_minutos DECIMAL(8,2) DEFAULT 0,     #Tiempo de horneado por tanda
  capacidad_horneado INT,                   #Unidades que se pueden hornear a la vez
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP    #Cuando se inserta en la bd
);

-- ============================================
-- TABLA DE OFERTAS
-- ============================================
CREATE TABLE IF NOT EXISTS OFERTAS (
    id_oferta INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),            #Ej: "2x1 en tartas"
    tipo ENUM('descuento','2x1','3x2') DEFAULT 'descuento',
    valor DECIMAL(5,2) NULL,       #Porcentaje de descuento si aplica
    id_postre INT NULL,             #Si aplica a un postre concreto
    fecha_inicio DATE,
    fecha_fin DATE,
    ser_visible BOOLEAN DEFAULT TRUE,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_postre) REFERENCES postres(id_postre)
);

-- ============================================
-- DESCUENTOS PARA USUARIOS
-- ============================================
CREATE TABLE IF NOT EXISTS DESCUENTOS (
  id_descuento INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT,
  nombre VARCHAR(100),
  porcentaje DECIMAL(5,2),
  fecha_inicio DATE,
  fecha_fin DATE,
  tipo_descuento ENUM('Top1','Top2hasta5','cumpleanos'),
  estado ENUM('activo','cajeado','caducado') DEFAULT 'activo',
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- ============================================
-- TABLA DE PEDIDOS
-- ============================================
CREATE TABLE IF NOT EXISTS PEDIDOS (
  id_pedido INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT,
  fecha_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_entrega_estimada DATETIME NULL,  #Se calcula según los postres y disponibilidad
  estado ENUM('en_pedido','pendiente','en_preparacion','recogido','cancelado') DEFAULT 'en_pedido',
  total DECIMAL(8,2),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- ============================================
-- DETALLE DE PEDIDOS (POSTRES EN CADA PEDIDO)
-- ============================================
CREATE TABLE IF NOT EXISTS DETALLE_PEDIDO (
  id_detalle INT AUTO_INCREMENT PRIMARY KEY,
  id_pedido INT,
  id_postre INT,
  cantidad INT,
  precio_unitario DECIMAL(10,2),
  subtotal DECIMAL(8,2),
  FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido),
  FOREIGN KEY (id_postre) REFERENCES postres(id_postre)
);

-- ============================================
-- HISTORIAL_PEDIDOS (Evita la perdida de datos al modificar postres)
-- ============================================
CREATE TABLE IF NOT EXISTS HISTORIAL_PEDIDOS (
  id_historial INT AUTO_INCREMENT PRIMARY KEY,
  id_pedido INT,
  id_usuario INT,
  fecha_pedido DATETIME,
  total DECIMAL(8,2),
  postres JSON,   #Guarda snapshot de los postres: nombre, precio, cantidad
  estado ENUM('pendiente','en_preparacion','listo','recogido','cancelado'),
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- RANKING DE USUARIOS (COMPRAS TOTALES)
-- ============================================
CREATE TABLE IF NOT EXISTS RANKING_USUARIOS (
  id_usuario INT PRIMARY KEY,
  total_compras INT DEFAULT 0,
  ranking_general INT DEFAULT 0,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- ============================================
-- POSTRES MÁS VENDIDOS
-- ============================================
CREATE TABLE IF NOT EXISTS POSTRES_MAS_VENDIDOS (
  id_postre INT PRIMARY KEY,
  ventas_totales INT DEFAULT 0,
  FOREIGN KEY (id_postre) REFERENCES postres(id_postre)
);


-- ============================================
-- VALORACIONES DE POSTRES
-- ============================================
CREATE TABLE IF NOT EXISTS VALORACIONES_POSTRES (
  id_valoracionpostre INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT,
  id_postre INT,
  puntuacion INT CHECK (puntuacion BETWEEN 1 AND 5),
  comentario TEXT,
  fecha_valoracion DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
  FOREIGN KEY (id_postre) REFERENCES postres(id_postre)
);

-- ============================================
-- VALORACIONES DEL SERVICIO
-- ============================================
CREATE TABLE IF NOT EXISTS VALORACIONES_SERVICIO (
  id_valoracionservicio INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT,
  puntuacion INT CHECK (puntuacion BETWEEN 1 AND 5),
  comentario TEXT,
  fecha_valoracion DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);



-- ============================================
-- REGISTRO DE INTERACCIONES CON ASISTENTE IA
-- ============================================
CREATE TABLE IF NOT EXISTS ASISTENTE_IA (
  id_interaccion INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NULL,
  tipo ENUM('voz','texto'),
  comando VARCHAR(255),
  respuesta TEXT,
  fecha_interaccion DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);



-- ============================================
-- HORARIOS Y CAPACIDAD DE PEDIDOS
-- ============================================
CREATE TABLE IF NOT EXISTS HORARIOS_PEDIDOS (
  id_horario INT AUTO_INCREMENT PRIMARY KEY,
  dia_semana ENUM('Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'),
  hora_apertura TIME,
  hora_cierre TIME,
  pedidos_maximos INT DEFAULT 20,  -- Máximo de pedidos por día
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- ============================================
-- Insertar usuario admin por defecto
-- ============================================
INSERT INTO USUARIOS (
    nombre,
    apellidos,
    telefono,
    fecha_nacimiento,
    imagen,
    email,
    contrasena,
    informacion_publica,
    rol
) VALUES (
    'Admin',
    'Principal',
    '000000000',
    '1990-01-01',
    NULL,
    'admin@sweetculture.com',
    'admin123',   -- Te recomiendo luego cifrarlo
    FALSE,
    'admin'
);


