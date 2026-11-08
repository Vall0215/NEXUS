const markup = `<section
            id="simulador"
            class="section dark-section"
        >


            <div class="section-title">
<h2>

                    Antes de invertir,

                    <span>
                        simula.
                    </span>

                </h2>


                <p>

                    Explora diferentes escenarios de
                    generación y almacenamiento energético.

                </p>


            </div>



            <div class="simulator">


                <!-- CONTROLES -->

                <div class="controls">


                    <label>

                        Número de paneles


                        <input
                            type="range"
                            id="paneles"
                            min="1"
                            max="30"
                            value="10"
                            oninput="actualizarSimulacion()"
                        >


                        <strong id="panelValue">
                            10 paneles
                        </strong>

                    </label>



                    <label>

                        Batería


                        <select
                            id="bateria"
                            onchange="actualizarSimulacion()"
                        >

                            <option value="0">
                                Sin batería
                            </option>

                            <option value="1">
                                Batería pequeña
                            </option>

                            <option value="2">
                                Batería mediana
                            </option>

                        </select>


                    </label>



                    <button
                        id="analyzeScenarioButton"
                        class="primary-button"
                        style="background: linear-gradient(105deg, #a97924 0%, #e9c46a 52%, #f5dfa0 100%) !important; background-color: #e9c46a !important; color: #171208 !important; -webkit-text-fill-color: #171208 !important; border: 1px solid rgba(245,223,160,.5) !important;"
                        onclick="analizarEscenario()"
                    >

                        Analizar escenario

                    </button>


                </div>



                <!-- RESULTADOS -->

                <div class="results">


                    <div class="result-card">

                        <span>
                            Generación estimada
                        </span>

                        <strong id="generacion">
                            520
                        </strong>

                        <small>
                            kWh / mes
                        </small>

                    </div>



                    <div class="result-card">

                        <span>
                            Ahorro estimado
                        </span>

                        <strong id="ahorro">
                            $286.000
                        </strong>

                        <small>
                            mensual
                        </small>

                    </div>



                    <div class="result-card">

                        <span>
                            Retorno estimado
                        </span>

                        <strong id="retorno">
                            5.8
                        </strong>

                        <small>
                            años
                        </small>

                    </div>


                </div>


            </div>


        </section>

        <div class="nx-section-transition" aria-hidden="true"><span></span><i></i></div>`;
export default function Simulator(){return <div dangerouslySetInnerHTML={{__html:markup}}/>;}
