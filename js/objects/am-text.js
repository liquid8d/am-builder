class AMText extends AMObject {
    constructor() {
        super()
        this.type = 'AMText'
        this.label = 'Text'
        //add additional text properties to base props
        var textProps = {
            msg: { label: 'msg', type: 'dropdown', default: '[Title]', values: [ '[DisplayName]', '[ListSize]', '[ListEntry]', '[FilterName]', '[Search]', '[SortName]', '[Name]', '[Title]', '[Emulator]', '[CloneOf]', '[Year]', '[Manufacturer]', '[Category]', '[Players]', '[Rotation]', '[Control]', '[Status]', '[DisplayCount]', '[DisplayType]', '[AltRomname]', '[AltTitle]', '[PlayedTime]', '[PlayedCount]', '[SortValue]', '[System]', '[SystemN]', '[Overview]' ] },
            font: { label: 'font', type: 'file', default: '', values: 'font' },
            charsize: { label: 'charsize', type: 'number', default: 16, min: -1, max: 100 },
            align: { label: 'align', type: 'select', default: 'Align.Centre', values: [ 'Align.Left', 'Align.Centre', 'Align.Right' ] },
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
        //set current value for all props to the defaults
        this.values.width = 200
        this.values.height = 20
        Object.keys(textProps).forEach(function(key) {
            this.props[key] = textProps[key]
            this.values[key] = textProps[key].default
        }.bind(this))
    }

    createElement() {
        this.el = document.createElement('div')
        this.el.classList.add('text')
        this.el.style.overflow = 'hidden'
        var text = document.createElement('span')
        text.style.display = 'inline-block'
        text.style.position = 'relative'
        text.style.overflow = 'hidden'
        text.style.pointerEvents = 'none'
        this.el.appendChild(text)
    }

    updateElement() {
        this.el.style.display = ( this.values.visible && !this.editor.hidden ) ? ( this.values.word_wrap ) ? 'inline-block' : 'block' : 'none'
        if ( this.values.zorder >= 0 ) this.el.style.zIndex = this.values.zorder

        var text = this.el.querySelector('span')
        text.innerHTML = this.magicTokens( this.values.msg, this.values.index_offset )
        
        var bg_alpha = ( this.values.bg_alpha > 0 ) ? this.values.bg_alpha / 255 : 0
        this.el.style.backgroundColor = 'rgba(' + this.values.bg_red + ',' + this.values.bg_green + ',' + this.values.bg_blue + ',' + bg_alpha + ')'
        
        var alpha = ( this.values.alpha > 0 ) ? this.values.alpha / 255 : 0
        text.style.color = 'rgba(' + this.values.red + ',' + this.values.green + ',' + this.values.blue + ', ' + alpha + ')'
        text.style.fontFamily = this.values.font
        text.style.fontWeight = ( this.props.style.values[0].checked.includes(this.values.style) ) ? 'bold' : 'normal'
        text.style.fontStyle = ( this.props.style.values[1].checked.includes(this.values.style) ) ? 'italic' : ''
        text.style.textDecoration = ( this.props.style.values[2].checked.includes(this.values.style) ) ? 'underline' : ''
        text.style.wordBreak = 'break-all'

        this.el.style.width = this.values.width + 'px'
        this.el.style.height = this.values.height + 'px'

        //do transform after all properties are set, since some may affect it
        this.transform()
    }

    transform() {
        super.transform()
        var text = this.el.querySelector('span')
        if ( this.values.charsize != -1 ) {
            if ( this.values.word_wrap ) {
                text.style.fontSize = this.values.charsize + 'px'
                //center vertically
                text.style.lineHeight = 'normal'
                //this doesn't quite center properly for charsize of 9 or less
                text.style.top = ( ( this.el.getBoundingClientRect().height - text.getBoundingClientRect().height ) / 2 ) + 'px'
            } else {
                //specific font size
                text.style.fontSize = this.values.charsize + 'px'
                //center vertically
                text.style.lineHeight = this.values.height + 'px'
                text.style.top = 0
            }
        } else {
            //auto size text (no word wrap)
            text.style.top = 0
            text.style.fontSize = this.values.height + 'px'
            text.style.lineHeight = ( this.values.height * 1.0 ) + 'px'
        }
        this.el.style.textAlign = ( this.values.align == 'Align.Centre' ) ? 'center' : ( this.values.align == 'Align.Right' ) ? 'right' : 'left'
    }

    toSquirrel() {
        //note: [surface] [object] and [props] are dynamically replaced as object variables respectively
        var code = ''
            code += 'local [object] = [surface].add_text( "' + this.values.msg + '", -1, -1, 1, 1 )' + '\n'
            code += '   foreach( key, val in props[aspect]["[object]"] )\n'
            code += '      if ( key != "zorder" && key != "shader" )\n'
            code += '         try { [object][key] = val } catch(e) { print("error setting property: " + key + "\\n" ) }\n'
            if ( this.values.zorder >= 0 )
                code += '   [object].zorder = ' + this.values.zorder + '\n'
        return code
    }
}
