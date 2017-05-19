var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

const APP_TOKEN = 'EAATLqKYY1W8BAPQ0j2wEf20T3RZAnrHd7mfl7eihkN3dqpZAIFb32mpMooIS6uKwAg45GnQR4ZCt6haM9nNwPhcwiEkWfUXZBUfoIWDNHzJkg4iHQZAFgATNdAHUwCygFfLRm6d7Yp6dke047RJFQwwGxZCDDtpqv3KP3naKie0QZDZD';

var app = express();

app.use(bodyParser.json());




app.listen(3000,function(){
	console.log('Server is runngin on port 3000');
});


app.get('/', function(req,res){
	res.send('Welcome')
});


app.get('/webhook', function(req,res){
	if(req.query['hub.verify_token'] === 'test_token_say_hellow'){
		res.send(req.query['hub.challenge']);
	} else {
		res.send("Tu no tienes que entrar aqui");
	}
});


app.post('/webhook', function(req,res){
	var data = req.body;
	if (data.object == 'page'){

		data.entry.forEach(function(pageEntry){
			pageEntry.messaging.forEach(function(messagingEvent){
				

				if(messagingEvent.message){
					receiveMessage(messagingEvent);
				}
			});
		});

		res.sendStatus(200);
	}
});


function receiveMessage(event){
	var senderID = event.sender.id;
	var messageText = event.message.text;

	console.log(senderID);
	console.log(messageText);

	evaluateMessage(senderID,messageText);
}


function evaluateMessage(recipientId, message){
	var finalMessage = '';

	if(isContain(message, 'ayuda')){
		finalMessage = 'Por el momento no te puedo ayudar';
	} else {
		finalMessage = 'Solo se repetir las cosas' + message;
	}

	sendMessageText(recipientId,finalMessage);
}

function sendMessageText(recipientId, message){
	var messageData = {
		recipient : {
			id : recipientId
		},
		message : {
			text: message
		}
	};
	callSendAPI(messageData);
}

function callSendAPI(messageData){
	request({
		uri:  'https://graph.facebook.com/v2.6/me/messages',
		qs: { access_token : APP_TOKEN },
		method: 'POST',
		json: messageData
	},function(error, response, data){
		if(error){
			console.log('No es posible enviar el mensaje');
		} else {
			console.log('El mensaje fue enviado');
		}
	});
}

function isContain(sentence, word){
	return sentence.indexOf(word) > -1;
}















