# Delilah
Proyecto de backend para pedidos de restaurante 
 Proyecto de restaurante

	_Debes instalar los siguientes modulos usando npm:_
	"bcrypt": "^4.0.1",
    "express": "^4.17.1",
    "mysql2": "^2.1.0",
    "sequelize": "^5.21.9"
    "jsonwebtoken": "^8.5.1"
    "dotenv": "^8.2.0"
    
    _Debes instalar tambien:_
    XAMPP
    Apache
    MySql
    
_Es importante que montes las base de datos incluida en el documento .sql y lo puedes hacer abriendo tu nevegador y usando la ruta http://localhost/phpmyadmin/_

_También es importante que sepas que el el server está corriendo en el pueto 3030 así que es ese puerto en local host el que debes usar para hacer cualquier prueba_

_como dato adicional quiero dejarte el usuario y contraseña de dos de los usuarios ya registrados en la base de datos_
	
	Administrador:
	usuario: Admin
	contraseña: 1234
	
	Usuario:
	usuario:JoseLow
	contraseña: 159
	
A continuación enlisto los puntos del check list con sus respectivos endpoints 

**Poder registrar un nuevo usuario**

Resgistrar un nuevo usuario

	POST
	Ruta: localhost:3030/users/new
	Headers: 
		Content-Type: application/json
	Body:
	{
	"usuario": string,
	"nombreApellido": string,
	"correoElectronico": string,
	"telefono": string,
	"direccionEnvio": string,
	"contrasenia": string
	}
	
	Response:
	{
        "id": number,
        "usuario": string,
        "nombre_apellido": string,
        "correo_electronico": string,
        "telefono": string,
        "direccion_envio": string,
        "contraseña": string (hash),
        "es_admin": bolean (0/1)
    	}
	
Usuario Login

	POST
	Ruta: localhost:3030/users/new
	Headers: 
		Content-Type: application/json
	Body:
	{
	"usuario": string,

	"contrasenia": string
	}
	
	Response:
	{
        "token": string,
    	}
	
**Un usuario debe poder listar todos los productos disponibles.**

Usuario Lista productos

	GET
	Ruta: localhost:3030/users/products
	Headers: 
		Content-Type: application/json
	
	Response:
   	[
	{
        "id": number,
        "nombre": string,
        "costo": number,
        "foto": string (url),
        "descripcion": string
    	},
	{...},
	{...},
	{...}
	]
	
**Un usuario debe poder generar un nuevo pedido al Restaurante con un listado de platos que desea.**

Usuario hace pedido 

	POST
	Ruta: localhost:3030/users/pedido
	Headers: 
		Content-Type: application/json
	Body:
	{
	"id_usuario": number,
	"medio_de_pago": string,
	"valor": number,
	"direccion":string,
	"productos":[{"producto":string,"cantidad": number},{"producto":string,"cantidad": number}, {...}, {...}]
	}
	
	Response:
	[
   	 {
        "id": number,
        "id_usuario": number,
        "estado": srtring,
        "hora": string,
        "medio_de_pago": string,
        "valor": number,
        "direccion": string,
        "descripcion": string, ejemplo: "2 X Hambuergesa de res 1 X Papas fritas"
    	}
	]
	
**El usuario con roles de administrador debe poder actualizar el estado del pedido.**

Admin cambia estado de pedido 

	PATCH
	Ruta: localhost:3030/admin/estado_pedido
	Headers: 
		Content-Type: application/json
		Authorization(Bearer Token): Token obtenido en login
	Body:
	{
	"id_pedido":2
	"estado": "Confirmado",
	
	}
	
	Response:
	[
   	 {
        "id": number,
        "id_usuario": number,
        "estado": string,
        "hora": string,
        "medio_de_pago": string,
        "valor": number,
        "direccion": string,
        "descripcion": string, ejemplo: "2 X Hambuergesa de res 1 X Papas fritas"
    	}
	]
	
**Un usuario con rol de administrador debe poder realizar las acciones de creación, edición y eliminación de recursos de productos (CRUD de productos).**


Admin lista producto  (Read)

	GET
	Ruta: localhost:3030/admin/productos
	Headers: 
		Content-Type: application/json
		Authorization(Bearer Token): Token obtenido en login
	
	
	Response:
   	[
	{
        "id": number,
        "nombre": string,
        "costo": number,
        "foto": string (url),
        "descripcion": string
    	},
	{...},
	{...},
	{...}
	]

Admin crea nuevo producto  (Create)

	POST
	Ruta: localhost:3030/admin/productos/nuevo
	Headers: 
		Content-Type: application/json
		Authorization(Bearer Token): Token obtenido en login
	
	Body:
	{
	"nombre": string,
	"costo": number,
	"foto": string (url),
	"descripcion": "Deliciosa gaseosa"
	}
	
	Response:
   	{
        "id": number,
        "nombre": string,
        "costo": number,
        "foto": string (url),
        "descripcion": string
    	}

Admin modifica producto  (Update)

	Patch
	Ruta: localhost:3030/admin/productos
	Headers: 
		Content-Type: application/json
		Authorization(Bearer Token): Token obtenido en login
	
	Body:
	{
	"nombre": string,
	"costo": number,
	"foto": string (url),
	"descripcion": "Deliciosa gaseosa"
	}
	
	Response:
	[
   	{
        "id": number,
        "nombre": string,
        "costo": number,
        "foto": string (url),
        "descripcion": string
    	}
	]

Admin borra producto  (Delete)

	Delete
	Ruta: localhost:3030/admin/productos/borrar
	Headers: 
		Content-Type: application/json
		Authorization(Bearer Token): Token obtenido en login
	
	Body:
	{
	"id_producto":12
	}
	
	Response:
	
	Borrado
	
**Un usuario sin roles de administrador no debe poder crear, editar o eliminar un producto, ni editar o eliminar un pedido. Tampoco debe poder acceder a informaciones de otros usuarios.**

Admin borra pedido  

	Delete
	Ruta: localhost:3030/admin/pedidos/borrar
	Headers: 
		Content-Type: application/json
		Authorization(Bearer Token): Token obtenido en login
	
	
	Response:
	
	Borrado
    
	
Solo el admin puede ver todos los usuarios

	GET
	Ruta: localhost:3030/admin/users
	Headers: 
		Content-Type: application/json
		Authorization(Bearer Token): Token obtenido en login
	
	
	Response:
	
	[
    	{
        "id": number
        "usuario": string,
        "nombre_apellido": string,
        "correo_electronico": string,
        "telefono": string,
        "direccion_envio": string,
        "es_admin": bolena (0/1)
    	},
    	{...},
    	{...},
    	{...}
	]

Admin puede asignar otros admins

	PATCH
	Ruta: localhost:3030/admin/users
	Headers: 
		Content-Type: application/json
		Authorization(Bearer Token): Token obtenido en login
	
	Body
	{
	"id_user": 2 (Al usuarios que se le quiere asignar el rol)
	}
	
	Response:
	
	[
    	{
        "id": number
        "usuario": string,
        "nombre_apellido": string,
        "correo_electronico": string,
        "telefono": string,
        "direccion_envio": string,
        "es_admin": bolena (0/1)
    	}
	]
