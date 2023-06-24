exports.signup = (data) => {
    
    const regexMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexPhone = /^\+(?:[0-9] ?){6,14}[0-9]$/;
              
    if (data.username.trim() !=="" && data.password.trim() !=="" && data.name.trim() !=="" && data.address.trim() !=="" && data.age.trim()!=="" && data.phone.trim() !=="") {
        if(!regexMail.test(data.username)) {
            return {dataOk: false, message: "E-Mail No válido"};
        }
        if(!regexPhone.test(data.phone)) {
            return {dataOk: false, message: "Teléfono Inválido, tiene que empezar con '+' y tener formato internacional. Ejemplo: +5491140869823 Para Argentina"};
        }
        return {dataOk: true};
    } else {
        return {dataOk: false, message:"Faltan Ingresar Datos" };
    }   
}

exports.dbActions = (option, data) => {
    switch (option) {
        case "modifyProduct":
            return (Object.values(data).includes("") || Object.values(data).includes(undefined) || !("id" in data) || !("field" in data) || !("value" in data)) ? {dataOk: false, message:"Algún dato es incorrecto o nulo o hay algún campo faltante" } : {dataOk: true};   //Si hay algún valor vacío o indefinido o con nombre equivocado salimos
        
        case "addProduct":
            const requiredKeys = ["marca", "modelo", "precio", "imgScr", "stock", "socket", "frecuencia", "tipodememoria", "cantidaddememoria", "tdp", "serie", "certificacion", "potencia", "rgb", "opcionesBusqueda", "describir"];
            return (requiredKeys.every((key) => key in data) && !Object.values(data).includes("") && !Object.values(data).includes(undefined)) ? {dataOk: true} : {dataOk: false, message:"Algún dato es incorrecto o nulo o hay algún campo faltante"};
    }        

    return {dataOk: true};
}
