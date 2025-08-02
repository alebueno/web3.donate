//import Image from "next/image";
"use client" // para funcionar codigo javascript no lado do navegador

import { useState } from "react";
import { addCampaign, getLastCampaignId } from "@/services/Web3Services";


export default function Create() {
    // usa {} para objetos e aspas para string
    const [getMessage, setMessage] = useState("");
    const [getCampaign, setCampaign] = useState({
        title: "",
        description: "",
        videoUrl: "",
        imageUrl: ""
    });




    // recebe um objeto de evento evt
    function onInputChange(evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setCampaign(prevState => ({
            ...prevState,
            [evt.target.id]: evt.target.value
        }));
    }

    function btnSaveClick() {
        //setMessage(JSON.stringify(getCampaign));
        setMessage("Salvando a campanha ... aguarde...");
        addCampaign(getCampaign)
            //.then(tx => setMessage(JSON.stringify(tx)))
            .then(tx => getLastCampaignId())
            .then(id => setMessage(`Campanha foi salva com o ID ${id}. Em alguns minutos ela estará pronta para receber doaçoes
                use este link para dibulgala  http://localhost:3000/donate/${id}`)) //note que usamos crase por causa da variavel
            .catch(err => {
                console.error(err);
                setMessage(err.message || "Erro ao salvar a campanha.");
            })

    }

    return (
        <>
            <div className="container">
                <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3 mt-5"> Donate Cripto </h1>
                <p>Preencha os campos para incluir nova Campanha na plataforma</p>
                <p>Ao término do cadastro, você receberá um link para divultar e realizar pagamento</p>
                <hr className="mb-4" />
                <div className="form-floating mb-3">
                    <input type="text" id="title" className="form-control" onChange={onInputChange} value={getCampaign.title || ""} />
                    <label htmlFor="title">Titulo</label>
                </div>
                <div className="form-floating mb-3">
                    <textarea id="description" className="form-control" onChange={onInputChange} value={getCampaign.description || ""} />
                    <label htmlFor="description">Descrição</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="text" id="videoUrl" className="form-control" onChange={onInputChange} value={getCampaign.videoUrl || ""} />
                    <label htmlFor="videoUrl">URL  do Video</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="text" id="imageUrl" className="form-control" onChange={onInputChange} value={getCampaign.imageUrl || ""} />
                    <label htmlFor="imageUrl">URL da imagem</label>
                </div>
                <div className="col-6 mb-3">
                    <button type="button" className="btn btn-primary col-12 p-3" onClick={btnSaveClick} >Salvar</button>
                </div>
                {
                    getMessage
                        ? <div className="alert alert-success p-3 col-12" role="alert"> {getMessage} </div>
                        : <></>
                }
            </div>
        </>
    );
}
