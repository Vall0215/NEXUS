function irAlMapa() {

    document.getElementById("mapa").scrollIntoView({
        behavior: "smooth"
    });

}


function irAlSimulador() {

    document.getElementById("simulador").scrollIntoView({
        behavior: "smooth"
    });

}


function mostrarDemo() {

    alert(
        "NEXUS analiza una ubicación, simula escenarios de energía renovable y genera recomendaciones mediante su Copiloto Energético."
    );

}


document.addEventListener("DOMContentLoaded", function () {


    if (typeof L === "undefined") {

        console.error(
            "NEXUS: Leaflet no se pudo cargar."
        );

        return;

    }

    const mapElement =
        document.getElementById("map");


    if (!mapElement) {

        console.error(
            "NEXUS: No se encontró el elemento #map."
        );

        return;

    }


    const nexusMap = L.map("map").setView(
        [10.9685, -74.7813],
        12
    );


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {

            attribution:
                "&copy; OpenStreetMap contributors",

            maxZoom: 19

        }

    ).addTo(nexusMap);

    
    let nexusMarker = L.marker([

        10.9685,
        -74.7813

    ]).addTo(nexusMap);


    nexusMarker
        .bindPopup(`

            <div style="font-family: Arial;">

                <strong>NEXUS</strong>

                <br>

                Barranquilla, Atlántico

                <br><br>

                <span style="color:#1fa463;">

                    ⚡ Potencial solar: ALTO

                </span>

            </div>

        `)
        .openPopup();


    nexusMap.on(
        "click",
        function (event) {


            const latitude =
                event.latlng.lat;


            const longitude =
                event.latlng.lng;


            nexusMap.removeLayer(
                nexusMarker
            );


            nexusMarker =
                L.marker([

                    latitude,
                    longitude

                ]).addTo(nexusMap);


            nexusMarker
                .bindPopup(`

                    <strong>
                        Ubicación seleccionada
                    </strong>

                    <br><br>

                    Latitud:
                    ${latitude.toFixed(4)}

                    <br>

                    Longitud:
                    ${longitude.toFixed(4)}

                `)
                .openPopup();


            actualizarUbicacion(
                latitude,
                longitude
            );


        }
    );


    function actualizarUbicacion(
        latitude,
        longitude
    ) {


        const diferencia =
            Math.abs(
                latitude - 10.9685
            );

        let radiation =
            5.2 -
            (diferencia * 2);

        radiation =
            Math.max(
                3.5,
                radiation
            );


        radiation =
            radiation.toFixed(1);


        const temperature =
            (
                28.4 +
                (
                    latitude -
                    10.9685
                ) * 2
            ).toFixed(1);


        let potential =
            "ALTO";


        let potentialText =
            "Condiciones favorables";



        if (radiation < 4.5) {

            potential =
                "MEDIO";

            potentialText =
                "Potencial moderado";

        }



        if (radiation < 3.8) {

            potential =
                "BAJO";

            potentialText =
                "Se recomienda analizar el escenario";

        }


        const locationName =
            document.getElementById(
                "locationName"
            );

        const solarRadiation =
            document.getElementById(
                "solarRadiation"
            );

        const temperatureElement =
            document.getElementById(
                "temperature"
            );

        const solarPotential =
            document.getElementById(
                "solarPotential"
            );

        const potentialTextElement =
            document.getElementById(
                "potentialText"
            );


        if (locationName) {

            locationName.textContent =

                `Lat ${latitude.toFixed(4)},
                 Lon ${longitude.toFixed(4)}`;

        }

        if (solarRadiation) {

            solarRadiation.textContent =
                radiation;

        }

        if (temperatureElement) {

            temperatureElement.textContent =
                temperature;

        }

        if (solarPotential) {

            solarPotential.textContent =
                potential;

        }

        if (potentialTextElement) {

            potentialTextElement.textContent =
                potentialText;

        }


    }


    setTimeout(function () {

        nexusMap.invalidateSize();

    }, 500);


});


function actualizarSimulacion() {


    const panelesElement =
        document.getElementById("paneles");


    const bateriaElement =
        document.getElementById("bateria");


    if (!panelesElement) {
        return;
    }


    const paneles =
        Number(
            panelesElement.value
        );

    const bateria =
        Number(
            bateriaElement.value
        );


    document.getElementById(
        "panelValue"
    ).textContent =

        `${paneles} paneles`;


    let generacion =
        paneles * 52;


    if (bateria === 1) {

        generacion *= 1.05;

    }

    if (bateria === 2) {

        generacion *= 1.10;

    }

    generacion =
        Math.round(
            generacion
        );

    const ahorro =
        generacion * 550;


    let retorno =
        7 -
        (
            paneles * 0.12
        );

    if (bateria === 1) {

        retorno += 0.5;

    }

    if (bateria === 2) {

        retorno += 1;

    }

    retorno =
        Math.max(
            3,
            retorno
        );


    document.getElementById(
        "generacion"
    ).textContent =

        generacion.toLocaleString(
            "es-CO"
        );

    document.getElementById(
        "ahorro"
    ).textContent =

        "$" +
        Math.round(
            ahorro
        ).toLocaleString(
            "es-CO"
        );

    document.getElementById(
        "retorno"
    ).textContent =

        retorno.toFixed(1);

}

function analizarEscenario() {


    actualizarSimulacion();


    document.getElementById(
        "copiloto"
    ).scrollIntoView({

        behavior: "smooth"

    });


}

function enviarPregunta() {


    const input =
        document.getElementById(
            "copilotQuestion"
        );


    if (!input) {
        return;
    }


    const pregunta =
        input.value.trim();



    if (
        pregunta === ""
    ) {

        return;

    }

    const conversation =
        document.querySelector(
            ".conversation"
        );

    const userMessage =
        document.createElement(
            "div"
        );


    userMessage.className =
        "user-message";


    userMessage.textContent =
        pregunta;



    conversation.appendChild(
        userMessage
    );

    const aiMessage =
        document.createElement(
            "div"
        );


    aiMessage.className =
        "ai-message";


    aiMessage.innerHTML = `

        <strong>
            ✦ NEXUS
        </strong>

        <p>
            He analizado tu consulta
            dentro del escenario actual.
        </p>

        <p>
            ☀️ El potencial solar de la
            ubicación seleccionada es
            <b>favorable</b>.
        </p>

        <p>
            Te recomiendo comparar
            diferentes configuraciones
            de paneles antes de realizar
            una inversión.
        </p>

        <div class="recommendation">

            <span>
                RECOMENDACIÓN
            </span>

            <strong>
                Analizar diferentes escenarios
            </strong>

        </div>

    `;

    conversation.appendChild(
        aiMessage
    );


    input.value = "";

    conversation.scrollTop =
        conversation.scrollHeight;

}

document.addEventListener(
    "DOMContentLoaded",
    function () {

        actualizarSimulacion();

    }
);