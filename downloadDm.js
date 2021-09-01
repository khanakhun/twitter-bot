const axios = require('axios')
const config = require('dotenv').config()
const TOKEN = process.env.TWITTER_BEARER_TOKEN
const needle = require('needle')
const apiUrl = 'https://api.twitter.com/1.1/direct_messages/events/list.json'
const Twitter = require('twitter')

// const getDms = async () => {
// 	const response = await axios.get(apiUrl, {
// 		headers: {
// 			Authorization: `Bearer ${TOKEN}`,
// 		},
// 	})
// 	console.log(response.data)
// }
// // getDms()
// async function getRules() {
// 	const response = await needle('get', apiUrl, {
// 		headers: {
// 			Authorization: `OAuth oauth_consumer_key="${process.env.API_KEY}" Bearer ${TOKEN}`,
// 			'Content-type': 'application/json',
// 		},
// 	})
// 	console.log(response.body)
// 	return response.body
// }
// getRules()

// var client = new Twitter({
// 	consumer_key: process.env.API_KEY,
// 	consumer_secret: process.env.API_SECRET,
// 	access_token_key: process.env.ACCESS_TOKEN,
// 	access_token_secret: process.env.ACCESS_TOKEN_SECRET,
// })

// var params = { screen_name: '@khanakhun1' }
// client.get(
// 	'direct_messages/events/list',
// 	params,
// 	function (error, tweets, response) {
// 		if (!error) {
// 			console.log(tweets)
// 			console.log(response)
// 		}
// 	},
// )

// Twit

var Twit = require('twit')

var T = new Twit({
	consumer_key: process.env.API_KEY,
	consumer_secret: process.env.API_SECRET,
	access_token: process.env.ACCESS_TOKEN,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET,
	timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
	strictSSL: true, // optional - requires SSL certificates to be valid.
})

//
//  tweet 'hello world!'
//

//
//  search twitter for all tweets containing the word 'banana' since July 11, 2011
//
T.get(
	'direct_messages/events/list',

	function (err, data, response) {
		const events = data.events
		let name
		let message
		events.map((ele) => {
			T.get(
				'/users/lookup',
				{ user_id: ele.message_create.sender_id },

				function (err, data, response) {
					name = data[0].screen_name
					console.log(name)
					// console.log(data[0].screen_name)
				},
			)
			message = ele.message_create.message_data.text

			console.log(message)
		})
	},
)

//
//  get the list of user id's that follow @tolga_tezel
//
// T.get(
// 	'followers/ids',
// 	{ screen_name: '@khanakhun1' },
// 	function (err, data, response) {
// 		console.log(data)
// 	},
// )
