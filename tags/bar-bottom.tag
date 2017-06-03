<bar-bottom>
    <button onclick="riot.mixin('utils').toggleFullscreen()">Fullscreen</button>
    <button onclick="{showCode}">View Code</button>
    <button if="{layout}" onclick="{layout.saveZip}">Download ZIP</button>
    <button if="{layout}" onclick="{layout.clear}">Clear</button>
    <button if="{layout}" onclick="{layout.save}">Save</button>
    <button if="{layout}" onclick="{layout.resume}">Resume</button>
    <div id="msg1" style="margin: 0 1em 0 1em; font-size: 12px;"></div>
    <div id="msg2" style="margin: 0 1em 0 1em; font-size: 12px;"></div>
    <div id="msg3" style="margin: 0 1em 0 1em; font-size: 12px;"></div>
    <script>
        this.layout = null
        setLayout(layout) {
            this.layout = layout
            this.layout.on('object-selected', function() {
                if ( !this.layout.selectedObject ) return
                this.setMessage( 2, this.layout.selectedObject.type + ': ' + this.layout.selectedObject.values.x + 'x' + this.layout.selectedObject.values.y + ' ' + this.layout.selectedObject.values.width + 'x' + this.layout.selectedObject.values.height )
            }.bind(this))
            this.layout.on('object-update', function() {
                if ( !this.layout.selectedObject ) return
                this.setMessage( 2, this.layout.selectedObject.type + ': ' + this.layout.selectedObject.values.x + 'x' + this.layout.selectedObject.values.y + ' ' + this.layout.selectedObject.values.width + 'x' + this.layout.selectedObject.values.height )
            }.bind(this))
            this.layout.on('object-deselected', function() {
                this.setMessage(2, '')
            }.bind(this))
            this.update()
        }
        setMessage(which, msg) {
            this.root.querySelector('#msg' + which).innerHTML = msg
        }
        showCode() {
            showModal('<textarea style="flex-grow: 1">' + this.layout.generateCode() + '</textarea><button onclick="closeModal()">Close</button>')
        }
    </script>
</bar-bottom>