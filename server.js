var express = require('express');
var app = express();
var cors = require("cors");
var mysql = require('mysql');

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const port = process.env.PORT || 5000
if(port === 'production'){
    app.use(express.static(path.join(__dirname,'frontend/build')));
    app.get('*',(req,res)=>{
        res.sendFile(path.join(__dirname, 'frontend/build','index.html'));
    })
}

const db = mysql.createPool({

    host: "tvcpw8tpu4jvgnnq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "eba0kge57brov1g3",
    password: "m18o78m8z73wsi8i",
    database: "rnqr8rnyvyzk2cub"


});
db.getConnection((error, connection) => {
    try {
        if (connection) {
            console.log("conected...")
            connection.release();
        }

    }
    catch (error) {
        console.log(error);
    }
});

db.query('CREATE TABLE IF NOT EXISTS marks(roll varchar(255) NOT NULL ,name varchar(255),maths int,physics int, chemistry int, total int, percentage int) ', (err, resp) => {
    if (err) {
        console.log(err)
    }
    else {
        console.log('table is created')
    }
})






app.post('/', (req, res) => {

    const values = [[req.body.roll, req.body.name, req.body.maths, req.body.physics, req.body.chemistry, req.body.total, req.body.percentage]];
    db.query('insert into marks(roll  ,name ,maths ,physics , chemistry , total , percentage) values?', [values], (err, resp) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log('row is inserted')
            res.json('values inserted');
        }
    })



})

app.get('/leaderboard', (req, res) => {
    const sql = `select * from marks`;
    db.query(sql, (error, response) => {
        if (error) {
            console.log(error)
        }
        else {
            console.log('selected')
            res.json(response)
        }
    })
})




app.listen(port, () => {
    console.log('server running...')
})