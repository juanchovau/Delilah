-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 24-05-2020 a las 21:03:56
-- Versión del servidor: 10.4.11-MariaDB
-- Versión de PHP: 7.4.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `delilah`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Pedidos`
--

CREATE TABLE `Pedidos` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `estado` varchar(30) NOT NULL,
  `hora` varchar(10) NOT NULL,
  `medio_de_pago` varchar(10) NOT NULL,
  `valor` int(11) NOT NULL,
  `direccion` varchar(50) NOT NULL,
  `descripcion` varchar(350) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `Pedidos`
--

INSERT INTO `Pedidos` (`id`, `id_usuario`, `estado`, `hora`, `medio_de_pago`, `valor`, `direccion`, `descripcion`) VALUES
(1, 2, 'confirmado', '18:2', 'efectivo', 40000, 'Cra 123 No. 12 - 16', ' 2 X Hambuergesa de res 2 X Papas fritas'),
(2, 2, 'Confirmado', '18:5', 'efectivo', 35000, 'Cra 123 No. 12 - 16', ' 2 X Hambuergesa de res 1 X Papas fritas'),
(4, 1, 'Nuevo', '22:13', 'efectivo', 35000, 'Cra 123 No. 12 - 16', ' 2 X Hambuergesa de res 1 X Papas fritas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Productos`
--

CREATE TABLE `Productos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `costo` int(11) NOT NULL,
  `foto` varchar(150) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `Productos`
--

INSERT INTO `Productos` (`id`, `nombre`, `costo`, `foto`, `descripcion`) VALUES
(1, 'Hamburguesa de res', 15000, 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', 'Deliciosa hamburguesa de res '),
(2, 'Hamburguesa de pollo', 17000, 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', 'Deliciosa Hambuerguesa de pollo'),
(5, 'Hambuegusa de bufalo ', 21000, 'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', 'Deliciosa hamburguesa de Bufalo '),
(7, 'Papas fritas', 5000, 'https://images.pexels.com/photos/1439177/pexels-photo-1439177.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', 'Deliciosas papas a la francesa '),
(14, 'Gaseosa', 2000, 'https://images.pexels.com/photos/104509/pexels-photo-104509.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', 'Deliciosa gaseosa y sin azucar');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Usuarios`
--

CREATE TABLE `Usuarios` (
  `id` int(11) NOT NULL,
  `usuario` varchar(20) NOT NULL,
  `nombre_apellido` varchar(100) NOT NULL,
  `correo_electronico` varchar(100) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `direccion_envio` varchar(200) NOT NULL,
  `contraseña` varchar(150) NOT NULL,
  `es_admin` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `Usuarios`
--

INSERT INTO `Usuarios` (`id`, `usuario`, `nombre_apellido`, `correo_electronico`, `telefono`, `direccion_envio`, `contraseña`, `es_admin`) VALUES
(1, 'Admin', 'Juan Vargas', 'juanchova@hotmail.com', '3201234567', 'Cra 123 No. 12 - 14', '$2b$10$4LqFtzYZgscaFPuNBerLjupV0g/yM8Yq2p8V2EwvaRdLl3UkvNwIS', 1),
(2, 'Lola', 'lola Vargas', 'lolaa@hotmail.com', '3201234568', 'Cra 123 No. 12 - 16', '$2b$10$hUIUsRCa1acmtVx7bnj72up3K4Ds.GFohK66ysYy8DN8U887xSuGu', 1),
(3, 'DidoL', 'Dido Low', 'didol@hotmail.com', '3201234578', 'Cra 123 No. 12 - 20', '$2b$10$/hRY4GM1qyRMCcusSIdMQueS9USuH0b8BRxyVm1cdoDBLZGCxV6GW', 0),
(5, 'Bere', 'Bere Low', 'Berel@hotmail.com', '3201255578', 'Cra 123 No. 15 - 20', '$2b$10$gMbz.MDzLgQmjywRkVAK6O5m4MlXTcymYp3D9iEDa7A4kVy4QVW9m', 0),
(6, 'JoseLow', 'Jose Low', 'josel@hotmail.com', '3201277578', 'Cra 123 No. 15 - 22', '$2b$10$dix.OcS6xixNXT5tf4rjEOYo3BMQxWi9xJiVUBa3fvAN4MqJ6rbji', 0),
(7, 'MartinLow', 'Martin Low', 'Martinl@hotmail.com', '3201277578', 'Cra 123 No. 15 - 22', '$2b$10$JdXevXEaTSjjmT7y7GAf7uX8smsJxe2jLrCvt6TiIqjNmy48WhZim', 0),
(9, 'PepaLow', 'Pepa Low', 'Peinl@hotmail.com', '3211277578', 'Cra 123 No. 15 - 22', '$2b$10$hn0rugEUA3ltE707QWiTVuiJyN4yQ3pkjU/9q3BVe7DLs82nKA2De', 0),
(10, 'PepaLow', 'Pepa Low', 'Peinl@hotmail.com', '3211277578', 'Cra 123 No. 15 - 22', '$2b$10$zVUNF2MDIRdXY38uyftUXeDvUQ2jwBnfH12bdZ7LMGBtjEM2ZYkvS', 0),
(11, 'Pepavargas', 'Pepa vargas', 'Peva@hotmail.com', '3212377578', 'Cra 123 No. 15 - 22', '$2b$10$KTKAQbYPzWC5aZTvHBfjC.Us1jDbubRRSXLSGuBOHgfovJQrCvqZ6', 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `Pedidos`
--
ALTER TABLE `Pedidos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuaruo` (`id_usuario`);

--
-- Indices de la tabla `Productos`
--
ALTER TABLE `Productos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `Usuarios`
--
ALTER TABLE `Usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `Pedidos`
--
ALTER TABLE `Pedidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `Productos`
--
ALTER TABLE `Productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `Usuarios`
--
ALTER TABLE `Usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `Pedidos`
--
ALTER TABLE `Pedidos`
  ADD CONSTRAINT `Pedidos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `Usuarios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
