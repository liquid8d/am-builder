function AMText(x, y, width, height) {
    AMObject.call(this, x, y, width, height)

    //set defaults
    this.type = 'AMText'
    this.label = 'Text'

    var props = {
        msg: { label: 'msg', type: 'dropdown', default: '[Title]', values: [ '[DisplayName]', '[ListSize]', '[ListEntry]', '[FilterName]', '[Search]', '[SortName]', '[Name]', '[Title]', '[Emulator]', '[CloneOf]', '[Year]', '[Manufacturer]', '[Category]', '[Players]', '[Rotation]', '[Control]', '[Status]', '[DisplayCount]', '[DisplayType]', '[AltRomname]', '[AltTitle]', '[PlayedTime]', '[PlayedCount]', '[SortValue]', '[System]', '[SystemN]', '[Overview]' ] },
        red: { label: 'red', type: 'number', default: 255, min: 0, max: 255 },
        green: { label: 'green', type: 'number', default: 255, min: 0, max: 255 },
        blue: { label: 'blue', type: 'number', default: 255, min: 0, max: 255 },
        alpha: { label: 'alpha', type: 'number', default: 255, min: 0, max: 255 },
        bg_red: { label: 'bg_red', type: 'number', default: 0, min: 0, max: 255 },
        bg_green: { label: 'bg_green', type: 'number', default: 0, min: 0, max: 255 },
        bg_blue: { label: 'bg_blue', type: 'number', default: 0, min: 0, max: 255 },
        bg_alpha: { label: 'bg_alpha', type: 'number', default: 0, min: 0, max: 255 },
        word_wrap: { label: 'word_wrap', type: 'bool', default: false },
        align: { label: 'align', type: 'select', default: 'Align.Left', values: [ 'Align.Left', 'Align.Centre', 'Align.Right' ] },
        charsize: { label: 'charsize', type: 'number', default: 16, min: -1, max: 100 },
        style: { label: 'style', type: 'select', default: 'Style.Regular', values: [ 'Style.Regular', 'Style.Bold', 'Style.Italic' ] },
        index_offset: { label: 'index_offset', type: 'number', default: 0 },
        filter_offset: { label: 'filter_offset', type: 'number', default: 0 },
        font: { label: 'font', type: 'file', default: '', values: 'font' },
        //shader: { label: 'shader', type: 'text', default: '' }
    }

    Object.keys(props).forEach(function(key) {
        this.props[key] = props[key]
        this.values[key] = props[key].default
    }.bind(this))

    //create the html element
    this.createElement = function() {
        this.el = document.createElement('span')
        this.el.style.overflow = 'hidden'
    }

    //update html element to match properties
    this.updateElement = function() {
        this.el.innerHTML = utils.magicTokens( this.values.msg, this.values.index_offset )
        this.el.style.left = this.values.x + 'px'
        this.el.style.top = this.values.y + 'px'
        this.el.style.width = this.values.width + 'px'
        this.el.style.height = this.values.height + 'px'
        this.el.style.display = ( this.values.visible ) ? ( this.values.word_wrap ) ? 'inline-block' : 'block' : 'none'
        this.el.style.transform = ( this.values.rotation ) ? 'rotate(' + this.values.rotation + 'deg)' : ''
        var alpha = ( this.values.alpha > 0 ) ? this.values.alpha / 255 : 0
        this.el.style.color = 'rgba(' + this.values.red + ',' + this.values.green + ',' + this.values.blue + ', ' + alpha + ')'
        var bg_alpha = ( this.values.bg_alpha > 0 ) ? this.values.bg_alpha / 255 : 0
        this.el.style.backgroundColor = 'rgba(' + this.values.bg_red + ',' + this.values.bg_green + ',' + this.values.bg_blue + ',' + bg_alpha + ')'
        this.el.style.textAlign = ( this.values.align == 'Align.Centre' ) ? 'center' : ( this.values.align == 'Align.Right' ) ? 'right' : 'left'
        this.el.style.fontFamily = this.values.font
        this.el.style.fontSize = ( this.values.charsize != -1 ) ? this.values.charsize + 'px' : '100vh'
        if ( this.values.zorder >= 0 ) this.el.style.zIndex = this.values.zorder
        this.el.style.whiteSpace = ( this.values.word_wrap ) ? 'normal' : 'nowrap'
        if ( this.values.style.indexOf('Style.Bold') > -1 ) this.el.style.fontWeight = 'bold'
        if ( this.values.style.indexOf('Style.Italic') > -1 ) this.el.style.fontStyle = 'italic'
        if ( this.values.style.indexOf('Style.Underlined') > -1 ) this.el.style.textDecoration = 'underline'
    }

    //export object to squirrel code
    this.toSquirrel = function() {
        var code = ''
            //note: '[object]' and '[props]' are dynamic and are replaced with the object values respectively
            code += 'local [object] = fe.add_text( "' + this.values.msg + '", -1, -1, 1, 1 )' + '\n'
            Object.keys(this.props).forEach(function(key) {
                switch(key) {
                    case 'zorder':
                        if ( this.values.zorder >= 0 ) code += '   [object].' + key + ' = [props].' + key + '\n'
                        break
                    default:
                       code += '   [object].' + key + ' = [props].' + key + '\n'
                       break
                }
            }.bind(this))
        return code
    }
}
AMText.prototype = Object.create(AMObject.prototype)
AMText.prototype.constructor = AMText