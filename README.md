**e-HARD e-commerce: Proyecto final para el curso de Coderhouse “Programación Backend”**

El proyecto consta de un backend realizado con NodeJS y Express y un frontend desarrollado con ReactJS. Los archivos estáticos de react son servidos por el backend desde la carpeta “build”. 
Desde el archivo de entorno .env (en la ruta raíz del proyecto) puede configurarse la base de datos a utilizar, las opciones son:  

a)	MongoDB (Mongo Atlas) Es la opción por defecto y ya tiene todos los productos y el usuario administrador cargados.  

b)	Postgre (render.com) También tiene todos los productos y el usuario administrador cargados.  

c)	Base de datos local MondoDB o Postgre. En este cado se deberá crear un usuario administrador. Primero creando un nuevo usuario desde la opción SignUp en el frontend y luego accediendo a la    base de datos local y a la colección “users” modificando el campo “isadmin” y asignandole “true” al usuario al cual se desea darle los derechos de administrador. 
Luego de loguearse con el usuario administrador, desde el panel de administración pueden cargarse todos los productos con la opción “Restaurar Base de Datos de Productos”.  


Dependencias Utilizadas:

    "app-root-path": "^3.1.0",
    "bcryptjs": "^2.4.3",
    "clear": "^0.1.0",
    "cluster": "^0.7.7",
    "compression": "^1.7.4",
    "connect-mongo": "^4.6.0",
    "connect-pg-simple": "^8.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "ejs": "^3.1.9",
    "express": "^4.18.2",
    "express-handlebars": "^7.0.7",
    "express-session": "^1.17.3",
    "knex": "^2.4.2",
    "log4js": "^6.9.1",
    "minimist": "^1.2.8",
    "mongoose": "^6.9.2",
    "multer": "^1.4.5-lts.1",
    "node-fetch": "^3.3.1",
    "nodemailer": "^6.9.1",
    "passport": "^0.6.0",
    "passport-local": "^1.0.0",
    "pg": "^8.10.0",
    "pug": "^3.0.2",
    "socket.io": "^4.6.1",
    "twilio": "^4.9.0",
    "uuid": "^9.0.0"

