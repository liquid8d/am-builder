riot.mixin('utils', {
    fetch: function(url, opts) {
        if (!url) return
        opts.url = url
        if ( !opts.method ) opts.method = 'GET'
        if ( !opts.timeout ) opts.timeout = 5000
        if (opts.begin) opts.begin(url, opts)
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            //console.log(xhr.readyState + ": " + xhr.status)
            //console.log(xhr.readyState + ':' + xhr.status + ':' + xhr.responseText)
            var response = {}
            if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText) {
                response.status = xhr.status
                response.data = ( opts.json ) ? JSON.parse(xhr.responseText) : xhr.responseText
                if ( opts.complete ) opts.complete(response)
            } else if ( xhr.readyState == 4 && xhr.status == 404 ) {
                response.status = xhr.status
            }
        }
        xhr.open( opts.method, url, true)
        xhr.onerror = function(){ if ( opts.error ) opts.error(xhr.status) }
        if ( opts.headers ) {
            Object.keys(opts.headers).forEach(function(key) {
                console.log('adding header ' + key + ' ' + opts.headers[key] )
                try {
                    xhr.setRequestHeader( key, opts.headers[key])
                } catch( e ) {
                    console.dir(e)
                    console.log('error adding header ' + key)
                }
            })
        }
        if ( opts.method == 'POST' ) {
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
            if ( opts.data ) xhr.send(opts.data); else xhr.send()
        } else {
            xhr.send()
        }
    },
    replaceAll: function (str, find, replace) {
        return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
    },
    fileExists: function( url, responseFunc ) {
        riot.mixin('utils').fetch(url, {
            complete: function(response) {
                responseFunc.call(this, true)
            },
            error: function(status) {
                responseFunc.call(this, false)
            }
        })
    },
    loadCss: function(url) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    },
    //replace magic tokens
    magicTokens: function( text, index_offset ) {
        if ( index_offset == undefined ) index_offset = 0
        if ( !data ) return text
        var currentDisplay = data.displays[data.displayIndex]
        var currentRom = currentDisplay.romlist[ utils.getAdjustedIndex(index_offset) ]
        return text.replace('[Title]', currentRom.Title)
                   .replace('[ListSize]', currentDisplay.romlist.length )
                   .replace('[ListEntry]', data.listIndex )
                   .replace('[Emulator]', currentRom.Emulator )
                   .replace('[Name]', currentRom.Name )
                   .replace('[Year]', currentRom.Year )
                   .replace('[CloneOf]', currentRom.CloneOf )
                   .replace('[Manufacturer]', currentRom.Manufacturer )
                   .replace('[Category]', currentRom.Category )
                   .replace('[Players]', currentRom.Players )
                   .replace('[Rotation]', currentRom.Rotation )
    },
    getAdjustedIndex: function(index_offset) {
        //not working, need to loop or not loop?
        var current_index = data.listIndex + index_offset
        var currentDisplay = data.displays[data.displayIndex]
        var max = currentDisplay.romlist.length - 1
        if ( current_index < 0 ) current_index = Math.abs( Math.floor( max / current_index ) ) - 1
        if ( current_index > max ) current_index = Math.abs( Math.floor( current_index / max ) ) - 1
        return current_index
    }
})