var express = require('express');
var app = express();
const path = require('path');
const fs = require('fs');

const PORT = 3001;
const API_BASE_URL = "http://localhost:3000/pedidos/"


app.set('view engine', 'ejs');

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/views'));



app.get('/', async (req, res) => {

    fetch(API_BASE_URL).then(data => {
        return data.json();
    }).then(result => {
        res.render('index', { pedidos: result, formatMoney });
    }).catch(err => {
        res.render(`index`, { pedidos: [], formatMoney });
    })

});



app.get('/pedido/novo', (req, res) => {
    res.render('create')
})

app.post('/pedido/novo', async (req, res) => {


    if (!req.body) {
        res.sendStatus(400);
    } else {

        const response = await fetch(API_BASE_URL + "novo", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });

        if (response.status == "201") {
            res.redirect('/')
        } else {
            res.status(400).send({ error: 'Erro ao criar pedido' })
        }
    }

})

app.get('/pedido/:id', (req, res) => {

    fetch(API_BASE_URL + req.params.id).then(data => {
        return data.json();
    }).then(pedido => {
        res.render('details', { pedido, formatMoney });
    })
})

app.get('/pedido/:id/boleto', async (req, res) => {

    fetch(API_BASE_URL + `${req.params.id}/boleto`)
        .then(data => data.json())
        .then(result => {   
            console.log(__dirname)
            fetch(result.data.pdf.charge)
                .then(response => {
                    return response.blob();
                }).then(file => {
                    return file.arrayBuffer()
                })
                .then(arrayBuffer => {

                    const buffer = Buffer.from(arrayBuffer);
                    const dateNow = Date.now();

                    return new Promise((resolve, reject) => {
                        fs.writeFile( path.join(__dirname, 'boletosGerados', `file${dateNow}.pdf`), buffer, (err) => {
                            if (err) {
                                reject()
                            } else {
                                resolve(dateNow);
                            }
                        });
                    })

                }).then(fileDate => {
                    let filePath = path.join(__dirname, 'boletosGerados', `file${fileDate}.pdf`);
                    res.status(200).sendFile(filePath, null, (err) => {
                        if (err) {
                            fs.rm(filePath, () => {

                            });
                        }
                    });

                }).catch(err => {
                    res.sendStatus(500);
                })
        }).catch(err =>{
            res.sendStatus(500)
        });

})


function formatMoney(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

app.listen(PORT, () => {
    console.log(`Server rodando na porta ${PORT}`)
});
