class AMClone extends AMImage {
    constructor(parent) {
        if ( !parent ) return null
        super()
        this.label = 'Clone'
        this.type = parent.type
        this.parent = parent
    }

    createElement() {
        //clone parent properties
        Object.keys(this.parent.values).forEach(function(key) {
            this.values[key] = this.parent.values[key]
        }.bind(this))
        super.createElement()
        this.el.classList.add('clone')
        this.editor.clone = true
    }

    updateElement() {
        super.updateElement()
    }

    toSquirrel() {
        var parentId = this.parent.type + this.parent.id
        var code = ''
            code += 'local [object] = fe.add_clone(' + parentId + ')' + '\n'
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