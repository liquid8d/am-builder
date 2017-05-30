<layout>
    <!--
        triggers:
            object-added
            object-selected
            object-deselected
            object-deleted
            object-update
            file-added
            file-deleted
    -->
    <style>
        :scope {
            display: block;
            padding: 1em;
            width: 100%;
            overflow: auto;
        }

        .layout {
            position: relative;
            width: 640px;
            height: 480px;
            overflow: hidden;
            background: linear-gradient(rgb(5,5,5),rgb(15,15,15),rgb(5,5,5));
        }
        .gridlines {
            background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2Y2IyOTE4NC0wMjU3LTRhNDYtYWQzNS03YjY0N2MyZmM4OWUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzE1MDFEQTc0NDBEMTFFN0ExRTQ4QzZDRTM0RjEwRTMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzE1MDFEQTY0NDBEMTFFN0ExRTQ4QzZDRTM0RjEwRTMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDMyNTQ4ZTktZTNkZi00ZjQwLWI0OTEtN2MzNjA1YmE4ZmUxIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjZjYjI5MTg0LTAyNTctNGE0Ni1hZDM1LTdiNjQ3YzJmYzg5ZSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoE/vRoAAAAMUExURSEtSCAgIA8PDwAAAOlHyb4AAABgSURBVHja7NUhDgAhDEXBttz/zig0NAHUVK0hI15+Nsa6OvzK9osICASyR6p72X6hCQRi8ZpAIBavCQRi8cJDIJeQfH+aQCD+8ZpAIBavCQRi8cJDIBYvPATSRn7cFGAAf4RrcmCdlfgAAAAASUVORK5CYII=') repeat;
            height: 100%;
            pointer-events: none;
        }

        .object {
            position: absolute;
            font-family: Arial;
            pointer-events: all;
        }
        .object.image {
            background-size: contain;
        }

        .selected {
            border-style: inset;
            border: 1px dashed yellow;
        }
    </style>
    <div class= "layout">
        <div class="gridlines"></div>
    </div>
    <script>
        this.config = {
            editor: {
                zoom: 100,
                gridlines: true,
                snap: true,
                snapSize: 10
            },
            globals: {
                width: { label: 'width', type: 'number', default: 640 },
                height: { label: 'height', type: 'number', default: 480 },
                font: { label: 'font', type: 'dropdown', default: 'Arial', values: [ 'Arial' ] },
                base_rotation: { label: 'base_rotation', type: 'select', default: 'RotateScreen.None', values: [ 'RotateScreen.None', 'RotateScreen.Right', 'RotateScreen.Flip', 'RotateScreen.Left' ] },
                toggle_rotation: { label: 'toggle_rotation', type: 'select', default: 'RotateScreen.None', values: [ 'RotateScreen.None', 'RotateScreen.Right', 'RotateScreen.Flip', 'RotateScreen.Left' ] },
                page_size: { label: 'page_size', type: 'number', default: 10 },
                preserve_aspect_ratio: { label: 'preserve_aspect_ratio', type: 'bool', default: false }
            },
            objects: [],
            files: [
                { id: 0, type: 'media', label: 'missing.png', name: 'missing.png', data: 'data:image/png;base64,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' },
                { id: 1, type: 'media', label: 'pixel.png', name: 'pixel.png', data: 'data:image/png;base64,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' }
            ],
            shaders: [],
            fonts: []
        }

        this.aspect = 'Standard (4x3)'
        this.aspects = [ 'Standard (4x3)', 'Standard Vert (3x4)', 'Wide (16x10)', 'Wide Vert (10x16)', 'HD (16x9)', 'HD Vert (9x16)' ]
        this.values = {}
        this.selectedObject = null
        this.idCounter = 1
        this.idCounterFiles = this.config.files.length

        //update globals values for this layout
        Object.keys(this.config.globals).forEach(function(key) {
            this.values[key] = this.config.globals[key].default
        }.bind(this))

        updateElements() {
            this.config.objects.forEach(function(obj) {
                obj.updateElement()
            })
        }

        toggleSnap() {
            this.config.editor.snap = !this.config.editor.snap
            interact('.object').options.drag.snap.enabled = this.config.editor.snap
            interact('.object').options.resize.snap.enabled = this.config.editor.snap
        }

        toggleGridlines() {
            this.config.editor.gridlines = !this.config.editor.gridlines
            this.root.querySelector('.gridlines').style.display = ( this.config.editor.gridlines ) ? '' : 'none'
        }

        //Navigation for the fake data
        next_display() {
            data.displayIndex = ( data.displayIndex < data.displays.length - 1 ) ? data.displayIndex + 1 : 0
            data.listIndex = 0
            data.filterIndex = 0
            console.log('next_display: ' + data.displayIndex )
            this.updateElements()
        }
        prev_display() {
            data.displayIndex = ( data.displayIndex > 0 ) ? data.displayIndex - 1 : data.displays.length - 1
            data.listIndex = 0
            data.filterIndex = 0
            console.log('prev_display: ' + data.displayIndex )
            this.updateElements()
        }
        next_rom() {
            var currentDisplay = data.displays[data.displayIndex]
            data.listIndex = ( data.listIndex < currentDisplay.romlist.length - 1 ) ? data.listIndex + 1 : 0
            console.log('next_rom: ' + data.listIndex )
            this.updateElements()
        }
        prev_rom() {
            var currentDisplay = data.displays[data.displayIndex]
            data.listIndex = ( data.listIndex > 0 ) ? data.listIndex - 1 : currentDisplay.romlist.length - 1
            console.log('prev_rom: ' + data.listIndex )
            this.updateElements()
        }
        next_filter() {
            var currentDisplay = data.displays[data.displayIndex]
            data.filterIndex = ( data.filterIndex < currentDisplay.filters.length - 1 ) ? data.filterIndex + 1 : 0
            console.log('next_filter: ' + data.filterIndex )
            this.updateElements()
        }
        prev_filter() {
            var currentDisplay = data.displays[data.displayIndex]
            data.filterIndex = ( data.filterIndex > 0 ) ? data.filterIndex - 1 : currentDisplay.filters.length - 1
            console.log('prev_filter: ' + data.filterIndex )
            this.updateElements()
        }

        //save state of the layout
        save() {
            riot.mixin('utils').save('values', this.values)
            //convert objects to standard JS object
            var objects = []
            this.config.objects.forEach(function(obj) {
                var saveObj = {
                    id: obj.id,
                    label: obj.label,
                    locked: obj.locked,
                    hidden: obj.hidden,
                    type: obj.type,
                    aspect_values: obj.aspect_values,
                    values: obj.values
                }
                objects.push(saveObj)
            })
            riot.mixin('utils').save('objects', objects)
        }

        //clear the layout of objects
        clear() {
            this.root.querySelector('.layout').querySelectorAll('.object').forEach(function(el) {
                this.deleteObject(this.findObjectByEl(el))
            }.bind(this))
            this.update()
            this.trigger('object-deleted')
        }

        //restore state of the layout
        resume() {
            this.clear()
            this.values = riot.mixin('utils').load('values')
            //recreate objects from standard JS object
            var objects = riot.mixin('utils').load('objects')
            objects.forEach(function(obj) {
                var newObj = new window[obj.type]()
                Object.keys(obj).forEach(function(key) {
                    newObj[key] = obj[key]
                })
                this.addAMObject(newObj)
            }.bind(this))
            this.trigger('object-added')
        }

        //add AM objects
        addAMObject(obj) {
            if ( !obj ) return
            //console.log('adding object')
            obj.id = this.idCounter
            this.idCounter++
            obj.label = obj.label || obj.type
            this.config.objects.push( obj )

            obj.createElement()
            obj.el.setAttribute('data-id', obj.id)
            obj.el.classList.add('object')
            obj.updateElement()

            var layoutCanvas = this.root.querySelector('.layout')
            layoutCanvas.appendChild( obj.el )

            this.select(obj.el)
            this.trigger('object-added')
            return obj
        }

        //delete AM objects
        deleteObject(obj) {
            if ( !obj ) return
            this.config.objects.forEach(function(o, idx) {
                if ( o.id == obj.id ) {
                obj.el.parentNode.removeChild(obj.el)
                    this.config.objects.splice(idx, 1)
                    this.unselect()
                    this.trigger('object-deleted')
                }
            }.bind(this))
        }

        //find object by its assigned id
        findObjectById(id) {
            var selected = null
            this.config.objects.forEach(function(obj) {
                if ( id == obj.id ) selected = obj
            })
            return selected
        }

        //find object by the element representing it
        findObjectByEl(el) {
            var selected = null
            this.config.objects.forEach(function(obj) {
                if ( el.getAttribute('data-id') == obj.id ) selected = obj
            })
            return selected
        }
        
        //add new file
        addFile( fileObj ) {
            var found = false
            this.config.files.forEach(function(item) {
                if ( item.name == fileObj.name ) found = true
            })
            if ( !found ) {
                fileObj.id = this.idCounterFiles
                this.config.files.push(fileObj)
                this.idCounterFiles++
                this.trigger('file-added', fileObj)
            }
        }

        //find stored file by specified search key
        findFile( search, key ) {
            if ( key === undefined ) key = 'id'
            var selected = null
            this.config.files.forEach(function(file) {
                if ( file[key] == search ) selected = file
            })
            return selected
        }

        //delete stored file
        deleteFile( fileObj ) {
            if ( !fileObj ) return
            this.config.files.forEach(function(file, idx) {
                if ( fileObj.id == file.id ){
                    this.config.files.splice(idx, 1)
                    this.trigger('file-deleted')
                }
            }.bind(this))
        }

        //select an AM object element in the layout
        select(el) {
            this.unselect()
            this.selectedObject = this.findObjectByEl(el)
            if ( this.selectedObject ) {
                this.selectedObject.el.classList.add('selected')
                this.selectedObject.el.onmousedown = this.startDrag
                this.trigger('object-selected')
            }
        }

        //deselect an AM object element in the layout
        unselect() {
            if ( this.selectedObject ) {
                this.selectedObject.el.classList.remove('selected')
                this.selectedObject.el.onmousedown = function() {}
            }
            this.selectedObject = null
            this.trigger('object-deselected')
        }

        this.on('mount', function() {
            this.root.onmousedown = function(e) {
                this.select(e.target)
            }.bind(this)
            
            interact('.object')
                .on('tap', function(e) { this.select(e.target); e.preventDefault() }.bind(this))
                .draggable({
                    restrict: {
                        endOnly: true,
                        elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
                    },
                    snap: { targets: [ interact.createSnapGrid({ x: this.config.editor.snapSize, y: this.config.editor.snapSize }) ], range: Infinity }
                })
                .on('dragmove', function(e) {
                    if ( !this.selectedObject || this.selectedObject.locked ) return
                        var scale = ( this.config.editor.zoom / 100 ).toFixed(2)
                        var x = this.selectedObject.values.x = this.selectedObject.el.offsetLeft + e.dx,
                            y = this.selectedObject.values.y =  this.selectedObject.el.offsetTop + e.dy
                            this.selectedObject.el.style.left = x + 'px'
                            this.selectedObject.el.style.top = y + 'px'
                        this.trigger('object-update')
                }.bind(this))
                .resizable({
                    preserveAspectRatio: false,
                    edges: { left: true, right: true, bottom: true, top: true },
                    snap: { targets: [ interact.createSnapGrid({ x: this.config.editor.snapSize, y: this.config.editor.snapSize }) ], range: Infinity }
                })
                .on('resizemove', function(event) {
                    if ( !this.selectedObject || this.selectedObject.locked ) return
                    var target = event.target,
                        x = (parseFloat(target.getAttribute('data-x')) || 0),
                        y = (parseFloat(target.getAttribute('data-y')) || 0);

                    // update the element's style
                    target.style.width  = event.rect.width + 'px';
                    target.style.height = event.rect.height + 'px';

                    // translate when resizing from top or left edges
                    x += event.deltaRect.left;
                    y += event.deltaRect.top;
                    
                    var left = event.target.offsetLeft + x
                    var top = event.target.offsetTop + y
                    target.style.left = left + 'px'
                    target.style.top = top + 'px'
                    
                    this.selectedObject.values.x = left
                    this.selectedObject.values.y = top
                    this.selectedObject.values.width = event.rect.width
                    this.selectedObject.values.height = event.rect.height
                    this.trigger('object-update')
                }.bind(this))
        })

        //create a zipfile of the layout contents, and prompt the user to save it
        createZip() {
            var zip = new JSZip()
            zip.file('layout.nut', this.generateCode())
            var resources = zip.folder('resources')
            this.config.files.forEach(function(file) {
                resources.file( ( file.type == 'font' ) ? file.label : file.name, file.data.replace('data:;base64,', '').replace('data:image/png;base64,', ''), { base64: true } )
            })
            zip.generateAsync({ type: 'blob' }).then(function(content) {
                showModal('<p>Your download has started. Enjoy!</p><button onclick="closeModal()">Close</button>')
                saveAs(content, "am-builder.zip")
                //<a href="data:application/zip;base64,' + content + '">Download now</a>
            })
        }

        //generates the squirrel code needed for AM layouts
        generateCode() {
            //save current aspect
            this.updateAspect(this.aspect)

            var code =  ''
            code += '///////////////////////////////////////\n'
            code += '// Generated with AMBuilder 1.0\n'
            code += '// https://github.com/liquid8d/am-builder\n'
            code += '///////////////////////////////////////\n'
            code += '\n'
            code += '//layout configuration\n'
            code += 'fe.layout.width = ' + this.values.width + '\n'
            code += 'fe.layout.height = ' + this.values.height + '\n'
            code += 'fe.layout.font = "' + this.values.font + '"\n'
            code += 'fe.layout.base_rotation = ' + this.values.base_rotation + '\n'
            code += 'fe.layout.toggle_rotation = ' + this.values.toggle_rotation + '\n'
            code += 'fe.layout.page_size = ' + this.values.page_size + '\n'
            code += 'fe.layout.preserve_aspect_ratio = ' + this.values.preserve_aspect_ratio + '\n'
            code += '\n'
            code += '//stored aspect values\n'
            code += 'local aspect = "Standard (4x3)"\n'
            //write out properties for all aspects
            code += 'local props = {\n'
            var availableAspects = []
            Object.keys(this.config.objects[0].aspect_values).forEach(function(key) {
                availableAspects.push(key)
            })
            availableAspects.forEach(function(aspect, idx) {
                code += '   "' + aspect + '": {\n'
                var objCount = 0
                this.config.objects.forEach(function(obj) {
                    if ( obj.aspect_values[aspect] ) {
                        objCount++
                        var objId = obj.type + obj.id
                        //we have to convert constant strings to constants here
                        code += '      "' + objId + '":' + JSON.stringify(obj.aspect_values[aspect])
                            .replace('"Align.Left"', 'Align.Left')
                            .replace('"Align.Centre"', 'Align.Centre')
                            .replace('"Align.Left"', 'Align.Right')
                        code += ( objCount < this.config.objects.length ) ? ',\n' : '\n'
                    }
                }.bind(this))
                code += ( idx < availableAspects.length -1 ) ? '   },\n' : '   }\n'
            }.bind(this))
            code += '}\n\n'
            //write out object code
            this.config.objects.forEach(function(obj) {
                var objId = obj.type + obj.id
                var objCode = utils.replaceAll(obj.toSquirrel(), '[object]', objId )
                objCode = utils.replaceAll(objCode, '[props]', 'props[aspect]["' + objId + '"]' )
                code += objCode + '\n'
            }.bind(this))
            return code
        }

        //save current object aspect settings and switch to a new one
        updateAspect(aspect) {
            var layout = this.root.querySelector('.layout')
            switch (aspect) {
                case 'Standard (4x3)':
                    layout.style.width = '640px'
                    layout.style.height = '480px'
                    break
                case 'Standard Vert (3x4)':
                    layout.style.width = '480px'
                    layout.style.height = '640px'
                    break
                case 'Wide (16x10)':
                    layout.style.width = '1280px'
                    layout.style.height = '800px'
                    break
                case 'Wide Vert (10x16)':
                    layout.style.width = '800px'
                    layout.style.height = '1280px'
                    break
                case 'HD (16x9)':
                    layout.style.width = '1024px'
                    layout.style.height = '576px'
                    break
                case 'HD Vert (9x16)':
                    layout.style.width = '576px'
                    layout.style.height = '1024px'
                    break
            }
            console.log( 'switch from ' + this.aspect + ' to ' + aspect )
            this.config.objects.forEach(function(obj) {
                //store current aspect values
                obj.aspect_values[this.aspect] = JSON.parse(JSON.stringify(obj.values))
                if ( obj.aspect_values[aspect] ) obj.values = JSON.parse(JSON.stringify(obj.aspect_values[aspect]))
                obj.updateElement()
            }.bind(this))
            this.aspect = aspect
            this.trigger('object-update')
        }

        setZoom(per) {
            //this.root.style.zoom = scale
            this.root.querySelector('.layout').style.zoom = per + '%'
            this.config.editor.zoom = per
        }

        deleteSelected() {
            this.deleteObject(this.selectedObject)
        }

        startDrag(e) {
            if ( !this.selectedObject.locked ) {
                //console.log('start drag ' + this.dragType)
                this.root.onmouseup = function(e) {
                    //stop drag
                    this.isDragging = false
                }.bind(this)
                this.isDragging = true
                e.stopPropagation()
            }
        }

        this.on('mount', function() {
            this.root.querySelector('.layout').onmousemove = function(e) {
                var scale = ( this.config.editor.zoom / 100 )
                var x = e.layerX / scale,
                    y = e.layerY / scale
                barBottom.setMessage(1, 'x: ' + x + ' y: ' + y )
            }.bind(this)
        })
    </script>
</layout>