"use client";
import { useEffect, useState } from "react";
import { getCampaign, donate } from "@/services/Web3Services";
import { useParams } from "next/navigation";
import Web3 from "web3";

interface Campaign {
    id: string;
    title: string;
    description: string;
    videoUrl?: string;
    imageUrl?: string;
    author?: string;
    balance?: string;
}

export default function Donate() {
    const params = useParams<{ id: string }>();

    const [getMessage, setMessage] = useState<string>("");
    const [campaign, setCampaign] = useState<Campaign>({ id: "", title: "", description: "" });
    const [donation, setDonation] = useState<number>(0);

    useEffect(() => {
        if (!params.id) return;

        setMessage("Buscando campanha ... aguarde...");
        getCampaign(params.id)
            .then((result: any) => {
                result.id = params.id;
                setCampaign(result);
                setMessage("");
            })
            .catch((err: any) => {
                console.error(err);
                setMessage(err.message || "Erro ao buscar a campanha.");
            });
    }, [params.id]);

    function onDonationChange(evt: React.ChangeEvent<HTMLInputElement>) {
        setDonation(Number(evt.target.value));
    }

    function btnDonateClick() {
        if (!campaign.id || donation <= 0) {
            setMessage("Por favor, insira um valor válido para doação.");
            return;
        }

        setMessage("Fazendo sua doação... aguarde");
        donate(campaign.id, donation)
            .then((tx: any) => {
                setMessage("Doação realizada com sucesso! Em alguns minutos o saldo será atualizado.");
                setDonation(0);
            })
            .catch((err: any) => {
                console.error(err);
                setMessage(err.message || "Erro ao processar a doação.");
            });
    }

    return (
        <div className="container px-4 py-5">
            <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">Donate Crypto</h1>
            <p className="lead">Verifique se esta é a campanha correta antes da doação</p>
            <hr />

            <div className="row flex-lg-row-reverse align-items-center g-5">
                <div className="col-7">
                    {campaign.videoUrl ? (
                        <iframe
                            width="100%"
                            height={480}
                            src={`https://www.youtube.com/embed/${campaign.videoUrl}`}
                            title="Vídeo da campanha"
                            frameBorder="0"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <img
                            src={campaign.imageUrl}
                            alt="Imagem da campanha"
                            className="d-block mx-lg-auto img-fluid"
                            width={640}
                            height={480}
                        />
                    )}
                </div>

                <div className="col-5 mb-5" style={{ height: 480, overflowY: "auto" }}>
                    <h2>{campaign.title}</h2>
                    <p><strong>Autor:</strong> {campaign.author || "Desconhecido"}</p>
                    <p className="mb-3">{campaign.description}</p>
                    <p className="mb-3 fst-italic mt-5">
                        E aí, o que achou do projeto? Já foi arrecadado{" "}
                        <strong>{Web3.utils.fromWei(campaign.balance || "0", "ether")}</strong> POL nesta campanha.
                        <br />
                        Quanto você quer doar (em POL)?
                    </p>

                    <div className="mb-3">
                        <div className="input-group">
                            <input
                                type="number"
                                id="donation"
                                className="form-control p-3 w-50"
                                value={donation}
                                onChange={onDonationChange}
                            />
                            <span className="input-group-text">POL</span>
                            <button
                                type="button"
                                className="btn btn-primary p-3 w-25"
                                onClick={btnDonateClick}
                            >
                                Doar
                            </button>
                        </div>
                    </div>

                    {getMessage && (
                        <div className="alert alert-success p-3 col-12 mt-3" role="alert">
                            {getMessage}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
