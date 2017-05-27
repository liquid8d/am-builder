function AMListBox(x, y, width, height) {
    AMObject.call(this, x, y, width, height)

    //set defaults
    this.type = 'AMListBox'
    this.label = 'Listbox'
    
    var props = {
        red: { label: 'red', type: 'number', default: 255, min: 0, max: 255 },
        green: { label: 'green', type: 'number', default: 255, min: 0, max: 255 },
        blue: { label: 'blue', type: 'number', default: 255, min: 0, max: 255 },
        alpha: { label: 'alpha', type: 'number', default: 255, min: 0, max: 255 },
        bg_red: { label: 'bg_red', type: 'number', default: 0, min: 0, max: 255 },
        bg_green: { label: 'bg_green', type: 'number', default: 0, min: 0, max: 255 },
        bg_blue: { label: 'bg_blue', type: 'number', default: 0, min: 0, max: 255 },
        bg_alpha: { label: 'bg_alpha', type: 'number', default: 0, min: 0, max: 255 },
        sel_red: { label: 'sel_red', type: 'number', default: 255, min: 0, max: 255 },
        sel_green: { label: 'sel_green', type: 'number', default: 255, min: 0, max: 255 },
        sel_blue: { label: 'sel_blue', type: 'number', default: 0, min: 0, max: 255 },
        sel_alpha: { label: 'sel_alpha', type: 'number', default: 255, min: 0, max: 255 },
        selbg_red: { label: 'selbg_red', type: 'number', default: 0, min: 0, max: 255 },
        selbg_green: { label: 'selbg_green', type: 'number', default: 0, min: 0, max: 255 },
        selbg_blue: { label: 'selbg_blue', type: 'number', default: 255, min: 0, max: 255 },
        selbg_alpha: { label: 'selbg_alpha', type: 'number', default: 255, min: 0, max: 255 },
        align: { label: 'align', type: 'select', default: 'Align.Left', values: [ 'Align.Left', 'Align.Centre', 'Align.Right' ]},
        charsize: { label: 'charsize', type: 'number', default: -1, min: -1, max: 100 },
        font: { label: 'font', type: 'text', default: 'Arial' },
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
        this.el.style.zIndex = this.values.zorder
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
        var objId = 'listbox' + this.id
        var code = 'local ' + objId + ' = fe.add_listbox( -1, -1, 1, 1 )' + '\n'
            code += "      " + objId + '.set_pos( ' + this.values.x + ', ' + this.values.y + ', ' + this.values.width + ', ' + this.values.height + ' )' + '\n'
            code += "      " + objId + '.visible = ' + this.values.visible + '\n'
            code += "      " + objId + '.rotation = ' + this.values.rotation + '\n'
            code += "      " + objId + '.zorder = ' + this.values.zorder + '\n'
            code += "      " + objId + '.set_rgb( ' + this.values.red + ', ' + this.values.green + ', ' + this.values.blue + ' )' + '\n'
            code += "      " + objId + '.alpha = ' + this.values.alpha + '\n'
            code += "      " + objId + '.set_bg_rgb( ' + this.values.bg_red + ', ' + this.values.bg_green + ', ' + this.values.bg_blue + ' )' + '\n'
            code += "      " + objId + '.bg_alpha = ' + this.values.bg_alpha + '\n'
            code += "      " + objId + '.charsize = ' + this.values.charsize + '\n'
            code += "      " + objId + '.align = ' + this.values.align + '\n'
        return code
    }
}


AMListBox.prototype = Object.create(AMObject.prototype)
AMListBox.prototype.constructor = AMListBox