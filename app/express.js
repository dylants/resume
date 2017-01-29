import consolidate from 'consolidate';
import express from 'express';
import gitRev from 'git-rev-sync';
import path from 'path';
import sassMiddleware from 'node-sass-middleware';

import config from './config';

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const APP_ROOT = path.join(__dirname, '../');

// Initialize express app
const app = express();

// Setting application local variables
app.locals.gitRevision = gitRev.long();

// Set the template engine
app.engine('server.view.html', consolidate[config.templateEngine]);

// Set views path and view engine
app.set('view engine', 'server.view.html');
app.set('views', './app/views');

// serve all static assets in the public directory under /assets
app.use('/assets', express.static(path.resolve('./public')));

if (IS_DEVELOPMENT) {
  // in development mode, re-generate the css code from sass every request
  app.use(sassMiddleware({
    src: path.join(__dirname, 'styles'),
    dest: path.join(APP_ROOT, 'public'),
    debug: true,
    outputStyle: 'compressed',
    prefix: '/public',
    force: true,
  }));
}

if (IS_PRODUCTION) {
  // serve the static assets (js/css)
  app.use('/public', express.static(path.join(APP_ROOT, 'public')));
}

// as of now, all routes cause us to render the resume page
app.all('/*', (req, res) => res.render('resume'));

module.exports = app;
