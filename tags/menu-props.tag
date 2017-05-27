<menu-props>
    <style scoped>
        :scope { display: flex; }
        .list { width: 100%; }
        input[type="number"] { width: 50px; }
        .item > input[type="text"] { width: 100px; }
    </style>
    <div if="{ showProps() }" class="list">
        <div class="item" each="{ prop, key in layout.selectedObject.props }">
            <label style="flex-grow:1;">{prop.label}</label>
            <!-- text property -->
            <input if="{ prop.type=='text' }" type="text" value="{ layout.selectedObject.values[key] || '' }" onchange="{ updateProps }" />
            <!-- number property -->
            <input if="{ prop.type == 'number' }" size="{prop.size||3}" type="number" min="{prop.min}" max="{prop.max}" value="{layout.selectedObject.values[key]}" onchange="{ updateProps }" />
            <!-- boolean property -->
            <input if="{ prop.type=='bool' }" type="checkbox" checked="{ layout.selectedObject.values[key] || false }" onclick="{ updateProps }" />
            <!-- select property -->
            <select if="{ prop.type=='select' }" onchange="{ updateProps }">
                <option if="{ typeof prop.values != 'string' }" each="{ val in prop.values }" selected="{ layout.selectedObject.values[key] == val }">{val}</option>
            </select>
            <!-- dropdown property -->
            <div if="{ prop.type=='dropdown' }" class="dropdown">
                <input type="text" value="{ layout.selectedObject.values[key] }" onchange="{ updateProps }" />
                <select if="{layout}" onchange="{ updateProps }">
                    <option if="{ typeof prop.values === 'string' && prop.values == '[media]' }" each="{ media in layout.config.media }" value="{media.name}">{media.name}</option>
                    <option if="{ typeof prop.values != 'string' }" each="{ val in prop.values }" selected="{ layout.selectedObject.values[key] == val }">{val}</option>
                </select>
            </div>
        </div>
    </div>
    <div if="{ !showProps() }">
        <span>Click an object in the layout or in the objects list to view its properties</span>
    </div>
    <script>
        this.layout = null  //currently attached layout
        
        //whether we should show properties
        showProps() {
            return  ( this.layout && this.layout.selectedObject ) ? true : false
        }
        isCustom(which) {

        }
        //update property values based on propType
        updateProps(e) {
            switch( e.item.prop.type ) {
                case 'text':
                    this.layout.selectedObject.values[e.item.key] = e.target.value
                    break
                case 'select':
                    this.layout.selectedObject.values[e.item.key] = e.target.selectedOptions[0].value
                    break
                case 'number':
                    this.layout.selectedObject.values[e.item.key] = parseFloat(e.target.value)
                    break
                case 'bool':
                    this.layout.selectedObject.values[e.item.key] = e.target.checked
                    break
                case 'dropdown':
                    if ( e.target.tagName == 'SELECT' ) {
                        e.target.previousElementSibling.value=e.target.value
                        e.target.previousElementSibling.focus()
                        this.layout.selectedObject.values[e.item.key] = e.target.previousElementSibling.value
                    } else {
                        this.layout.selectedObject.values[e.item.key] = e.target.value
                    }
                    break
            }
            this.layout.selectedObject.updateElement()
        }

        //set and monitor layout events
        setLayout(layout) {
            this.layout = layout
            this.layout.on('object-selected', function() { this.update() }.bind(this) )
            this.layout.on('object-deselected', function() { this.update() }.bind(this) )
            this.layout.on('object-update', function() { this.update() }.bind(this) )
            this.layout.on('media-added', function() { this.update(); }.bind(this) )
            this.layout.on('media-deleted', function() { this.update(); }.bind(this) )
            this.update()
        }
    </script>
</menu-props>