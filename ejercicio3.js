const db = db.getSiblingDB('los_alamcenes');

// Reglas de valicación de la colección almacen
db.createCollection("almacen", {
  validator: {
     $jsonSchema: {
        bsonType: "object",
        required: ["codigo", "lugar", "capacidad"],
        properties: {
           codigo: {
              bsonType: "int",
              description: "codigo must be a int and is required" 
           },
           lugar: {
              bsonType: "string",
              description: "lugar must be a string and is required" 
           },
           capacidad: {
              bsonType: "int",
              description: "capacidad must be a int and is required" 
           }
        }
     }
  }
})

// Crea un índice único para el atrubuto "codigo",al ser PK no queremos duplicadad
db.almacen.createIndex({ codigo: 1 }, { unique: true });

// Reglas de valicación de la colección caja
db.createCollection("caja", {
  validator: {
     $jsonSchema: {
        bsonType: "object",
        required: ["num_referencia", "contenido", "valor", "almacen"],
        properties: {
           num_referencia: {
              bsonType: "string",
              pattern: "^[0-9]{5}$",  // Patrón para validar una cadena de 5 dígitos
              description: "num_referencia must be a string with 5 digits and is required" 
           },
           contenido: {
              bsonType: "string",
              description: "contenido must be a string and is required" 
           },
           valor: {
              bsonType: "int",
              description: "valor must be a int and is required" 
           },
           almacen: {
              bsonType: "int",
              description: "almacen must be a int and is required" 
           }
        }
     }
  }
})

db.almacen.insertOne({ "codigo": 1, "lugar": "Almacen A", "capacidad": 10000 })
db.almacen.insertOne({ "codigo": 2, "lugar": "Almacen B", "capacidad": 15000 })
db.almacen.insertOne({ "codigo": 3, "lugar": "Almacen C", "capacidad": 12000 })
db.almacen.insertOne({ "codigo": 4, "lugar": "Almacen D", "capacidad": 9000 })
db.almacen.insertOne({ "codigo": 5, "lugar": "Almacen E", "capacidad": 8000 })
db.almacen.insertOne({ "codigo": 6, "lugar": "Almacen F", "capacidad": 11000 })
db.almacen.insertOne({ "codigo": 7, "lugar": "Almacen G", "capacidad": 13000 })
db.almacen.insertOne({ "codigo": 8, "lugar": "Almacen H", "capacidad": 9500 })
db.almacen.insertOne({ "codigo": 9, "lugar": "Almacen I", "capacidad": 14000 })
db.almacen.insertOne({ "codigo": 10, "lugar": "Almacen J", "capacidad": 10500 })

// El campo Almacen Referencias a almacane.codigo
db.caja.insertOne({ "num_referencia": "00001", "contenido": "Objeto 1", "valor": 100, "almacen": 1 })
db.caja.insertOne({ "num_referencia": "00002", "contenido": "Objeto 2", "valor": 150, "almacen": 2 })
db.caja.insertOne({ "num_referencia": "00003", "contenido": "Objeto 3", "valor": 120, "almacen": 3 })
db.caja.insertOne({ "num_referencia": "00004", "contenido": "Objeto 4", "valor": 90, "almacen": 4 })
db.caja.insertOne({ "num_referencia": "00005", "contenido": "Objeto 5", "valor": 80, "almacen": 5 })
db.caja.insertOne({ "num_referencia": "00006", "contenido": "Objeto 6", "valor": 110, "almacen": 6 })
db.caja.insertOne({ "num_referencia": "00007", "contenido": "Objeto 7", "valor": 130, "almacen": 7 })
db.caja.insertOne({ "num_referencia": "00008", "contenido": "Objeto 8", "valor": 95, "almacen": 8 })
db.caja.insertOne({ "num_referencia": "00009", "contenido": "Objeto 9", "valor": 140, "almacen": 9 })
db.caja.insertOne({ "num_referencia": "00010", "contenido": "Objeto 10", "valor": 105, "almacen": 10 })


/**
 * Testamos la integridad de nuetra base de datos
 *  ESTOS DATO NO SE INSERTARÁ AL NO CUMPLIR LAS VALIDACIONES
 * 
 * @returns Document failed validation con un JSON "information"
 */
db.caja.insertOne({ "num_referencia": "0000004", "contenido": "Objeto 1", "valor": "100", "almacen": 1 }) // num_referencia" deberia ser de 5 digitos
db.caja.insertOne({ "num_referencia": "00004", "contenido": "Objeto 4", "valor": "90", "almacen": 4 }) // valor deberia ser un Numero
db.almacen.insertOne({ "almacen" : "Alfa " })  // No será insertado por ser un Número y faltar el resto de campos requeridos


/**
 * Testamos los datos referenciados 
 * @returns JSON con el objeto solicitado
 */
let { almacen  } = db.caja.findOne({ "num_referencia": "00003" })
db.almacen.findOne({ codigo: almacen }); 

let  codigo   = db.caja.findOne({ "contenido": "Objeto 9" })
db.almacen.findOne({ codigo: codigo.almacen }); 


