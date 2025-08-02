import ABI from "./ABI.json";
import Web3 from "web3";

//endereço de cntrato na BLC
const CONTRACT_ADDRESS = "0xB30527B524b534d6B69b1Dfb0868EbFD342E8d71";

export async function doLogin() {
    if(!window.ethereum) throw new Error("MetaMask não encontrada!");

    // caso seja encontrada alguma conta solicita todas, so arrai de endereço, nao da pra fazer transação
    // a metamask vai perguntar ao usuario se ele quer ou não mostrar as contas dele
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.requestAccounts();
    if (!accounts || !accounts.length) throw new Error ("Carteira não encontrada ou não autorizada!");

    //se confirmada vamos armazenar no navegador
    localStorage.setItem("wallet", accounts[0]);
    return accounts[0];

}

// Função que configura a comunicação com o contrato
function getContract(){
    const web3 = new Web3(window.ethereum);
    const from = localStorage.getItem("wallet");
    return new web3.eth.Contract(ABI, CONTRACT_ADDRESS, {from});
}

//função que vai enviar a campanha para a blockchain. send chama o metamask pra autororizar
export async function addCampaign(getCampaign) {
    const contract = getContract();
    return contract.methods.addCampaign(getCampaign.title, getCampaign.description, getCampaign.videoUrl, getCampaign.imageUrl).send();
}

// usa o call para chamar
export async function getLastCampaignId(){
    const contgract = getContract();
    return contract.methods.nextId().call(); 
}

export async function getCampaign(id){
    const contgract = getContract();
    return contract.methods.campaign(id).call(); 
}

export async function donate(id, donation){
    await doLogin();
    const contgract = getContract();
    return contract.methods.donate(id).send({
        value: Web3.utils.toWei(donation, "ether")
    }

    )
}