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










