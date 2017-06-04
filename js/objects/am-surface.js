class AMSurface extends AMImage {
    constructor() {
        super()
        this.label = 'Surface'
        this.type = 'AMSurface'
        this.objects = []
        this.idCounter = 0
        this.selectedObject = null
        this.editor.expanded = true
        delete this.props.file_name
        delete this.props.video_flags
        delete this.props.video_playing
    }

    createElement() {
        super.createElement()
        this.el.style.overflow = 'hidden'
        this.el.classList.add('surface')
    }

    updateElement() {
        super.updateElement()
    }
    
    toSquirrel() {
        //note: [surface] [object] and [props] are dynamically replaced as object variables respectively
        var code = ''
            if ( this.objects.length > 0 ) code += '///////////////////////////\n// BEGIN SURFACE: ' + this.id + '\n' + '///////////////////////////\n\n'
            if ( this.editor.clone ) {
                code += 'local [object] = fe.add_clone([clone])' + '\n'
            } else {
                code += 'local [object] = [surface].add_surface( [props].width, [props].height )' + '\n'
            }
            code += '   foreach( key, val in props[aspect]["[object]"] )\n'
            code += '      if ( key != "subimg_width" && key != "subimg_height" && key != "zorder" && key != "shader" )\n'
            code += '         try { [object][key] = val } catch(e) { print("error setting property: " + key + "\\n" ) }\n'
            if ( this.values.zorder >= 0 )
                code += '   [object].zorder = ' + this.values.zorder + '\n'
            if ( this.values.subimg_width != 0 || this.values.subimg_height != 0 ) {
                code += '   [object].subimg_width = ' + this.values.subimg_width + '\n'
                code += '   [object].subimg_height = ' + this.values.subimg_height + '\n'
            }
            code += '\n'
            for ( var i = 0; i < this.objects.length; i++) {
                //var objId = this.objects[i].id.substring(0, this.objects[i].id.indexOf('-'))
                var childCode = utils.replaceAll( this.objects[i].toSquirrel(), '[surface]', ( this.objects[i].editor.surface ) ? this.objects[i].editor.surface : 'fe' )
                    childCode = utils.replaceAll( childCode, '[clone]', this.objects[i].editor.clone )
                    childCode = utils.replaceAll( childCode, '[object]', this.objects[i].id )
                    childCode = utils.replaceAll( childCode, '[props]', 'props[aspect]["' + this.objects[i].id + '"]' )
                code += childCode + '\n'
            }
            if ( this.objects.length > 0 ) code += '//////////////////////////////////////////////////////\n\n'
            return code
    }

    //add AM objects
    addObject(obj) {
        if ( !obj ) return
        //console.log('adding object')
        obj.id = this.id + '_' + obj.type + this.idCounter
        obj.editor.surface = this.id
        this.idCounter++
        obj.label = obj.label || obj.type
        this.objects.push( obj )

        obj.createElement()
        obj.el.setAttribute('data-id', obj.id)
        obj.el.classList.add('object')
        obj.updateElement()

        this.el.appendChild( obj.el )
        return obj
    }

    deleteObject(obj) {
        //TODO
    }

    unselectObject(e) {
        //TODO
    }

    selectObject(e) {
        this.unselectObject()
        this.selectedObject = this.findObjectByEl(el)
        if ( this.selectedObject ) {
            this.selectedObject.el.classList.add('selected')
            this.trigger('object-selected')
        }
    }

    //find object
    findObject(e) {
        if ( !e.target ) return
        this.objects.forEach(function(obj) {
            if ( e.target.getAttribute('data-id') == obj.id ) return obj
        })
        return null
    }
}
