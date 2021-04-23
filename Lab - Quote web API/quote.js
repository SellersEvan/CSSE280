window.addEventListener("DOMContentLoaded", function () {
   document.querySelector( "#fetchQuotesBtn" ).addEventListener("click", function () {

      // Get values from drop-downs
      const topicDropdown = document.querySelector("#topicSelection");
      const selectedTopic = topicDropdown.options[topicDropdown.selectedIndex].value;
      const countDropdown = document.querySelector("#countSelection");
      const selectedCount = countDropdown.options[countDropdown.selectedIndex].value;
   
      // Get and display quotes
      fetchQuotes( selectedTopic, selectedCount );	   
   });
});

function fetchQuotes( topic, count ) {
   const reqXml = new XMLHttpRequest();
   reqXml.addEventListener( "load", responseReceivedHandler );
   reqXml.responseType = "json";
   reqXml.open( "GET", `https://wp.zybooks.com/quotes.php?topic=${ topic }&count=${ count }` );
   reqXml.send();
}

// TODO: Add responseReceivedHandler() here

function responseReceivedHandler() {
   if ( !this.response[ "error" ] ) {
      let html = "<ol>";
      this.response.forEach( elm => {
         html += `<li>${ elm.quote } - ${ elm.source }</li>`;
      });
      html += "</ol>";
      document.querySelector("#quotes").innerHTML = html;
   } else {
      document.querySelector("#quotes").innerHTML = this.response[ "error" ];
   }
}