<menu-objects>
    <style scoped>
        :scope {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
        }
        .list { overflow: auto; padding: 5px; flex-grow: 1; }
        .list .item { cursor: pointer; flex-shrink: 0; }
        input[type="text"] {
            border: none;
            background: #111;
            color: #aaa;
            padding: 2px;
            outline: none;
        }
        input[readonly] {
            background: transparent;
        }
        .item.clone input { color: rgb(100, 100, 175); }
        .item.surface input { color: rgb(175, 100, 100); }
        .item.surface { border-top: 1px solid #333; border-right: 1px solid #333; border-left: 1px solid #333; }
        .item.surface.expanded { border-bottom: none; }
        .item.surface.collapsed { border-bottom: 1px solid #333; }
        .item .expandable.collapsed::before { margin: 0 5px 0 5px; content: "+"; }
        .item .expandable.expanded::before { margin: 0 5px 0 5px; content: '-'; border-bottom: none; }
        .children { border-right: 1px solid #333; border-bottom: 1px solid #333; border-left: 1px solid #333; }
        .children.expanded { display: block; }
        .children.collapsed { display: none }
    </style>
    <!-- top toolbar -->
    <div class="horizontal-toolbar" style="height: 20px; flex-shrink: 0;">
        <span></span>
    </div>
    <!-- objects list -->
    <div if="{ showObjects() }" class="list">
        <virtual each="{ item in layout.config.objects }">
            <div class="item { ( item.type == 'AMSurface' ) ? 'surface' : '' } { ( item.editor.clone ) ? 'clone' : '' } { ( item.editor.expanded ) ? 'expanded' : 'collapsed' }" data-id="{ item.id }" onclick="{ selectObject }">
                <div class="icon { ( item.editor.hidden ) ? 'hide' : 'show' }" onclick="{ toggleVisible }"></div>
                <div class="icon { ( item.editor.locked ) ? 'lock' : 'unlock' }" onclick="{ toggleLock }"></div>
                <div if="{ item.type == 'AMSurface' }" class="expandable { ( item.editor.expanded ) ? 'expanded' : 'collapsed' }" onclick="{ toggleChildren }"></div>
                <input type="text" style="width: 100%;" data-id="{ item.id }" value="{item.label}" ondblclick="{ editLabelStart }" onkeydown="{ editLabelEnd }" onblur="{ editLabelEnd }" readonly="readonly" />
                <div class="icon trash" onclick="{ deleteObject }"></div>
            </div>
            <div if="{ item.type == 'AMSurface' }" class="children {item.type + item.id}-children { ( item.editor.expanded ) ? 'expanded' : 'collapsed' }">
                <div each="{ subitem in item.objects }" class="item { ( subitem.editor.clone ) ? 'clone' : '' }" data-id="{ subitem.id }" onclick="{ selectObject }">
                    <div class="icon { ( subitem.editor.hidden ) ? 'hide' : 'show' }" onclick="{ toggleVisible }"></div>
                    <div class="icon { ( subitem.editor.locked ) ? 'lock' : 'unlock' }" onclick="{ toggleLock }"></div>
                    <input type="text" style="width: 100%;" data-id="{ subitem.id }" value="{subitem.label}" ondblclick="{ editLabelStart }" onkeydown="{ editLabelEnd }" onblur="{ editLabelEnd }" readonly="readonly" />
                    <div class="icon trash" onclick="{ deleteObject }"></div>
                </div>
            </div>
        </virtual>
    </div>
    <!-- empty list -->
    <div if="{ !showObjects() }" style="padding: 10px; flex-grow: 1;">
        <span>No objects in layout</span>
    </div>
    <!-- bottom toolbar -->
    <div class="horizontal-toolbar" style="height: 32px; flex-shrink: 0;">
        <div class="no-select icon text" title="Text" onclick="{addText}"></div>
        <div class="no-select icon image" title="Image" onclick="{addImage}"></div>
        <div class="no-select icon artwork" title="Artwork" onclick="{addArtwork}"></div>
        <div class="no-select icon listbox" title="Listbox" onclick="{addListBox}"></div>
        <div class="no-select icon clone" title="Clone" onclick="{addClone}"></div>
        <div class="no-select icon surface" title="Surface" onclick="{addSurface}"></div>
    </div>
    <script>
        this.layout = null  //currently attached layout
        this.editLabelEl = null

        editLabelStart(e) {
            this.editLabelEl = e.target
            this.editLabelEl.removeAttribute('readonly')
        }

        editLabelEnd(e) {
            var end = false
            if ( this.editLabelEl ) {
                if ( e.type == 'keydown' && e.keyCode == 27 ) {
                    //cancel label edit on esc
                    var obj = this.layout.findObjectById( this.editLabelEl.getAttribute('data-id') )
                    if ( obj ) this.editLabelEl.value = obj.label
                    end = true
                }
                if ( e.type == 'blur' || ( e.type == 'keydown' && e.keyCode == 13 ) ) {
                    //submit label edit
                    var obj = this.layout.findObjectById( this.editLabelEl.getAttribute('data-id') )
                    if ( obj ) obj.label = this.editLabelEl.value
                    end = true
                }
            }
            //stop label editing
            if ( end && this.editLabelEl ) {
                this.editLabelEl.setAttribute('readonly', 'readonly')
                this.editLabelEl = null
            }
        }

        addText(e) {
            var selected = this.root.querySelector('.item.selected')
            if ( selected ) {
                var object = layout.findObjectById( selected.getAttribute('data-id') )
                if ( object && selected.classList.value.indexOf('surface') >= 0 ) {
                    //surface selected, add to it
                    object.addObject( new AMText() )
                } else if ( object && object.editor.surface ) {
                    //object on surface selected, add to that surface
                    var surface = layout.findObjectById( object.editor.surface )
                    surface.addObject( new AMText() )
                } else {
                    //fallback
                    layout.addAMObject( new AMText() )
                }
            } else {
                layout.addAMObject( new AMText() )
            }
            this.root.querySelector('.list').scrollTop = this.root.querySelector('.list').scrollHeight
        }

        addImage(e) {
            var selected = this.root.querySelector('.item.selected')
            if ( selected ) {
                var object = layout.findObjectById( selected.getAttribute('data-id') )
                if ( object && selected.classList.value.indexOf('surface') >= 0 ) {
                    //surface selected, add to it
                    object.addObject( new AMImage() )
                } else if ( object && object.editor.surface ) {
                    //object on surface selected, add to that surface
                    var surface = layout.findObjectById( object.editor.surface )
                    surface.addObject( new AMImage() )
                } else {
                    //fallback
                    layout.addAMObject( new AMImage() )
                }
            } else {
                layout.addAMObject( new AMImage() )
            }
            this.root.querySelector('.list').scrollTop = this.root.querySelector('.list').scrollHeight
        }

        addArtwork(e) {
            var selected = this.root.querySelector('.item.selected')
            if ( selected ) {
                var object = layout.findObjectById( selected.getAttribute('data-id') )
                if ( object && selected.classList.value.indexOf('surface') >= 0 ) {
                    //surface selected, add to it
                    object.addObject( new AMArtwork() )
                } else if ( object && object.editor.surface ) {
                    //object on surface selected, add to that surface
                    var surface = layout.findObjectById( object.editor.surface )
                    surface.addObject( new AMArtwork() )
                } else {
                    //fallback
                    layout.addAMObject( new AMArtwork() )
                }
            } else {
                layout.addAMObject( new AMArtwork() )
            }
            this.root.querySelector('.list').scrollTop = this.root.querySelector('.list').scrollHeight
        }

        addListBox(e) {
            var selected = this.root.querySelector('.item.selected')
            if ( selected ) {
                var object = layout.findObjectById( selected.getAttribute('data-id') )
                if ( object && selected.classList.value.indexOf('surface') >= 0 ) {
                    //surface selected, add to it
                    object.addObject( new AMListBox() )
                } else if ( object && object.editor.surface ) {
                    //object on surface selected, add to that surface
                    var surface = layout.findObjectById( object.editor.surface )
                    surface.addObject( new AMListBox() )
                } else {
                    //fallback
                    layout.addAMObject( new AMListBox() )
                }
            } else {
                layout.addAMObject( new AMListBox() )
            }
            this.root.querySelector('.list').scrollTop = this.root.querySelector('.list').scrollHeight
        }

        addClone(e) {
            if ( !layout.selectedObject || ( ( layout.selectedObject instanceof AMImage ) == false && layout.selectedObject instanceof AMArtwork == false ) ) return
            
            //create a clone of the object
            var cloned = getInstance(layout.selectedObject.type)
            cloned.editor.clone = layout.selectedObject.id
            //clone parent properties
            Object.keys(layout.selectedObject.values).forEach(function(key) {
                cloned.values[key] = layout.selectedObject.values[key]
            })

            var selected = this.root.querySelector('.item.selected')
            if ( selected ) {
                var object = layout.findObjectById( selected.getAttribute('data-id') )
                if ( object && selected.classList.value.indexOf('surface') >= 0 ) {
                    //surface selected, add to it
                    object.addObject( cloned )
                } else if ( object && object.editor.surface ) {
                    //object on surface selected, add to that surface
                    var surface = layout.findObjectById( object.editor.surface )
                    surface.addObject( cloned )
                } else {
                    //fallback
                    layout.addAMObject( cloned )
                }
            } else {
                layout.addAMObject( cloned )
            }
            this.root.querySelector('.list').scrollTop = this.root.querySelector('.list').scrollHeight
        }

        addSurface() {
            var surfaceSelected = this.root.querySelector('.item.surface.selected')
            if ( surfaceSelected ) {
                console.warn('do no support surfaces on surfaces yet')
            } else {
                layout.addAMObject( new AMSurface() )
                this.root.querySelector('.list').scrollTop = this.root.querySelector('.list').scrollHeight
            }
        }

        //whether to show the objects list
        showObjects() {
            return ( this.layout && this.layout.config.objects.length > 0 ) ? true : false
        }

        //set and monitor layout events
        setLayout(layout) {
            this.layout = layout
            this.layout.on( 'object-added', function() { this.update(); this.updateSelected() }.bind(this) )
            this.layout.on( 'object-deleted', function() { this.update(); this.updateSelected() }.bind(this) )
            this.layout.on( 'object-selected', function() { this.update(); this.updateSelected() }.bind(this) )
            this.layout.on( 'object-deselected', function() { this.update(); this.updateSelected() }.bind(this) )
            this.update()
        }

        //update selected items in the object list
        updateSelected() {
            this.root.querySelectorAll('.item').forEach(function(item) {
                if ( layout.selectedObject && layout.selectedObject.id == item.getAttribute('data-id') )
                    item.classList.add('selected')
                else
                    item.classList.remove('selected')
            })
        }

        //select the clicked object in the layout
        selectObject(e) {
            var selected = layout.findObjectById( e.target.parentElement.getAttribute('data-id') )
            if ( selected ) layout.select( selected.el )
        }

        //delete the clicked object in the layout
        deleteObject(e) {
            var clickedObject = layout.findObjectById( e.target.parentElement.getAttribute('data-id') )
            layout.deleteObject( clickedObject )
        }

        //toggle the clicked objects visibility in the layout
        toggleVisible(e) {
            var clickedObject = layout.findObjectById( e.target.parentElement.getAttribute('data-id') )
            if ( clickedObject ) clickedObject.editor.hidden = !clickedObject.editor.hidden
            clickedObject.updateElement()
            this.layout.trigger('object-update')
            if ( clickedObject.editor.hidden ) {
                e.target.classList.remove('hide')
                e.target.classList.add('show')
            } else {
                e.target.classList.remove('show')
                e.target.classList.add('hide')
            }
        }

        //toggle the object lock in the layout (prevents moving/resizing)
        toggleLock(e) {
            var clickedObject = layout.findObjectById( e.target.parentElement.getAttribute('data-id') )
            if ( clickedObject ) clickedObject.editor.locked = !clickedObject.editor.locked
            if ( clickedObject.editor.locked ) {
                e.target.classList.remove('unlock')
                e.target.classList.add('lock')
            } else {
                e.target.classList.remove('lock')
                e.target.classList.add('unlock')
            }
        }

        //toggle showing children for surfaces
        toggleChildren(e) {
            var clickedObject = layout.findObjectById( e.target.parentElement.getAttribute('data-id') )
            clickedObject.editor.expanded = !clickedObject.editor.expanded
            var children = this.root.querySelector( '.' + clickedObject.type + clickedObject.id + '-children')
            if ( clickedObject.editor.expanded ) {
                children.classList.remove('collapsed')
                children.classList.add('expanded')
            } else {
                children.classList.remove('expanded')
                children.classList.add('collapsed')
            }
        }
    </script>
</menu-objects>