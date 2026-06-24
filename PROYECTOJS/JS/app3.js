// =====================================================================
// 1. VISUALIZACIÓN RÁPIDA DE DATOS
// =====================================================================
// Nos aseguramos de que el DOM (el HTML) esté completamente cargado antes de actuar.
document.addEventListener("DOMContentLoaded", () => {
    // Capturamos los elementos del HTML donde vamos a inyectar las listas.
    const contConductores = document.getElementById("contenedor-conductores");
    const contEstudiantes = document.getElementById("contenedor-estudiantes");

    // Función genérica para leer datos y pintarlos en pantalla.
    function mostrarDatos(clave, contenedor) {
        // Busca en localStorage por la 'clave'. Si no existe o es null, devuelve un arreglo vacío [].
        const datos = JSON.parse(localStorage.getItem(clave)) || [];

        // Si no hay datos guardados, mostramos un mensaje por defecto y detenemos la función (return).
        if (datos.length === 0) {
            contenedor.innerHTML = "<p>No hay registros aún.</p>";
            return;
        }

        // Recorremos cada registro encontrado en el localStorage.
        datos.forEach(item => {
            // Creamos un nuevo elemento <div> en memoria.
            const card = document.createElement("div");
            // Le aplicamos estilos CSS básicos directamente con JS.
            card.style.border = "1px solid #ccc";
            card.style.padding = "10px";
            card.style.margin = "5px";
            // Llenamos el <div> con la información del registro usando Template Literals (`).
            card.innerHTML = `
                <strong>${item.titulo}</strong>
                <p>${item.descripcion}</p>
            `;
            // Agregamos el <div> ya armado al contenedor visible de la página.
            contenedor.appendChild(card);
        });
    }

    // Ejecutamos la función para conductores y luego para estudiantes.
    mostrarDatos("conductores", contConductores);
    mostrarDatos("estudiantes", contEstudiantes);
});


// =====================================================================
// 2. GESTIÓN DE ESTUDIANTES (FORMULARIO Y WEB COMPONENT)
// =====================================================================
document.addEventListener("DOMContentLoaded", () => {
    // Capturamos todos los campos del formulario usando sus IDs.
    const nombre = document.getElementById("1");
    const edad = document.getElementById("2");
    const tarjeta = document.getElementById("3");
    const zona = document.getElementById("4");
    const jornada = document.getElementById("5");
    const selectConductor = document.getElementById("select-conductor");
    const contenedor = document.getElementById("8");
    const formulario = document.getElementById("7");

    // Banderas globales para saber si estamos creando uno nuevo o editando uno existente.
    let editando = false;
    let tarjetaParaEditar = null;

    // Lee los conductores de localStorage y llena el menú desplegable (<select>).
    function actualizarConductores() {
        const conductores = JSON.parse(localStorage.getItem("conductores")) || [];
        if (!selectConductor) return; // Si no existe el select en esta página, no hace nada.

        // Resetea el contenido del select con la opción por defecto.
        selectConductor.innerHTML = '<option value="" disabled selected>Seleccione un conductor</option>';
        // Crea un <option> por cada conductor encontrado.
        conductores.forEach(c => {
            const option = document.createElement("option");
            option.value = c.titulo;
            option.textContent = c.titulo;
            selectConductor.appendChild(option);
        });
    }

    // Definimos el esqueleto HTML y CSS de nuestro Web Component.
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

    // Clase que define el comportamiento del Web Component <article-card>.
    class ArticleCard extends HTMLElement {
        constructor() {
            super();
            // Creamos un Shadow DOM (un árbol DOM independiente y encapsulado) para proteger sus estilos.
            this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        }

        // Le decimos a JS qué atributos (HTML) debe vigilar por si cambian.
        static get observedAttributes() { return ["titulo", "descripcion"]; }

        // Si uno de los atributos vigilados cambia, actualizamos el texto dentro del componente.
        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue !== newValue) {
                if (name === "titulo") this.shadowRoot.querySelector("h2").textContent = newValue;
                if (name === "descripcion") this.shadowRoot.querySelector("p").textContent = newValue;
            }
        }

        // Se ejecuta cuando la tarjeta se inserta en el DOM de la página.
        connectedCallback() {
            // Asigna los valores iniciales.
            this.shadowRoot.querySelector("h2").textContent = this.getAttribute("titulo");
            this.shadowRoot.querySelector("p").textContent = this.getAttribute("descripcion");

            // Evento para ELIMINAR el estudiante.
            this.shadowRoot.querySelector("#btn-eliminar").addEventListener("click", () => {
                this.remove(); // Borra la tarjeta del HTML.
                actualizarLocalStorage(); // Sobrescribe el almacenamiento sin esta tarjeta.
            });

            // Evento para EDITAR el estudiante.
            this.shadowRoot.querySelector("#btn-editar").addEventListener("click", () => {
                const desc = this.getAttribute("descripcion");
                const claveEdicion = 333; // Clave de seguridad hardcodeada.
                const ingresado = Number(prompt("Ingrese su clave de edición personal:"));

                if (ingresado === claveEdicion) {
                    // Si la clave es correcta, separamos el string "Edad: X | TI: Y..." usando el " | ".
                    const partes = desc.split(" | ");
                    // Llenamos los inputs del formulario quitando el texto sobrante.
                    nombre.value = this.getAttribute("titulo");
                    edad.value = partes[0].replace("Edad: ", "");
                    tarjeta.value = partes[1].replace("TI: ", "");
                    zona.value = partes[2].replace("Zona: ", "");
                    jornada.value = partes[3].replace("Jornada: ", "");

                    // Activamos el modo edición y bloqueamos la edición del ID (tarjeta).
                    editando = true;
                    tarjetaParaEditar = this;
                    tarjeta.readOnly = true;
                    window.scrollTo(0, 0); // Sube la pantalla hacia el formulario.
                } else {
                    alert("Clave incorrecta.");
                }
            });
        }
    }

    // Registramos la etiqueta <article-card> en el navegador para poder usarla.
    if (!customElements.get("article-card")) {
        customElements.define("article-card", ArticleCard);
    }

    // Pinta las tarjetas guardadas al abrir la página.
    function cargarDesdeLocalStorage() {
        if (!contenedor) return;
        const guardados = JSON.parse(localStorage.getItem("estudiantes")) || [];
        guardados.forEach(e => crearTarjeta(e));
    }

    // Función que instancia el Web Component y lo inyecta en el DOM.
    function crearTarjeta(datos) {
        const nuevoEstudiante = document.createElement("article-card");
        nuevoEstudiante.setAttribute("titulo", datos.titulo);
        nuevoEstudiante.setAttribute("descripcion", datos.descripcion);
        contenedor.appendChild(nuevoEstudiante);
    }

    // Reconstruye el localStorage leyendo todas las tarjetas <article-card> visibles en el HTML.
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

    // Lógica para guardar o actualizar la información enviada desde el formulario.
    function agregarProyectoInicio() {
        // Validamos que los campos esenciales no estén vacíos.
        if (nombre.value.trim() === "" || selectConductor.value === "") {
            alert("Complete todos los campos incluyendo el conductor");
            return;
        }

        // Consolidamos la información en un solo objeto literal.
        const datos = {
            titulo: nombre.value,
            descripcion: `Edad: ${edad.value} | TI: ${tarjeta.value} | Zona: ${zona.value} | Jornada: ${jornada.value} | Conductor: ${selectConductor.value}`
        };

        // Si estamos editando, solo actualizamos los atributos de la tarjeta seleccionada.
        if (editando) {
            tarjetaParaEditar.setAttribute("titulo", datos.titulo);
            tarjetaParaEditar.setAttribute("descripcion", datos.descripcion);
            editando = false; // Apagamos el modo edición
            tarjeta.readOnly = false; // Desbloqueamos el campo TI
        } else {
            // Si es un estudiante nuevo, creamos la tarjeta desde cero.
            crearTarjeta(datos);
        }

        actualizarLocalStorage(); // Guardamos el nuevo estado.
        formulario.reset(); // Limpiamos el formulario.
    }

    // Inicializamos datos básicos.
    actualizarConductores();
    cargarDesdeLocalStorage();

    // Escuchamos el evento 'submit' (envío) del formulario.
    if (formulario) {
        formulario.addEventListener("submit", (e) => {
            e.preventDefault(); // Evitamos que la página se recargue al enviar el formulario.
            agregarProyectoInicio(); // Disparamos la lógica de guardado.
        });
    }

    // Listener especial: Si en otra pestaña cambian los conductores, actualizamos el select aquí también en tiempo real.
    window.addEventListener("storage", (e) => {
        if (e.key === "conductores") actualizarConductores();
    });
});


// =====================================================================
// 3. GESTIÓN DE RUTAS (AGRUPAR ESTUDIANTES)
// =====================================================================
document.addEventListener("DOMContentLoaded", () => {
    const formRuta = document.getElementById("form-ruta");
    const contenedorRutas = document.getElementById("dashboard");

    if (!formRuta || !contenedorRutas) return;

    let editandoRuta = false;
    let tarjetaRutaParaEditar = null;

    // Clase del Web Component <ruta-card>
    class RutaCard extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: "open" });
        }

        connectedCallback() {
            this.render(); // Llamamos al método que construye visualmente la tarjeta
        }

        // Método encargado de pintar el HTML de la ruta y filtrar estudiantes.
        render() {
            // Obtenemos los datos de la propia ruta
            const nombre = this.getAttribute("nombre");
            const zona = this.getAttribute("zona");
            const jornada = this.getAttribute("jornada");
            const conductor = this.getAttribute("conductor");

            // LÓGICA CLAVE: Leemos los estudiantes y usamos .filter() para encontrar coincidencias exactas.
            const todosEst = JSON.parse(localStorage.getItem("estudiantes")) || [];
            const filtrados = todosEst.filter(e =>
                e.descripcion.includes(`Zona: ${zona}`) &&
                e.descripcion.includes(`Jornada: ${jornada}`)
            );

            // Construimos el HTML interno, mapeando los estudiantes filtrados a etiquetas <li>.
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

            // Botón eliminar ruta: la borra del DOM y actualiza LocalStorage.
            this.shadowRoot.querySelector("#btn-eliminar-ruta").addEventListener("click", () => {
                this.remove();
                actualizarLocalStorageRutas();
            });

            // Botón editar ruta: solicita clave (111) y si es correcta, rellena el formulario form-ruta.
            this.shadowRoot.querySelector("#btn-editar-ruta").addEventListener("click", () => {
                if (prompt("Ingrese clave para editar (111):") === "111") {
                    document.getElementById("nombre-ruta").value = nombre;
                    document.getElementById("select-conductor").value = conductor;
                    document.getElementById("zona-ruta").value = zona;
                    document.getElementById("jornada-ruta").value = jornada;

                    editandoRuta = true;
                    tarjetaRutaParaEditar = this;

                    // Cambiamos el texto del botón del formulario para mayor claridad visual.
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

    // Reconstruye el localStorage de rutas basándose en las tarjetas que existen en el DOM.
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

    // Escucha el evento submit del formulario de Rutas.
    formRuta.addEventListener("submit", (e) => {
        e.preventDefault();

        // Extraemos valores ingresados
        const data = {
            nombre: document.getElementById("nombre-ruta").value,
            conductor: document.getElementById("select-conductor").value,
            zona: document.getElementById("zona-ruta").value,
            jornada: document.getElementById("jornada-ruta").value
        };

        if (editandoRuta) {
            // Actualizamos los atributos HTML de la tarjeta existente.
            tarjetaRutaParaEditar.setAttribute("nombre", data.nombre);
            tarjetaRutaParaEditar.setAttribute("conductor", data.conductor);
            tarjetaRutaParaEditar.setAttribute("zona", data.zona);
            tarjetaRutaParaEditar.setAttribute("jornada", data.jornada);
            tarjetaRutaParaEditar.render(); // Forzamos un render para que recalcule los estudiantes filtrados.

            editandoRuta = false; // Apagamos edición
            const btnSubmit = formRuta.querySelector('button[type="submit"]');
            if (btnSubmit) btnSubmit.textContent = "CREAR RUTA";
        } else {
            // Instanciamos una nueva etiqueta de ruta.
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

    // Lee las rutas al iniciar y las coloca en la pantalla.
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


// =====================================================================
// 4. API EXTERNA (CLIMA)
// =====================================================================
// Declaramos la función 'async' porque la petición a internet toma tiempo y debemos esperar (await).
async function obtenerClima() {
    const contenedorClima = document.getElementById("info-clima");
    if (!contenedorClima) return; // Validación de seguridad

    const apiKey = '7b2f85cc2ca5a95354dfd120325f32ab';
    const ciudad = 'Ipiales'; // Ciudad quemada en el código

    // Construimos la URL agregando la ciudad, la key, que sea en grados Celsius (metric) y en español (es).
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`;

    // Try/Catch evita que un error de conexión rompa toda la página web.
    try {
        // Fetch hace la petición HTTP a la API de OpenWeather.
        const respuesta = await fetch(url);
        // Transformamos el string devuelto por la API en un objeto manipulable de JS.
        const datos = await respuesta.json();

        // El código 200 significa "Petición Exitosa" en protocolos HTTP.
        if (datos.cod === 200) {
            // Extraemos los datos navegando por las propiedades del objeto JSON.
            const temperatura = Math.round(datos.main.temp); // Math.round quita los decimales.
            const descripcion = datos.weather[0].description;
            const icono = datos.weather[0].icon;

            // Inyectamos el diseño visual del clima (con Flexbox en línea) directamente en el contenedor.
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
            // Si el código no es 200 (ej. ciudad no encontrada), mostramos el error de la API.
            contenedorClima.innerHTML = `<p style="color: red;">Error: ${datos.message}</p>`;
        }
    } catch (error) {
        // Entra aquí si no hay internet o el servidor está caído.
        contenedorClima.innerHTML = `<p style="color: red;">No se pudo conectar con el servidor de clima.</p>`;
        console.error("Error al obtener el clima:", error); // Log para desarrolladores.
    }
}

// Arrancamos la función de clima automáticamente.
obtenerClima();