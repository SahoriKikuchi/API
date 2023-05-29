var Gerencianet = require('gn-api-sdk-node');


const options = {
    sandbox: true,
    client_id: 'Client_Id_066a531ee905a0aa2f746486f477eedad46f5bb1',
    client_secret: 'Client_Secret_086a0dac3b3e824a9d05dff3704c596cee8d52bf',
    certificate: './pedidoAppCert-hmg.p12',
}

var gerencianet = new Gerencianet(options);

function createBankSlip(request) {

    return gerencianet.createOneStepCharge([], createBankSlipBody(request))
        .then((resposta) => {
            console.log(resposta)
            return resposta;
        })
        .catch((error) => {
            console.log(error);
            return null;
        })

}

function createBankSlipBody(order) {
    return {
        payment: {
            banking_billet: {
                expire_at: '2023-06-06',
                customer: {
                    name: 'Amanda Sahori',
                    email: 'sahorikikuchi@gmail.com',
                    cpf: '89124714062',
                    birth: '2002-06-02',
                    phone_number: '11980776343',
                }
            }
        },
        items: [
            {
                name: order.nome,
                value:floatToCents(order.valor)
            }
        ],
    }

}

const floatToCents = (value)=>{
    return parseInt(value*100);
}
const bankSlipController = {
    createBankSlip
}

module.exports = {
    bankSlipController
};