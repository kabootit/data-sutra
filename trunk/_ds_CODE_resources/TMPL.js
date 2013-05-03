/**
 * @param {String} template
 * @param {Object} data
 *
 * @properties={typeid:24,uuid:"1F159655-480C-44B8-9851-CFAD133498F1"}
 */
function tim(template, data){

    var start   = "{{",
        end     = "}}",
        path    = "[a-z0-9_][\\.a-z0-9_]*", // e.g. config.person.name
        pattern = new RegExp(start + "\\s*("+ path +")\\s*" + end, "gi"),
        undef; 

        // Merge data into the template string
        return template.replace(pattern, function(tag, token){
            path = 	token.split(".")
            var  	len = path.length,
                	lookup = data,
                	i = 0;

            for (; i < len; i++){
                lookup = lookup[path[i]];
                
                // Property not found
                if (lookup === undef){
                    throw "tim: '" + path[i] + "' not found in " + tag;
                }
                
                // Return the required value
                if (i === len - 1){
                    return lookup;
                }
            }
        });
}