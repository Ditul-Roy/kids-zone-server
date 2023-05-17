const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) =>{
    res.send('kids car server is running')
})

app.listen(port, ()=>{
    console.log(`car server is running on PORT: ${port}`);
})