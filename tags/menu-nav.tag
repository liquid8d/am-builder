<menu-nav>
    <style scoped>
        .container { padding: 5px; }
    </style>
    <div class="container">
        <div style="display: flex; align-items: center;">
            <label style="flex-grow: 1">Game</label>
            <button if="{layout}" onclick="{layout.prev_rom}">Prev</button>
            <button if="{layout}" onclick="{layout.next_rom}">Next</button>
        </div>
        <div style="display: flex; align-items: center;">
            <label style="flex-grow: 1">Display</label>
            <button if="{layout}" onclick="{layout.prev_display}">Prev</button>
            <button if="{layout}" onclick="{layout.next_display}">Next</button>
        </div>
        <div style="display: flex; align-items: center;">
            <label style="flex-grow: 1">Filter</label>
            <button if="{layout}" onclick="{layout.prev_filter}">Prev</button>
            <button if="{layout}" onclick="{layout.next_filter}">Next</button>
        </div>
    </div>
    <script>
        this.layout = null
        setLayout(layout) {
            this.layout = layout
            this.update()
        }
    </script>
</menu-nav>