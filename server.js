const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const WEATHER_URL = 'http://api.openweathermap.org/data/2.5';
const port = process.env.PORT || 80;
const apiProxy = createProxyMiddleware({
	target: WEATHER_URL,
	changeOrigin: true,
	pathRewrite: { '^/api': '' },
	cookieDomainRewrite: '',
});
app.use('/api', apiProxy);

app.use(express.static('./dist'));

const expose = (req, res) => res.sendFile(process.cwd() + "/dist");

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
