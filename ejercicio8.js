const db = db.getSiblingDB('los_investigadores');

db.createCollection("facultad", {
  validator: {
     $jsonSchema: {
        bsonType: "object",
        required: ["codigo", "nombre"],
        properties: {
           codigo: {
              bsonType: "int",
              description: "debe ser un entero"
           },
           nombre: {
              bsonType: "string",
              description: "debe ser una cadena de caracteres"
           }
        }
     }
  }
});

db.createCollection("investigador", {
  validator: {
     $jsonSchema: {
        bsonType: "object",
        required: ["dni", "nombre_apellidos", "facultad", "Odni_profesor"],
        properties: {
           dni: {
              bsonType: "string",
              description: "debe ser una cadena de 8 caracteres"
           },
           nombre_apellidos: {
              bsonType: "string",
              description: "debe ser una cadena de caracteres"
           },
           facultad: {
              bsonType: "int",
              description: "debe ser un entero"
           },
           Odni_profesor: {
              bsonType: "string",
              description: "debe ser una cadena de 9 caracteres"
           }
        }
     }
  }
});


db.createCollection("equipo", {
  validator: {
     $jsonSchema: {
        bsonType: "object",
        required: ["num_serie", "nombre", "facultad", "dni_profesor"],
        properties: {
           num_serie: {
              bsonType: "string",
              description: "debe ser una cadena de 4 caracteres"
           },
           nombre: {
              bsonType: "string",
              description: "debe ser una cadena de caracteres"
           },
           facultad: {
              bsonType: "int",
              description: "debe ser un entero"
           },
           dni_profesor: {
              bsonType: "string",
              description: "debe ser una cadena de 9 caracteres"
           }
        }
     }
  }
});

db.createCollection("reserva", {
  validator: {
     $jsonSchema: {
        bsonType: "object",
        required: ["dni_investigador", "num_equipo", "comienzo", "fin", "dni_profesor"],
        properties: {
           dni_investigador: {
              bsonType: "string",
              description: "debe ser una cadena de 8 caracteres"
           },
           num_equipo: {
              bsonType: "string",
              description: "debe ser una cadena de 4 caracteres"
           },
           comienzo: {
              bsonType: "date",
              description: "debe ser una fecha y hora"
           },
           fin: {
              bsonType: "date",
              description: "debe ser una fecha y hora"
           },
           dni_profesor: {
              bsonType: "string",
              description: "debe ser una cadena de 9 caracteres"
           }
        }
     }
  }
});

// INSERCIONES 
for (let i = 1; i <= 10; i++) {

  // Inserción en la colección "facultad"
  db.facultad.insert({ codigo: i, nombre: `Facultad ${i}` });

  // Inserción en la colección "investigador"
  db.investigador.insert({ dni: `DNI${i}`, nombre_apellidos: `Investigador ${i}`, facultad: i, Odni_profesor: `Profesor${i}` });

  // Inserción en la colección "equipo"
  db.equipo.insert({ num_serie: `SER${i}`, nombre: `Equipo ${i}`, facultad: i, dni_profesor: `Profesor${i}` });
  
  // Inserción en la colección "reseva"
  db.reserva.insert({  dni_investigador: `DNI${i}`, num_equipo: `SER${i}`,  comienzo: new Date(),  fin: new Date(),  dni_profesor: `Profesor${i}` });
};


/**
 * Testamos la integridad de nuetra base de datos
 *  ESTOS DATO NO SE INSERTARÁ AL NO CUMPLIR LAS VALIDACIONES
 * 
 * @returns Document failed validation con un JSON "information"
 */
// Inserción no válida en la colección "facultad" (código no es un entero)
db.facultad.insert({ codigo: "NoEsUnEntero", nombre: "Facultad Inválida" });

// Inserción no válida en la colección "investigador" dni debe ser un String
db.investigador.insert({ dni: 12345 , nombre_apellidos: "Investigador Inválido", facultad: 1, Odni_profesor: "Profesor1" });

// Inserción no válida en la colección "equipo" num_serie debe ser string
db.equipo.insert({ num_serie: 12345, nombre: "Equipo Inválido", facultad: 1, dni_profesor: "Profesor1" });

// Inserción no válida en la colección "reserva" le falta un campò requerido
db.reserva.insert({ dni_investigador: "DNI12345", num_equipo: "SER1", comienzo: new Date(), fin: new Date() });

 
