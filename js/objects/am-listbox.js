class AMListBox extends AMObject {
    constructor() {
        super()
        this.label = 'ListBox'
        this.type = 'AMListBox'
        var listboxProps = {
            format_string: { label: 'format_string', type: 'text', default: '[Title]' },
            font: { label: 'font', type: 'file', default: '', values: 'font' },
            charsize: { label: 'charsize', type: 'number', default: 16, min: -1, max: 100 },
            align: { label: 'align', type: 'select', default: 'Align.Left', values: [ 'Align.Left', 'Align.Centre', 'Align.Right' ]},
            style: { label: 'style', type: 'multiselect', default: 0, values: [ { label: 'Bold', value: 1, checked: [ 1,3,5,7 ] }, { label: 'Italic', value: 2, checked: [2,3,6,7] }, { label: 'Underlined', value: 4, checked: [4,5,6,7] } ] },
            rows: { label: 'rows', type: 'number', default: 11 },
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
            sel_style: { label: 'sel_style', type: 'multiselect', default: 0, values: [ { label: 'Bold', value: 1, checked: [ 1,3,5,7 ] }, { label: 'Italic', value: 2, checked: [2,3,6,7] }, { label: 'Underlined', value: 4, checked: [4,5,6,7] } ] },
            selbg_red: { label: 'selbg_red', type: 'range', default: 0, min: 0, max: 255 },
            selbg_green: { label: 'selbg_green', type: 'range', default: 0, min: 0, max: 255 },
            selbg_blue: { label: 'selbg_blue', type: 'range', default: 255, min: 0, max: 255 },
            selbg_alpha: { label: 'selbg_alpha', type: 'range', default: 255, min: 0, max: 255 },
            shader: { label: 'shader', type: 'select', default: '', values: [] }
        }
        //set current value for all props to the defaults
        Object.keys(listboxProps).forEach(function(key) {
            this.props[key] = listboxProps[key]
            this.values[key] = listboxProps[key].default
        }.bind(this))
    }

    createElement() {
        this.el = document.createElement('ul')
        this.el.classList.add('listbox')
        this.el.style.listStyle = 'none'
        this.el.whiteSpace = 'nowrap'
        this.el.style.overflow = 'hidden'
        this.el.style.margin = 0
        this.el.style.padding = 0
    }

    updateElement() {
        this.el.style.display = ( this.values.visible && !this.editor.hidden ) ? 'block' : 'none'
        if ( this.values.zorder >= 0 ) this.el.style.zIndex = this.values.zorder

        //update object transform
        this.transform()
        this.el.style.width = this.values.width + 'px'
        this.el.style.height = this.values.height + 'px'
        
        var alpha = ( this.values.alpha > 0 ) ? this.values.alpha / 255 : 0
        this.el.style.color = 'rgba(' + this.values.red + ',' + this.values.green + ',' + this.values.blue + ', ' + alpha + ')'
        var bg_alpha = ( this.values.bg_alpha > 0 ) ? this.values.bg_alpha / 255 : 0
        this.el.style.backgroundColor = 'rgba(' + this.values.bg_red + ',' + this.values.bg_green + ',' + this.values.bg_blue + ',' + bg_alpha + ')'
        this.el.style.textAlign = ( this.values.align == 'Align.Centre' ) ? 'center' : ( this.values.align == 'Align.Right' ) ? 'right' : 'left'
        this.el.style.fontFamily = this.values.font
        this.el.style.fontSize = ( this.values.charsize != -1 ) ? this.values.charsize + 'px' : 'initial'
        this.el.style.fontWeight = ( this.props.style.values[0].checked.includes(this.values.style) ) ? 'bold' : 'normal'
        this.el.innerHTML = ''
        for ( var i = 0; i < this.values.rows; i++ ) {
            var li = document.createElement('li')
            li.style.pointerEvents = 'none'
            li.innerHTML = this.magicTokens( this.values.format_string, i )
            if ( i == 0 ) {
                var sel_alpha = ( this.values.sel_alpha > 0 ) ? this.values.sel_alpha / 255 : 0
                var selbg_alpha = ( this.values.selbg_alpha > 0 ) ? this.values.selbg_alpha / 255 : 0
                li.style.backgroundColor = 'rgba(' + this.values.selbg_red + ',' + this.values.selbg_green + ',' + this.values.selbg_blue + ',' + selbg_alpha + ')'
                li.style.color = 'rgba(' + this.values.sel_red + ',' + this.values.sel_green + ',' + this.values.sel_blue + ', ' + sel_alpha + ')'
                li.style.fontWeight = ( this.props.sel_style.values[0].checked.includes(this.values.sel_style) ) ? 'bold' : 'normal'
                li.style.fontStyle = ( this.props.sel_style.values[1].checked.includes(this.values.sel_style) ) ? 'italic' : ''
                li.style.textDecoration = ( this.props.sel_style.values[2].checked.includes(this.values.sel_style) ) ? 'underline' : ''
            } else {
                li.style.fontStyle = ( this.props.style.values[1].checked.includes(this.values.style) ) ? 'italic' : ''
                li.style.textDecoration = ( this.props.style.values[2].checked.includes(this.values.style) ) ? 'underline' : ''
            }
            this.el.appendChild(li)
        }
    }

    toSquirrel() {
        //note: [surface] [object] and [props] are dynamically replaced as object variables respectively
        var code = ''
            code += 'local [object] = [surface].add_listbox( -1, -1, 1, 1)' + '\n'
            code += '   foreach( key, val in props[aspect]["[object]"] )\n'
            code += '      if ( key != "zorder" && key != "shader" )\n'
            code += '         try { [object][key] = val } catch(e) { print("error setting property: " + key + "\\n" ) }\n'
            if ( this.values.zorder >= 0 )
                code += '   [object].zorder = ' + this.values.zorder + '\n'
        return code
    }

}