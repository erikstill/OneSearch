// getDocTarget.js is the brains of the Millennium OneSearch capability.  getDocTarget.js grabs the user's search term, compares it to a variety of prefixes, and offers a link (if appropriate) to a non-library document system, or even a better link to the Library catalog.
// getDocTarget.js has 2 functions:  getQuery() and getDocTarget().
// getQuery() extracts the user's search query from the Millennium searchtool, performs some filtering and cleansing, and passes the query to getDocTarget().
// getDocTarget() tests the search query by comparing it to RegExps that characterize Boeing document systems.  If there is a match, getDocTarget() assembles a linkString that is passed back to getQuery().
// [Side note:  the profiles of non-library doc systems are managed in a separate file, prefixTest.js.  getDocTarget() makes a call to the prefixTest() function in this file.]
// Once getQuery() has the linkString, it displays it in the OPAC.
// Erik Still, 10/29/2009

// This is Erik's public version of getDocTarget.js (4/25/2014)

function getQuery(winControl) { // getQuery() extracts the user's search query from the Millennium searchtool.  winControl is the optional parameter used to select an alternate link display.
var searchQuery = "";
if (!document.searchtool) { // This section applies when form name="searchtool" does not exist.  This case occurs on a "no hit" heading browse display, e.g., a subject search on mcrowave.
	var searchArg = document.getElementsByName('searcharg');  // getting the user's search term
 	for (var i=0; i<searchArg.length; i++) {
		searchQuery = searchArg[i].value;
  		}
		
	if (document.forms[1]){ // this section changes the value of <option value="Y"> KEYWORD</option> from "Y" to "X" (because I do not use the "Y" searchpage option, srchhelp_Y).  Because the "searchtool" form is unnamed, I am using the DOM structure to address the option value.  Because there is no guarantee that the structure will be stable with new software releases, this manipulation may not always work.
	if (document.forms[1].elements[0]){
	if (document.forms[1].elements[0].options[0]){
	if (document.forms[1].elements[0].options[0].value == "Y"){ 
	document.forms[1].elements[0].options[0].value = "X";
	}}}}
}

else { // document.searchtool exists on item browse and bib record displays
	searchQuery = document.searchtool.searcharg.value; // get the search term
	
var testForSearchtype = document.searchtool.searchtype; // this section changes the searchtype Option value from Y to X.  For our OPAC, "Y" (srchhelp_Y.html, keyword search) is an unnecessary duplicate, and I make this page automatically nav to /search.  This caused a problem when customers used searchtool to perform a KW that retrieved no hits; users were taken to opacmenu.html with no No Entries Found message.  This code is my workaround solution to this problem.
if (typeof testForSearchtype != "undefined"){
		for (var j=0; j<document.searchtool.searchtype.options.length; j++){
			if (document.searchtool.searchtype.options[j].value == "Y"){
				document.searchtool.searchtype.options[j].value = "X";
				}
			}	
	}
} // end of else

if (searchQuery.length > 0) { // what to do if there is a search term
	var WSCheck = searchQuery.search(/\s/);
	if (WSCheck != -1) { // what to do if there is a whitespace character in the search term, indicating a multi-term query
		//searchQuery = searchQuery.replace(/(\S+)(\s.*)/, "$1"); // retains the first string of characters, and throws away the following whitespace and any subsequent characters 
		//searchQuery = searchQuery.replace(/^(\S+)(\s)(\S+)((\s.*)?)/, "$1$3"); // removes the first whitespace, and throws away an characters following a second whitespace
		searchQuery = searchQuery.replace(/^(\S+)(\s)(\S+)(\s)(\S+)((\s.*)?)/, "$1$3$5"); // removes the first and second whitespace, and throws away the third whitespace and any subsequent characters.
		}
	if (searchQuery != "***") { // Again, what to do next with the search term - but filtering out instances in which the search term is "***"
		var termArg = "insertionPoint";  // "insertionPoint" is the id value of the placeholder tag that will eventually display the targetURL (e.g., see bib_display.html).
		var termID = document.getElementById(termArg);
			if (!termID) {}
			else { // looking for the condition of the page having a tag with id="insertionPoint".
			var linkStringfromDocTarget = getDocTarget(searchQuery,winControl); // pass searchQuery to getDocTarget() function, and return a value (a targetURL/linkString)
			if (linkStringfromDocTarget != "") { // what to do if there is a OneSearch link to offer
				termID.innerHTML = linkStringfromDocTarget; // replace the HTML of the insertionPoint tag with the targetURL/linkString.  NOTE that this only affects the FIRST instance of "insertionPoint" on the page.  Other instances are ignored.
				var termArg2 = "displaySwitchforMultisearch"; // These several lines manage the display of the link to the Library's Multisearch.  I want to hide this link when a OneSearch link exists so that it does not compete with the OneSearch link.  This display management is performed with a span id="displaySwitchforMultisearch", which is used on srchhelp_X, and the WebBridge resource definition for Multisearch.
				var termID2 = document.getElementById(termArg2);
				if (!termID2) {}
				else {
					termID2.style.display = "none"; 
					}
				}
			}
		}
	} // end searchQuery.length check condition 
} // end getQuery()



function getDocTarget(testQuery,winControl) {

var targetArray = new Array(); // Each target system must have the following data, formatted as follows in the targetArray array

targetArray.Sys = ""; // the name of the target system - for display purposes
targetArray.SysQual = ""; // an optional, additional phrase that further explains the target system - for display purposes
targetArray.URLBase = ""; // the permanent, stable part of the target system's URL that does not change with different results
targetArray.testQueryMod = ""; // controls if or how the testQuery is manipulated (or whether it is even used) before submitting it to the target system
targetArray.URLSuffix = ""; // characters or name/value pairs that are added to the URL in addition to URLBase and testQueryMod to formulate the targetURL

prefixTest(testQuery, targetArray); // call to the function that tests for prefixes of non-library systems.  prefixTest exists in prefixTest.js

if (targetArray.Sys == "Library Catalog") { // Since users are already in the Library Catalog, manipulate some targetArray values for local use
targetArray.Sys = "Catalog";
targetArray.SysQual = "as an ID#";
targetArray.URLBase = "/search/i?SEARCH=";
}

var cURL=location.href;
var cSRCH_ID=cURL.search(/\/search.{0,7}\/i|searchtype\=i/i); // Conditions under which current URL represents a Library Catalog ID# search.  \/search.{0,7}\/i accounts for strings like "/search~S22?/i" and "/searchcatalog/i"
if (targetArray.Sys == "Catalog" && cSRCH_ID != -1) // If 1) the target system is Library Catalog, and 2) current URL represents an ID# search in the Catalog, then empty the targetArray values so that OneSearch does not provide silly, circular Catalog links. 
	{
	targetArray.Sys = "";
	targetArray.SysQual = "";
	targetArray.URLBase = "";
	}

var targetURL = targetArray.URLBase + targetArray.testQueryMod + targetArray.URLSuffix;
var linkString = "";

if (targetArray.Sys != ""){ // Assemble the desired linkString, based on the format specified by the winControl value specified on the display page.
	if (winControl == "newWin"){
	linkString = "<div class=\"insertionPoint\"><a href="+targetURL+" target=\"_blank\">Search for <i>"+testQuery+"</i> "+targetArray.SysQual+" in "+targetArray.Sys+"</a></div>";
	}
	else if (winControl == "wp_panel"){ // this html dresses-up the link to look as if it belongs to a WB Category
	linkString = "<br><div class=\"wbresourcelist\"><div class=\"wbcategory\">Search in "+targetArray.Sys+"</div><div class=\"wblinkdisplay\"><div class=\"insertionPoint\"><a href="+targetURL+" target=\"_blank\">Search for <i>"+testQuery+"</i> "+targetArray.SysQual+" in "+targetArray.Sys+"</a></div></div></div>";
	}
	else {
	linkString = "<div class=\"insertionPoint\"><a href="+targetURL+">Search for <i>"+testQuery+"</i> "+targetArray.SysQual+" in "+targetArray.Sys+"</a></div>";
	}
}

return linkString; // Send linkString back to getQuery() for display instructions.
}

