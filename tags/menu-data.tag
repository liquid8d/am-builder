<menu-data>
    <button if="{layout}" onclick="{layout.next_rom}">Next Rom</button>
    <button if="{layout}" onclick="{layout.prev_rom}">Previous Rom</button>
    <button if="{layout}" onclick="{layout.next_display}">Next Display</button>
    <button if="{layout}" onclick="{layout.prev_display}">Previous Display</button>
    <button onclick="{editData}">Edit Data</button>
    <script>
        this.layout = null
        setLayout(layout) {
            this.layout = layout
            this.update()
        }
        editData() {
            showModal('<textarea style="flex-grow: 1">' + JSON.stringify(data, null, '\t') + '</textarea><button onclick="closeModal()">Close</button>')
        }
        setListIndex(e) {
            this.layout.setListIndex(e.target.value)
        }
    </script>
</menu-data>