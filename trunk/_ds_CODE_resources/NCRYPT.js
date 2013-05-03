/*
 * Wrapped open source cryptographic algorithms implemented in JavaScript for Servoy use.
 * @author Data Mosaic <http://www.data-mosaic.com/>
 * @license MIT
 * 
 * Source:
 * 
 * Crypto-JS v2.5.4
 * http://code.google.com/p/crypto-js/
 * (c) 2009-2012 by Jeff Mott. All rights reserved.
 * http://code.google.com/p/crypto-js/wiki/License
 * Crypto-JS contribution from Simon Greatrix
 */

	
/**
 * NCRYPT utilities
 * 
 * @properties={typeid:35,uuid:"002BEA97-8ED3-425A-BDD1-1229D77CBF7B",variableType:-4}
 */
var util = {
	
	/** @private */
	base64map : function () {
		return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
	},

	// Bit-wise rotate left
	rotl: function (n, b) {
		return (n << b) | (n >>> (32 - b));
	},

	// Bit-wise rotate right
	rotr: function (n, b) {
		return (n << (32 - b)) | (n >>> b);
	},

	// Swap big-endian to little-endian and vice versa
	endian: function (n) {

		// If number given, swap endian
		if (n.constructor == Number) {
			return util.rotl(n,  8) & 0x00FF00FF |
			       util.rotl(n, 24) & 0xFF00FF00;
		}

		// Else, assume array and swap all items
		for (var i = 0; i < n.length; i++)
			n[i] = util.endian(n[i]);
		return n;

	},

	// Generate an array of any length of random bytes
	randomBytes: function (n) {
		for (var bytes = []; n > 0; n--)
			bytes.push(Math.floor(Math.random() * 256));
		return bytes;
	},

	// Convert a byte array to big-endian 32-bit words
	bytesToWords: function (bytes) {
		for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
			words[b >>> 5] |= (bytes[i] & 0xFF) << (24 - b % 32);
		return words;
	},

	// Convert big-endian 32-bit words to a byte array
	wordsToBytes: function (words) {
		for (var bytes = [], b = 0; b < words.length * 32; b += 8)
			bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
		return bytes;
	},

	// Convert a byte array to a hex string
	bytesToHex: function (bytes) {
		for (var hex = [], i = 0; i < bytes.length; i++) {
			hex.push((bytes[i] >>> 4).toString(16));
			hex.push((bytes[i] & 0xF).toString(16));
		}
		return hex.join("");
	},

	// Convert a hex string to a byte array
	hexToBytes: function (hex) {
		for (var bytes = [], c = 0; c < hex.length; c += 2)
			bytes.push(parseInt(hex.substr(c, 2), 16));
		return bytes;
	},

	// Convert a byte array to a base-64 string
	bytesToBase64: function (bytes) {
		for(var base64 = [], i = 0; i < bytes.length; i += 3) {
			var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
			for (var j = 0; j < 4; j++) {
				if (i * 8 + j * 6 <= bytes.length * 8)
					base64.push(this.base64map().charAt((triplet >>> 6 * (3 - j)) & 0x3F));
				else base64.push("=");
			}
		}

		return base64.join("");
	},

	// Convert a base-64 string to a byte array
	base64ToBytes: function (base64) {
		// Remove non-base-64 characters
		base64 = base64.replace(/[^A-Z0-9+\/]/ig, "");

		for (var bytes = [], i = 0, imod4 = 0; i < base64.length; imod4 = ++i % 4) {
			if (imod4 == 0) continue;
			bytes.push(((this.base64map().indexOf(base64.charAt(i - 1)) & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2)) |
			           (this.base64map().indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
		}

		return bytes;
	},
	
	UTF8 : {

		// Convert a string to a byte array
		stringToBytes: function (str) {
			return util.Binary.stringToBytes(unescape(encodeURIComponent(str)));
		},

		// Convert a byte array to a string
		bytesToString: function (bytes) {
			return decodeURIComponent(escape(util.Binary.bytesToString(bytes)));
		}
	},
	
	Binary : {

		// Convert a string to a byte array
		stringToBytes: function (str) {
			for (var bytes = [], i = 0; i < str.length; i++)
				bytes.push(str.charCodeAt(i) & 0xFF);
			return bytes;
		},

		// Convert a byte array to a string
		bytesToString: function (bytes) {
			for (var str = [], i = 0; i < bytes.length; i++)
				str.push(String.fromCharCode(bytes[i]));
			return str.join("");
		}
	}

}


/**
 * NCRYPT MD5 hasher
 * 
 * @properties={typeid:24,uuid:"66FBCF58-DAE2-4AB8-B13F-69CD51AE560F"}
 */
function MD5 (message, options) {
	
	// Package private blocksize
	MD5._blocksize = 16;
	MD5._digestsize = 16;
	
	/** @private */
	function _md5 () {

		// Convert to byte array
		if (message.constructor == String) message = util.UTF8.stringToBytes(message);
		/* else, assume byte array already */

		var m = util.bytesToWords(message),
		    l = message.length * 8,
		    a =  1732584193,
		    b = -271733879,
		    c = -1732584194,
		    d =  271733878;

		// Swap endian
		for (var i = 0; i < m.length; i++) {
			m[i] = ((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF |
			       ((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00;
		}

		// Padding
		m[l >>> 5] |= 0x80 << (l % 32);
		m[(((l + 64) >>> 9) << 4) + 14] = l;

		// Method shortcuts
		var FF = _ff,
		    GG = _gg,
		    HH = _hh,
		    II = _ii;

		for (var j = 0; j < m.length; j += 16) {

			var aa = a,
			    bb = b,
			    cc = c,
			    dd = d;

			a = FF(a, b, c, d, m[i+ 0],  7, -680876936);
			d = FF(d, a, b, c, m[i+ 1], 12, -389564586);
			c = FF(c, d, a, b, m[i+ 2], 17,  606105819);
			b = FF(b, c, d, a, m[i+ 3], 22, -1044525330);
			a = FF(a, b, c, d, m[i+ 4],  7, -176418897);
			d = FF(d, a, b, c, m[i+ 5], 12,  1200080426);
			c = FF(c, d, a, b, m[i+ 6], 17, -1473231341);
			b = FF(b, c, d, a, m[i+ 7], 22, -45705983);
			a = FF(a, b, c, d, m[i+ 8],  7,  1770035416);
			d = FF(d, a, b, c, m[i+ 9], 12, -1958414417);
			c = FF(c, d, a, b, m[i+10], 17, -42063);
			b = FF(b, c, d, a, m[i+11], 22, -1990404162);
			a = FF(a, b, c, d, m[i+12],  7,  1804603682);
			d = FF(d, a, b, c, m[i+13], 12, -40341101);
			c = FF(c, d, a, b, m[i+14], 17, -1502002290);
			b = FF(b, c, d, a, m[i+15], 22,  1236535329);

			a = GG(a, b, c, d, m[i+ 1],  5, -165796510);
			d = GG(d, a, b, c, m[i+ 6],  9, -1069501632);
			c = GG(c, d, a, b, m[i+11], 14,  643717713);
			b = GG(b, c, d, a, m[i+ 0], 20, -373897302);
			a = GG(a, b, c, d, m[i+ 5],  5, -701558691);
			d = GG(d, a, b, c, m[i+10],  9,  38016083);
			c = GG(c, d, a, b, m[i+15], 14, -660478335);
			b = GG(b, c, d, a, m[i+ 4], 20, -405537848);
			a = GG(a, b, c, d, m[i+ 9],  5,  568446438);
			d = GG(d, a, b, c, m[i+14],  9, -1019803690);
			c = GG(c, d, a, b, m[i+ 3], 14, -187363961);
			b = GG(b, c, d, a, m[i+ 8], 20,  1163531501);
			a = GG(a, b, c, d, m[i+13],  5, -1444681467);
			d = GG(d, a, b, c, m[i+ 2],  9, -51403784);
			c = GG(c, d, a, b, m[i+ 7], 14,  1735328473);
			b = GG(b, c, d, a, m[i+12], 20, -1926607734);

			a = HH(a, b, c, d, m[i+ 5],  4, -378558);
			d = HH(d, a, b, c, m[i+ 8], 11, -2022574463);
			c = HH(c, d, a, b, m[i+11], 16,  1839030562);
			b = HH(b, c, d, a, m[i+14], 23, -35309556);
			a = HH(a, b, c, d, m[i+ 1],  4, -1530992060);
			d = HH(d, a, b, c, m[i+ 4], 11,  1272893353);
			c = HH(c, d, a, b, m[i+ 7], 16, -155497632);
			b = HH(b, c, d, a, m[i+10], 23, -1094730640);
			a = HH(a, b, c, d, m[i+13],  4,  681279174);
			d = HH(d, a, b, c, m[i+ 0], 11, -358537222);
			c = HH(c, d, a, b, m[i+ 3], 16, -722521979);
			b = HH(b, c, d, a, m[i+ 6], 23,  76029189);
			a = HH(a, b, c, d, m[i+ 9],  4, -640364487);
			d = HH(d, a, b, c, m[i+12], 11, -421815835);
			c = HH(c, d, a, b, m[i+15], 16,  530742520);
			b = HH(b, c, d, a, m[i+ 2], 23, -995338651);

			a = II(a, b, c, d, m[i+ 0],  6, -198630844);
			d = II(d, a, b, c, m[i+ 7], 10,  1126891415);
			c = II(c, d, a, b, m[i+14], 15, -1416354905);
			b = II(b, c, d, a, m[i+ 5], 21, -57434055);
			a = II(a, b, c, d, m[i+12],  6,  1700485571);
			d = II(d, a, b, c, m[i+ 3], 10, -1894986606);
			c = II(c, d, a, b, m[i+10], 15, -1051523);
			b = II(b, c, d, a, m[i+ 1], 21, -2054922799);
			a = II(a, b, c, d, m[i+ 8],  6,  1873313359);
			d = II(d, a, b, c, m[i+15], 10, -30611744);
			c = II(c, d, a, b, m[i+ 6], 15, -1560198380);
			b = II(b, c, d, a, m[i+13], 21,  1309151649);
			a = II(a, b, c, d, m[i+ 4],  6, -145523070);
			d = II(d, a, b, c, m[i+11], 10, -1120210379);
			c = II(c, d, a, b, m[i+ 2], 15,  718787259);
			b = II(b, c, d, a, m[i+ 9], 21, -343485551);

			a = (a + aa) >>> 0;
			b = (b + bb) >>> 0;
			c = (c + cc) >>> 0;
			d = (d + dd) >>> 0;

		}

		return util.endian([a, b, c, d]);

	}
	/** @private */
	function _ff (a, b, c, d, x, s, t) {
		var n = a + (b & c | ~b & d) + (x >>> 0) + t;
		return ((n << s) | (n >>> (32 - s))) + b;
	};
	/** @private */
	function _gg (a, b, c, d, x, s, t) {
		var n = a + (b & d | c & ~d) + (x >>> 0) + t;
		return ((n << s) | (n >>> (32 - s))) + b;
	};
	/** @private */
	function _hh (a, b, c, d, x, s, t) {
		var n = a + (b ^ c ^ d) + (x >>> 0) + t;
		return ((n << s) | (n >>> (32 - s))) + b;
	};
	/** @private */
	function _ii (a, b, c, d, x, s, t) {
		var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
		return ((n << s) | (n >>> (32 - s))) + b;
	};
	
	
	var digestbytes = util.wordsToBytes(_md5());
	return options && options.asBytes ? digestbytes :
	       options && options.asString ? util.Binary.bytesToString(digestbytes) :
	       util.bytesToHex(digestbytes);
};


/**
 * NCRYPT SHA1 hasher
 * 
 * @example 
 * 		scopes.NCRYPT.SHA1("Message")  // returns Hex by default
 * 		scopes.NCRYPT.SHA1("Message", { asBytes: true } )
 * 		scopes.NCRYPT.SHA1("Message", { asString: true } )
 * 		
 * @properties={typeid:35,uuid:"76EFC380-21B5-462A-B760-3AD5D478C857",variableType:-4}
 */
var SHA1 = function (message, options) {
	
	// Package private blocksize
	SHA1._blocksize = 16;
	SHA1._digestsize = 20;
	
	/** @private */
	function _sha1 () {

		// Convert to byte array
		if (message.constructor == String) message = util.UTF8.stringToBytes(message);
		/* else, assume byte array already */

		var m  = util.bytesToWords(message),
		    l  = message.length * 8,
		    w  =  [],
		    H0 =  1732584193,
		    H1 = -271733879,
		    H2 = -1732584194,
		    H3 =  271733878,
		    H4 = -1009589776;

		// Padding
		m[l >> 5] |= 0x80 << (24 - l % 32);
		m[((l + 64 >>> 9) << 4) + 15] = l;

		for (var i = 0; i < m.length; i += 16) {

			var a = H0,
			    b = H1,
			    c = H2,
			    d = H3,
			    e = H4;

			for (var j = 0; j < 80; j++) {

				if (j < 16) w[j] = m[i + j];
				else {
					var n = w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16];
					w[j] = (n << 1) | (n >>> 31);
				}

				var t = ((H0 << 5) | (H0 >>> 27)) + H4 + (w[j] >>> 0) + (
				         j < 20 ? (H1 & H2 | ~H1 & H3) + 1518500249 :
				         j < 40 ? (H1 ^ H2 ^ H3) + 1859775393 :
				         j < 60 ? (H1 & H2 | H1 & H3 | H2 & H3) - 1894007588 :
				                  (H1 ^ H2 ^ H3) - 899497514);

				H4 =  H3;
				H3 =  H2;
				H2 = (H1 << 30) | (H1 >>> 2);
				H1 =  H0;
				H0 =  t;

			}

			H0 += a;
			H1 += b;
			H2 += c;
			H3 += d;
			H4 += e;

		}

		return [H0, H1, H2, H3, H4];

	}
	
	var digestbytes = util.wordsToBytes(_sha1());
	return options && options.asBytes ? digestbytes :
	       options && options.asString ? util.Binary.bytesToString(digestbytes) :
	       util.bytesToHex(digestbytes);
};


/**
 * @properties={typeid:24,uuid:"463B1410-408A-4E04-84C0-5BEF75BEF01A"}
 */
function SHA256 (message, options) {
	
	// Package private blocksize
	SHA256._blocksize = 16;
	SHA256._digestsize = 32;
	
	/** @private */
 	function _sha256 () {
		 
		// Constants
		 var K = [ 0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
		           0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
		           0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
		           0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
		           0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC,
		           0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
		           0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
		           0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
		           0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
		           0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
		           0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
		           0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
		           0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
		           0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
		           0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
		           0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2 ];

		// Convert to byte array
		if (message.constructor == String) message = util.UTF8.stringToBytes(message);
		/* else, assume byte array already */

		var m = util.bytesToWords(message),
		    l = message.length * 8,
		    H = [ 0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A,
		          0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19 ],
		    w = [],
		    a, b, c, d, e, f, g, h,
		    t1, t2;

		// Padding
		m[l >> 5] |= 0x80 << (24 - l % 32);
		m[((l + 64 >> 9) << 4) + 15] = l;

		for (var i = 0; i < m.length; i += 16) {

			a = H[0];
			b = H[1];
			c = H[2];
			d = H[3];
			e = H[4];
			f = H[5];
			g = H[6];
			h = H[7];

			for (var j = 0; j < 64; j++) {

				if (j < 16) w[j] = m[j + i];
				else {

					var gamma0x = w[j - 15],
					    gamma1x = w[j - 2],
					    gamma0  = ((gamma0x << 25) | (gamma0x >>>  7)) ^
					              ((gamma0x << 14) | (gamma0x >>> 18)) ^
					               (gamma0x >>> 3),
					    gamma1  = ((gamma1x <<  15) | (gamma1x >>> 17)) ^
					              ((gamma1x <<  13) | (gamma1x >>> 19)) ^
					               (gamma1x >>> 10);

					w[j] = gamma0 + (w[j - 7] >>> 0) +
					       gamma1 + (w[j - 16] >>> 0);

				}

				var ch  = e & f ^ ~e & g,
				    maj = a & b ^ a & c ^ b & c,
				    sigma0 = ((a << 30) | (a >>>  2)) ^
				             ((a << 19) | (a >>> 13)) ^
				             ((a << 10) | (a >>> 22)),
				    sigma1 = ((e << 26) | (e >>>  6)) ^
				             ((e << 21) | (e >>> 11)) ^
				             ((e <<  7) | (e >>> 25));


				t1 = (h >>> 0) + sigma1 + ch + (K[j]) + (w[j] >>> 0);
				t2 = sigma0 + maj;

				h = g;
				g = f;
				f = e;
				e = (d + t1) >>> 0;
				d = c;
				c = b;
				b = a;
				a = (t1 + t2) >>> 0;

			}

			H[0] += a;
			H[1] += b;
			H[2] += c;
			H[3] += d;
			H[4] += e;
			H[5] += f;
			H[6] += g;
			H[7] += h;

		}

		return H;

	}
	
	var digestbytes = util.wordsToBytes(_sha256());
	return options && options.asBytes ? digestbytes :
	       options && options.asString ? util.Binary.bytesToString(digestbytes) :
	       util.bytesToHex(digestbytes);
}

/**
 * @param hasher Hasher type
 * @param message A salt
 * @param key Another salt
 * @param options Return type of String | Bytes | Hex, default is Bytes
 * 
 * @example  
 * 		scopes.NCRYPT.HMAC(scopes.NCRYPT.MD5,"Message","some key")
 *
 * @properties={typeid:24,uuid:"28E9A2F4-C10B-4053-BE2E-7A2E2A0E99AA"}
 */
function HMAC (hasher, message, key, options) {

	// Convert to byte arrays
	if (message.constructor == String) message = util.UTF8.stringToBytes(message);
	if (key.constructor == String) key = util.UTF8.stringToBytes(key);
	/* else, assume byte arrays already */

	// Allow arbitrary length keys
	if (key.length > hasher._blocksize * 4)
		key = hasher(key, { asBytes: true });

	// XOR keys with pad constants
	var okey = key.slice(0),
	    ikey = key.slice(0);
	for (var i = 0; i < hasher._blocksize * 4; i++) {
		okey[i] ^= 0x5C;
		ikey[i] ^= 0x36;
	}

	var hmacbytes = hasher(okey.concat(hasher(ikey.concat(message), { asBytes: true })), { asBytes: true });

	return options && options.asBytes ? hmacbytes :
	       options && options.asString ? Binary.bytesToString(hmacbytes) :
	       util.bytesToHex(hmacbytes);
}

/**
 * @param password
 * @param salt
 * @param keylen
 * @param options
 * 
 * @example
 * 		var salt = scopes.NCRYPT.util.randomBytes(128)
 * 		scopes.NCRYPT.PBKDF2("password", salt, 128) // SHA1 default hasher
 * 		scopes.NCRYPT.PBKDF2("password",salt,128,{ hasher : scopes.NCRYPT.SHA256 })
 * 		scopes.NCRYPT.PBKDF2("password",salt,128,{ iterations : 100 })
 * 		scopes.NCRYPT.PBKDF2("password",salt,128,{  hasher : scopes.NCRYPT.SHA256, iterations : 100, asBytes : true })
 *
 * @properties={typeid:24,uuid:"6DC47B78-8F44-442F-A6EF-ECE66EA2CBC7"}
 */
function PBKDF2 (password, salt, keylen, options) {

	// Convert to byte arrays
	if (password.constructor == String) password = util.UTF8.stringToBytes(password);
	if (salt.constructor == String) salt = util.UTF8.stringToBytes(salt);
	/* else, assume byte arrays already */

	// Defaults
	var hasher = options && options.hasher || SHA1,
	    iterations = options && options.iterations || 1;

	// Pseudo-random function
	function PRF(modSalt) {
		return HMAC(hasher, modSalt, password, { asBytes: true });
	}

	// Generate key
	var derivedKeyBytes = [],
	    blockindex = 1;
	while (derivedKeyBytes.length < keylen) {
		var block = PRF(salt.concat(util.wordsToBytes([blockindex])));
		for (var u = block, i = 1; i < iterations; i++) {
			u = PRF(u);
			for (var j = 0; j < block.length; j++) block[j] ^= u[j];
		}
		derivedKeyBytes = derivedKeyBytes.concat(block);
		blockindex++;
	}

	// Truncate excess bytes
	derivedKeyBytes.length = keylen;

	return options && options.asBytes ? derivedKeyBytes :
	       options && options.asString ? util.Binary.bytesToString(derivedKeyBytes) :
	       util.bytesToHex(derivedKeyBytes);

}





