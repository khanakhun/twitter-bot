const config = require('dotenv').config()
const moment = require('moment')
const Twit = require('twit')
const fs = require('fs')
const T = new Twit({
	consumer_key: process.env.API_KEY,
	consumer_secret: process.env.API_SECRET,
	access_token: process.env.ACCESS_TOKEN,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET,
	timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
	strictSSL: true, // optional - requires SSL certificates to be valid.
})

var obj = {
	dms: [],
}
// Function to Parse unxi timestamp
const parseDate = async (date) => {
	let formatedDate = await moment(parseInt(date)).format('MM/DD/YYYY')

	return formatedDate
}

// function to fetch twitter User data by id
const getUser = (id) => {
	return new Promise((resolve, reject) => {
		let params = { user_id: id }
		T.get('/users/lookup', params, function (err, data, response) {
			if (err) {
				reject(err)
			}
			resolve([data[0].screen_name, data[0].name, data[0].id_str])
		})
	})
}

// function to save DMs in Json file
// const collection = path.resolve(__dirname, './history.json')
const saveFile = (sender, name, message, id, formatedDate) => {
	try {
		obj.dms.push({
			sender: sender,
			screen_name: name,
			message: message,
			id: id,
			date: formatedDate,
		})
		var json = JSON.stringify(obj)
		var fs = require('fs')
		fs.writeFile('Dms.json', json, 'utf8', (err) => {
			if (err) {
				return err
			}
		})
	} catch (error) {
		throw error
	}
}
// function to fetch Dm of user
const fectchDms = async () => {
	const dms = T.get(
		'direct_messages/events/list',
		async function (err, data, response) {
			const events = data.events
			let name
			let message
			events.map(async (ele) => {
				name = await getUser(ele.message_create.sender_id)
				message = ele.message_create.message_data.text
				let formatedDate = await parseDate(
					ele.created_timestamp,
				)
				saveFile(
					name[1],
					name[0],
					message,
					name[2],
					formatedDate,
				)
			})
			console.log('Complete.....')
		},
	)
}
fectchDms()
