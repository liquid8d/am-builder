<menu-data>
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
    </script>
</menu-data>