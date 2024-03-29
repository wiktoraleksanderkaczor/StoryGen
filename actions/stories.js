// Own code requirements.
const dbController = require("../own_modules/dbController.js");
const acl = require("../own_modules/accessControl.js");


function get(req, res) {
	//Get role
	(dbController.getUserRole(req.user.username, function callback(err, role) {
		if (err) {
			console.log(err);
		}
		else {
			// Check if role can do the action.
			permission = acl.ac.can(role).execute("read").sync().on("stories");
			// Continue if yes, reject if no.
			if (permission.granted) {	
				// Getting data for user to append.
				(dbController.getUserStories(req.user.username, function callback(err, data) {
					if (err) {
						console.log(err);
					}
					else {
						// Convert to appropriate format for usage.
						parsed = JSON.parse(data);
						// Check if empty, if so, log error.
						if (data === JSON.stringify({})) {
							console.log("Error; " + req.user.username + " JSON empty.");
						}
						// If not, send to client requsting it.
						else {
							res.json(parsed);
						}
					}
				}));
			}
			else {
				res.json({ "error": "Denied access"});
			}
		}
	}));
}

module.exports.get = get;