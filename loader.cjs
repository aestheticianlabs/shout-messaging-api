// loads the app on cPanel
// see: https://www.reddit.com/r/node/comments/12ar8q1/why_is_my_app_breaking_after_being_deployed/
async function loadApp() {
	await import('./server.js');
}

loadApp();