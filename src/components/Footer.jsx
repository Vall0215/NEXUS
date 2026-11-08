const markup = `<footer>


        <div class="logo">

            <span class="logo-icon">
                N
            </span>

            <span>
                NEXUS
            </span>

        </div>


        <p>

            Inteligencia energética para decisiones
            más inteligentes.

        </p>


        <small>

            Prototipo MVP — Universidad de la Costa

        </small>


    </footer>`;
export default function Footer(){return <div className="react-fragment" dangerouslySetInnerHTML={{__html:markup}}/>;}
