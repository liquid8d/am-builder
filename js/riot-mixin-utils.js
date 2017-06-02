riot.mixin('utils', {
    save : function (id, what) {
        if ( localStorage )
            localStorage.setItem( id, JSON.stringify( what ) )
    },
    load: function (id) {
        var val = null
        if ( localStorage && localStorage.getItem(id) )
            val = JSON.parse( localStorage.getItem(id) )
        return val
    },
    toggleFullscreen: function(el, forced) {
        //launch specified element in fullscreen, default to document.body
        forced = forced || false
        var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
            (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
            (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
            (document.msFullscreenElement && document.msFullscreenElement !== null);

        if (!isInFullScreen || forced) {
            el = ( el ) ? el : document.body
            if (el.requestFullscreen) {
                el.requestFullscreen();
            } else if (el.mozRequestFullScreen) {
                el.mozRequestFullScreen();
            } else if (el.webkitRequestFullScreen) {
                el.webkitRequestFullScreen();
            } else if (el.msRequestFullscreen) {
                el.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
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
    }
})