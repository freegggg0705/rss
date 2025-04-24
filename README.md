---Warning---   

3. CORS and Protecting Sensitive Data

Is CORS to prevent webpages from loading and running scripts to access other webpage origin’s sensitive data stored in the browser or auto-authorized/logged-in account info?
Yes, exactly! CORS is part of the browser’s security model to protect users and servers. Let’s break it down:

Same-Origin Policy: Browsers restrict scripts (like your script.js) to only access resources from the same origin (e.g., https://username.github.io). This prevents a malicious site from making requests to another site (e.g., https://yourbank.com) on your behalf.



Sensitive Data Protection:

If you’re logged into a site (e.g., Reddit, your bank), your browser stores cookies or session tokens for that site.



Without CORS, a malicious webpage (e.g., https://evil.com) could send requests to https://reddit.com/api/user with your cookies, potentially accessing your account data.



CORS ensures the target server (Reddit) must explicitly allow evil.com via headers like Access-Control-Allow-Origin. If not allowed, the browser blocks the response.


Auto-Authorized Requests: CORS prevents scripts from exploiting your logged-in state (e.g., auto-authorized API calls) by requiring server permission for cross-origin requests

Example:

Your RSS reader on https://username.github.io tries to fetch https://www.reddit.com/r/gifs.rss.



Reddit’s server doesn’t include Access-Control-Allow-Origin: https://username.github.io (or *), so the browser blocks the response to protect Reddit’s data and your session

`Protect My Session`

Safety Recommendations for Your Use Case

Since you’re using the CORS Unblock add-on for your RSS reader (hosted on username.github.io) in a personal context, here’s how to stay safe:

Use Incognito Mode:

Open your RSS reader in incognito mode to minimize risks from stored cookies or sessions.



Avoid logging into sensitive sites (e.g., bank, email) in the same incognito session to prevent cross-origin attacks.


Trustworthy Add-ons:

Use a reputable CORS Unblock add-on (e.g., “CORS Everywhere” for Firefox or “Allow CORS: Access-Control-Allow-Origin” for Chrome) from a verified developer.



Check reviews and permissions (e.g., avoid add-ons requesting excessive access like “read all browsing data”).


Disable Add-on When Not Needed:

Enable the add-on only when using your RSS reader. Disable it for general browsing to avoid exposing other sites to cross-origin risks.



In Chrome, you can toggle extensions via chrome://extensions/ or right-click the extension icon




----



# About using side by side rss reader in https://freegggg0705.github.io/rss/simple/12345.html  
# And About using column wise or grid wise rss reader in https://freegggg0705.github.io/rss/simple5/12345.html [Final Version]  
> About use it reddit:   
You can turn your multireddit into rss by adding ".rss" after it, but remember to turn your multireddit to private   
You can also turn your reddit frontpage into subreddit, getting the link from your profile in old reddit
You can use https://www.reddit.com/r/gifsgonewild/top/.rss?t=month [hour/day/week/year/all] [best/new/rising/hot]
    
    
    
---for reference of different version---         
https://freegggg0705.github.io/rss/simple2/12345.html  [First try that work]  
https://freegggg0705.github.io/rss/simple3/12345.html  [Ehancement]    
https://freegggg0705.github.io/rss/simple4/12345.html [Crashed gif load due to thumbnail down quality process maybe or video extract maybe]   

----------------------------------------

1. Remember to install addon to unblock CORS (Cross-Origin Resource Sharing) restrictions enforced by your browser.  
   https://addons.mozilla.org/en-US/firefox/addon/cors-unblock/

2. Here are the lists of bilinugal use webpage:  
   [Bilingual HKGov news Feature]  
   https://www.news.gov.hk/en/common/html/topstories.rss.xml   
   https://www.news.gov.hk/tc/common/html/topstories.rss.xml  
   
   [Bilingual HKGov news All]  
   https://www.info.gov.hk/gia/rss/general_zh.xml
   https://www.info.gov.hk/gia/rss/general_en.xml 

   Belows are not of much content in rss:  
     
   [Bilingual Legislative Council Research Publication]  
   https://www.legco.gov.hk/en/rss/eresearch_publications.xml  
   https://www.legco.gov.hk/tc/rss/cresearch_publications.xml  
     
   [Bilingual Legislative Council Legislative Council Briefs]  
   https://www.legco.gov.hk/en/rss/ebriefs.xml   
   https://www.legco.gov.hk/tc/rss/cbriefs.xml  
   
3. Furthermore, You can use https://freegggg0705.blogspot.com/rss.xml and instapaper as bridge for creating bilingual view of page easily. 
