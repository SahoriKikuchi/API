const fs = require('fs');
const path = require('path');

const DB_FILE_PATH = path.join(__dirname, 'database','db.json');



function getDatabase() {
    return new Promise((resolve, reject) => {
      fs.readFile(DB_FILE_PATH, 'utf-8', (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
  }
  

function updateDatabase(newData){
    fs.writeFileSync(DB_FILE_PATH, newData);
}

function insertPedido(pedido){

    return getDatabase().then(currentData=>{
        const newId = currentData.indexs.pedidos + 1;
        currentData.pedidos.push({...pedido, id: newId, valor: formatMoney(pedido.valor)});
        currentData.indexs.pedidos = newId;
        updateDatabase(JSON.stringify(currentData));
        return true;
    }).catch(err=>{
        return false;
    });

}

function deletePedido(id){

    return getDatabase().then(currentData=>{
        const index = currentData.pedidos.findIndex( p => p.id == id);
        if(index == -1){
            return false;
        }
        currentData.pedidos.splice(index,1);
        updateDatabase(JSON.stringify(currentData));
        return true;
    }).catch(err=>{
        return false;
    });

  
}

function formatMoney (value){
  return parseFloat(value.replace(/\./g, '').replace(/,/g, '.'));
}

function getPedidos(){

    return getDatabase().then(data=>{
        return data.pedidos;
    })
}

function getPedido(id){
    return getDatabase().then(data=>{
        return data.pedidos.find( p => p.id == id);
    })
}

const pedidoController = {
    insertPedido,
    deletePedido,
    getPedido,
    getPedidos
}


module.exports = {
    pedidoController
};