<menu-tools>
    <div class="no-select icon text" title="Text" onclick="{addText}"></div>
    <div class="no-select icon image" title="Image" onclick="{addImage}"></div>
    <div class="no-select icon artwork" title="Artwork" onclick="{addArtwork}"></div>
    <div class="no-select icon listbox" title="Listbox" onclick="{addListBox}"></div>
    <div class="no-select icon surface" title="Surface" onclick=""></div>
    <div class="no-select icon clone" title="Clone" onclick=""></div>
    <script>
        addText() {
            layout.addAMObject( new AMText() )
        }
        addImage() {
            layout.addAMObject( new AMImage() )
        }
        addArtwork() {
            var art = new AMImage()
            art.values.isArtwork = true
            layout.addAMObject(art)
        }
        addListBox() {
            layout.addAMObject( new AMListBox() )
        }
    </script>
</menu-tools>

                