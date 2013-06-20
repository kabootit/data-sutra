//
// Dust - Asynchronous Templating v0.3.0
// http://akdubya.github.com/dustjs
//
// Copyright (c) 2010, Aleksander Williams
// Released under the MIT License.
//



/**
 * @properties={typeid:35,uuid:"BF4691DF-7A03-45EB-8F3D-5DDFC451E3BB",variableType:-4}
 */
var cache = {};

/**
 * @properties={typeid:35,uuid:"B567BFF7-481E-4C9F-9551-B668D4739D58",variableType:-4}
 */
var BS = /\\/g,
    CR = /\r/g,
    LS = /\u2028/g,
    PS = /\u2029/g,
    NL = /\n/g,
    LF = /\f/g,
    SQ = /'/g,
    DQ = /"/g,
    TB = /\t/g;

/**
 * @properties={typeid:35,uuid:"BBAAF58A-6757-4C53-A008-B394FBF81FAB",variableType:-4}
 */
var HCHARS = new RegExp(/[&<>\"]/),
    AMP    = /&/g,
    LT     = /</g,
    GT     = />/g,
    QUOT   = /\"/g;

/**
 * @param name
 * @param tmpl
 *
 * @properties={typeid:24,uuid:"4A095E46-6F7C-4F49-9C96-D907AC592E16"}
 */
function register (name, tmpl) {
  if (!name) return;
  cache[name] = tmpl;
};

/**
 * @param name
 * @param context
 * @param callback
 *
 * @properties={typeid:24,uuid:"EA5805AF-44D6-493D-8069-9D98E7358E33"}
 */
function render(name, context, callback) {
  var chunk = new Stub(callback).head;
  load(name, chunk, Context.wrap(context)).end();
};

/**
 * @param name
 * @param context
 *
 * @properties={typeid:24,uuid:"82620CDD-3030-4BB0-91EC-861C741C9BF2"}
 */
function stream(name, context) {
  var strm = new Stream();
  nextTick(function() {
    load(name, strm.head, Context.wrap(context)).end();
  });
  return strm;
};

/**
 * @param source
 * @param context
 * @param callback
 *
 * @properties={typeid:24,uuid:"D82AEC80-1F8B-4151-9D91-BBCB8A231041"}
 */
function renderSource(source, context, callback) {
  return compileFn(source)(context, callback);
};

/**
 * @param source
 * @param name
 *
 * @properties={typeid:24,uuid:"3D1A1773-56D7-4056-A7B2-20246F443834"}
 */
function compileFn(source, name) {
  var tmpl = loadSource(compile(source, name));
  return function(context, callback) {
    var master = callback ? new Stub(callback) : new Stream();
    nextTick(function() {
      tmpl(master.head, Context.wrap(context)).end();
    });
    return master;
  }
};

/**
 * @param name
 * @param chunk
 * @param context
 *
 * @properties={typeid:24,uuid:"AA209F32-6D00-4BCB-977A-7D65AB4DAD72"}
 */
function load(name, chunk, context) {
  var tmpl = cache[name];
  if (tmpl) {
    return tmpl(chunk, context);
  } 
  else {
	  return chunk.map(function(chunk) {
	    onLoad(name, function(err, src) {
	      if (err) return chunk.setError(err);
	      if (!cache[name]) loadSource(compile(src, name));
	      cache[name](chunk, context).end();
	    });
	  }); 
  }
};

/**
 * @param source
 * @param path
 *
 * @properties={typeid:24,uuid:"588AA615-8765-4D3D-A2A5-6C4E957E3636"}
 */
function loadSource(source) {
  return eval(source);
};


/**
 * @param arr
 *
 * @properties={typeid:24,uuid:"DB8D2179-31F4-435C-84DF-42B11E0D9B08"}
 */
function isArray(arr) {
    return Object.prototype.toString.call(arr) == "[object Array]";
};


/**
 * @param callback
 *
 * @properties={typeid:24,uuid:"2F1D1795-9F19-4B9E-AF8C-49B3703F827F"}
 */
function nextTick(callback) {
  setTimeout(callback, 0);
}

/**
 * @param value
 *
 * @properties={typeid:24,uuid:"0B8AF369-B18A-43A5-8698-603D31816DAA"}
 */
function isEmpty(value) {
  if (isArray(value) && !value.length) return true;
  if (value === 0) return false;
  return (!value);
};

/**
 * TODO generated, please specify type and doc for the params
 * @param string
 * @param auto
 * @param filters
 *
 * @properties={typeid:24,uuid:"C96663C9-223A-4F82-B782-A1987CD9AC70"}
 */
function filter(string, auto, filters) {
  if (filters) {
    for (var i=0, len=filters.length; i<len; i++) {
      var name = filters[i];
      if (name === "s") {
        auto = null;
      } else {
        string = filters[name](string);
      }
    }
  }
  if (auto) {
    string = filters[auto](string);
  }
  return string;
};

/**
 * @properties={typeid:35,uuid:"CB41DA00-7488-413F-BF59-2299D4F05B57",variableType:-4}
 */
var filters = {
  h: function(value) { return escapeHtml(value); },
  j: function(value) { return escapeJs(value); },
  u: encodeURI,
  uc: encodeURIComponent
}

/**
 * @param global
 *
 * @properties={typeid:24,uuid:"F7196CB3-7F53-4DA1-942C-5B8724585FEF"}
 */
function makeBase(global) {
  return new Context(new Stack(), global);
}


/**
 * @properties={typeid:35,uuid:"D282EDD9-7891-450C-9FDA-0C319D17E812",variableType:-4}
 */
var Context = new function(stack, global, blocks) {
  this.stack  = stack;
  this.global = global;
  this.blocks = blocks;

	this.wrap = function(context) {
		return context;
	}

	this.get = function(key) {
	  var ctx = this.stack, value;

	  while(ctx) {
	    if (ctx.isObject) {
	      value = ctx.head[key];
	      if (!(value === undefined)) {
	        return value;
	      }
	    }
	    ctx = ctx.tail;
	  }
	  return this.global ? this.global[key] : undefined;
	};

	this.getPath = function(cur, down) {
	  var ctx = this.stack,
	      len = down.length;

	  if (cur && len === 0) return ctx.head;
	  if (!ctx.isObject) return undefined;
	  ctx = ctx.head;
	  var i = 0;
	  while(ctx && i < len) {
	    ctx = ctx[down[i]];
	    i++;
	  }
	  return ctx;
	};

	this.push = function(head, idx, len) {
	  return new Context(new Stack(head, this.stack, idx, len), this.global, this.blocks);
	};

	this.rebase = function(head) {
	  return new Context(new Stack(head), this.global, this.blocks);
	};

	this.current = function() {
	  return this.stack.head;
	};

	this.getBlock = function(key) {
	  var blocks = this.blocks;

	  if (!blocks) return;
	  var len = blocks.length, fn;
	  while (len--) {
	    fn = blocks[len][key];
	    if (fn) return fn;
	  }
	}

	this.shiftBlocks = function(locals) {
	  var blocks = this.blocks;

	  if (locals) {
	    if (!blocks) {
	      newBlocks = [locals];
	    } else {
	      newBlocks = blocks.concat([locals]);
	    }
	    return new Context(this.stack, this.global, newBlocks);
	  }
	  return this;
	}
	
}	

/**
 * @param head
 * @param tail
 * @param idx
 * @param len
 *
 * @properties={typeid:24,uuid:"36008D0E-B35E-44B1-880C-E650B28F1194"}
 */
function Stack(head, tail, idx, len) {
  this.tail = tail;
  this.isObject = !isArray(head) && head && typeof head === "object";
  this.head = head;
  this.index = idx;
  this.of = len;
}

/**
 * @param callback
 *
 * @properties={typeid:24,uuid:"ED2C5AE9-B3D5-4455-B366-191703540D56"}
 */
function Stub(callback) {
  this.head = new Chunk(this);
  this.callback = callback;
  this.out = '';

	this.flush = function() {
	  var chunk = this.head;

	  while (chunk) {
	    if (chunk.flushable) {
	      this.out += chunk.data;
	    } else if (chunk.error) {
	      this.callback(chunk.error);
	      this.flush = function() {};
	      return;
	    } else {
	      return;
	    }
	    chunk = chunk.next;
	    this.head = chunk;
	  }
	  this.callback(null, this.out);
	}

}



/**
 * @properties={typeid:24,uuid:"6DF29D27-DF10-4D30-A2BC-8437E8F3BC7A"}
 */
function Stream() {
  this.head = new Chunk(this);

	this.flush = function() {
	  var chunk = this.head;

	  while(chunk) {
	    if (chunk.flushable) {
	      this.emit('data', chunk.data);
	    } else if (chunk.error) {
	      this.emit('error', chunk.error);
	      this.flush = function() {};
	      return;
	    } else {
	      return;
	    }
	    chunk = chunk.next;
	    this.head = chunk;
	  }
	  this.emit('end');
	}

	this.emit = function(type, data) {
	  var events = this.events;

	  if (events && events[type]) {
	    events[type](data);
	  }
	}

	this.on = function(type, callback) {
	  if (!this.events) {
	    this.events = {};
	  }
	  this.events[type] = callback;
	  return this;
	}
}



/**
 * @param root
 * @param next
 * @param taps
 *
 * @properties={typeid:24,uuid:"DAD833F6-0BF4-4299-9201-FE8CA34601D2"}
 */
function Chunk(root, next, taps) {
  this.root = root;
  this.next = next;
  this.data = '';
  this.flushable = false;
  this.taps = taps;

	this.write = function(data) {
	  var taps  = this.taps;

	  if (taps) {
	    data = taps.go(data);
	  }
	  this.data += data;
	  return this;
	}

	this.end = function(data) {
	  if (data) {
	    this.write(data);
	  }
	  this.flushable = true;
	  this.root.flush();
	  return this;
	}

	this.map = function(callback) {
	  var cursor = new Chunk(this.root, this.next, this.taps),
	      branch = new Chunk(this.root, cursor, this.taps);

	  this.next = branch;
	  this.flushable = true;
	  callback(branch);
	  return cursor;
	}

	this.tap = function(tap) {
	  var taps = this.taps;

	  if (taps) {
	    this.taps = taps.push(tap);
	  } else {
	    this.taps = new Tap(tap);
	  }
	  return this;
	}

	this.untap = function() {
	  this.taps = this.taps.tail;
	  return this;
	}

	this.render = function(body, context) {
	  return body(this, context);
	}

	this.reference = function(elem, context, auto, filters) {
	  if (typeof elem === "function") {
	    elem = elem(this, context, null, {auto: auto, filters: filters});
	    if (elem instanceof Chunk) {
	      return elem;
	    }
	  }
	  if (!isEmpty(elem)) {
	    return this.write(filter(elem, auto, filters));
	  } else {
	    return this;
	  }
	};

	this.section = function(elem, context, bodies, params) {
	  if (typeof elem === "function") {
	    elem = elem(this, context, bodies, params);
	    if (elem instanceof Chunk) {
	      return elem;
	    }
	  }

	  var body = bodies.block,
	      skip = bodies['else'];

	  if (params) {
	    context = context.push(params);
	  }

	  if (isArray(elem)) {
	    if (body) {
	      var len = elem.length, chunk = this;
	      for (var i=0; i<len; i++) {
	        chunk = body(chunk, context.push(elem[i], i, len));
	      }
	      return chunk;
	    }
	  } else if (elem === true) {
	    if (body) return body(this, context);
	  } else if (elem || elem === 0) {
	    if (body) return body(this, context.push(elem));
	  } else if (skip) {
	    return skip(this, context);
	  }
	  return this;
	};

	this.exists = function(elem, context, bodies) {
	  var body = bodies.block,
	      skip = bodies['else'];

	  if (!isEmpty(elem)) {
	    if (body) return body(this, context);
	  } else if (skip) {
	    return skip(this, context);
	  }
	  return this;
	}

	this.notexists = function(elem, context, bodies) {
	  var body = bodies.block,
	      skip = bodies['else'];

	  if (isEmpty(elem)) {
	    if (body) return body(this, context);
	  } else if (skip) {
	    return skip(this, context);
	  }
	  return this;
	}

	this.block = function(elem, context, bodies) {
	  var body = bodies.block;

	  if (elem) {
	    body = elem;
	  }

	  if (body) {
	    return body(this, context);
	  }
	  return this;
	};

	this.partial = function(elem, context) {
	  if (typeof elem === "function") {
	    return this.capture(elem, context, function(name, chunk) {
	      load(name, chunk, context).end();
	    });
	  }
	  return load(elem, this, context);
	};

	this.helper = function(name, context, bodies, params) {
	  return helpers[name](this, context, bodies, params);
	};

	this.capture = function(body, context, callback) {
	  return this.map(function(chunk) {
	    var stub = new Stub(function(err, out) {
	      if (err) {
	        chunk.setError(err);
	      } else {
	        callback(out, chunk);
	      }
	    });
	    body(stub.head, context).end();
	  });
	};

	this.setError = function(err) {
	  this.error = err;
	  this.root.flush();
	  return this;
	};

}

/**
 * @properties={typeid:35,uuid:"08148929-06D4-43F2-BAA2-3C1222E47083",variableType:-4}
 */
var helpers = {
  sep: function(chunk, context, bodies) {
    if (context.stack.index === context.stack.of - 1) {
      return chunk;
    }
    return bodies.block(chunk, context);
  },

  idx: function(chunk, context, bodies) {
    return bodies.block(chunk, context.push(context.stack.index));
  }
}

/**
 * TODO generated, please specify type and doc for the params
 * @param head
 * @param tail
 *
 * @properties={typeid:24,uuid:"D9BDBF1E-6F27-482D-BBC6-BC3EB51C6E6A"}
 */
function Tap(head, tail) {
  this.head = head;
  this.tail = tail;

	this.push = function(tap) {

		this.go = function(value) {
		  var tap = this;
	
		  while(tap) {
		    value = tap.head(value);
		    tap = tap.tail;
		  }
		  return value;
		};
		
		return new Tap(tap, this);

	};

}

/**
 * @param s
 *
 * @properties={typeid:24,uuid:"37CB7EEA-257D-45CE-B149-4EC70AC0F62E"}
 */
function escapeHtml(s) {
  if (typeof s === "string") {
    if (!HCHARS.test(s)) {
      return s;
    }
    return s.replace(AMP,'&amp;').replace(LT,'&lt;').replace(GT,'&gt;').replace(QUOT,'&quot;');
  }
  return s;
};

/**
 * TODO generated, please specify type and doc for the params
 * @param s
 *
 * @properties={typeid:24,uuid:"4DEDCB1C-465F-49A6-B1EB-0EBB9A868C7B"}
 */
function escapeJs(s) {
  if (typeof s === "string") {
    return s
      .replace(BS, '\\\\')
      .replace(DQ, '\\"')
      .replace(SQ, "\\'")
      .replace(CR, '\\r')
      .replace(LS, '\\u2028')
      .replace(PS, '\\u2029')
      .replace(NL, '\\n')
      .replace(LF, '\\f')
      .replace(TB, "\\t");
  }
  return s;
};