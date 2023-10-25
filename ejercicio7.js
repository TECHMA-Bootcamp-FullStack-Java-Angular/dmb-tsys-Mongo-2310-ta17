const db = db.getSiblingDB('gandes_almacenes');

db.createCollection("productos", {
  validator: {
     $jsonSchema: {
        bsonType: "object",
        required: ["codigo", "nombre", "precio"],
        properties: {
           codigo: {
              bsonType: "int",
              description: "debe ser un entero"
           },
           nombre: {
              bsonType: "string",
              description: "debe ser una cadena de caracteres"
           },
           precio: {
              bsonType: "int",
              description: "debe ser un entero"
           }
        }
     }
  }
});

db.createCollection("cajeros", {
  validator: {
     $jsonSchema: {
        bsonType: "object",
        required: ["codigo", "nom_apels"],
        properties: {
           codigo: {
              bsonType: "int",
              description: "debe ser un entero"
           },
           nom_apels: {
              bsonType: "string",
              description: "debe ser una cadena de caracteres"
           }
        }
     }
  }
});

db.createCollection("maquinas_registradoras", {
  validator: {
     $jsonSchema: {
        bsonType: "object",
        required: ["codigo", "piso"],
        properties: {
           codigo: {
              bsonType: "int",
              description: "debe ser un entero"
           },
           piso: {
              bsonType: "int",
              description: "debe ser un entero"
           }
        }
     }
  }
});

db.createCollection("venta", {
  validator: {
     $jsonSchema: {
        bsonType: "object",
        required: ["cajero", "maquina", "producto"],
        properties: {
           cajero: {
              bsonType: "int",
              description: "debe ser un entero"
           },
           maquina: {
              bsonType: "int",
              description: "debe ser un entero"
           },
           producto: {
              bsonType: "int",
              description: "debe ser un entero"
           }
        }
     }
  }
});

for (let i = 1; i < 6; i++) {
   
   db.productos.insert({ codigo: i, nombre: `Producto ${i}`, precio: 100 * i })
   db.cajeros.insert({ codigo: 100 + i, nom_apels: `Cajero ${i}` })
   db.maquinas_registradoras.insert({ codigo: 200 + i, piso: i });
   
   db.venta.insert({
   cajero: 100 + i,  // Referencia al código de cajero
   maquina: 200 + i, // Referencia al código de máquina
   producto: i   // Referencia al código de producto
   });
}


/**
 * Testamos la integridad de nuetra base de datos
 *  ESTOS DATO NO SE INSERTARÁ AL NO CUMPLIR LAS VALIDACIONES
 * 
 * @returns Document failed validation con un JSON "information"
 */
// producto sin el campo "nombre":
db.productos.insert({ codigo: 6, precio: 600 }) 

//  código que no es un número entero
db.cajeros.insert({ codigo: "invalido", nom_apels: "Cajero Inválido" })

// máquina registradora con un piso que no es un número entero
db.maquinas_registradoras.insert({ codigo: 206, piso: "no es un número" })




/**
 * Testamos los datos referenciados 
 * @returns JSON con el objeto solicitado
 */

// Búsqueda de todas las ventas realizadas por un cajero específico en una máquina 
db.venta.find({ cajero: cajeroID, maquina: maquinaID })

// Búsqueda de productos cuyo precio sea mayor o igual a un valor específico
db.productos.find({ precio: { $gte: valorMinimo } })

// Búsqueda de todas las ventas que involucran un producto específico
db.venta.find({ producto: productoID })

// Búsqueda de cajeros que trabajan en máquinas registradoras ubicadas en un piso particular
db.cajeros.find({ codigo: {  $in: db.maquinas_registradoras.find({ piso: pisoEspecifico }).map(m => m.codigo) }})








