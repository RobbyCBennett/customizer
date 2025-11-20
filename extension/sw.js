// @ts-check
'use strict';


/**
 * Try to get the URL of the tab and remember it for the options
 * @param {chrome.tabs.Tab} tab
 */
async function remember_url_for_options(tab)
{
	// Fail if no tab URL
	if (!tab.url)
		return;

	// Get the base URL or fail
	const base_url_pattern = /^https?:\/\/(www.)?(.+?[^\/:])(?=[?\/]|$)/;
	const base_url = tab.url.match(base_url_pattern);
	if (!base_url)
		return;

	// Remember the URL
	await chrome.storage.local.set({ url: `css:${base_url[2]}` });
}


/**
 * Handle a command like clicking a button or a keyboard shortcut
 * @param {string} command
 * @param {chrome.tabs.Tab | undefined} tab
 */
async function handle_command(command, tab)
{
	switch (command) {
		case 'bigOptions':
			break;
		case 'bigOptionsEditSite':
			if (tab)
				await remember_url_for_options(tab);
			break;
		default:
			return;
	}

	chrome.runtime.openOptionsPage();
}


/**
 * Main function of the service worker in the background
 */
function main()
{
	chrome.commands.onCommand.addListener(handle_command);
}


main();
