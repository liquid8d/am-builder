<menu-files>
    <style scoped>
        .list .item { cursor: pointer; }
        .list .item span { flex-grow: 1; overflow: hidden; pointer-events: none; }
        .preview { border: 1px solid rgb(25,25,25); width: 100%; height: 64px; background-size: cover; margin: 7px 0 7px 0; }
        .dropzone { padding: 5px; border: 1px dashed #555; }
        .dropzone.over { border: 1px dashed #999933 }
        input[type='file'] { margin-top: 7px; }
    </style>
    <div class="dropzone" dragenter="{onDragEnter}" dragleave="{onDragLeave}" dragover="{onDragOver}" ondrop="{onDrop}">
        <p style="margin: 0; pointer-events: none;">{ opts.drop_msg }</p>
    </div>
    <div class="preview" class="preview"></div>
    <div if="{ show() }" class="list">
        <div each="{ item in fileList() }" class="item" data-id="{ item.id }" onclick="{ preview }">
            <span>{ item.label }</span>
            <div class="icon trash" onclick="{ remove }"></div>
        </div>
    </div>
    <script>
        this.layout = null

        //whether to show the files
        show() {
            return ( this.layout && this.layout.config.files.length > 0 ) ? true : false
        }

        fileList() {
            var fileList = []
            layout.config.files.forEach(function(file) {
                if ( file.type == this.opts.file_type ) fileList.push(file)
            }.bind(this))
            return fileList
        }

        //handle dragged file events
        onDragEnter(e) {
            this.root.querySelector('.dropzone').classList.add('over')
        }
        onDragLeave(e) {
            this.root.querySelector('.dropzone').classList.remove('over')
        }
        onDragOver(e) {
            e.stopPropagation()
            e.preventDefault()
            e.dataTransfer.dropEffect = 'copy'
        }

        //handle dropped files
        onDrop(e) {
            this.root.querySelector('.dropzone').classList.remove('over')
            e.stopPropagation()
            e.preventDefault()
            var files = e.dataTransfer.files
            if ( FileReader && files && files.length ) {
                for ( var i = 0, f; f = files[i]; i++) {
                    var supported = false

                    if ( f.type && f.type.match( this.opts.allowed ) != null ) {
                        //known file type, matches allowed regex
                        supported = true
                    } else {
                        //check allowed extensions for unknown file types
                        if ( this.opts.allowed.length > 0 ) {
                            this.opts.allowed.split(',').forEach(function(ext) {
                                var fileExt = f.name.substr( f.name.length - ext.length, f.name.length ).toLowerCase()
                                if ( ext === fileExt ) supported = true
                            })
                        }
                    }

                    if  ( supported ) {
                        var fileType = this.opts.file_type
                        var reader = new FileReader()
                        reader.onload = (function(theFile) {
                            return function(e) {
                                //process
                                console.log( 'processed: ' + theFile.name )
                                layout.addFile({
                                    label: theFile.name,
                                    name: theFile.name.replace('.TTF', '').replace('.OTF', '').replace('.ttf', '').replace('.otf', ''),
                                    type: fileType,
                                    data: e.target.result,
                                })
                            }
                        })(f)
                        reader.readAsDataURL(f)
                    } else {
                        console.warn('unsupported file type, expected: ' + this.opts.allowed )
                    }
                }
            } else {
                console.warn('browser may not support FileReader?')
            }
        }

        preview(e) {
            var clicked = layout.findFile( e.target.getAttribute('data-id') )
            if ( clicked ) {
                //update preview
                var preview = this.root.querySelector('.preview')
                if ( clicked.data ) {
                    switch( clicked.type ) {
                        case 'media':
                            preview.style.background = 'url(\'' + clicked.data + '\') no-repeat center'
                            preview.style.backgroundSize = 'contain'
                            break
                        case 'font':
                            preview.innerHTML = 'Example'
                            preview.style.fontFamily = clicked.name
                            preview.style.fontSize = '16px'
                            break
                        default:
                            preview.innerHTML = 'No preview available'
                            console.log('can not preview that file type yet')
                            break
                    }
                }

                //set selected media item
                this.root.querySelectorAll('.list .item').forEach(function(item) {
                    item.classList.remove('selected')
                })
                e.target.classList.add('selected')
            }
        }

        //remove selected file
        remove(e) {
            var clicked = layout.findFile( e.target.parentElement.getAttribute('data-id') )
            layout.deleteFile( clicked )
            //var preview = this.root.querySelector('.preview')
            //preview.style.background = ''
        }

        //set and monitor layout events
        setLayout(layout) {
            this.layout = layout
            this.layout.on( 'file-added', function(f) {
                if ( f.type == this.opts.file_type ) {
                    switch( f.type ) {
                        case 'font':
                            console.log('adding font')
                            var style = document.createElement('style')
                            style.innerHTML = '@font-face { font-family: \'' + f.name + '\'; src: local(\'☺\'), url(\'' + f.data + '\') format("opentype"); }'
                            document.head.appendChild(style)
                            break
                    }
                }
                this.update();
            }.bind(this) )
            this.update()
        }

    </script>
</menu-files>
