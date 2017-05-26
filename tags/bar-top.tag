<bar-top>
    <style scoped>
        span { margin: 0 5px 0 5px; }
    </style>
    <span>Aspect</span>
    <select if="{layout}" id="aspect" onchange="{updateAspect}">
        <option if="{layout}" each="{ val in layout.aspects }" value="{val}" selected="{ val == layout.aspect }">{val}</option>
    </select>
    <span>Zoom</span>
    <select id="zoom" onchange="{setZoom}">
        <option each="{ val in zoomLevels }" value="{val}" selected="{ val == defaultZoom }">{val}%</option>
    </select>
    <span>Show Grid</span>
    <input if="{layout}" type="checkbox" checked onchange="{layout.toggleGridlines}" />
    <script>
        this.zoomLevels = [ 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200 ]
        this.defaultZoom = 100
        this.layout = null
        setLayout(layout) {
            this.layout = layout
            this.update()
        }
        updateAspect(e) {
            layout.updateAspect( e.target.selectedOptions[0].value )
        }
        setZoom(e) {
            layout.setZoom( e.target.selectedOptions[0].value )
        }
    </script>
</bar-top>