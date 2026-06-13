const botonEstudiantes = document.getElementById("1");

botonEstudiantes.addEventListener("click", function() {
    const contra = Number(prompt("Ingrese su contraseña:"));
    
    if (contra === 1234) {
        window.location.href = "http://127.0.0.1:5500/PROYECTOJS/index1.html";
    } else {
        alert("Incorrecto");
    }
});

const botonConductores = document.getElementById("2");

botonConductores.addEventListener("click", function() {
    const contras = Number(prompt("Ingrese su contraseña:"));
    
    if (contras === 12345) {
        window.location.href = "http://127.0.0.1:5500/PROYECTOJS/index2.html";
    } else {
        alert("Incorrecto");
    }
});

const botonRutas = document.getElementById("3");

botonRutas.addEventListener("click", function() {
    const contrase = Number(prompt("Ingrese su contraseña:"));
    
    if (contrase === 123456) {
        window.location.href = "http://127.0.0.1:5500/PROYECTOJS/index3.html";
    } else {
        alert("Incorrecto");
    }
});

