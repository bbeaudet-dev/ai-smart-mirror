/* Basic MagicMirror² Configuration for Raspberry Pi
 * This is a minimal configuration to test basic functionality
 */

let config = {
	address: "0.0.0.0",	// Listen on all interfaces for Pi
	port: 8080,
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1", "192.168.1.0/24"], // Allow local network

	language: "en",
	logLevel: ["INFO", "LOG", "WARN", "ERROR"],
	timeFormat: 12, // 12-hour format with AM/PM
	units: "imperial", // Use imperial units for US

	modules: [
		{
			module: "alert",
		},
		{
			module: "updatenotification",
			position: "top_bar"
		},
		{
			module: "clock",
			position: "top_left", 
			config: {
				displaySeconds: true,
				showDate: true,
				dateFormat: "dddd, LL",
				showPeriod: true // Show AM/PM
			}
		},
		{
			module: "calendar",
			header: "US Holidays",
			position: "top_left",
			config: {
				calendars: [
					{
						fetchInterval: 7 * 24 * 60 * 60 * 1000,
						symbol: "calendar-check",
						url: "https://ics.calendarlabs.com/76/mm3137/US_Holidays.ics"
					}
				]
			}
		},
		{
			module: "ai-motivation", 
			position: "top_center",
			config: {
				updateInterval: 60000, // 1 minute
				apiEndpoint: "http://localhost:5000/api/ai/motivation"
			}
		},
		{
			module: "compliments",
			position: "lower_third"
		},
		{
			module: "weather",
			position: "top_right",
			config: {
				weatherProvider: "openmeteo",
				type: "current",
				lat: 40.776676, // New York coordinates - change these for your location
				lon: -73.971321,
				units: "imperial",
				roundTemp: true // Round temperatures to whole numbers (no decimals)
			}
		},
		{
			module: "weather",
			position: "top_right",
			header: "Weather Forecast",
			config: {
				weatherProvider: "openmeteo",
				type: "forecast",
				lat: 40.776676, // New York coordinates - change these for your location
				lon: -73.971321,
				units: "imperial",
				roundTemp: true // Round temperatures to whole numbers (no decimals)
			}
		},
		{
			module: "newsfeed",
			position: "bottom_bar",
			config: {
				feeds: [
					{
						title: "New York Times",
						url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml"
					}
				],
				showSourceTitle: true,
				showPublishDate: true,
				updateInterval: 10 * 60 * 1000, // 10 minutes
				animationSpeed: 2.5 * 1000 // 2.5 seconds
			}
		}
	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") { module.exports = config; }
