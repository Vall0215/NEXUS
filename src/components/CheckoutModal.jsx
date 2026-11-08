const markup = `<div
        id="checkoutModal"
        class="modal-overlay"
    >
        <div class="checkout-modal">
            <button
                class="close-modal"
                onclick="cerrarCheckout()"
            >
                ×
            </button>
            <div class="checkout-icon">
                ⚡
            </div>
            <span class="checkout-label">
                NEXUS PREMIUM
            </span>
            <h2>
                Desbloquea tu potencial energético.
            </h2>
            <p>
                Obtén acceso a simulaciones ilimitadas,
                reportes y al Copiloto Energético.
            </p>
            <div class="checkout-summary">
                <div>
                    <span>
                        Plan seleccionado
                    </span>
                    <strong>
                        NEXUS Premium
                    </strong>
                </div>
                <div>
                    <span>
                        Total
                    </span>
                    <strong>
                        $29.900 / mes
                    </strong>
                </div>
            </div>
            <div class="payment-method">
                <span>
                    MÉTODO DE PAGO
                </span>
                <button
                    class="payment-option active"
                    onclick="seleccionarPago(this)"
                >
                    💳 Tarjeta
                </button>
                <button
                    class="payment-option"
                    onclick="seleccionarPago(this)"
                >
                    🏦 PSE
                </button>
                <button
                    class="payment-option"
                    onclick="seleccionarPago(this)"
                >
                    📱 Billetera digital
                </button>
            </div>
            <button
                class="primary-button checkout-button"
                onclick="procesarPago()"
            >
                Continuar con el pago →
            </button>
            <small class="demo-payment">
                Prototipo de checkout · Pago simulado
            </small>
        </div>
    </div>`;
export default function CheckoutModal(){return <div className="react-fragment" dangerouslySetInnerHTML={{__html:markup}}/>;}