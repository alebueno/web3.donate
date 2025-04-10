// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

struct Campaign {
    address author;
    string title;
    string description;
    string videoUrl;
    string imageUrl;
    uint256 balance; // pq os numeros são grandes na blockchain
    bool active; // boleana
}

contract DonateCrypto { 

    uint256 public fee = 100; // para cada transação  paga 100 wei
    uint256 public nextId = 0;
     // variavel de encremento

    mapping(uint256 => Campaign) public campaigns; // recupera com id => campanha salvas no blockchaon

    function addCampaign(string calldata title,  string calldata description, string calldata videoUrl, string calldata imageUrl) public {
        // calldata para não salvar os parametors na blockchain    
    
        Campaign memory newCampaign;
        newCampaign.title = title;
        newCampaign.description = description;
        newCampaign.videoUrl = videoUrl;
        newCampaign.imageUrl = imageUrl;
        newCampaign.active = true;
        newCampaign.author = msg.sender;

        nextId++;  //Encrementa a variavel
        campaigns[nextId] = newCampaign; // salva na blockchain

    }

    // cria função de doação e o modificador payable permite enviar pagamento
    // require faz validação dentro da função
    function donate(uint256 id) public payable {
        require(msg.value > 0, "You must send a donation value > 0");
        require(campaigns[id].active == true, "Cannot donate to this campaign");

        campaigns[id].balance += msg.value; // Garda o valor doado para passar ao destinatario

    }
    
    // Função de saque withdraw
    // so o autor da campanha pode sacar
    // uma vez executado saca tudo e finaliza a campanha
    function withdraw(uint256 id) public {
        
        Campaign memory campaign = campaigns[id]; // objeto de memoria
        require(campaign.author == msg.sender, "You do not have permission");
        require(campaign.active== true,"This campaign is closed");
        require(campaign.balance > fee, "this campaign does not have balance");

        address payable recipient = payable(campaign.author); // converte recipiente para o endereço de quem vai receber
        // abaixo transfer valor do saldo menos a taxa para o destinatario dono da campanha.
        // possivel adicionar string, mas estamos mandando vazio
        recipient.transfer(campaign.balance - fee);
        
        //desativa campanha
        campaign.active = false;

    }

}