<resizer onmousedown="{start}">
    <style>
        :scope {
            display: flex;
            flex-basis: 3px;
        }
        :scope:hover {
            cursor: ew-resize;
        }
        resizer {
            background: rgb(20,20,20);
            border-left: 1px solid rgb(15,15,15);
            border-right: 1px solid rgb(15,15,15);
        }
    </style>
    <div class="resizer"></div>
    <script>
        this.isResizing = false
        start(e) {
            //start
            this.isResizing = true
            document.onmouseup = function() {
                //stop
                this.isResizing = false
                document.onmousemove = function() {}
            }.bind(this)
            document.onmousemove = function(e) {
                //resize
                if ( this.isResizing ) {
                    this.trigger('resize', e)
                }
            }.bind(this)
        }
    </script>
</resizer>