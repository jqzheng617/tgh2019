process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'; //SHOULD REMOVE THIS FOR PRODUCTION AND RESOLVE ISSUES, IF ANY

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var oReq = new XMLHttpRequest();
var lastChain;

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



//setInterval

//get last chain

setInterval(function () {
    findRecentChains()
}, 10000);

function findRecentChains() {

    oReq.addEventListener("load", checkFoundChains);
    oReq.open("POST", "https://hackathon.casperlabs.io/graphql", true);
    oReq.send('{ "operationName": "", "variables": {}, "query": "{ dagSlice(depth: 20) { blockHash rank}}" }');


}

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
        } else if (doc !== "undefined" && doc.toString().substring(0,1) !=="u") {

            //redrawTodosUI(doc.rows);
           console.log(doc);
           // var serverResponseLength = JSON.parse(serverResponse).data.dagSlice.length;
           // console.log(serverResponse, typeof serverResponse, new Date(), serverResponseLength);

        } else {

            console.log("undefined response");
            return;
        }

    })
}

function findLastChain(chains) {
    lastChain = {
        rank: 0,
        blockHash: ""
    };
    //console.log("chains.length", chains.length)

    chains.forEach(checkChain);
    function checkChain(v, i, a) {//  console.log(v, v.rank, i, a);
        if (v.rank > lastChain.rank) {
            lastChain.rank = v.rank;
            lastChain.blockHash = v.blockHash;
        }
    }
    return lastChain;
}

function checkFoundChains() {
    serverResponse = this.responseText;
    var serverResponseJSON = JSON.parse(serverResponse).data.dagSlice;
    //console.log(serverResponse, typeof serverResponse, new Date());
    const maxChain = findLastChain(serverResponseJSON);
    console.log(maxChain)
}
var serverResponse;

getDocumentById('74ccd506496113c7ef408ba23efbed5f018a7ebca130a0f34527ca435ff75ce0');