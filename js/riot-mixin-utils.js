riot.mixin('utils', {
    save : function (id, what) {
        if ( localStorage )
            localStorage.setItem( id, JSON.stringify( what ) )
        console.log('saved ' + id + ':')
        console.dir(what)
    },
    load: function (id) {
        var val = null
        if ( localStorage && localStorage.getItem(id) )
            val = JSON.parse( localStorage.getItem(id) )
        console.log('loading ' + id + ':')
        console.dir(val)
        return val
    },
    //this allows you to colorize images with rgb values by adding filter: url(#idFromHere) to the image
    createFilterColor: function( id, r, g, b) {
        var svg = document.getElementById('color-filter') || document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svg.id = 'color-filter'
        svg.classList.add('defs-only')
        document.body.appendChild(svg)
        if ( !svg ) return
        //r 0 0 0 0 0 g 0 0 0 0 0 b 0 0 0 0 0 1 0
        var color = r + ' 0 0 0 0 0 ' + g + ' 0 0 0 0 0 ' + b + ' 0 0 0 0 0' + ' 1 0'
        var filter = svg.querySelector('filter') || document.createElementNS('http://www.w3.org/2000/svg', 'filter')
            filter.id = id
            filter.setAttribute( 'color-interpolation-filters', 'sRGB')
            filter.setAttribute( 'x', 0 )
            filter.setAttribute( 'y', 0 )
            filter.setAttribute( 'width', '100%' )
            filter.setAttribute( 'height', '100%' )
            var matrix = filter.querySelector('feColorMatrix') || document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix')
            matrix.setAttribute( 'type', 'matrix' )
            matrix.setAttribute( 'values', color )
            filter.appendChild(matrix)
        svg.appendChild(filter)
    },
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
        var currentFilter = currentDisplay.filters[data.filterIndex]
        var currentRom = currentDisplay.romlist[ utils.getAdjustedIndex(index_offset) ]
        //var currentStats = ( currentRom ) ? currentDisplay.stats[currentRom.Name] : { "PlayedTime": 0, "PlayedCount": 0 }
        var currentStats = { "PlayedTime": 5423, "PlayedCount": 27 }
        return text.replace('[DisplayName]', currentDisplay.name)
                    .replace('[ListSize]', currentDisplay.romlist.length )
                    .replace('[ListEntry]', data.listIndex )
                    .replace('[FilterName]', currentFilter.name )
                    .replace('[Search]', currentDisplay.Search )
                    .replace('[SortName]', currentDisplay.SortName )
                    .replace('[Name]', currentRom.Name )
                    .replace('[Title]', currentRom.Title)
                    .replace('[Emulator]', currentRom.Emulator )
                    .replace('[CloneOf]', currentRom.CloneOf )
                    .replace('[Year]', currentRom.Year )
                    .replace('[Manufacturer]', currentRom.Manufacturer )
                    .replace('[Category]', currentRom.Category )
                    .replace('[Players]', currentRom.Players )
                    .replace('[Rotation]', currentRom.Rotation )
                    .replace('[Control]', currentRom.Control )
                    .replace('[Status]', currentRom.Status )
                    .replace('[DisplayCount]', currentRom.DisplayCount )
                    .replace('[DisplayType]', currentRom.DisplayType )
                    .replace('[AltRomname]', currentRom.AltRomname )
                    .replace('[AltTitle]', currentRom.AltTitle )
                    .replace('[PlayedTime]', currentStats.PlayedTime )
                    .replace('[PlayedCount]', currentStats.PlayedCount )
                    .replace('[SortValue]', currentDisplay.SortValue )
                    .replace('[System]', data.emulators[currentRom.Emulator].System )
                    .replace('[SystemN]', data.emulators[currentRom.Emulator].System )
                    .replace('[Overview]', "" )
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