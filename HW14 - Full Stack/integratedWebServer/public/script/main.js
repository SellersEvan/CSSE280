/*
 *   Edited by Evan Sellers <sellersew@gmail.com> on
 *   behalf of Rose-Hulman Institute of Technology
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Tue Mar 16 2021
 *   original: N/A
 *   file: script.js
 *   project: N/A
 *   purpose: N/A
 *
 */

const API = "http://localhost:3000/api";
let selectedEntry = -1;
let editEntryMode = false;
let counterElm = new counter(
    document.querySelector( "#incButton" ),
    document.querySelector( "#decButton" ),
    document.querySelector( "#resetButton" ),
    document.querySelector( "#counterText" )
);

function setup() {
    document.querySelector( "#createButton" ).addEventListener( "click", () => {
        createEntry();
    });

    document.querySelector( "#updateButton" ).addEventListener( "click", () => {
        updateEntry();
    });

    document.querySelector( "#deleteButton" ).addEventListener( "click", () => {
        deleteEntry();
    });
}

function loadEntry( id ) {
    selectedEntry = id;
    fetch( API + "/id/" + id ).then( data => 
        data.json()
    ).then( data => {
        document.querySelector( "#inputName" ).value = data.name;
        counterElm.display( data.count );
        editEntryMode = true;
        updateView();
    }).catch( err => console.log( err ) );
}

function updateEntry() {
    let name  = document.querySelector( "#inputName" ).value;
    let count = counterElm.getValue();
    let data  = { "name": name, "count": count };
    fetch( API + "/id/" + selectedEntry, {
        "method": "PUT",
        "headers": { "Content-Type": "application/json" },
        "body": JSON.stringify( data )
    }).then( () =>  {
        editEntryMode = false;
        document.querySelector( "#inputName" ).value = "";
        counterElm.display( 0 );
        updateView();
    }).catch( err => console.log( err ) );
}

function deleteEntry() {
    fetch( API + "/id/" + selectedEntry, {
        "method": "DELETE"
    }).then( () =>  {
        editEntryMode = false;
        document.querySelector( "#inputName" ).value = "";
        counterElm.display( 0 );
        updateView();
    }).catch( err => console.log( err ) );
}

function createEntry() {
    let name = document.querySelector( "#inputName" ).value;
    let count = counterElm.getValue();
    let data  = { "name": name, "count": count };
    let allEntries = fetch( API, {
        "method": "POST",
        "headers": { "Content-Type": "application/json" },
        "body": JSON.stringify( data )
    }).then( () =>  {
        editEntryMode = false;
        document.querySelector( "#inputName" ).value = "";
        counterElm.display( 0 );
        updateView();
    }).catch( err => console.log( err ) );
}

function loadEntries() {
    let allEntries = fetch( API ).then( data => 
        data.json()
    ).then( data => {
        let dom = "";
        data.forEach( ( item, id ) => {
            dom += `<button id="id${ id }" onclick="loadEntry(${ id })">Select Entry</button><label>${ item.name }</label>&nbsp;<label>${ item.count }</label><br></br>`
        });
        document.querySelector( "#displayEntries" ).innerHTML = dom;
    }).catch( err => console.log( err ) );
}

function updateView() {
    document.querySelector( "#createButton" ).disabled = editEntryMode;
    document.querySelector( "#updateButton" ).disabled = !editEntryMode;
    document.querySelector( "#deleteButton" ).disabled = !editEntryMode;
    loadEntries();
}


loadEntries();
updateView();
setup();