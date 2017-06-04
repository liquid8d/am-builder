class AMClone extends AMImage {
    constructor(clone) {
        if ( !clone ) return null
        super()
        this.label = 'Clone'
        this.type = clone.type
        this.editor.clone = clone
    }

    createElement() {
        //clone parent properties
        Object.keys(this.parent.values).forEach(function(key) {
            this.values[key] = this.parent.values[key]
        }.bind(this))
        super.createElement()
        this.el.classList.add('clone')
    }

    updateElement() {
        super.updateElement()
    }

    toSquirrel() {
        super.toSquirrel()
        //note: [surface] [clone] [object] and [props] are dynamically replaced as object variables respectively
        var code = ''
            code += 'local [object] = fe.add_clone([clone])' + '\n'
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