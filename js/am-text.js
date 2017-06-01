function AMText(x, y, width, height) {
    AMObject.call(this, x, y, width, height)

    //set defaults
    this.type = 'AMText'
    this.label = 'Text'

    var props = {
        msg: { label: 'msg', type: 'dropdown', default: '[Title]', values: [ '[DisplayName]', '[ListSize]', '[ListEntry]', '[FilterName]', '[Search]', '[SortName]', '[Name]', '[Title]', '[Emulator]', '[CloneOf]', '[Year]', '[Manufacturer]', '[Category]', '[Players]', '[Rotation]', '[Control]', '[Status]', '[DisplayCount]', '[DisplayType]', '[AltRomname]', '[AltTitle]', '[PlayedTime]', '[PlayedCount]', '[SortValue]', '[System]', '[SystemN]', '[Overview]' ] },
        font: { label: 'font', type: 'file', default: '', values: 'font' },
        charsize: { label: 'charsize', type: 'number', default: 16, min: -1, max: 100 },
        align: { label: 'align', type: 'select', default: 'Align.Left', values: [ 'Align.Left', 'Align.Centre', 'Align.Right' ] },
        style: { label: 'style', type: 'multiselect', default: 0, values: [ { label: 'Bold', value: 1, checked: [ 1,3,5,7 ] }, { label: 'Italic', value: 2, checked: [2,3,6,7] }, { label: 'Underlined', value: 4, checked: [4,5,6,7] } ] },
        word_wrap: { label: 'word_wrap', type: 'bool', default: false },
        red: { label: 'red', type: 'range', default: 255, min: 0, max: 255 },
        green: { label: 'green', type: 'range', default: 255, min: 0, max: 255 },
        blue: { label: 'blue', type: 'range', default: 255, min: 0, max: 255 },
        alpha: { label: 'alpha', type: 'range', default: 255, min: 0, max: 255 },
        bg_red: { label: 'bg_red', type: 'range', default: 0, min: 0, max: 255 },
        bg_green: { label: 'bg_green', type: 'range', default: 0, min: 0, max: 255 },
        bg_blue: { label: 'bg_blue', type: 'range', default: 0, min: 0, max: 255 },
        bg_alpha: { label: 'bg_alpha', type: 'range', default: 0, min: 0, max: 255 },
        index_offset: { label: 'index_offset', type: 'number', default: 0 },
        filter_offset: { label: 'filter_offset', type: 'number', default: 0 },
        shader: { label: 'shader', type: 'select', default: '', values: [] }
    }

    Object.keys(props).forEach(function(key) {
        this.props[key] = props[key]
        this.values[key] = props[key].default
    }.bind(this))

    //create the html element
    this.createElement = function() {
        this.el = document.createElement('span')
        this.el.classList.add('text')
        this.el.style.overflow = 'hidden'
    }

    //update html element to match properties
    this.updateElement = function() {
        this.el.innerHTML = utils.magicTokens( this.values.msg, this.values.index_offset )
        //transforms
        var transform = 'translate(' + this.values.x + 'px, ' + this.values.y + 'px)'
        transform += ( this.values.rotation ) ? 'rotate(' + this.values.rotation + 'deg)' : ''
        this.el.style.transform = transform
        this.el.style.transformOrigin = '0 0'

        this.el.style.width = this.values.width + 'px'
        this.el.style.height = this.values.height + 'px'
        this.el.style.display = ( this.values.visible && !this.hidden ) ? ( this.values.word_wrap ) ? 'inline-block' : 'block' : 'none'
        if ( this.values.zorder >= 0 ) this.el.style.zIndex = this.values.zorder

        var alpha = ( this.values.alpha > 0 ) ? this.values.alpha / 255 : 0
        this.el.style.color = 'rgba(' + this.values.red + ',' + this.values.green + ',' + this.values.blue + ', ' + alpha + ')'
        var bg_alpha = ( this.values.bg_alpha > 0 ) ? this.values.bg_alpha / 255 : 0
        this.el.style.backgroundColor = 'rgba(' + this.values.bg_red + ',' + this.values.bg_green + ',' + this.values.bg_blue + ',' + bg_alpha + ')'
        this.el.style.textAlign = ( this.values.align == 'Align.Centre' ) ? 'center' : ( this.values.align == 'Align.Right' ) ? 'right' : 'left'
        this.el.style.fontFamily = this.values.font
        this.el.style.fontSize = ( this.values.charsize != -1 ) ? this.values.charsize + 'px' : '100vh'
        this.el.style.whiteSpace = ( this.values.word_wrap ) ? 'normal' : 'nowrap'
        this.el.style.fontWeight = ( props.style.values[0].checked.includes(this.values.style) ) ? 'bold' : 'normal'
        this.el.style.fontStyle = ( props.style.values[1].checked.includes(this.values.style) ) ? 'italic' : ''
        this.el.style.textDecoration = ( props.style.values[2].checked.includes(this.values.style) ) ? 'underline' : ''
    }

    //export object to squirrel code
    this.toSquirrel = function() {
        var code = ''
            //note: '[object]' and '[props]' are dynamic and are replaced with the object values respectively
            code += 'local [object] = fe.add_text( "' + this.values.msg + '", -1, -1, 1, 1 )' + '\n'
            code += '   foreach( key, val in props[aspect]["[object]"] ) try { if ( key != "zorder" && key != "shader" ) [object][key] = val } catch(e) { print("error setting property: " + key) }'
        if ( this.values.zorder >= 0 )
            code += '   [object].zorder = ' + this.values.zorder + '\n'
        return code
    }
}
AMText.prototype = Object.create(AMObject.prototype)
AMText.prototype.constructor = AMText