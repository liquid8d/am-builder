function AMListBox(x, y, width, height) {
    AMObject.call(this, x, y, width, height)

    //set defaults
    this.type = 'AMListBox'
    this.label = 'Listbox'
    
    var props = {
        red: { label: 'red', type: 'range', default: 255, min: 0, max: 255 },
        green: { label: 'green', type: 'range', default: 255, min: 0, max: 255 },
        blue: { label: 'blue', type: 'range', default: 255, min: 0, max: 255 },
        alpha: { label: 'alpha', type: 'range', default: 255, min: 0, max: 255 },
        bg_red: { label: 'bg_red', type: 'range', default: 0, min: 0, max: 255 },
        bg_green: { label: 'bg_green', type: 'range', default: 0, min: 0, max: 255 },
        bg_blue: { label: 'bg_blue', type: 'range', default: 0, min: 0, max: 255 },
        bg_alpha: { label: 'bg_alpha', type: 'range', default: 0, min: 0, max: 255 },
        sel_red: { label: 'sel_red', type: 'range', default: 255, min: 0, max: 255 },
        sel_green: { label: 'sel_green', type: 'range', default: 255, min: 0, max: 255 },
        sel_blue: { label: 'sel_blue', type: 'range', default: 0, min: 0, max: 255 },
        sel_alpha: { label: 'sel_alpha', type: 'range', default: 255, min: 0, max: 255 },
        selbg_red: { label: 'selbg_red', type: 'range', default: 0, min: 0, max: 255 },
        selbg_green: { label: 'selbg_green', type: 'range', default: 0, min: 0, max: 255 },
        selbg_blue: { label: 'selbg_blue', type: 'range', default: 255, min: 0, max: 255 },
        selbg_alpha: { label: 'selbg_alpha', type: 'range', default: 255, min: 0, max: 255 },
        align: { label: 'align', type: 'select', default: 'Align.Left', values: [ 'Align.Left', 'Align.Centre', 'Align.Right' ]},
        charsize: { label: 'charsize', type: 'number', default: 16, min: -1, max: 100 },
        font: { label: 'font', type: 'file', default: '', values: 'font' },
        style: { label: 'style', type: 'select', default: 'Style.Regular', values: [ 'Style.Regular', 'Style.Bold', 'Style.Italic' ] },
        rows: { label: 'rows', type: 'number', default: 11 },
        format_string: { label: 'format_string', type: 'text', default: '[Title]' }
    }

    Object.keys(props).forEach(function(key) {
        this.props[key] = props[key]
        this.values[key] = props[key].default
    }.bind(this))

    this.createElement = function() {
        this.el = document.createElement('ul')
        this.el.classList.add('listbox')
        this.el.style.listStyle = 'none'
        this.el.whiteSpace = 'nowrap'
        this.el.style.overflow = 'hidden'
        this.el.style.margin = 0
        this.el.style.padding = 0
    }

    this.updateElement = function() {
        this.el.style.left = this.values.x + 'px'
        this.el.style.top = this.values.y + 'px'
        this.el.style.width = this.values.width + 'px'
        this.el.style.height = this.values.height + 'px'
        this.el.style.display = ( this.values.visible ) ? 'block' : 'none'
        this.el.style.transform = ( this.values.rotation ) ? 'rotate(' + this.values.rotation + 'deg)' : ''
        var alpha = ( this.values.alpha > 0 ) ? this.values.alpha / 255 : 0
        this.el.style.color = 'rgba(' + this.values.red + ',' + this.values.green + ',' + this.values.blue + ', ' + alpha + ')'
        var bg_alpha = ( this.values.bg_alpha > 0 ) ? this.values.bg_alpha / 255 : 0
        this.el.style.backgroundColor = 'rgba(' + this.values.bg_red + ',' + this.values.bg_green + ',' + this.values.bg_blue + ',' + bg_alpha + ')'
        this.el.style.textAlign = ( this.values.align == 'Align.Centre' ) ? 'center' : ( this.values.align == 'Align.Right' ) ? 'right' : 'left'
        this.el.style.fontFamily = this.values.font
        this.el.style.fontSize = ( this.values.charsize != -1 ) ? this.values.charsize + 'px' : 'initial'
        this.el.style.fontWeight = ( this.values.style.indexOf('Style.Bold') > -1 ) ? 'bold' : 'normal'
        this.el.style.fontStyle = ( this.values.style.indexOf('Style.Italic') > -1 ) ? 'italic' : ''
        if ( this.values.zorder >= 0 ) this.el.style.zIndex = this.values.zorder
        this.el.innerHTML = ''
        for ( var i = 0; i < this.values.rows; i++ ) {
            var li = document.createElement('li')
            li.innerHTML = utils.magicTokens( this.values.format_string, i )
            if ( i == 0 ) {
                li.style.backgroundColor = 'rgba(' + this.values.selbg_red + ',' + this.values.selbg_green + ',' + this.values.selbg_blue + ',' + this.values.selbg_alpha + ')'
                li.style.color = 'rgba(' + this.values.sel_red + ',' + this.values.sel_green + ',' + this.values.sel_blue + ', ' + this.values.sel_alpha + ')'
            }
            this.el.appendChild(li)
        }
    }

    this.toSquirrel = function() {
        var code = ''
            code += 'local [object] = fe.add_listbox( -1, -1, 1, 1)' + '\n'
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


AMListBox.prototype = Object.create(AMObject.prototype)
AMListBox.prototype.constructor = AMListBox