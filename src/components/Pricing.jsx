const markup = `<section
            id="planes"
            class="section pricing-section"
        >


            <div class="section-title pricing-title">
<h2>

                    Elige el nivel de

                    <span>
                        inteligencia energética.
                    </span>

                </h2>


                <p>

                    Comienza explorando gratuitamente y
                    desbloquea herramientas avanzadas
                    cuando estés listo para tomar una
                    decisión de inversión.

                </p>


            </div>



            <div class="pricing-grid">


                <!-- FREE -->

                <div class="pricing-card">


                    <div class="pricing-header">

                        <span class="plan-label">
                            EXPLORACIÓN
                        </span>


                        <h3>
                            NEXUS Free
                        </h3>


                        <p>
                            Para conocer el potencial
                            energético de una ubicación.
                        </p>

                    </div>


                    <div class="price">

                        <strong>
                            $0
                        </strong>

                        <span>
                            / mes
                        </span>

                    </div>


                    <ul class="features">

                        <li>
                            ✓ Mapa energético
                        </li>

                        <li>
                            ✓ Exploración básica
                        </li>

                        <li>
                            ✓ Recomendación diaria
                        </li>

                        <li class="disabled">
                            × Simulaciones ilimitadas
                        </li>

                        <li class="disabled">
                            × Reportes personalizados
                        </li>

                    </ul>


                    <button
                        class="secondary-button pricing-button"
                        onclick="seleccionarPlan('Free')"
                    >
                        Comenzar gratis
                    </button>


                </div>


                <div class="pricing-card featured">


                    <div class="pricing-header">

                        <div class="popular-badge">MÁS ELEGIDO</div>

                        <span class="plan-label">
                            DECISIÓN
                        </span>


                        <h3>
                            NEXUS Premium
                        </h3>


                        <p>
                            Para analizar y simular una
                            inversión energética.
                        </p>

                    </div>


                    <div class="price">

                        <strong>
                            $29.900
                        </strong>

                        <span>
                            / mes
                        </span>

                    </div>


                    <ul class="features">

                        <li>
                            ✓ Mapa energético completo
                        </li>

                        <li>
                            ✓ Simulaciones ilimitadas
                        </li>

                        <li>
                            ✓ Copiloto Energético IA
                        </li>

                        <li>
                            ✓ Reportes personalizados
                        </li>

                        <li>
                            ✓ Seguimiento de escenarios
                        </li>

                    </ul>


                    <button
                        class="primary-button pricing-button"
                        onclick="abrirCheckout('Premium')"
                    >
                        Elegir Premium →
                    </button>


                </div>


                <div class="pricing-card">


                    <div class="pricing-header">

                        <span class="plan-label">
                            PROFESIONAL
                        </span>


                        <h3>
                            NEXUS Proyectos
                        </h3>


                        <p>
                            Para desarrolladores y proyectos
                            de energía renovable.
                        </p>

                    </div>


                    <div class="price">

                        <strong>
                            Personalizado
                        </strong>

                    </div>


                    <ul class="features">

                        <li>
                            ✓ Análisis avanzado
                        </li>

                        <li>
                            ✓ Reportes técnicos
                        </li>

                        <li>
                            ✓ Evaluación de proyectos
                        </li>

                        <li>
                            ✓ Acompañamiento especializado
                        </li>

                        <li>
                            ✓ Soluciones empresariales
                        </li>

                    </ul>


                    <button
                        class="secondary-button pricing-button"
                        onclick="contactarProyectos()"
                    >
                        Contactar
                    </button>


                </div>


            </div>


        </section>`;
export default function Pricing(){return <div className="react-fragment" dangerouslySetInnerHTML={{__html:markup}}/>;}
