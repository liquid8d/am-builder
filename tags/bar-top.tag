<bar-top>
    <style scoped>
        span { margin: 0 5px 0 5px; }
    </style>
    <span>Aspect</span>
    <select if="{layout}" id="aspect" onchange="{updateAspect}">
        <option if="{layout}" each="{ val in layout.aspects }" value="{val}" selected="{ val == layout.aspect }">{val}</option>
    </select>
    <span>Zoom</span>
    <div if="{layout}" class="dropdown">
        <input type="text" value="{ layout.config.editor.zoom }%" onchange="{ setZoom }" />
        <select id="zoom" onchange="{ setZoom }">
            <option each="{ val in layout.config.editor.zoomLevels }" value="{val}" selected="{ layout.config.editor.zoom == val }">{val}%</option>
        </select>
    </div>
    <span>Show Grid</span>
    <input if="{layout}" type="checkbox" checked onchange="{layout.toggleGridlines}" />
    <span>Snap to Grid</span>
    <input if="{layout}" type="checkbox" checked onchange="{layout.toggleSnap}" />
    <script>
        this.defaultZoom = 100
        this.layout = null
        setLayout(layout) {
            this.layout = layout
            this.layout.on( 'editor-update', function () { this.update() }.bind(this) )
            this.update()
        }
        updateAspect(e) {
            layout.updateAspect( e.target.selectedOptions[0].value )
        }
        setZoom(e) {
            if ( e.target.tagName == 'SELECT' ) {
                layout.setZoom( e.target.selectedOptions[0].value )
            } else {
                layout.setZoom( e.target.value.replace('%', '') )
            }
        }
    </script>
</bar-top>