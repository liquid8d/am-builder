//get an AMObject instance
function getInstance(val) {
    if ( val === "AMText" ) return new AMText()
    else if ( val === "AMImage" ) return new AMImage()
    else if ( val === "AMArtwork" ) return new AMArtwork()
    else if ( val === "AMListBox" ) return new AMListBox()
    else if ( val === "AMClone" ) return new AMClone()
    else if ( val === "AMSurface" ) return new AMSurface()
    throw new Error(`Could not instantiate ${value}`);
}

//base AMObject class
class AMObject {
    constructor() {
        this.id = 0
        this.label = 'Object'
        this.type = 'Object'
        this.el = null
        //editor options for this object
        this.editor = {
            locked: false,
            hidden: false
        }
        //currently stored values for all props
        this.values = {}
        //stored values for each aspect supported by the editor
        this.aspect_values = {}
        //properties for this object
        this.props = {
            x: { label: 'x', type: 'number', default: 0, size: 4 },
            y: { label: 'y', type: 'number', default: 0, size: 4 },
            width: { label: 'width', type: 'number', default: 100, size: 4 },
            height: { label: 'height', type: 'number', default: 100, size: 4 },
            visible: { label: 'visible', type: 'bool', default: true },
            rotation: { label: 'rotation', type: 'range', default: 0, min: 0, max: 359 },
            zorder: { label: 'zorder', type: 'number', default: -1, min: -1, max: 99, size: 2 }
        }
        //set current value for all props to the defaults
        Object.keys(this.props).forEach(function(key) {
            this.values[key] = this.props[key].default
        }.bind(this))
    }
}

//code to create/initialize an html element that represents the object
AMObject.prototype.createElement = function() {
    //this.el = document.create('div')
}

//code to update the element when properties change
AMObject.prototype.updateElement = function() {
    //this.el.style.display = 'none'
}

//code to create the object in squirrel
AMObject.prototype.toSquirrel = function() {
    //return 'local obj = fe.add_obj(1,1,1,1)' +
    //          obj.prop = val
}

//get adjust index for object data
AMObject.prototype.getAdjustedIndex = function(index_offset) {
    //not working, need to loop or not loop?
    var current_index = data.listIndex + index_offset
    var currentDisplay = data.displays[data.displayIndex]
    var max = currentDisplay.romlist.length - 1
    if ( current_index < 0 ) current_index = Math.abs( Math.floor( max / current_index ) ) - 1
    if ( current_index > max ) current_index = Math.abs( Math.floor( current_index / max ) ) - 1
    return current_index
}

//replaces AM magic tokens in text
AMObject.prototype.magicTokens = function( text, index_offset ) {
    //replace magic tokens
    if ( window.data === undefined ) return text
    if ( index_offset == undefined ) index_offset = 0
    var currentDisplay = data.displays[data.displayIndex]
    var currentFilter = currentDisplay.filters[data.filterIndex]
    var currentRom = currentDisplay.romlist[ this.getAdjustedIndex(index_offset) ]
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
}

//this allows you to colorize images with rgb values by adding filter: url(#idFromHere) to the image
AMObject.prototype.createFilterColor = function( id, r, g, b) {
    var svg = document.getElementById('color-filter') || document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.id = 'color-filter'
    svg.classList.add('defs-only')
    document.body.appendChild(svg)
    if ( !svg ) return
    //r 0 0 0 0 0 g 0 0 0 0 0 b 0 0 0 0 0 1 0
    var color = r + ' 0 0 0 0 0 ' + g + ' 0 0 0 0 0 ' + b + ' 0 0 0 0 0' + ' 1 0'
    var filter = svg.getElementById(id) || document.createElementNS('http://www.w3.org/2000/svg', 'filter')
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
}

AMObject.prototype.transform = function() {
    //transforms
    if ( !this.el ) return
    var transform = 'translate(' + this.values.x + 'px, ' + this.values.y + 'px)'
    transform += ( this.values.rotation ) ? 'rotate(' + this.values.rotation + 'deg)' : ''
    if ( this.values.skew_x || this.values.skew_y ) {
        //px to deg?? http://inamidst.com/stuff/notes/csspx
        var skew_x = ( ( Math.atan( parseFloat() / 5376) * 2 ) * 180 / Math.PI ).toFixed(3)
        var skew_y = ( ( Math.atan( parseFloat(this.values.skew_x) / 5376) * 2 ) * 180 / Math.PI ).toFixed(3)
        transform += ' skew(' + ( this.values.skew_x / 2 ) + 'deg, ' + ( this.values.skew_y / 2 ) + 'deg)'
    }
    this.el.style.transform = transform
    this.el.style.transformOrigin = '0 0'
}

//create stretched sprites - scales spritesheet, then clips a specific sprite for subimg
AMObject.prototype.resizeSprite = function( img, width, height, subimg_x, subimg_y, subimg_width, subimg_height ) {
    var scaleW = width / subimg_width,
        scaleH = height / subimg_height,
        adjWidth = img.naturalWidth * scaleW,
        adjHeight = img.naturalHeight * scaleH,
        pos = {
            x: subimg_x * scaleW,
            y: subimg_y * scaleH,
            width: subimg_width * scaleW,
            height: subimg_height * scaleH,
        }
    img.style.width = adjWidth + 'px'
    img.style.height = adjHeight + 'px'
    img.style.clip = 'rect( ' + pos.y + 'px ' + ( pos.x + pos.width ) + 'px ' + ( pos.y + pos.height ) + 'px ' + pos.x + 'px )'
    //update existing translate or set it
    img.style.transform = 'translate( ' + -pos.x + 'px, ' + -pos.y + 'px )'
    img.style.transformOrigin = '0 0'
}
    