/*
 *   Edited by Evan Sellers <sellersew@gmail.com> on
 *   behalf of Rose-Hulman Institute of Technology
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Sun Mar 14 2021
 *   original: N/A
 *   file: script.js
 *   project: N/A
 *   purpose: N/A
 *
 */

console.log( "Hello World" );                                                   // notify that the script has started

document.querySelector( "#BtnSendAlert" ).addEventListener( "click", () => {    // add action event listener
    alert( "We need your attention!!" );                                        // alert the user
});