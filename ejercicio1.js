const db = db.getSiblingDB('tienda_informatica');

// Reglas de valicación de la colección fabricante
db.createCollection("fabricante", {
  validator: {
     $jsonSchema: {
        bsonType: "object",
        required: ["nombre"],
        properties: {
           nombre: {
            bsonType: "string",
            description: "nombre must be a string and is required" 
           }
        }
     }
  }
})

// Reglas de valicación de la colección articulo
db.createCollection("articulo", {
  validator: {
     $jsonSchema: {
        bsonType: "object",
        required: ["nombre", "precio", "fabricante"],
        properties: {
           nombre: {
            bsonType: "string",
            description: "nombre must be a string and is required"
           },
           precio: {
             bsonType: "int",
             description: "precio must be a int and is required" 
           },
           fabricante: {
             bsonType: "objectId" ,
             description: "Is an objectId that references the fabricante objectId"
           }
        }
     }
  }
})

db.fabricante.insertMany([
  { "_id": ObjectId("6536aa540e34da5029210ce6"), "nombre": "Chevrolet" },
  { "_id": ObjectId("6536aa540e34da5029210ce7"), "nombre": "Dodge"},
  { "_id": ObjectId("6536aa540e34da5029210ce8"), "nombre": "Dodge"},
  { "_id": ObjectId("6536aa540e34da5029210ce9"), "nombre": "Audi"},
  { "_id": ObjectId("6536aa540e34da5029210cea"), "nombre": "Lamborghini"},
  { "_id": ObjectId("6536aa540e34da5029210ceb"), "nombre": "Chevrolet"},
  { "_id": ObjectId("6536aa540e34da5029210cec"), "nombre": "Aston Martin" },
  { "_id": ObjectId("6536aa540e34da5029210ced"), "nombre": "Jensen"},
  { "_id": ObjectId("6536aa540e34da5029210cee"), "nombre": "Chevrolet" },
  { "_id": ObjectId("6536aa540e34da5029210cef"), "nombre": "BMW" }
])

// farbricante referencia a fabricante._id
db.articulo.insertMany([
  { "_id": ObjectId("6536ae430e34da5029210cf4"), "nombre": "Range Rover Sport", "precio": 71434,"fabricante": ObjectId("6536aa540e34da5029210ce6") },
  { "_id": ObjectId("6536ae430e34da5029210cf5"), "nombre": "Cherokee", "precio": 71534, "fabricante": ObjectId("6536aa540e34da5029210ce6")},
  { "_id": ObjectId("6536ae430e34da5029210cf6"), "nombre": "Grand Marquis", "precio": 75367, "fabricante": ObjectId("6536aa540e34da5029210ce6")},
  { "_id": ObjectId("6536ae430e34da5029210cf7"), "nombre": "Express 3500", "precio": 68540, "fabricante": ObjectId("6536aa540e34da5029210ce7")},
  { "_id": ObjectId("6536ae430e34da5029210cf8"), "nombre": "Boxster", "precio": 74842, "fabricante": ObjectId("6536aa540e34da5029210ce7")},
  { "_id": ObjectId("6536ae430e34da5029210cf9"), "nombre": "Mountaineer", "precio": 65453,"fabricante": ObjectId("6536aa540e34da5029210ce6")},
  { "_id": ObjectId("6536ae430e34da5029210cfa"), "nombre": "9-2X", "precio": 60914,"fabricante": ObjectId("6536aa540e34da5029210ce6")},
  { "_id": ObjectId("6536ae430e34da5029210cfb"), "nombre": "Odyssey", "precio": 74505, "fabricante": ObjectId("6536aa540e34da5029210cea")},
  { "_id": ObjectId("6536ae430e34da5029210cfc"), "nombre": "SL-Class", "precio": 63550, "fabricante": ObjectId("6536aa540e34da5029210cea")},
  { "_id": ObjectId("6536ae430e34da5029210cfd"), "nombre": "S6","precio": 73841, "fabricante": ObjectId("6536aa540e34da5029210ce6") }
])

/**
 * Testamos la integridad de nuetra base de datos
 *  ESTOS DATO NO SE INSERTARÁ AL NO CUMPLIR LAS VALIDACIONES
 * 
 * @returns Document failed validation con un JSON "information"
 */
db.fabricante.insertOne({ "nombre": 1 })  // Nombre debería ser string
db.articulo.updateMany({ "fabricante": "Chevrolet" }, { $set: { "precio": "60000" } })  // Precio debería ser number


/**
 * Testamos los datos referenciados 
 * @returns JSON con el objeto solicitado
 */
const { fabricante } = db.articulo.findOne({ "nombre": "Cherokee" })
db.fabricante.findOne({ "_id":  fabricante });


/**
 * Actualizamos un datos
 * @returns JSON  acknowledged : true
 */
db.fabricante.updateOne( { "nombre": "Chevrolet" }, { $set: { "nombre": "Chevy" } })


/**
 * Borramos un datos
 * @returns JSON  admitida: true
 */
db.articulo.deleteMany({ "precio": { $lte: 50000 } })

