function AMImage(file_name,x, y, width, height, artwork) {
    AMObject.call(this, x, y, width, height)

    //set defaults
    this.type = 'AMImage'
    this.label = 'Image'
    this.isArtwork = artwork || false

    var props = {
        file_name: { label: 'file_name', type: 'dropdown', default: 'missing.png', values: '[media]' },
        red: { label: 'red', type: 'number', default: 255, min: 0, max: 255 },
        green: { label: 'green', type: 'number', default: 255, min: 0, max: 255 },
        blue: { label: 'blue', type: 'number', default: 255, min: 0, max: 255 },
        alpha: { label: 'alpha', type: 'number', default: 255, min: 0, max: 255 },
        index_offset: { label: 'index_offset', type: 'number', default: 0 },
        filter_offset: { label: 'filter_offset', type: 'number', default: 0 },
        skew_x: { label: 'skew_x', type: 'number', default: 0 },
        skew_y: { label: 'skew_y', type: 'number', default: 0 },
        pinch_x: { label: 'pinch_x', type: 'number', default: 0 },
        pinch_y: { label: 'pinch_y', type: 'number', default: 0 },
        subimg_x: { label: 'subimg_x', type: 'number', default: 0 },
        subimg_y: { label: 'subimg_y', type: 'number', default: 0 },
        subimg_width: { label: 'subimg_width', type: 'number', default: 0 },
        subimg_height: { label: 'subimg_height', type: 'number', default: 0 },
        origin_x: { label: 'origin_x', type: 'number', default: 0 },
        origin_y: { label: 'origin_y', type: 'number', default: 0 },
        video_flags: { label: 'video_flags', type: 'select', default: 'Vid.Default', values: [ 'Vid.Default', 'Vid.Default', 'Vid.NoAudio', 'Vid.NoAutoStart', 'Vid.NoLoop' ] },
        video_playing: { label: 'video_playing', type: 'bool', default: false },
        preserve_aspect_ratio: { label: 'preserve_aspect_ratio', type: 'bool', default: false },
        smooth: { label: 'smooth', type: 'bool', default: false },
        trigger: { label: 'trigger', type: 'text', default: '' },
        shader: { label: 'shader', type: 'text', default: '' }
    }
    
    Object.keys(props).forEach(function(key) {
        this.props[key] = props[key]
        this.values[key] = props[key].default
    }.bind(this))

    this.createElement = function() {
        this.el = document.createElement('div')
        this.el.style.cursor = 'default'
        this.el.classList.add('image')
        this.el.style.backgroundRepeat = 'no-repeat'

        if ( this.isArtwork ) {
            console.log('adding artwork' )
            this.type = 'AMArtwork'
            this.label = 'Artwork'
            this.props.file_name = { label: 'file_name', type: 'dropdown', default: 'snap', values: [ 'fanart', 'flyer', 'marquee', 'snap', 'video', 'wheel' ] }
            this.values.file_name = this.props.file_name.default
            console.dir(this.props)
        }
    }

    this.updateElement = function() {
        this.el.style.left = this.values.x + 'px'
        this.el.style.top = this.values.y + 'px'
        this.el.style.width = ( this.values.width ) ? this.values.width + 'px' : 'auto'
        this.el.style.height = ( this.values.height  ) ? this.values.height + 'px' : 'auto'
        this.el.style.display = ( this.values.visible ) ? 'block' : 'none'
        this.el.style.transform = ( this.values.rotation ) ? 'rotate(' + this.values.rotation + 'deg)' : ''
        this.el.style.zIndex = this.values.zorder
        
        var media = layout.findMedia(this.values.file_name, 'name')
        var url = ( media ) ? media.data : ''
        if ( data && this.isArtwork ) {
            var currentDisplay = data.displays[data.displayIndex]
            var currentRom = currentDisplay.romlist[ ( data.listIndex + this.values.index_offset ) ]
            url = 'data/media/' + currentDisplay.name + '/' + this.values.file_name + '/' + currentRom.Name + '.png'
        }
        this.el.style.backgroundImage = 'url(\'' + url + '\')'
        
        //colorize image with svg filter
        var red = (this.values.red / 255 ) || 0
        var green = ( this.values.green / 255 ) || 0
        var blue = ( this.values.blue / 255 ) || 0
        riot.mixin('utils').createFilterColor('object-filter-' + this.id, red, green, blue)
        this.el.style.filter = 'url(\'#object-filter-' + this.id + '\')'
        
        var alpha = ( this.values.alpha > 0 ) ? this.values.alpha / 255 : 0
        this.el.style.opacity = alpha
        if ( this.values.preserve_aspect_ratio ) {
            this.el.style.backgroundSize = ''
            this.el.style.backgroundPosition = 'center'
        } else {
            this.el.style.backgroundPosition = ''
            this.el.style.backgroundSize = '100% 100%'
        }
        this.el.draggable = false
    }

    this.toSquirrel = function() {
        var code = ''
            if ( this.isArtwork ) {
                code += 'local [object] = fe.add_artwork( [props].file_name, -1, -1, 1, 1)' + '\n'
            } else {
                code += 'local [object] = fe.add_image( "resources/" + [props].file_name, -1, -1, 1, 1)' + '\n'
            }
            Object.keys(this.props).forEach(function(key) {
                switch(key) {
                    case 'video_playing':
                    case 'video_flags':
                    case 'subimg_x':
                    case 'subimg_y':
                    case 'subimg_width':
                    case 'subimg_height':
                    case 'shader':
                    case 'trigger':
                        //don't use yet
                        break
                    default:
                       code += '   [object].' + key + ' = [props].' + key + '\n'
                       break
                }
            })
        return code
    }
}

AMImage.prototype = Object.create(AMObject.prototype)
AMImage.prototype.constructor = AMImage