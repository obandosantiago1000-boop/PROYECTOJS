document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.querySelector("form");
    const inputs = formulario.querySelectorAll("input");
    const nombre = inputs[0];
    const edad = inputs[1];
    const cedula = inputs[2];
    const contenedor = document.getElementById("8");

    let editando = false;
    let tarjetaParaEditar = null;


    const template = document.createElement("template");
    template.innerHTML = `
    <style>
        .card { width: 300px; background-color: #2c3e50; border-radius: 12px; padding: 15px; color: white; margin-bottom: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        h2 { margin: 0 0 10px; font-size: 20px; }
        p { font-size: 14px; margin-bottom: 10px; }
        button { padding: 8px; border: none; border-radius: 5px; cursor: pointer; margin-right: 5px; }
    </style>
    <article class="card">
        <h2></h2>
        <p></p>
        <button id="btn-editar">EDITAR</button>
        <button id="btn-eliminar">ELIMINAR</button>
    </article>
    `;

    class ConductorCard extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        }

        static get observedAttributes() { return ["titulo", "descripcion"]; }

        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue !== newValue) {
                if (name === "titulo") this.shadowRoot.querySelector("h2").textContent = newValue;
                if (name === "descripcion") this.shadowRoot.querySelector("p").textContent = newValue;
            }
        }

        connectedCallback() {
            this.shadowRoot.querySelector("h2").textContent = this.getAttribute("titulo");
            this.shadowRoot.querySelector("p").textContent = this.getAttribute("descripcion");

            this.shadowRoot.querySelector("#btn-eliminar").addEventListener("click", () => {
                const claveCorrecta = 222;
                const ingresado = Number(prompt("Para eliminar este conductor, ingrese su clave de administración:"));

                if (ingresado === claveCorrecta) {
                    const nombreConductor = this.getAttribute("titulo");
                    this.remove();
                    actualizarLocalStorage();
                    const eventoEliminacion = new CustomEvent("conductorEliminado", {
                        detail: { nombre: nombreConductor }
                    });
                    window.dispatchEvent(eventoEliminacion);
                } else {
                    alert("Clave incorrecta. No se pudo eliminar el conductor.");
                }
            });


            this.shadowRoot.querySelector("#btn-editar").addEventListener("click", () => {
                const desc = this.getAttribute("descripcion");
                const cont = 222
                const cedulaIngresada = Number(prompt("Para editar, ingrese su clave de edicion:"));

                if (cedulaIngresada === cont) {
                    const partes = desc.split(" | ");
                    nombre.value = this.getAttribute("titulo");
                    edad.value = partes[0].replace("Edad: ", "");
                    cedula.value = partes[1].replace("Cédula: ", "");

                    editando = true;
                    tarjetaParaEditar = this;
                    window.scrollTo(0, 0);
                } else {
                    alert("Cédula incorrecta.");
                }
            });
        }
    }

    if (!customElements.get("conductor-card")) {
        customElements.define("conductor-card", ConductorCard);
    }


    function cargarDesdeLocalStorage() {
        const guardados = JSON.parse(localStorage.getItem("conductores")) || [];
        guardados.forEach(c => crearTarjeta(c));
    }

    function crearTarjeta(datos) {
        const nuevaTarjeta = document.createElement("conductor-card");
        nuevaTarjeta.setAttribute("titulo", datos.titulo);
        nuevaTarjeta.setAttribute("descripcion", datos.descripcion);
        contenedor.appendChild(nuevaTarjeta);
    }

    function actualizarLocalStorage() {
        const tarjetas = document.querySelectorAll("conductor-card");
        const nuevosDatos = [];
        tarjetas.forEach(t => {
            nuevosDatos.push({
                titulo: t.getAttribute("titulo"),
                descripcion: t.getAttribute("descripcion")
            });
        });
        localStorage.setItem("conductores", JSON.stringify(nuevosDatos));
    }

    formulario.addEventListener("submit", (e) => {
        e.preventDefault();
        const datos = {
            titulo: nombre.value,
            descripcion: `Edad: ${edad.value} | Cédula: ${cedula.value}`
        };

        if (editando) {
            tarjetaParaEditar.setAttribute("titulo", datos.titulo);
            tarjetaParaEditar.setAttribute("descripcion", datos.descripcion);
            editando = false;
            cedula.readOnly = false;
        } else {
            crearTarjeta(datos);
        }

        actualizarLocalStorage();
        formulario.reset();
    });

    cargarDesdeLocalStorage();
});




document.addEventListener("DOMContentLoaded", () => {

    const contRutas = document.getElementById("contenedor-rutas");

    function mostrarRutasConEstudiantes() {
        if (!contRutas) return;

        const rutas = JSON.parse(localStorage.getItem("rutas")) || [];
        const estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];

        if (rutas.length === 0) {
            contRutas.innerHTML = "<p>No hay rutas registradas aún.</p>";
            return;
        }

        contRutas.innerHTML = "";

        rutas.forEach(ruta => {

            const estudiantesAsignados = estudiantes.filter(e =>
                e.descripcion.includes(`Zona: ${ruta.zona}`) &&
                e.descripcion.includes(`Jornada: ${ruta.jornada}`)
            );


            let listaEstudiantesHTML = "<li style='color: #777;'>No hay estudiantes asignados.</li>";
            if (estudiantesAsignados.length > 0) {
                listaEstudiantesHTML = estudiantesAsignados.map(e => `<li>${e.titulo}</li>`).join('');
            }


            const card = document.createElement("div");
            card.style.border = "1px solid #ccc";
            card.style.padding = "15px";
            card.style.margin = "10px 5px";
            card.style.borderRadius = "8px";
            card.style.backgroundColor = "#fff";
            card.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";

            card.innerHTML = `
                <h3 style="margin: 0 0 10px 0; color: #2c3e50;">Ruta: ${ruta.nombre}</h3>
                <p style="margin: 5px 0;"><strong>Zona:</strong> ${ruta.zona} | <strong>Jornada:</strong> ${ruta.jornada}</p>
                <p style="margin: 5px 0;"><strong>Conductor:</strong> ${ruta.conductor}</p>
                
                <div style="margin-top: 15px; padding-top: 10px; border-top: 1px dashed #ccc;">
                    <strong style="color: #2980b9;">Estudiantes Asignados (${estudiantesAsignados.length}):</strong>
                    <ul style="margin-top: 5px; padding-left: 20px;">
                        ${listaEstudiantesHTML}
                    </ul>
                </div>
            `;

            contRutas.appendChild(card);
        });
    }


    mostrarRutasConEstudiantes();
});

window.addEventListener("conductorEliminado", (e) => {
    const nombreEliminado = e.detail.nombre;


    alert(`⚠️ El conductor "${nombreEliminado}" ha sido eliminado. Sus rutas quedarán sin asignar.`);


    let rutas = JSON.parse(localStorage.getItem("rutas")) || [];
    let rutasModificadas = false;

    rutas = rutas.map(ruta => {
        if (ruta.conductor === nombreEliminado) {

            ruta.conductor = "Sin asignar (Conductor eliminado)";
            rutasModificadas = true;
        }
        return ruta;
    });


    if (rutasModificadas) {
        localStorage.setItem("rutas", JSON.stringify(rutas));


        if (typeof mostrarRutasConEstudiantes === "function") {
            mostrarRutasConEstudiantes();
        }
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