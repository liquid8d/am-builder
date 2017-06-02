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
    </style>
    <!-- top toolbar -->
    <div class="horizontal-toolbar" style="height: 20px; flex-shrink: 0;">
        <span></span>
    </div>
    <!-- objects list -->
    <div if="{ showObjects() }" class="list">
        <div each="{ item in layout.config.objects }" class="item" data-id="{ item.id }" onclick="{ selectObject }">
            <div class="icon { ( item.editor.hidden ) ? 'hide' : 'show' }" onclick="{ toggleVisible }"></div>
            <div class="icon { ( item.editor.locked ) ? 'lock' : 'unlock' }" onclick="{ toggleLock }"></div>
            <input type="text" style="width: 100%;" data-id="{item.id}" value="{item.label}" ondblclick="{ editLabelStart }" onkeydown="{ editLabelEnd }" onblur="{ editLabelEnd }" readonly="readonly" />
            <div class="icon trash" onclick="{ deleteObject }"></div>
        </div>
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
        <div class="no-select icon surface" title="Surface" onclick=""></div>
    </div>
    <script>
        this.layout = null  //currently attached layout
        this.editLabelEl = null

        editLabelStart(e) {
            this.editLabelEl = e.target
            this.editLabelEl.removeAttribute('readonly')
            //this.editLabelEl.focus(function() { this.select() })
        }

        editLabelEnd(e) {
            var end = false
            if ( this.editLabelEl ) {
                if ( e.type == 'keydown' && e.keyCode == 27 ) {
                    //cancel label edit on esc
                    var obj = this.layout.findObjectById( this.editLabelEl.getAttribute('data-id') )
                    this.editLabelEl.value = obj.label
                    end = true
                }
                if ( e.type == 'blur' || ( e.type == 'keydown' && e.keyCode == 13 ) ) {
                    //submit label edit
                    var obj = this.layout.findObjectById( this.editLabelEl.getAttribute('data-id') )
                    obj.label = this.editLabelEl.value
                    end = true
                }
            }
            //stop label editing
            if ( end && this.editLabelEl ) {
                this.editLabelEl.setAttribute('readonly', 'readonly')
                this.editLabelEl = null
            }
        }

        addText() {
            layout.addAMObject( new AMText() )
            this.root.querySelector('.list').scrollTop = this.root.querySelector('.list').scrollHeight
        }

        addImage() {
            layout.addAMObject( new AMImage() )
            this.root.querySelector('.list').scrollTop = this.root.querySelector('.list').scrollHeight
        }

        addArtwork() {
            layout.addAMObject( new AMArtwork() )
            this.root.querySelector('.list').scrollTop = this.root.querySelector('.list').scrollHeight
        }

        addListBox() {
            layout.addAMObject( new AMListBox() )
            this.root.querySelector('.list').scrollTop = this.root.querySelector('.list').scrollHeight
        }

        addClone() {
            if ( !layout.selectedObject || ( ( layout.selectedObject instanceof AMImage ) == false && layout.selectedObject instanceof AMArtwork == false ) ) return
            var cloned = getInstance(layout.selectedObject.type)
            cloned.editor.clone = layout.selectedObject.type + layout.selectedObject.id
            console.log('cloning: ' + cloned.editor.clone)
            //clone parent properties
            Object.keys(layout.selectedObject.values).forEach(function(key) {
                cloned.values[key] = layout.selectedObject.values[key]
            })
            layout.addAMObject( cloned )
            this.root.querySelector('.list').scrollTop = this.root.querySelector('.list').scrollHeight
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
            var selected = layout.findObjectById(e.target.getAttribute('data-id'))
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

    </script>
</menu-objects>