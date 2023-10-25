const db = db.getSiblingDB('los_directores');

// Reglas de valicación de la colección despachos
db.createCollection("despachos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["numero", "capacidad"],
      properties: {
        numero: {
          bsonType: "int",
          description: "It must be an integer (INT) and is required."
        },
        capacidad: {
          bsonType: "int",
          description: "It must be an integer (INT) and is required."
        }
      }
    }
  }
})

// Reglas de valicación de la colección director
db.createCollection("director", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["dni", "nombre_apellidos", "despacho"],
      properties: {
        dni: {
          bsonType: "string",
          pattern: "^[0-9]{8}$",
          description: "It must be an 8 digit string and is required.",
          unique: true,
        },
        nombre_apellidos: {
          bsonType: "string",
          description: "It must be a character string and is required."
        },
        despacho: {
          bsonType: "int",
          description: "It must be an integer and must refer to the number of a dispatch in the 'dispatches' collection."
        },
        dni_jefe: {
          bsonType: "string",
          pattern: "^[0-9]{8}$",
          description: "refers to the boss ID and must be an 8-digit string"
        }
      }
    }
  }
})

// Crea un índice único para el atrubuto "numero",al ser PK no queremos duplicadad
db.almacen.createIndex({ numero: 1 }, { unique: true });

db.despachos.insertMany([
  { numero: 1, capacidad: 10 },
  { numero: 2, capacidad: 15 },
  { numero: 3, capacidad: 12 },
  { numero: 4, capacidad: 8 },
  { numero: 5, capacidad: 20 },
  { numero: 6, capacidad: 16 },
  { numero: 7, capacidad: 18 },
  { numero: 8, capacidad: 14 },
  { numero: 9, capacidad: 11 },
  { numero: 10, capacidad: 9 }
])

// despacho referencia a despachos.numero
db.director.insertMany([
  { dni: "12345678", nombre_apellidos: "Juan Pérez", despacho: 1},
  { dni: "23456789", nombre_apellidos: "María Rodríguez", despacho: 2, dni_jefe: "12345678" },
  { dni: "34567890", nombre_apellidos: "Carlos Sánchez", despacho: 3},
  { dni: "45678901", nombre_apellidos: "Ana López", despacho: 4, dni_jefe: "12345678" },
  { dni: "56789012", nombre_apellidos: "Pedro Gómez", despacho: 5 },
  { dni: "67890123", nombre_apellidos: "Laura Martínez", despacho: 6, dni_jefe: "34567890" },
  { dni: "78901234", nombre_apellidos: "Sergio Torres", despacho: 7},
  { dni: "89012345", nombre_apellidos: "Elena Vargas", despacho: 8, dni_jefe: "23456789" },
  { dni: "90123456", nombre_apellidos: "Miguel Ruiz", despacho: 9 },
  { dni: "01234567", nombre_apellidos: "Isabel Fernández", despacho: 10, dni_jefe: "34567890" }
])

/**
 * Testamos la integridad de nuetra base de datos
 *  ESTOS DATO NO SE INSERTARÁ AL NO CUMPLIR LAS VALIDACIONES
 * 
 * @returns Document failed validation con un JSON "information"
 */
db.director.insertOne({ dni: 90123456, nombre_apellidos: "Miguel Ruiz", despacho: 9 }) // codigo dni debaria ser String
db.director.insertOne({ dni: "56789012", nombre_apellidos: 0, despacho: 5})  // nombre_apellidos deberia ser string
db.despachos.insertOne({ numero: 10, capacidad: "9" })  // capacidad debaria ser number


/**
 * Testamos los datos referenciados 
 * @returns JSON con el objeto solicitado
 */
// le pasamos un dni y busca que personal tiene a su carco
let { dni } = db.director.findOne({ dni : "34567890" })
db.director.find({ dni_jefe : dni }); 


/**
 * Actualizamos un datos
 * @returns JSON  acknowledged : true
 */

// Le pasas en numero del despacho asignado al director y descuenta la capaciad del despacho
const numDespacho = 10 // ejemplo
let { capacidad , numero } = db.despachos.findOne( { numero: numDespacho });
db.despachos.updateOne({ numero: numero }, { $set: { capacidad: capacidad-1 } });

// Busca todos los despachos ocupados y le resta la capciadad
db.despachos.updateMany({}, { $inc: { capacidad: -1 } });