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
        var video = document.createElement('video')
        video.style.display = 'none'
        video.style.pointerEvents = 'none'
        video.style.width = '100%'
        video.style.height = '100%'
        this.el.appendChild(video)
    }

    updateElement() {
        super.updateElement()

        //we added child elements for video or subimg, these are shown/hidden depending on the artwork type ( video or subimg )
        var img = this.el.querySelector('img')
        var video = this.el.querySelector('video')

        var currentDisplay = data.displays[data.displayIndex]
        var currentRom = currentDisplay.romlist[ ( data.listIndex + this.values.index_offset ) ]
        //if video_playing is enabled or if the ImagesOnly flag is set
        var imagesOnly = this.props.video_flags.values[0].checked.includes(this.values.video_flags)
        if ( this.values.video_playing && !imagesOnly ) {
            //use video element for artwork video
            img.style.display = 'none'
            video.style.display = ''
            var newSrc = 'data/media/' + currentDisplay.name + '/video/' + currentRom.Name + '.mp4'
            var currentSrc = video.src.substring( video.src.length - newSrc.length, video.src.length)
            if ( currentSrc != newSrc ) video.src = newSrc
            video.setAttribute('type', 'video/mp4')
            video.style.pointerEvents = 'none'
            video.style.width = '100%'
            video.style.height = '100%'
            video.style.objectFit = ( this.values.preserve_aspect_ratio ) ? 'contain' : 'fill'
            var loop = !this.props.video_flags.values[1].checked.includes(this.values.video_flags)
            if ( loop ) video.setAttribute('loop', true); else video.removeAttribute('loop')
            if ( loop && video.currentTime == 0 ) video.play()
            var autoplay = !this.props.video_flags.values[2].checked.includes(this.values.video_flags) 
            if ( autoplay ) { video.play() } else { video.pause(); video.currentTime = 0 }
            var audio = !this.props.video_flags.values[3].checked.includes(this.values.video_flags)
            video.muted = ( audio ) ? false : true
        } else {
            video.style.display = 'none'
            video.src = ''
            //artwork images
            var is_subimg = ( this.values.subimg_x + this.values.subimg_y + this.values.subimg_width + this.values.subimg_height != 0 ) ? true : false
            if ( is_subimg ) {
                this.el.style.overflow = 'hidden'
                img.style.display = ''
                img.src = 'data/media/' + currentDisplay.name + '/' + this.values.file_name + '/' + currentRom.Name + '.png'
                this.resizeSprite(  img,
                                    this.values.width,
                                    this.values.height,
                                    this.values.subimg_x,
                                    this.values.subimg_y,
                                    this.values.subimg_width,
                                    this.values.subimg_height )
            } else {
                //standard artwork, use background instead for auto scaling
                img.style.display = 'none'
                this.el.style.overflow = ''
                this.el.style.backgroundImage = 'url(\'data/media/' + currentDisplay.name + '/' + this.values.file_name + '/' + currentRom.Name + '.png\')'
                this.el.style.backgroundRepeat = 'no-repeat'
                this.el.style.backgroundPosition = ( this.values.preserve_aspect_ratio ) ? 'center' : '0 0'
                this.el.style.backgroundSize = ( this.values.preserve_aspect_ratio ) ? 'contain' : '100% 100%'
            }
        }
    }

    toSquirrel() {
        //note: [surface] [object] and [props] are dynamically replaced as object variables respectively
        var code = ''
            if ( this.editor.clone ) {
                code += 'local [object] = fe.add_clone([clone])' + '\n'
            } else {
                code += 'local [object] = [surface].add_artwork( [props].file_name, -1, -1, 1, 1)' + '\n'
            }
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