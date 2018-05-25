var path = require("path");
var nodeResolve = require("resolve").sync;
let { IHtmlParser, CompileHtml } = require( "ihtml" );
const fs = require( "fs" );

function GetFileContents( source ){
  return new Promise( ( resolve, reject ) => {
    fs.readFile( source, ( err, data ) => {
      if( !err ){
        resolve( data.toString() );
      }
      else{
        reject( err );
      }
    } )
  });
}

module.exports = async function( source, options ) {
	let ihtml = IHtmlParser( source );
  //@TODO figure out a way to inform webpack of the relationship.
  let fileName = "";
  if( ihtml.from.startsWith( "." ) ){
    fileName = path.resolve( path.dirname( this.resourcePath ), ihtml.from );
  }
	else{
    fileName = nodeResolve( ihtml.from );
  }

  this.addDependency( fileName );

	let compiledContent = CompileHtml( ihtml, await GetFileContents( fileName ), "jsdom-template" );
	//console.log( compiledContent );
  return compiledContent;
	
}