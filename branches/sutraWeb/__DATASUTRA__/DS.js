/**
 * Valid values are Desktop, iPad, iPhone
 * @type {String}
 *
 * @properties={typeid:35,uuid:"780AFC6C-1B34-4D59-B6DE-EAAE9C393BD6"}
 */
var deviceFactor = 'Desktop';

/**
 * @param {String} device The device factor used to view Data Sutra
 * 
 * @properties={typeid:24,uuid:"A7441E3D-7529-4930-8597-968C00F5948C"}
 */
function setFactor(device) {
	if (device && device != 'null') {
		deviceFactor = device
	}
}