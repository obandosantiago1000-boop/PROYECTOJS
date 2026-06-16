document.addEventListener("DOMContentLoaded", () => {
    const contConductores = document.getElementById("contenedor-conductores");
    const contEstudiantes = document.getElementById("contenedor-estudiantes");


    function mostrarDatos(clave, contenedor) {
        const datos = JSON.parse(localStorage.getItem(clave)) || [];

        if (datos.length === 0) {
            contenedor.innerHTML = "<p>No hay registros aún.</p>";
            return;
        }

        datos.forEach(item => {
            const card = document.createElement("div");
            card.style.border = "1px solid #ccc";
            card.style.padding = "10px";
            card.style.margin = "5px";
            card.innerHTML = `
                <strong>${item.titulo}</strong>
                <p>${item.descripcion}</p>
            `;
            contenedor.appendChild(card);
        });
    }


    mostrarDatos("conductores", contConductores);
    mostrarDatos("estudiantes", contEstudiantes);
});


document.addEventListener("DOMContentLoaded", () => {

    const nombre = document.getElementById("1");
    const edad = document.getElementById("2");
    const tarjeta = document.getElementById("3");
    const zona = document.getElementById("4");
    const jornada = document.getElementById("5");
    const selectConductor = document.getElementById("select-conductor");
    const contenedor = document.getElementById("8");
    const formulario = document.getElementById("7");

    let editando = false;
    let tarjetaParaEditar = null;


    function actualizarConductores() {
        const conductores = JSON.parse(localStorage.getItem("conductores")) || [];
        if (!selectConductor) return;

        selectConductor.innerHTML = '<option value="" disabled selected>Seleccione un conductor</option>';
        conductores.forEach(c => {
            const option = document.createElement("option");
            option.value = c.titulo;
            option.textContent = c.titulo;
            selectConductor.appendChild(option);
        });
    }


    const template = document.createElement("template");
    template.innerHTML = `
    <style>
        .card { width: 300px; background-color: brown; border-radius: 12px; padding: 15px; color: white; margin-bottom: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        h2 { margin: 0 0 10px; font-size: 20px; }
        p { font-size: 14px; margin-bottom: 10px; }
        button { padding: 8px; border: none; border-radius: 5px; cursor: pointer; margin-right: 5px; color: black; }
    </style>
    <article class="card">
        <h2></h2>
        <p></p>
        <button id="btn-editar">EDITAR</button>
        <button id="btn-eliminar">ELIMINAR</button>
    </article>
    `;

    class ArticleCard extends HTMLElement {
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
                this.remove();
                actualizarLocalStorage();
            });

            this.shadowRoot.querySelector("#btn-editar").addEventListener("click", () => {
                const desc = this.getAttribute("descripcion");
                const claveEdicion = 333;
                const ingresado = Number(prompt("Ingrese su clave de edición personal:"));

                if (ingresado === claveEdicion) {
                    const partes = desc.split(" | ");
                    nombre.value = this.getAttribute("titulo");
                    edad.value = partes[0].replace("Edad: ", "");
                    tarjeta.value = partes[1].replace("TI: ", "");
                    zona.value = partes[2].replace("Zona: ", "");
                    jornada.value = partes[3].replace("Jornada: ", "");

                    editando = true;
                    tarjetaParaEditar = this;
                    tarjeta.readOnly = true;
                    window.scrollTo(0, 0);
                } else {
                    alert("Clave incorrecta.");
                }
            });
        }
    }

    if (!customElements.get("article-card")) {
        customElements.define("article-card", ArticleCard);
    }


    function cargarDesdeLocalStorage() {
        if (!contenedor) return;
        const guardados = JSON.parse(localStorage.getItem("estudiantes")) || [];
        guardados.forEach(e => crearTarjeta(e));
    }

    function crearTarjeta(datos) {
        const nuevoEstudiante = document.createElement("article-card");
        nuevoEstudiante.setAttribute("titulo", datos.titulo);
        nuevoEstudiante.setAttribute("descripcion", datos.descripcion);
        contenedor.appendChild(nuevoEstudiante);
    }

    function actualizarLocalStorage() {
        const tarjetas = document.querySelectorAll("article-card");
        const nuevosDatos = [];
        tarjetas.forEach(t => {
            nuevosDatos.push({
                titulo: t.getAttribute("titulo"),
                descripcion: t.getAttribute("descripcion")
            });
        });
        localStorage.setItem("estudiantes", JSON.stringify(nuevosDatos));
    }

    function agregarProyectoInicio() {
        if (nombre.value.trim() === "" || selectConductor.value === "") {
            alert("Complete todos los campos incluyendo el conductor");
            return;
        }

        const datos = {
            titulo: nombre.value,
            descripcion: `Edad: ${edad.value} | TI: ${tarjeta.value} | Zona: ${zona.value} | Jornada: ${jornada.value} | Conductor: ${selectConductor.value}`
        };

        if (editando) {
            tarjetaParaEditar.setAttribute("titulo", datos.titulo);
            tarjetaParaEditar.setAttribute("descripcion", datos.descripcion);
            editando = false;
            tarjeta.readOnly = false;
        } else {
            crearTarjeta(datos);
        }

        actualizarLocalStorage();
        formulario.reset();
    }


    actualizarConductores();
    cargarDesdeLocalStorage();

    if (formulario) {
        formulario.addEventListener("submit", (e) => {
            e.preventDefault();
            agregarProyectoInicio();
        });
    }


    window.addEventListener("storage", (e) => {
        if (e.key === "conductores") actualizarConductores();
    });
});




document.addEventListener("DOMContentLoaded", () => {
    const formRuta = document.getElementById("form-ruta");
    const contenedorRutas = document.getElementById("dashboard");


    if (!formRuta || !contenedorRutas) return;

    let editandoRuta = false;
    let tarjetaRutaParaEditar = null;


    class RutaCard extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: "open" });
        }

        connectedCallback() {
            this.render();
        }


        render() {
            const nombre = this.getAttribute("nombre");
            const zona = this.getAttribute("zona");
            const jornada = this.getAttribute("jornada");
            const conductor = this.getAttribute("conductor");


            const todosEst = JSON.parse(localStorage.getItem("estudiantes")) || [];
            const filtrados = todosEst.filter(e =>
                e.descripcion.includes(`Zona: ${zona}`) &&
                e.descripcion.includes(`Jornada: ${jornada}`)
            );

            this.shadowRoot.innerHTML = `
            <style>
                .card { border: 2px solid green; padding: 15px; margin: 10px; border-radius: 8px; font-family: sans-serif; background: #f9f9f9; color: black; }
                button { padding: 8px; border: none; border-radius: 5px; cursor: pointer; margin-right: 5px; background: #ddd; }
                button:hover { background: #ccc; }
                h3 { margin-top: 0; }
            </style>
            <div class="card">
                <h3>Ruta: ${nombre}</h3>
                <p>Zona: ${zona} | Jornada: ${jornada}</p>
                <strong>Conductor: ${conductor}</strong>
                <br><br>
                <strong>Estudiantes asignados (${filtrados.length}):</strong>
                <ul>${filtrados.map(e => `<li>${e.titulo}</li>`).join('')}</ul>
                <button id="btn-editar-ruta">EDITAR</button>
                <button id="btn-eliminar-ruta">ELIMINAR</button>
            </div>`;


            this.shadowRoot.querySelector("#btn-eliminar-ruta").addEventListener("click", () => {
                this.remove();
                actualizarLocalStorageRutas();
            });


            this.shadowRoot.querySelector("#btn-editar-ruta").addEventListener("click", () => {
                if (prompt("Ingrese clave para editar (111):") === "111") {
                    document.getElementById("nombre-ruta").value = nombre;
                    document.getElementById("select-conductor").value = conductor;
                    document.getElementById("zona-ruta").value = zona;
                    document.getElementById("jornada-ruta").value = jornada;

                    editandoRuta = true;
                    tarjetaRutaParaEditar = this;

                    const btnSubmit = formRuta.querySelector('button[type="submit"]');
                    if (btnSubmit) btnSubmit.textContent = "ACTUALIZAR RUTA";

                    window.scrollTo(0, 0);
                } else alert("Clave incorrecta.");
            });
        }
    }

    if (!customElements.get("ruta-card")) {
        customElements.define("ruta-card", RutaCard);
    }


    function actualizarLocalStorageRutas() {
        const tarjetas = document.querySelectorAll("ruta-card");
        const rutas = Array.from(tarjetas).map(t => ({
            nombre: t.getAttribute("nombre"),
            conductor: t.getAttribute("conductor"),
            zona: t.getAttribute("zona"),
            jornada: t.getAttribute("jornada")
        }));
        localStorage.setItem("rutas", JSON.stringify(rutas));
    }


    formRuta.addEventListener("submit", (e) => {
        e.preventDefault();

        const data = {
            nombre: document.getElementById("nombre-ruta").value,
            conductor: document.getElementById("select-conductor").value,
            zona: document.getElementById("zona-ruta").value,
            jornada: document.getElementById("jornada-ruta").value
        };

        if (editandoRuta) {

            tarjetaRutaParaEditar.setAttribute("nombre", data.nombre);
            tarjetaRutaParaEditar.setAttribute("conductor", data.conductor);
            tarjetaRutaParaEditar.setAttribute("zona", data.zona);
            tarjetaRutaParaEditar.setAttribute("jornada", data.jornada);
            tarjetaRutaParaEditar.render(); // Refresca los estudiantes

            editandoRuta = false;
            const btnSubmit = formRuta.querySelector('button[type="submit"]');
            if (btnSubmit) btnSubmit.textContent = "CREAR RUTA";
        } else {

            const card = document.createElement("ruta-card");
            card.setAttribute("nombre", data.nombre);
            card.setAttribute("zona", data.zona);
            card.setAttribute("jornada", data.jornada);
            card.setAttribute("conductor", data.conductor);
            contenedorRutas.appendChild(card);
        }

        actualizarLocalStorageRutas();
        formRuta.reset();
    });


    function renderRutas() {
        contenedorRutas.innerHTML = "";
        const rutas = JSON.parse(localStorage.getItem("rutas")) || [];
        rutas.forEach(r => {
            const card = document.createElement("ruta-card");
            card.setAttribute("nombre", r.nombre);
            card.setAttribute("zona", r.zona);
            card.setAttribute("jornada", r.jornada);
            card.setAttribute("conductor", r.conductor);
            contenedorRutas.appendChild(card);
        });
    }

    renderRutas();
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