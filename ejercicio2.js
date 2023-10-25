const db = db.getSiblingDB('empleados');

// Reglas de valicación de la colección departamentos
db.createCollection("departamentos", {
  validator: {
     $jsonSchema: {
        bsonType: "object",
        required: ["codigo", "nombre", "presupuesto"],
        properties: {
           codigo: {
              bsonType: "int",
              description: "codigo must be a int and is required"
              
           },
           nombre: {
              bsonType: "string",
              description: "nombre must be a string and is required" 
           },
           presupuesto: {
              bsonType: "int",
              description: "presupuesto must be a int and is required"
           }
        }
     }
  }
})

// Reglas de valicación de la colección empleados
db.createCollection("empleados", {
  validator: {
     $jsonSchema: {
        bsonType: "object",
        required: ["dni", "nombre", "apellidos", "departamento"],
        properties: {
           dni: {
              bsonType: "string",
              pattern: "^[0-9]{8}$",  // Patrón para validar un DNI de 8 dígitos
              description: "dni must be a int with 8 digits and is required"
           },
           nombre: {
              bsonType: "string",
              description: "nombre must be a string and is required" 
           },
           apellidos: {
              bsonType: "string",
              description: "apellidos must be a string and is required" 
           },
           departamento: {
              bsonType: "int",
              description: "departamento must be a int and is required"
           }
        }
     }
  }
})

// Crea un índice único para el atrubuto "codigo",al ser PK no queremos duplicadad
db.almacen.createIndex({ codigo: 1 }, { unique: true });

db.departamentos.insertMany([
  { "codigo": 1, "nombre": "Departamento de Ventas", "presupuesto": 100000 },
  { "codigo": 2, "nombre": "Departamento de Marketing", "presupuesto": 80000 },
  { "codigo": 3, "nombre": "Departamento de Recursos Humanos", "presupuesto": 75000 },
  { "codigo": 4, "nombre": "Departamento de Tecnología", "presupuesto": 120000 },
  { "codigo": 5, "nombre": "Departamento de Finanzas", "presupuesto": 90000 },
  { "codigo": 6, "nombre": "Departamento de Logística", "presupuesto": 85000 },
  { "codigo": 7, "nombre": "Departamento de Producción", "presupuesto": 110000 },
  { "codigo": 8, "nombre": "Departamento de Calidad", "presupuesto": 72000 },
  { "codigo": 9, "nombre": "Departamento de Legal", "presupuesto": 95000 },
  { "codigo": 10, "nombre": "Departamento de Investigación", "presupuesto": 105000 }
])

// depatamaneto Refencia a depatamento.codigo
db.empleados.insertMany([
  { "dni": "12345678", "nombre": "Juan", "apellidos": "Pérez", "departamento": 1 },
  { "dni": "23456789", "nombre": "Ana", "apellidos": "García", "departamento": 2 },
  { "dni": "34567890", "nombre": "Pedro", "apellidos": "López", "departamento": 3 },
  { "dni": "45678901", "nombre": "Laura", "apellidos": "Martínez", "departamento": 4 },
  { "dni": "56789012", "nombre": "Carlos", "apellidos": "Rodríguez", "departamento": 5 },
  { "dni": "67890123", "nombre": "Sofía", "apellidos": "Fernández", "departamento": 6 },
  { "dni": "78901234", "nombre": "María", "apellidos": "Sánchez", "departamento": 7 },
  { "dni": "89012345", "nombre": "Luis", "apellidos": "Gómez", "departamento": 8 },
  { "dni": "90123456", "nombre": "Elena", "apellidos": "Torres", "departamento": 9 },
  { "dni": "01234567", "nombre": "Daniel", "apellidos": "Ramírez", "departamento": 10 }
])

/**
 * Testamos la integridad de nuetra base de datos
 *  ESTOS DATO NO SE INSERTARÁ AL NO CUMPLIR LAS VALIDACIONES
 * 
 * @returns Document failed validation con un JSON "information"
 */
db.empleados.insertOne({ dni: "123456789", "nombre": "Juan", "apellidos": "Pérez", "departamento": 1 })  // DNI debería ser mayor de 8 digitos
db.empleados.insertOne({ "dni": "23456789", "nombre": 22, "apellidos": "García", "departamento": 2 }) //nombre debería ser String 
db.departamentos.insertOne({ "codigo": "Alfa " }) // No será insertado por ser un String y faltar el resto de campos requeridos
 

/**
 * Testamos los datos referenciados 
 * @returns JSON con el objeto solicitado
 */
let { departamento } = db.empleados.findOne({ "nombre": "Luis" })
db.departamentos.findOne({ codigo: departamento }); 

let codigo  = db.empleados.findOne({ "dni": "56789012" })
db.departamentos.findOne({ codigo: codigo.departamento }); 


