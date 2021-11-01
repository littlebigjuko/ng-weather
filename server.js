const express = require('express');

const app = express();
const port = process.env.PORT || 80;
app.use(express.static('dist'));

const expose = (req, res) => res.sendFile(process.cwd() + "/dist/index.html");

app.get('/', expose);
app.get('/*', expose);
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err['status'] = 404;
	next(err);
});

app.listen(port, () => {
	console.log(`Server listening on the port:${port}`);
});
