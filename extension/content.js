// @ts-check
'use strict';


/**
 * Wait to get the stylesheet content then add it to the head
 * @param {Promise<{[key: string]: any}>} sheets_promise
 */
async function change_style(sheets_promise)
{
	// Get sheets for this URL or stop
	const sheets = await sheets_promise;
	if (Object.keys(sheets).length == 0)
		return;

	// Append stylesheet to head
	const style = document.createElement('style');
	style.innerHTML = Object.values(sheets).join('');
	document.head.appendChild(style);
}


function main()
{
	// Skip SVG
	if (document.documentElement.tagName === 'svg')
		return;

	// Parse the URL
	const hostname = window.location.host.replace(/^www\./, '');
	const hostname_parts = hostname.split('.');

	// Get keys for sheets
	// ['css:*', 'css:url.org', 'css:*.org', 'css:*.url.org']
	const keys = ['css:*', `css:${hostname}`];
	for (let i = hostname_parts.length - 1; i >= 0; i--) {
		const wildcard_parts = ['*'];
		for (let j = i; j < hostname_parts.length; j++)
			wildcard_parts.push(hostname_parts[j]);
		keys.push(`css:${wildcard_parts.join('.')}`);
	}

	// Start to get style for this URL
	const sheets = chrome.storage.sync.get(keys);

	// Wait for the head - the parent of a new style element
	if (document.head) {
		change_style(sheets);
	}
	else {
		const observer = new MutationObserver(() => {
			change_style(sheets);
			observer.disconnect();
		});
		observer.observe(document, { childList: true, subtree: true });
	}
}


main();
