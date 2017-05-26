<menu-layout>
    <div if="{ show() }" class="list">
        <div class="item" each="{ prop, key in layout.config.globals }">
            <label style="flex-grow:1;">{prop.label}</label>
            <!-- text property -->
            <input if="{ prop.type=='text' }" type="text" value="{ layout.values[key] || '' }" onchange="{ updateProps }" />
            <!-- number property -->
            <input if="{ prop.type == 'number' }" size="{prop.size||3}" type="number" value="{layout.values[key]}" onchange="{ updateProps }" />
            <!-- boolean property -->
            <input if="{ prop.type=='bool' }" type="checkbox" checked="{ layout.values[key] || false }" onclick="{ updateProps }" />
            <!-- select property -->
            <select if="{ prop.type=='select' }" onchange="{ updateProps }">
                <option if="{ typeof(prop.values) != 'string' }" each="{ val in prop.values }" selected="{ layout.values[key] == val }">{val}</option>
            </select>
            <!-- dropdown property -->
            <div if="{ prop.type=='dropdown' }" class="dropdown">
                <input type="text" value="{ layout.values[key] }" onchange="{ updateProps }" />
                <select onchange="{ updateProps }">
                    <option each="{ val in prop.values }" selected="{ layout.values[key] == val }">{val}</option>
                </select>
            </div>
        </div>
    </div>
    <div if="{ !show() }">
        No layout attached
    </div>
    <script>
        this.layout = null  //currently attached layout
        show() {
            return ( this.layout ) ? true : false
        }

        //update property values based on propType
        updateProps(e) {
            switch( e.item.prop.type ) {
                case 'text':
                    this.layout.config.values.globals[e.item.key] = e.target.value
                    break
                case 'select':
                    this.layout.values[e.item.key] = e.target.selectedOptions[0].value
                    break
                case 'number':
                    this.layout.values[e.item.key] = parseFloat(e.target.value)
                    break
                case 'bool':
                    this.layout.values[e.item.key] = e.target.checked
                    break
                case 'dropdown':
                    if ( e.target.tagName == 'SELECT' ) {
                        e.target.previousElementSibling.value=e.target.value
                        e.target.previousElementSibling.focus()
                        this.layout.values[e.item.key] = e.target.previousElementSibling.value
                    } else {
                        this.layout.values[e.item.key] = e.target.value
                    }
                    break
            }
            //TODO - update layout values
        }

        //set and monitor layout events
        setLayout(layout) {
            this.layout = layout
            this.update()
        }
    </script>
</menu-layout>