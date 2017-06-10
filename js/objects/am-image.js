class AMImage extends AMObject {
    constructor() {
        super()
        this.type = 'AMImage'
        this.label = 'Image'
        var imageProps = {
            file_name: { label: 'file_name', type: 'file', default: 'pixel.png', values: 'media' },
            preserve_aspect_ratio: { label: 'preserve_aspect_ratio', type: 'bool', default: false },
            video_flags: { label: 'video_flags', type: 'multiselect', default: 0, values: [ { label: 'ImagesOnly', value: 1, checked: [1,3,5,7,9,11,13,15] }, { label: 'NoLoop', value: 2, checked: [2,3,6,7,10,11,14,15] }, { label: 'NoAutoStart', value: 4, checked: [4,5,6,7,12,13,14,15] }, { label: 'NoAudio', value: 8, checked: [8,9,10,11,12,13,14,15] }] },
            video_playing: { label: 'video_playing', type: 'bool', default: false },
            smooth: { label: 'smooth', type: 'bool', default: true },
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
            skew_x: { label: 'skew_x', type: 'range', default: 0, min: -180, max: 180 },
            skew_y: { label: 'skew_y', type: 'range', default: 0, min: -180, max: 180 },
            pinch_x: { label: 'pinch_x', type: 'number', default: 0 },
            pinch_y: { label: 'pinch_y', type: 'number', default: 0 },
            index_offset: { label: 'index_offset', type: 'number', default: 0 },
            filter_offset: { label: 'filter_offset', type: 'number', default: 0 },
            shader: { label: 'shader', type: 'select', default: '', values: [] }
        }
        //set current value for all props to the defaults
        Object.keys(imageProps).forEach(function(key) {
            this.props[key] = imageProps[key]
            this.values[key] = imageProps[key].default
        }.bind(this))
    }

    createElement() {
        this.el = document.createElement('div')
        this.el.textAlign = 'center'
        this.el.classList.add('image')
        var img = document.createElement('img')
            img.style.display = 'none'
            img.style.pointerEvents = 'none'
            img.style.position = 'absolute'
            img.classList.add('sprite')
        this.el.appendChild(img)
    }

    updateElement() {
        this.el.style.display = ( this.values.visible && !this.editor.hidden ) ? 'block' : 'none'
        if ( this.values.zorder >= 0 ) this.el.style.zIndex = this.values.zorder

        //update object transform
        this.transform()
        this.el.style.width = this.values.width + 'px'
        this.el.style.height = this.values.height + 'px'

        //we added a child img element for subimg, this is shown/hidden depending on the image type ( standard or subimg )
        var img = this.el.querySelector('img')
        this.el.style.background = ''

        if ( this.type == "AMImage" ) {
            var file = layout.findFile(this.values.file_name, 'name')
            var is_subimg = ( this.values.subimg_x + this.values.subimg_y + this.values.subimg_width + this.values.subimg_height != 0 ) ? true : false
            if ( is_subimg ) {
                //subimg
                this.el.style.overflow = 'hidden'
                img.style.display = ''
                img.src = ( file ) ? file.data : ''
                this.resizeSprite(  img,
                                    this.values.width,
                                    this.values.height,
                                    this.values.subimg_x,
                                    this.values.subimg_y,
                                    this.values.subimg_width,
                                    this.values.subimg_height )
            } else {
                //standard image, use background instead for auto scaling
                img.style.display = ''
                this.el.style.overflow = ''
                this.el.style.background = 'url(\'' + file.data + '\') no-repeat'
                this.el.style.backgroundPosition = ( this.values.preserve_aspect_ratio ) ? 'center' : '0 0'
                this.el.style.backgroundSize = ( this.values.preserve_aspect_ratio ) ? 'contain' : '100% 100%'
                this.el.style.width = this.el.style.width
                this.el.style.height = this.el.style.height
            }
        }
        
        
        //colorize image with svg filter
        var red = (this.values.red / 255 ) || 0
        var green = ( this.values.green / 255 ) || 0
        var blue = ( this.values.blue / 255 ) || 0
        this.createFilterColor('object-filter-' + this.id, red, green, blue)
        this.el.style.filter = 'url(\'#object-filter-' + this.id + '\')'
        
        var alpha = ( this.values.alpha > 0 ) ? this.values.alpha / 255 : 0
        this.el.style.opacity = alpha
        this.el.draggable = false
    }
    
    transform() {
        //images use a point of origin for translations
        if ( !this.el ) return
        this.el.style.transformOrigin = this.values.origin_x + 'px ' + this.values.origin_y + 'px'
        var transform = 'translate(' + ( this.values.x - this.values.origin_x ) + 'px, ' + ( this.values.y - this.values.origin_y ) + 'px)'
        transform += ( this.values.rotation ) ? 'rotate(' + this.values.rotation + 'deg)' : ''
        if ( this.values.skew_x || this.values.skew_y )
            transform += ' skew(' + ( this.values.skew_x / 2 ) + 'deg, ' + ( this.values.skew_y / 2 ) + 'deg)'
        this.el.style.transform = transform
    }

    toSquirrel() {
        //note: [surface] [object] and [props] are dynamically replaced as object variables respectively
        var code = ''
            if ( this.editor.clone ) {
                code += 'local [object] = [surface].add_clone([clone])' + '\n'
            } else {
                code += 'local [object] = [surface].add_image( "resources/" + [props].file_name, -1, -1, 1, 1)' + '\n'
            }
            code += '   foreach( key, val in props[aspect]["[object]"] )\n'
           //the keys need to be set separately from other properties
            code += '   if ( key != "file_name" && key != "subimg_width" && key != "subimg_height" && key != "zorder" && key != "rotation" && key != "skew_x" && key != "skew_y" && key != "shader" )\n'
            code += '      try { [object][key] = val } catch(e) { print("error setting property: " + key + "\\n" ) }\n'
            code += '   if ( [props].zorder >= 0 ) [object].zorder = [props].zorder\n'
            code += '   if ( [props].subimg_width !=0 || [props].subimg_height != 0 ) {\n'
            code += '      [object].subimg_width = [props].subimg_width\n'
            code += '      [object].subimg_height = [props].subimg_height\n'
            code += '   }\n'
            code += '   //these have to be set after origin\n'
            code += '   [object].rotation = [props].rotation\n'
            code += '   [object].skew_x = [props].skew_x\n'
            code += '   [object].skew_y = [props].skew_y\n'
            return code
    }
}