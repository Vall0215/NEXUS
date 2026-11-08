const markup = `<section
            id="copiloto"
            class="section"
        >
            <div class="section-title">
<h2>
                    Los datos dicen mucho.
                    <span>
                        NEXUS te dice qué hacer.
                    </span>
                </h2>
            </div>
            <div class="copilot">
                <div class="copilot-header">
                    <div class="ai-icon">
                        ✦
                    </div>
                    <div>
                        <strong>
                            Copiloto Energético
                        </strong>
                        <small>
                            Inteligencia artificial
                        </small>
                    </div>
                    <span class="online">
                        ● ONLINE
                    </span>
                </div>
                <div
                    class="conversation"
                    id="conversation"
                >
                    <div class="user-message">
                        ¿Me conviene instalar paneles
                        solares en esta ubicación?
                    </div>
                    <div class="ai-message">
                        <strong>
                            ✦ NEXUS
                        </strong>
                        <p>
                            He analizado las condiciones
                            de la ubicación y el escenario
                            seleccionado.
                        </p>
                        <p>
                            ☀️ El potencial solar es
                            <b>alto</b>.
                        </p>
                        <p>
                            Para este escenario, recomiendo
                            evaluar una instalación fotovoltaica
                            de tamaño medio antes de incorporar
                            almacenamiento.
                        </p>
                        <div class="recommendation">
                            <span>
                                RECOMENDACIÓN
                            </span>
                            <strong>
                                Priorizar generación solar
                            </strong>
                        </div>
                    </div>
                </div>
                <div class="copilot-input">
                    <input
                        type="text"
                        id="copilotQuestion"
                        placeholder="Pregúntale algo al Copiloto..."
                        onkeydown="manejarEnter(event)"
                    >
                    <button
                        onclick="enviarPregunta()"
                    >
                        ↑
                    </button>
                </div>
            </div>
        </section>
        <div class="nx-section-transition" aria-hidden="true"><span></span><i></i></div>`;
export default function Copilot(){return <div className="react-fragment" dangerouslySetInnerHTML={{__html:markup}}/>;}