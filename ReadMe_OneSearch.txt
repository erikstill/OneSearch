"OneSearch" is a system for providing Millennium WebPAC customers with links to non-Library systems in cases when the the items they are looking for do not have catalog records.
OneSearch is based on a match between the user's search term, and regular expressions that define document number prefixes that are uniquely associated with non-library document systems.

OneSearch uses 2 external JavaScript files:
getDocTarget.js
prefixTest.js

In addition, there are several other WebPAC-related files that come into play:

From botlogo.html:
<script language="JavaScript" type="text/javascript" src="/screens/getDocTarget.js"></script> <!-- contains function getDocTarget(), and also extracts the user's search query from the Millennium searchtool -->
<script language="JavaScript" type="text/javascript" src="http://prefixmanageroutput.web.boeing.com/prefixTest.js"></script> <!-- contains function prefixTest(), which manages the non-library doc system targets for getDocTarget.js -->

<script language="JavaScript" type="text/javascript">
getQuery(); // specifies that links generated through this process will open in the same window
</script>


WebBridge, Resource Profile:  OneBox Prefix Manager Link
http://catalog.web.boeing.com/webbridge/edit?eaction=edit&rtype=res&id=384
Description:  provides insertionPoints for display of links from testing user's search term on Browse Table
Browse Linking/Display Link/Web OPAC Browse Table:  <span id="insertionPoint"></span>

bib_display.html:
<span id="insertionPoint" class="bib_display"></span> <!-- provide placeholder for possible link display based on testing of user's search query -->

srchhelp_X.html (the page you see after a failed keyword search), and wp_panel.html (the WebBridge panel you see after clicking the "Extend Your Search" button) - These pages required special attention.

