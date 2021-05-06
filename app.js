const Koa = require('koa');
const path = require('path');
const Router = require('koa-router');
// const Redis = require('ioredis');
const views = require('koa-views');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const { koaSwagger } = require('koa2-swagger-ui');
const config = require('config');

const passport = require('./src/libs/passport/koaPassport');
const errorCatcher = require('./src/middlewares/errorCatcher');

passport.initialize();

const app = new Koa();

app.use(serve('src/docs'));
app.use(koaSwagger({
  routePrefix: '/docs',
  hideTopbar: true,
  swaggerOptions: {
    url: `${config.get('server.baseUrl')}/docs.yml`,
  },
}));

app.use(cors());

app.use(bodyParser());
app.use(errorCatcher);

const router = new Router();

const port = process.env.PORT || 3000;

const render = views(path.join(__dirname, '/src/templates'), {
  extension: 'njk',
  map: {
    njk: 'nunjucks',
  },
});

app.use(render);
app.use(serve(path.join(__dirname, '/src/public')));

router.use('/users', require('./src/users/users.router'));

app.use(router.middleware());

app.use((ctx) => {
  ctx.body = 'it works';
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
