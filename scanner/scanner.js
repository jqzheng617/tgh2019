process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'; //SHOULD REMOVE THIS FOR PRODUCTION AND RESOLVE ISSUES, IF ANY

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var oReq = new XMLHttpRequest();
const fetch = require('node-fetch');
var lastChain;
var serverResponse;


//https://github.com/cloudant/nodejs-cloudant
const Cloudant = require('@cloudant/cloudant');

/*const username = "username";
const password = "password";
const cloudant = Cloudant({
    account: username,
    password: password
});*/

const account = "2aeca32c-420b-42c5-96ef-8032e3b74711-bluemix";
const key = "iseenchingetrayseditiewn";
const password = "9c4436e36be8b055eea0d0cee18c2c2378d3a9de";
const cloudant = Cloudant({
    account: account,
    key: key,
    password: password
});
const db = cloudant.use("tgh2019"); //console.log(db); 


//setInterval is called every 10 seconds to retrieve the last 20 blocks on the chain with all their data
setInterval(function () {
    findRecentChains()
}, 10000);

//
function findRecentChains() {

    // oReq.addEventListener("load", checkFoundChains);
    // oReq.open("POST", "https://hackathon.casperlabs.io/graphql", true);
    // oReq.send('{ "operationName": "", "variables": {}, "query": "{ dagSlice(depth: 20) { blockHash rank}}" }');

    //this fetch retrieves the 20 most recent blockchain entries and stores them in a variable named json
    //https://www.apollographql.com/docs/apollo-server/requests/
    //does a better job handling the POST body
    fetch("https://hackathon.casperlabs.io/graphql", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "query": "query { dagSlice(depth: 20) { \n  blockHash\n  rank\n  \n  parentHashes\n  justificationHashes\n  timestamp\n  \n  deployCount\n  validatorPublicKey\n  validatorBlockSeqNum\n  chainId\n  \n  faultTolerance\n  blockSizeBytes\n  blockSizeBytes\n  deployErrorCount\n  \n}}",
                "operationName": "",
                "variables": {}
            })
        })
        .then(res => res.json())
        .then(json => {
            //  console.log(json, typeof json)
            console.log(json.data.dagSlice.length)
            checkFoundChains(json)
        })
        .catch(function (error) {
            console.log('Request failure: ', error);
        });

    /*
    curl 'https://hackathon.casperlabs.io/graphql' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: https://hackathon.casperlabs.io' --data-binary '{"query":"query { dagSlice(depth: 20) { \n  blockHash\n  rank\n  \n  parentHashes\n  justificationHashes\n  timestamp\n  \n  deployCount\n  validatorPublicKey\n  validatorBlockSeqNum\n  chainId\n  \n  faultTolerance\n  blockSizeBytes\n  blockSizeBytes\n  deployErrorCount\n  \n}}"}' --compressed
    */

}
 
//retrieve a single document by id from the Cloudant database
getDocumentById('74ccd506496113c7ef408ba23efbed5f018a7ebca130a0f34527ca435ff75ce0');
function getDocumentById(chain) {

    db.find({
        selector: {
            _id: {
                $eq: chain
            }
        },
        sort: ['_id']
    }, function (err, doc) {

        if (err) {
            console.log("could not find document with this id");
            return;
        } else if (doc !== "undefined" && doc.toString().substring(0, 1) !== "u") {
            //show us what was retrieved
            console.log(doc);
            // var serverResponseLength = JSON.parse(serverResponse).data.dagSlice.length;
            // console.log(serverResponse, typeof serverResponse, new Date(), serverResponseLength);

        } else {

            console.log("undefined response");
            return;
        }

    })
}


function checkFoundChains(serverResponse = false) {
    var serverResponseJSON;
    if (serverResponse === false) {
        serverResponse = this.responseText;
        serverResponseJSON = JSON.parse(serverResponse).data.dagSlice;
    } else {
      //  console.log(serverResponse.data.dagSlice, typeof serverResponse.data.dagSlice)
        serverResponseJSON = Object.values(serverResponse.data.dagSlice);
      //  console.log(typeof serverResponseJSON)
    }
    //console.log(serverResponse, typeof serverResponse, new Date());
    const maxChain = findLastChain(serverResponseJSON);
    console.log("maxChain", maxChain)

   // process.exit(1)
}


function findLastChain(chains) {
    lastChain = {
        rank: 0,
        blockHash: ""
    };
    //console.log("chains.length", chains.length)

    chains.forEach(checkChain);

    function checkChain(v, i, a) { //  console.log(v, v.rank, i, a);
        if (v.rank > lastChain.rank) {
            lastChain.rank = v.rank;
            lastChain.blockHash = v.blockHash;
        }
    }
    return lastChain;
}



/*
function createDocument(designAndView, docId, document, template, config, debug) {
    this.designAndView = designAndView || {};
    this.docId = docId || {};
    this.document = document || {};
    this.template = template || {};
    this.config = config || {};
    this.debug = debug || false;
    //console.log(config);
    //console.log(this);
    var docx_filename = "https://midivr.com/scriptspecialists/documents/" + this.document.Name + "_" + this.template.Name;


    if (debug == true) {
        //console.log("function createDocument this");
        //console.log(this);
    }
    /////////////////////////Cloudant Setup/////////////////////////
    //var nano = {};
    //var db_name = "";
    var db = "";

    try {

        var portNumber = config.port;
        var hostProtocol = "http://";
        if (config.ssl == true) {
            portNumber = config.sslPort;
            hostProtocol = "https://";
        }
        var connectionString = hostProtocol + config.username + ':' + config.password + '@' + config.hostname + ':' + portNumber; //console.log(connectionString);
        if (debug == true) {
            //console.log(connectionString);
        }
        //nano = require('nano')(connectionString);

        db = cloudant.use(config.db_name); //console.log(db);
        //db = nano.use(config.db_name); //console.log(db);
    } catch (e) {
        console.log(e, "error loading nano for Cloudant");
    }
    /////////////////////////End Cloudant Setup/////////////////////////

    if (db != "") { //if database connection was good... retrieve data by design and view
        //  console.log(designAndView._designName, designAndView._viewName)
        db.view(designAndView._designName, designAndView._viewName, {
            'include_docs': true
        }, function (err, body) {
            var usableData = [];
            //console.log("KING OF THE HILL",body,designAndView._designName, designAndView._viewName);
            if (!err) {


                for (var i = 0; i < body.rows.length; i++) {

                    // body.rows[i].value = fillOutBody(body.rows[i].value);
                    //console.log(body.rows[i].value)
                    //console.log(body.rows[i]);
                    //console.log(body.rows[i].value.SR_Dialogue);
                    body.rows[i].value.SR_Title = removeAt(body.rows[i].value.SR_Title);
                    body.rows[i].value.SR_Dialogue = removeAt(body.rows[i].value.SR_Dialogue);
                    usableData.push(body.rows[i].value); //for docx2
                }
                // if (debug == true) {
                //console.log(usableData);
                // }
                // mergeDataIntoTemplateAndExportFile(usableData, document, template, debug);
            } else {
                console.log(err);
                console.log(JSON.stringify({
                    "this": "not found"
                }));
            }
        });
    }

    console.log(docx_filename);
}

*/