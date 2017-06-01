function AMArtwork() {
    AMObject.call(this)

    //set defaults
    this.type = 'AMArtwork'
    this.label = 'Artwork'

    var props = {
        file_name: { label: 'file_name', type: 'dropdown', default: 'snap', values: [ 'flyer', 'marquee', 'snap', 'wheel', 'fanart' ] },
        preserve_aspect_ratio: { label: 'preserve_aspect_ratio', type: 'bool', default: false },
        video_flags: { label: 'video_flags', type: 'multiselect', default: 0, values: [ { label: 'ImagesOnly', value: 1, checked: [1,3,5,7,9,11,13,15] }, { label: 'NoLoop', value: 2, checked: [2,3,6,7,10,11,14,15] }, { label: 'NoAutoStart', value: 4, checked: [4,5,6,7,12,13,14,15] }, { label: 'NoAudio', value: 8, checked: [8,9,10,11,12,13,14,15] }] },
        video_playing: { label: 'video_playing', type: 'bool', default: false },
        smooth: { label: 'smooth', type: 'bool', default: false },
        trigger: { label: 'trigger', type: 'select', default: 'Transition.ToNewSelection', values: [ 'Transition.ToNewSelection', 'Transition.EndNavigation' ] },
        red: { label: 'red', type: 'range', default: 255, min: 0, max: 255 },
        green: { label: 'green', type: 'range', default: 255, min: 0, max: 255 },
        blue: { label: 'blue', type: 'range', default: 255, min: 0, max: 255 },
        alpha: { label: 'alpha', type: 'range', default: 255, min: 0, max: 255 },
        origin_x: { label: 'origin_x', type: 'number', default: 0 },
        origin_y: { label: 'origin_y', type: 'number', default: 0 },
        subimg_x: { label: 'subimg_x', type: 'number', default: 0 },
        subimg_y: { label: 'subimg_y', type: 'number', default: 0 },
        subimg_width: { label: 'subimg_width', type: 'number', default: 0 },
        subimg_height: { label: 'subimg_height', type: 'number', default: 0 },
        skew_x: { label: 'skew_x', type: 'number', default: 0 },
        skew_y: { label: 'skew_y', type: 'number', default: 0 },
        pinch_x: { label: 'pinch_x', type: 'number', default: 0 },
        pinch_y: { label: 'pinch_y', type: 'number', default: 0 },
        index_offset: { label: 'index_offset', type: 'number', default: 0 },
        filter_offset: { label: 'filter_offset', type: 'number', default: 0 },
        shader: { label: 'shader', type: 'select', default: '', values: [] }
    }
    
    Object.keys(props).forEach(function(key) {
        this.props[key] = props[key]
        this.values[key] = props[key].default
    }.bind(this))

    this.createElement = function() {
        this.el = document.createElement('div')
        this.el.style.textAlign = 'center'
        this.el.classList.add('artwork')
    }

    this.updateElement = function() {
        this.el.style.display = ( this.values.visible && !this.hidden ) ? 'block' : 'none'
        if ( this.values.zorder >= 0 ) this.el.style.zIndex = this.values.zorder

        //transforms
        var transform = 'translate(' + this.values.x + 'px, ' + this.values.y + 'px)'
        transform += ( this.values.rotation ) ? 'rotate(' + this.values.rotation + 'deg)' : ''
        //px to deg?? http://inamidst.com/stuff/notes/csspx
        var skew_x = ( ( Math.atan( parseFloat() / 5376) * 2 ) * 180 / Math.PI ).toFixed(3)
        var skew_y = ( ( Math.atan( parseFloat(this.values.skew_x) / 5376) * 2 ) * 180 / Math.PI ).toFixed(3)
        transform += ' skew(' + ( this.values.skew_x / 2 ) + 'deg, ' + ( this.values.skew_y / 2 ) + 'deg)'
        this.el.style.transform = transform
        this.el.style.transformOrigin = '0 0'
        
        this.el.style.width = ( this.values.width ) ? this.values.width + 'px' : 'auto'
        this.el.style.height = ( this.values.height  ) ? this.values.height + 'px' : 'auto'
        this.el.style.background = ''

        var currentDisplay = data.displays[data.displayIndex]
        var currentRom = currentDisplay.romlist[ ( data.listIndex + this.values.index_offset ) ]
        //we add child elements for video or subimg, these are removed depending on the artwork type ( video or subimg )
        var video = this.el.querySelector('video')
        var img = this.el.querySelector('img')
        //if video_playing is enabled or if the ImagesOnly flag is set
        if ( this.values.video_playing && !props.video_flags.values[0].checked.includes(this.values.video_flags) ) {
            if ( img ) this.el.removeChild(img)
            //add a video element for artwork video
            video = document.createElement('video')
            video.src = 'data/media/' + currentDisplay.name + '/video/' + currentRom.Name + '.mp4'
            video.setAttribute('type', 'video/mp4')
            video.style.pointerEvents = 'none'
            video.style.width = '100%'
            video.style.height = '100%'
            video.style.objectFit = ( this.values.preserve_aspect_ratio ) ? 'contain' : 'fill'
            //if not noloop
            if ( !props.video_flags.values[1].checked.includes(this.values.video_flags) ) video.setAttribute('loop', true)
            //if not noautostart
            if ( !props.video_flags.values[2].checked.includes(this.values.video_flags) ) video.setAttribute('autoplay', true)
            //if noaudio
            if ( props.video_flags.values[3].checked.includes(this.values.video_flags) ) video.setAttribute('muted', true)
            this.el.appendChild(video)
        } else {
            if ( video ) this.el.removeChild(video)
            //artwork images
            var is_subimg = ( this.values.subimg_x + this.values.subimg_y + this.values.subimg_width + this.values.subimg_height != 0 ) ? true : false
            if ( is_subimg ) {
                if ( !img ) {
                    img = document.createElement('img')
                    img.style.pointerEvents = 'none'
                    img.style.position = 'absolute'
                    img.classList.add('sprite')
                }
                img.src = 'data/media/' + currentDisplay.name + '/' + this.values.file_name + '/' + currentRom.Name + '.png'
                this.el.appendChild(img)
                riot.mixin('utils').resizeSprite(  img,
                                    this.values.width,
                                    this.values.height,
                                    this.values.subimg_x,
                                    this.values.subimg_y,
                                    this.values.subimg_width,
                                    this.values.subimg_height )
            } else {
                //standard artwork, use background instead for auto scaling
                this.el.style.backgroundImage = 'url(\'data/media/' + currentDisplay.name + '/' + this.values.file_name + '/' + currentRom.Name + '.png\')'
                this.el.style.backgroundRepeat = 'no-repeat'
                this.el.style.backgroundPosition = ( this.values.preserve_aspect_ratio ) ? 'center' : '0 0'
                this.el.style.backgroundSize = ( this.values.preserve_aspect_ratio ) ? 'contain' : '100% 100%'
            }
        }
        
        //colorize image with svg filter
        var red = (this.values.red / 255 ) || 0
        var green = ( this.values.green / 255 ) || 0
        var blue = ( this.values.blue / 255 ) || 0
        riot.mixin('utils').createFilterColor('object-filter-' + this.id, red, green, blue)
        this.el.style.filter = 'url(\'#object-filter-' + this.id + '\')'
        
        var alpha = ( this.values.alpha > 0 ) ? this.values.alpha / 255 : 0
        this.el.style.opacity = alpha
        this.el.draggable = false
    }

    this.toSquirrel = function() {
        var code = ''
            code += 'local [object] = fe.add_artwork( [props].file_name, -1, -1, 1, 1)' + '\n'
            code += '   foreach( key, val in props[aspect]["[object]"] ) try { if ( key != "zorder" && key != "shader" ) [object][key] = val } catch(e) { print("error setting property: " + key) }'
        if ( this.values.zorder >= 0 )
            code += '   [object].zorder = ' + this.values.zorder + '\n'
        return code
    }
}

AMArtwork.prototype = Object.create(AMImage.prototype)
AMArtwork.prototype.constructor = AMArtwork