/*
Explaining the Data:
testQuery = user's search term, which is captured outside this prefixTest function

Each target system must have the following data, formatted as follows in the targetArray array
.Sys = the name of the target system - for display purposes
.SysQual = an optional, additional phrase that further explains the target system - for display purposes
.URLBase = the permanent, stable part of the target system's URL that does not change with different results
.testQueryMod = controls if or how the testQuery is manipulated (or whether it is even used) before submitting it to the target system
.URLSuffix = characters or name/value pairs that are added to the URL in addition to URLBase and testQueryMod to formulate the targetURL

Template:
if (testQuery.search(//i) == 0){
   targetArray.Sys = '';
   targetArray.SysQual = '';
   targetArray.URLBase = '';
   targetArray.testQueryMod = testQuery;
   targetArray.URLSuffix = '';
}
*/

/*
This version of prefixTest.js is for public display.  It contains only a sample profile.
*/


function prefixTest(testQuery, targetArray)
{
   if (testQuery.search(/(nasa)(a|cpl|cr|e)?\d*$/i) == 0)
   {
      targetArray.Sys = 'NASA Technical Reports Server (NTRS)';
      targetArray.SysQual = '';
      targetArray.URLBase = 'http://ntrs.nasa.gov/search.jsp?N=0&Ntk=Report-Patent-Number&Ntt=';
      targetArray.URLSuffix = '';
      targetArray.testQueryMod = encodeURIComponent(testQuery); // use the user's search query as is
   }
}
