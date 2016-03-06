var express = require( "express" );
var http = require( "http" );
var app = express();

app.use( express.static( __dirname ) );

app.get( "*.*", function( req, res, next )
{
    res.status( 200 ).sendFile( __dirname +  req._parsedOriginalUrl.pathname );
} );
app.get( "*", function( req, res, next )
{
    res.status( 200 ).sendFile( __dirname + "/app/index.html" );
} );


var port = process.env.PORT || 4000;
http.createServer( app ).listen( port );
console.log( "Server running on " + port );
