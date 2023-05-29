const {pedidoController} = require('./db.js')
const {bankSlipController} = require('./gerarCobranca.js')
const express = require('express');

const PORT = 3000;
const app = express();

app.use(express.json())

app.get('/pedidos/:id', (req,res)=>{

    pedidoController.getPedido(req.params.id).then(pedido=>{
        res.status(200).send(pedido)
    }).catch(err=>{
        res.status(400).send(err);
    });
})

app.get('/pedidos', (req,res)=>{
    pedidoController.getPedidos().then(pedidos =>{
        res.send(pedidos);
    }).catch(err=>{
        res.status(500).send(err)
    })
})


app.post('/pedidos/novo', (req,res)=>{
    
    if (Object.keys(req.body).length === 0) {
        res.sendStatus(400);
    } 
    
    pedidoController.insertPedido(req.body).then(result =>{
        if (result) {
            res.sendStatus(201);
        } else {
            res.sendStatus(500);
        }
    });
      
   
})

app.delete('/pedidos/:id', (req,res)=>{

    pedidoController.deletePedido(req.params.id).then(result=>{
        if(result){
            res.sendStatus(200);
        }else{
            res.sendStatus(400);
        }
    });

   
})

app.get('/pedidos/:id/boleto', async (req,res)=>{

    let order = await pedidoController.getPedido(req.params.id);


    if(order){
        bankSlipController.createBankSlip(order).then((response)=>{
            res.status(200).send(response);
        }).catch(err=>{
            res.sendStatus(400);
        });
    }else{
        res.sendStatus(400);
    }
})

app.listen( PORT, ()=>{
    console.log(`Server iniciado na porta ${PORT}`);
})

