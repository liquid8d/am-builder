<menu-objects>
    <style scoped>
        .list .item { cursor: pointer; }
        input[type="text"] {
            border: none;
            background: #111;
            color: #aaa;
            padding: 2px;
        }
        input[readonly] {
            background: transparent;
        }
    </style>
    <div if="{ showObjects() }" class="list">
        <div each="{ item in layout.config.objects }" class="item" data-id="{ item.id }" onclick="{ selectObject }">
            <div class="icon { ( item.hidden ) ? 'hide' : 'show' }" onclick="{ toggleVisible }"></div>
            <div class="icon { ( item.locked ) ? 'lock' : 'unlock' }" onclick="{ toggleLock }"></div>
            <input type="text" style="flex-grow: 1;" data-id="{item.id}" value="{item.label}" ondblclick="{ editLabelStart }" onkeydown="{ editLabelEnd }" onblur="{ editLabelEnd }" readonly="readonly" />
            <!--
            <span style="flex-grow: 1; pointer-events: none;">{ item.label }</span>
            -->
            <div class="icon trash" onclick="{ deleteObject }"></div>
        </div>
    </div>
    <div if="{ !showObjects() }">
        <span>No objects in layout</span>
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
            if ( clickedObject ) clickedObject.hidden = !clickedObject.hidden
            clickedObject.updateElement()
            this.layout.trigger('object-update')
            if ( clickedObject.hidden ) {
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
            if ( clickedObject ) clickedObject.locked = !clickedObject.locked
            if ( clickedObject.locked ) {
                e.target.classList.remove('unlock')
                e.target.classList.add('lock')
            } else {
                e.target.classList.remove('lock')
                e.target.classList.add('unlock')
            }
        }

    </script>
</menu-objects>