require('dotenv').config()

const express = require("express");
const Sequelize = require("sequelize");
const Bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const sequelize = new Sequelize("mysql://root:@localhost:3306/delilah");
const app = express();
app.use(express.json());

//app.use("/public", express.static("public"));

// --- Midlewares --- //

function comprobarExistenciaDeUsuario(req, res, next) {
  const { usuario } = req.body;
  sequelize
    .query("SELECT * FROM `Usuarios` WHERE usuario = ? ", {
      type: sequelize.QueryTypes.SELECT,
      replacements: [usuario],
    })
    .then((user) => {
      if (user.usuario !== usuario) {
        next();
      } else {
        res.status(409).send("Usuario ya existe");
      }
    });
}

function comprobarAdmin(req, res, next) {
 
  const autorizacion  = req.headers['authorization'];
  const token = autorizacion && autorizacion.split(' ')[1];
  if(token == null) return res.SendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, usuario) =>{
    if(err){
      
      return res.sendStatus(403);
    } 

    sequelize
    .query("SELECT * FROM `Usuarios` WHERE id = ? ", {
      type: sequelize.QueryTypes.SELECT,
      replacements: [usuario.id],
    })
    .then((user) => {
  
      if (user[0].es_admin === 1) {
        next();
      } else {
        res.status(403).send("No permitido");
      }
    });

  })

 
}

function comprobarUser(req, res, next) {
 
  const autorizacion  = req.headers['authorization'];
  const token = autorizacion && autorizacion.split(' ')[1];
  if(token == null) return res.SendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, usuario) =>{
    if(err){
      
      return res.sendStatus(403);
    } 

    sequelize
    .query("SELECT * FROM `Usuarios` WHERE id = ? ", {
      type: sequelize.QueryTypes.SELECT,
      replacements: [usuario.id],
    })
    .then((user) => {
  
      if (user[0]) {
        next();
      } else {
        res.status(403).send("No permitido");
      }
    });

  })

 
}

// --- Poder registrar un nuevo usuario --* //

app.post("/users/new", comprobarExistenciaDeUsuario, async (req, res) => {
  const {
    usuario,
    nombreApellido,
    correoElectronico,
    telefono,
    direccionEnvio,
    contrasenia,
  } = req.body;
  const contraseniaHash = await Bcrypt.hash(contrasenia, 10);

  await sequelize
    .query(
      "INSERT INTO `Usuarios`(`usuario`, `nombre_apellido`, `correo_electronico`, `telefono`, `direccion_envio`, `contraseña`, `es_admin`) VALUES ( ?, ?, ?, ?, ?, ?, false)",
      {
        type: sequelize.QueryTypes.INSERT,
        replacements: [
          usuario,
          nombreApellido,
          correoElectronico,
          telefono,
          direccionEnvio,
          contraseniaHash,
        ],
      }
    )
    .then((newUser) => {
      sequelize
        .query("SELECT * FROM `Usuarios` WHERE id = ? ", {
          type: sequelize.QueryTypes.SELECT,
          replacements: [newUser[0]],
        })
        .then((user) => res.status(201).json(user));
    })
    .catch((e) => console.log(e));
});

// --- Login de un usuario --- //

app.post("/users/login", async (req, res) => {
  const { usuario, contrasenia } = req.body;

  await sequelize
    .query("SELECT * FROM `Usuarios` WHERE usuario = ? ", {
      type: sequelize.QueryTypes.SELECT,
      replacements: [usuario],
    })
    .then(async (user) => {
      let usuruario = user[0]
      if (usuruario === undefined) {
        res.status(409).send("Usuario o contraseña erradas");
      } else {
        if (await Bcrypt.compare(contrasenia, usuruario.contraseña)) {
          const token = jwt.sign(usuruario, process.env.ACCESS_TOKEN_SECRET)
          res.status(200).json({token: token});
        } else {
          res.status(409).send("Usuario o contraseña erradas");
        }
      }
    }); //.catch(console.log)
});

//--- ​ Un usuario debe poder listar todos los productos disponibles. --- //

app.get("/users/products", comprobarUser, (req, res) => {
  sequelize
    .query("SELECT * FROM `Productos`", { type: sequelize.QueryTypes.SELECT })
    .then((users) => res.status(200).json(users));
});

// --- Un usuario debe poder generar un nuevo pedido al Restaurante con un listado de platos que desea. --- //

app.post("/users/pedido", comprobarUser, async (req, res) => {
  const { id_usuario, medio_de_pago, valor, direccion, productos } = req.body;

  const horas = new Date().getHours();
  let minutos = new Date().getMinutes();
  if (minutos < 10) {
    minutos = `0${minutos}`;
  }

  const hora = `${horas}:${minutos}`;
  let descripcion = "";
  productos.map((e) => {
    descripcion = `${descripcion} ${e.cantidad} X ${e.producto}`;
  });
  console.log(descripcion);
  await sequelize
    .query(
      'INSERT INTO `Pedidos`(`id_usuario`, `estado`, `hora`, `medio_de_pago`, `valor`, `direccion`, `descripcion`) VALUES ( ?, "Nuevo", ?, ?, ?, ?, ?)',
      {
        type: sequelize.QueryTypes.INSERT,
        replacements: [
          id_usuario,
          hora,
          medio_de_pago,
          valor,
          direccion,
          descripcion,
        ],
      }
    )
    .then((nuevoPedido) => {
      sequelize
        .query("SELECT * FROM `Pedidos` WHERE id = ? ", {
          type: sequelize.QueryTypes.SELECT,
          replacements: [nuevoPedido[0]],
        })
        .then((pedido) => res.status(201).json(pedido));
    })
    .catch(console.log);
});

// --- El usuario con roles de administrador debe poder actualizar el estado del pedido. --- //
app.patch("/admin/estado_pedido", comprobarAdmin, async (req, res) => {
  const { estado, id_pedido } = req.body;

  sequelize
    .query("UPDATE `Pedidos` SET `estado` = ? WHERE `Pedidos`.`id` = ?", {
      type: sequelize.QueryTypes.UPDATE,
      replacements: [estado, id_pedido],
    })
    .then((pedidoModificado) => {
      sequelize
        .query("SELECT * FROM `Pedidos` WHERE id = ? ", {
          type: sequelize.QueryTypes.SELECT,
          replacements: [id_pedido],
        })
        .then((pedido) => res.status(201).json(pedido));
    });
});

// --- Un usuario con rol de administrador debe poder realizar las acciones de creación, edición y eliminación de recursos de productos (CRUD de productos). --- //

app.post("/admin/productos/nuevo", comprobarAdmin, async (req, res) => {

  const{nombre, costo, foto, descripcion} = req.body;

  sequelize
  .query("INSERT INTO `Productos` (`nombre`, `costo`, `foto`, `descripcion`) VALUES (?, ?, ? , ?)", { type: sequelize.QueryTypes.INSERT, replacements: [nombre, costo, foto, descripcion], })
  .then((newProducto) => {
    sequelize
      .query("SELECT * FROM `Productos` WHERE id = ? ", {
        type: sequelize.QueryTypes.SELECT,
        replacements: [newProducto[0]],
      })
      .then((producto) => res.status(201).json(producto));
  })
 
})

app.patch("/admin/productos", comprobarAdmin, async (req, res) => {
  const{nombre, costo, foto, descripcion, id_producto} = req.body;

  sequelize
    .query("UPDATE `Productos` SET `nombre` = ?, `costo` = ?, `foto` = ?, `descripcion` = ? WHERE `Productos`.`id` = ?", {
      type: sequelize.QueryTypes.UPDATE,
      replacements: [nombre, costo, foto, descripcion, id_producto ],
    })
    .then((productoModificado) => {
      sequelize
        .query("SELECT * FROM `Productos` WHERE id = ? ", {
          type: sequelize.QueryTypes.SELECT,
          replacements: [id_producto],
        })
        .then((producto) => res.status(201).json(producto));
    });
});


app.get("/admin/productos", comprobarAdmin, async (req, res) => {

  sequelize
  .query("SELECT * FROM `Productos` ", { type: sequelize.QueryTypes.SELECT })
  .then((producto) => res.status(201).json(producto));
});

app.delete("/admin/productos/borrar", comprobarAdmin, async (req, res) => {

  const{id_producto} = req.body;

  sequelize
  .query("DELETE FROM `Productos` WHERE `Productos`.`id` = ? ", { type: sequelize.QueryTypes.DELETE, replacements: [id_producto], })
  .then((producto) => res.status(200).send("Borrado"));
});

// --- ​ Un usuario sin roles de administrador no debe poder crear, editar o eliminar un producto, ni editar o eliminar un pedido. Tampoco debe poder acceder a informaciones de otros usuarios. ---//

app.delete("/admin/pedidos/borrar", comprobarAdmin, async (req, res) => {

  const{id_pedido} = req.body;

  sequelize
  .query("DELETE FROM `Pedidos` WHERE `Pedidos`.`id` = ? ", { type: sequelize.QueryTypes.DELETE, replacements: [id_pedido], })
  .then((pedido) => res.status(200).send("Borrado"));
});

//Los unicos capaces de ver la info de otros ususarios es el admin 

app.get("/admin/users", comprobarAdmin, async (req, res) => {

  sequelize
  .query("SELECT id, usuario, nombre_apellido, correo_electronico, telefono, direccion_envio, es_admin FROM `Usuarios` ", { type: sequelize.QueryTypes.SELECT })
  .then((usuarios) => {
    
    res.status(200).json(usuarios)
  });
});

app.patch("/admin/asignar_admin", comprobarAdmin, async (req, res) => {
  const {id_user} = req.body;

  sequelize
    .query("UPDATE `Usuarios` SET `es_admin` = true WHERE `Usuarios`.`id` = ?", {
      type: sequelize.QueryTypes.UPDATE,
      replacements: [id_user],
    })
    .then((userModificado) => {
      sequelize
        .query("SELECT * FROM `Usuarios` WHERE id = ? ", {
          type: sequelize.QueryTypes.SELECT,
          replacements: [id_user],
        })
        .then((pedido) => res.status(201).json(pedido));
    });
});


app.listen(3030, () => {
  console.log("Servidor corriendo en el puerto 3030");
});

