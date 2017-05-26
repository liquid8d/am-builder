<menu-media>
    <style scoped>
        .list .item { cursor: pointer; }
        .list .item span { flex-grow: 1; overflow: hidden; pointer-events: none; }
        .preview { border: 1px solid rgb(20,20,20); width: 100%; height: 64px; background-size: cover; margin-bottom: 7px; }
        .dropzone { padding: 5px; border: 1px dashed #555; }
        .dropzone.over { border: 1px dashed #999933 }
        input[type='file'] { margin-top: 7px; }
    </style>
    <div class="dropzone" dragenter="{onDragEnter}" dragleave="{onDragLeave}" dragover="{onDragOver}" ondrop="{onDrop}">
        <p style="margin: 0; pointer-events: none;">Drag and drop your files here</p>
    </div>
    <div class="preview" class="preview"></div>
    <div if="{ showMedia() }" class="list">
        <div each="{ item in layout.config.media }" class="item" data-id="{ item.id }" onclick="{ previewMedia }">
            <span>{ item.label }</span>
            <div class="icon trash" onclick="{ deleteMedia }"></div>
        </div>
    </div>
    <div if="{ !showMedia() }">
        <span>No media</span>
    </div>
    <script>
        this.layout = null

        //whether to show the media
        showMedia() {
            return ( this.layout && this.layout.config.media.length > 0 ) ? true : false
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

        //handle dropped media files
        onDrop(e) {
            this.root.querySelector('.dropzone').classList.remove('over')
            e.stopPropagation()
            e.preventDefault()
            var files = e.dataTransfer.files
            if ( FileReader && files && files.length ) {
                for ( var i = 0, f; f = files[i]; i++) {
                    if ( !f.type.match('image.*'))
                        continue
                    var reader = new FileReader()
                    reader.onload = (function(theFile) {
                        return function(e) {
                            //process
                            console.log( 'processed: ' + theFile.name )
                            layout.addMedia({
                                label: theFile.name,
                                name: theFile.name,
                                data: e.target.result
                            })
                        }
                    })(f)
                    reader.readAsDataURL(f)
                }
            } else {
                console.warn('browser may not support FileReader?')
            }
        }

        previewMedia(e) {
            var clickedMedia = layout.findMedia( e.target.getAttribute('data-id') )
            if ( clickedMedia ) {
                //update preview
                var preview = this.root.querySelector('.preview')
                if ( clickedMedia.data )
                    preview.style.background = 'url(\'' + clickedMedia.data + '\') no-repeat center'
                preview.style.backgroundSize = 'contain'

                //set selected media item
                this.root.querySelectorAll('.list .item').forEach(function(item) {
                    item.classList.remove('selected')
                })
                e.target.classList.add('selected')
            }
        }

        //delete selected media
        deleteMedia(e) {
            var clickedMedia = layout.findMedia( e.target.parentElement.getAttribute('data-id') )
            layout.deleteMedia( clickedMedia )
            //var preview = this.root.querySelector('.preview')
            //preview.style.background = ''
        }

        //set and monitor layout events
        setLayout(layout) {
            this.layout = layout
            this.layout.on( 'media-added', function() { this.update(); }.bind(this) )
            this.update()
        }
    </script>
</menu-media>
