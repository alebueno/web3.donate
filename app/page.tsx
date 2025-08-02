"use client" // para funcionar codigo javascript no lado do navegador

import { useRouter } from "next/navigation";
import { useState } from "react";
import { doLogin } from "@/services/Web3Services";


export default function Home() {

  const { push } = useRouter();

  const [getMessage, setMessage] = useState("");

  //conecta na carteira
  function btnLoginClick(){
    setMessage("Conectando na carteira...aguarde...");
    doLogin()
      .then(account => push("/create"))
      .catch(err => {
        console.error(err);
        setMessage(err.getMessage);
      })
  }

  return (
    <> 
    <div className="container px-4 py-5"> 
      <div className="row flex-lg-row-reverse align-itens-center g-5 py-5">
        <div className="col-6">
          <img src="/images/water2.jpg" className="d-block mx-lg-outo img-fluid" width={300} height={300} />
        </div>
        <div className="col-6">
          <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3"> Donate Crypto </h1>
          <p className="lead"> Plataforma descentralizadas de campanha de doação</p>
          <p className="lead"> Autentique-se com sua carteira e crie novos contratos</p>
          <p className="lead mb-3"> Para resgate ou pagamentos use o link do contrato existente</p>
          <div className="d-flex justify-content-start mt-5">
            <button type="button" className="btn btn-primary btn-lg px-4 me-2 col-12" onClick={btnLoginClick}>
              <img src="/images/metamask.png" width={34} className="me-2" />
              Conectar com a MetamMask
            </button>
          </div>
          {
            getMessage
            ?  <div className="alert alert-success p-3 col-12" role="alert"> {getMessage} </div>
            :<></>
          }
        </div>
      </div>
    </div>
    </>
  );
}
