const db = db.getSiblingDB('los_cientificos');

db.createCollection("cientificos", {
  validator: {
     $jsonSchema: {
        bsonType: "object",
        required: ["dni", "nomApels"],
        properties: {
          dni: {
            bsonType: "string",
            pattern: "^[0-9]{8}$",  // Patrón para validar un DNI de 8 dígitos
            description: "dni must be a int with 8 digits and is required"
         },
           nomApels: {
              bsonType: "string",
              description:"must be a character string and is required"
           }
        },
     }
  }
});

db.createCollection("proyecto", {
  validator: {
     $jsonSchema: {
        bsonType: "object",
        required: ["id", "nombre", "horas"],
        properties: {
           id: {
            bsonType: "string",
              description: "must be a character string and is required"
           },
           nombre: {
              bsonType: "string",
              description: "must be a character string and is required"
           },
           horas: {
              bsonType: "int",
              description: "horas must be a int and is required",
           }
        },
     }
  }
});

db.createCollection("asignado_a", {
  validator: {
     $jsonSchema: {
        bsonType: "object",
        required: ["cientifico", "proyecto"],
        properties: {
           cientifico: {
              bsonType: "string",
              description:"must be a character string and is required"
           },
           proyecto: {
              bsonType: "string",
              description: "must be a character string and is required"
           }
        },
     }
  }
});

const dniArray = [
  "12345678",
  "23456789",
  "34567890",
  "45678901",
  "56789012",
  "67890123",
  "78901234",
  "89012345",
  "90123456",
  "98765432"
];


for (let i = 1; i <= 10; i++) {

  // Inserción en la colección "cientificos"
  db.cientificos.insert({ dni: dniArray[i-1],nomApels: `Cientifico ${i}`});

  // Inserción en la colección "proyecto"
  db.proyecto.insert({id: `PRJ-${i}`,nombre: `Proyecto ${i}`, horas: i * 10});

  // Inserción en la colección "asignado_a"
  db.asignado_a.insert({cientifico: dniArray[i-1],proyecto: `PRJ-${i}`});
}

/**
 * Testamos la integridad de nuetra base de datos
 *  ESTOS DATO NO SE INSERTARÁ AL NO CUMPLIR LAS VALIDACIONES
 * 
 * @returns Document failed validation con un JSON "information"
 */
db.cientificos.insert({ dni: "DNI1234567",nomApels: "Cientifico Inválido"}); // DNI debe tener 8 caracteres
db.proyecto.insert({ id: "PRJ11", nombre: "Proyecto Inválido", horas: "Cien"   }); // "horas" debe ser un número entero
db.asignado_a.insert({ cientifico: "DNI100",  proyecto: 100 }); // projeto deberia ser un numero


/**
 * Testamos los datos referenciados 
 * @returns JSON con el objeto solicitado
 */

// Hacemos una busqueda para seber con el dni de cinetifico en que proyecto esta
let { dni } = db.cientificos.findOne({ nomApels : "Cientifico 5" })
db.asignado_a.findOne({ cientifico: dni })

// DNI que deseas buscar
db.cientificos.findOne({ dni: dniArray[2]  });

/**
 * Testamos los datos referenciados 
 * @returns JSON con el objeto solicitado
 */
db.cientificos.updateOne(
    { DNI: dniArray[2]  },
    { $set: { nomApels: "Paco Martinez Soria"} }
);

