'use strict' //strict opering context, e.g  must use var or let before a variable name


//require depensence
const express = require('express') 
const bodyParser = require('body-parser')
const request = require('request')

//initatze the app into a express application
const app = express()

//set the port
app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())


// index
app.get('/', function(req, res){
	res.send("Hi I'm a chatbot")
})

const token = "EAACqiDyR6mEBAJBHZAPPmKYh46H9R9PZABsMtyPpyAuKApOsk3NfIVxelkP5anHhpvZCIObwJQVtSHDcJ35YAX6DmXh0VgFc3UWbyDvPlalqYgbmXTZCExcYUB4ZAFiZAzd9E0wNaBnFO2tqRdhAYrjJyu9kw0itKJGBXgolVDEgZDZD"

// for facebook verification
app.get('/webhook/', function(req, res){
	if(req.query['hub.verify_token'] === "sherlocked"){
		res.send(req.query['hub.challenge'])
	}
	res.send("wrong token")

})

// to post data
app.post('/webhook/', function(req, res){
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i< messaging_events.length; i++){
		let event = messaging_events[i]
		let sender = event.sender.id
		if (event.message && event.message.text){
			let text = event.message.text
			sendText(sender, "Text echo: " + text.substring(0,100))
		}
	}
	res.sendStatus(200)
})

function sendText(sender, text){
	let messageData = {text : text}
	request({
		url: "https://graph.facebook.com/v2.6/me/messages", 
		qs : {access_token: token},
		method : "POST",
		json: {
			recipient : {id: sender},
			message : messageData
		}
	}, function(error, response, body){
		if(error){
			console.log("sending error")
		} else if(response.body.error){
			console.log("response body error")

		}
	})
}

app.listen(app.get('port'), function(){
	console.log("running:port")
})
