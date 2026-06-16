const botonEstudiantes = document.getElementById("1");

botonEstudiantes.addEventListener("click", function () {
    const contra = Number(prompt("Ingrese su contraseña:"));

    if (contra === 1234) {
        window.location.href = "";
    } else {
        alert("Incorrecto");
    }
});

const botonConductores = document.getElementById("2");

botonConductores.addEventListener("click", function () {
    const contras = Number(prompt("Ingrese su contraseña:"));

    if (contras === 12345) {
        window.location.href = "";
    } else {
        alert("Incorrecto");
    }
});

const botonRutas = document.getElementById("3");

botonRutas.addEventListener("click", function () {
    const contrase = Number(prompt("Ingrese su contraseña:"));

    if (contrase === 123456) {
        window.location.href = "";
    } else {
        alert("Incorrecto");
    }
});



async function obtenerClima() {
    const contenedorClima = document.getElementById("info-clima");
    if (!contenedorClima) return;

    const apiKey = '7b2f85cc2ca5a95354dfd120325f32ab';
    const ciudad = 'Ipiales';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`;

    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        if (datos.cod === 200) {
            const temperatura = Math.round(datos.main.temp);
            const descripcion = datos.weather[0].description;
            const icono = datos.weather[0].icon;

            contenedorClima.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <img src="https://openweathermap.org/img/wn/${icono}@2x.png" alt="Icono del clima" width="50" height="50">
                    <div style="margin-left: 10px;">
                        <strong style="font-size: 24px;">${temperatura}°C</strong>
                        <p style="margin: 0; text-transform: capitalize; color: #555;">${descripcion}</p>
                        <p style="margin: 0; font-size: 12px; color: #777;">${datos.name}</p>
                    </div>
                </div>
            `;
        } else {
            contenedorClima.innerHTML = `<p style="color: red;">Error: ${datos.message}</p>`;
        }
    } catch (error) {
        contenedorClima.innerHTML = `<p style="color: red;">No se pudo conectar con el servidor de clima.</p>`;
        console.error("Error al obtener el clima:", error);
    }
}

obtenerClima()