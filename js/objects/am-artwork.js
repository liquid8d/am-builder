class AMArtwork extends AMImage {
    constructor() {
        super()
        this.type = 'AMArtwork'
        this.label = 'Artwork'
        this.props.file_name = { label: 'file_name', type: 'dropdown', default: 'snap', values: [ 'flyer', 'marquee', 'snap', 'wheel', 'fanart' ] }
        this.values.file_name = this.props.file_name.default
    }

    createElement() {
        super.createElement()
        this.el.classList.add('artwork')
    }

    updateElement() {
        super.updateElement()

        //we add child elements for video or subimg, these are added depending on the artwork type ( video or subimg )
        var img = this.el.querySelector('img')
        if ( img ) this.el.removeChild(img)
        var video = this.el.querySelector('video')
        if ( video ) this.el.removeChild(video)

        var currentDisplay = data.displays[data.displayIndex]
        var currentRom = currentDisplay.romlist[ ( data.listIndex + this.values.index_offset ) ]
        //if video_playing is enabled or if the ImagesOnly flag is set
        if ( this.values.video_playing && !this.props.video_flags.values[0].checked.includes(this.values.video_flags) ) {
            //add a video element for artwork video
            video = document.createElement('video')
            video.src = 'data/media/' + currentDisplay.name + '/video/' + currentRom.Name + '.mp4'
            video.setAttribute('type', 'video/mp4')
            video.style.pointerEvents = 'none'
            video.style.width = '100%'
            video.style.height = '100%'
            video.style.objectFit = ( this.values.preserve_aspect_ratio ) ? 'contain' : 'fill'
            //if not noloop
            if ( !this.props.video_flags.values[1].checked.includes(this.values.video_flags) ) video.setAttribute('loop', true)
            //if not noautostart
            if ( !this.props.video_flags.values[2].checked.includes(this.values.video_flags) ) video.setAttribute('autoplay', true)
            //if noaudio
            if ( this.props.video_flags.values[3].checked.includes(this.values.video_flags) ) video.setAttribute('muted', true)
            this.el.appendChild(video)
        } else {
            //artwork images
            var is_subimg = ( this.values.subimg_x + this.values.subimg_y + this.values.subimg_width + this.values.subimg_height != 0 ) ? true : false
            if ( is_subimg ) {
                this.el.style.overflow = 'hidden'
                img = document.createElement('img')
                img.style.pointerEvents = 'none'
                img.style.position = 'absolute'
                img.classList.add('sprite')
                img.src = 'data/media/' + currentDisplay.name + '/' + this.values.file_name + '/' + currentRom.Name + '.png'
                this.el.appendChild(img)
                this.resizeSprite(  img,
                                    this.values.width,
                                    this.values.height,
                                    this.values.subimg_x,
                                    this.values.subimg_y,
                                    this.values.subimg_width,
                                    this.values.subimg_height )
            } else {
                //standard artwork, use background instead for auto scaling
                this.el.style.overflow = ''
                this.el.style.backgroundImage = 'url(\'data/media/' + currentDisplay.name + '/' + this.values.file_name + '/' + currentRom.Name + '.png\')'
                this.el.style.backgroundRepeat = 'no-repeat'
                this.el.style.backgroundPosition = ( this.values.preserve_aspect_ratio ) ? 'center' : '0 0'
                this.el.style.backgroundSize = ( this.values.preserve_aspect_ratio ) ? 'contain' : '100% 100%'
            }
        }
    }

    toSquirrel() {
        var code = ''
            code += 'local [object] = fe.add_artwork( [props].file_name, -1, -1, 1, 1)' + '\n'
            code += '   foreach( key, val in props[aspect]["[object]"] )\n'
            code += '      if ( key != "file_name" && key != "subimg_width" && key != "subimg_height" && key != "zorder" && key != "shader" )\n'
            code += '         try { [object][key] = val } catch(e) { print("error setting property: " + key + "\\n" ) }\n'
            if ( this.values.zorder >= 0 )
                code += '   [object].zorder = ' + this.values.zorder + '\n'
            if ( this.values.subimg_width != 0 || this.values.subimg_height != 0 ) {
                code += '   [object].subimg_width = ' + this.values.subimg_width + '\n'
                code += '   [object].subimg_height = ' + this.values.subimg_height + '\n'
            }
        return code
    }
}