'use strict';

const Path = require('path');
const Hapi = require('hapi');
const Hoek = require('hoek');
const Inert = require('inert');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000,
    routes: {
            files: {
                relativeTo: Path.join(__dirname, 'public')
            }
        }
});

// Setup public file serve
server.register(Inert, () => {});

// Setup view engines
server.register(require('vision'), (err) => {

    Hoek.assert(!err, err);

    server.views({
        engines: {
            html: require('handlebars')
        },

        relativeTo: __dirname,
        path: Path.join(__dirname, 'templates'),
        layout: 'default',
        layoutPath: Path.join(__dirname, 'templates/layout'),
        partialsPath: Path.join(__dirname, 'templates/partials'),
        helpersPath: Path.join(__dirname, 'templates/helpers'),
        isCached: false

    });
});

// INDEX
server.route({
    method: 'GET',
    path:'/',
    handler: function (request, reply) {
        reply.view('index', { title: 'Homepage' })
    }
});

// PUBLIC
server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: '.',
            redirectToSlash: true,
            index: false
        }
    }
});

// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
