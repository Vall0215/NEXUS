const markup = `<section
            id="mapa"
            class="section"
        >


            <div class="section-title">
<h2>

                    Conoce el potencial

                    <span>
                        de tu ubicación.
                    </span>

                </h2>


                <p>

                    Visualiza variables ambientales y
                    energéticas para identificar oportunidades
                    de generación renovable.

                </p>


            </div>



            <div class="map-container">


                <div id="map"></div>


                <div class="map-data">


                    <div class="selected-location">

                        <span>
                            📍 UBICACIÓN SELECCIONADA
                        </span>

                        <strong id="locationName">
                            Barranquilla, Atlántico
                        </strong>

                    </div>



                    <div class="data-card">

                        <span>
                            ☀️ Radiación solar
                        </span>

                        <strong id="solarRadiation">
                            5.2
                        </strong>

                        <small>
                            kWh/m²/día
                        </small>

                    </div>



                    <div class="data-card">

                        <span>
                            🌡️ Temperatura
                        </span>

                        <strong id="temperature">
                            28.4
                        </strong>

                        <small>
                            °C promedio
                        </small>

                    </div>



                    <div class="data-card highlight">

                        <span>
                            ⚡ Potencial solar
                        </span>

                        <strong id="solarPotential">
                            ALTO
                        </strong>

                        <small id="potentialText">
                            Condiciones favorables
                        </small>

                    </div>



                    <div class="data-source">

                        <span>
                            Fuente de datos
                        </span>

                        <strong>
                            NASA POWER
                        </strong>

                        <small>
                            Promedio climatológico · NASA POWER
                        </small>
                        <small id="nasaStatus" role="status" aria-live="polite">
                            Consultando datos para la ubicación inicial…
                        </small>

                    </div>



                    <button
                        class="primary-button full-button"
                        onclick="irAlSimulador()"
                    >

                        Simular escenario →

                    </button>


                </div>


            </div>


        </section>

        <div class="nx-section-transition" aria-hidden="true"><span></span><i></i></div>`;
export default function EnergyMap(){return <div dangerouslySetInnerHTML={{__html:markup}}/>;}
