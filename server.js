var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose')

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

mongoose.Promise = Promise;
//connetion to mongo database
//use mlab
//normally you want to this in a configuration file for protection
var dbURL ='mongodb://man:manman1@ds147451.mlab.com:47451/chatapp-demo'

var Message = mongoose.model('Message',{
    name:String,
    message:String
});

// var messages = [
//     {name:'Tim',message: 'Hi'},
//     {name:'April',message: 'Hello'},
// ];


app.get('/messages',(req,res)=>{
    Message.find({},(err,messages)=>{
        res.send(messages)
    })
});

app.post('/messages',async(req,res)=>{

    try{    
        throw 'error'    
        var message = new Message(req.body)

        var savedMessage = await message.save()
        console.log('saved')

        var censored = await Message.findOne({message:'badword'})

        if(censored){
        await Message.remove({_id: censored.id})
        }else{
        io.emit('message',req.body)
        }
        res.sendStatus(200)

    }catch(error){
        res.sendStatus(500)
        return console.log(error)
    }finally{
        console.log('message post called')
    }
});
// app.post('/messages',(req,res)=>{
//     var message =new Message(req.body)

//     message.save()
//     .then(()=>{
//         //check for bad words
//         console.log('saved')
//         return Message.findOne({message:'badword'})
//     })
//     .then(censored =>{
//         if(censored){
//             console.log('censored words found',censored)
//             return Message.remove({_id: censored.id})
//             //returns as promise
//         }
//         io.emit('message',req.body)
//         res.sendStatus(200)
//     })
//     .catch((err)=>{
//         res.sendStatus(500)
//         return console.log(err)
//     })

// });

io.on('connection',(socket) =>{
    console.log('user connected');
});

mongoose.connect(dbURL,{ useNewUrlParser: true }, (err)=>{
    console.log('mongo db connection',err);
});

var server = http.listen(3000,() =>{
    console.log('server is listening on port: ', server.address().port)
});
