<menu>
    <style scoped>
        :scope { display: block; margin: 0; padding: 0; overflow: auto; }
        .items { margin: 0; padding: 5px; }
        .item .header { background: #333; color: #999; }
        .item .header h1 { margin: 0; flex-grow: 1; padding: 0; font-size: 80%; cursor: pointer; }
        .item .header .state.collapsed::after { content: "+"; }
        .item .header .state.expanded::after { margin-right: 2px; content: '-'; }
        .item .header, .item .link, .item .label { display: flex; align-items: center; padding: 7px; margin: 5px; cursor: pointer; box-sizing: border-box; }
        .item .label { cursor: default; }
        .item .content { display: flex; flex-direction: column; font-size: 14px; margin: 0; padding: 5px; overflow: auto; box-sizing: border-box; }
    </style>
    
    <!-- item container -->
    <div class="items">
        <div class="item item-{idx}" each={ item, idx in opts.items}>
            <!-- clickable label -->
            <div if="{!item.content && item.label && item.onclick }" class="link" onclick="{item.onclick.bind(this, this)}">{item.label}</div>
            <!-- label -->
            <span if="{!item.content && item.label && !item.onclick }" class="label">{item.label}</span>
            <!-- collapsable header -->
            <div if="{item.content && item.label && item.foldable}" class="header" onclick="{clickHeader.bind(this,idx)}">
                <h1>{item.label}</h1>
                <div class="state expanded"></div>
            </div>
            <!-- non-collapsable header -->
            <div if="{item.content && item.label && !item.foldable}" class="header" style="cursor:default;">
                <h1>{item.label}</h2>
            </div>
            <!-- item content -->
            <div if="{item.content}" class="item-{idx} content">Some content</div>
        </div>
    </div>
    <script>
        toggle(showClass) {
            if ( !showClass ) showClass = 'block'
            this.root.style.display = ( this.root.style.display == 'none' || this.root.style.display == '' ) ? showClass : 'none'
        }
        
        hide() {
            this.root.style.display = 'none'
        }

        show(showClass) {
            if ( !showClass ) showClass = 'block'
            this.root.style.display = showClass
        }

        clickHeader(idx) {
            this.toggleContent(idx)
            if ( this.opts.accordian ) {
                //only allow one expandable element, unless keepOpen is specified
                this.opts.items.forEach(function( item, i ) {
                    if ( item.foldable && i != idx )
                        if ( !item.keepOpen )
                            this.collapse(i)
                }.bind(this))
            }
        }

        toggleContent(idx) {
            var header = this.root.querySelector('.item-' + idx + ' .header')
            var content = this.root.querySelector('.item-' + idx + '.content')
            if ( content.style.display == 'block' || content.style.display == '' )
                this.collapse(idx)
            else
                this.expand(idx)
        }

        collapse(idx) {
            var header = this.root.querySelector('.item-' + idx + ' .header')
            var content = this.root.querySelector('.item-' + idx + '.content')
            if ( content ) content.style.display = 'none'
            if ( header ) {
                var state = header.querySelector('.state')
                if ( state ) state.className = 'state collapsed'
            }
        }

        expand(idx) {
            var header = this.root.querySelector('.item-' + idx + ' .header')
            var content = this.root.querySelector('.item-' + idx + '.content')
            if ( content ) content.style.display = 'block'
            if ( header ) {
                var state = header.querySelector('.state')
                if ( state ) state.className = 'state expanded'
            }
        }

        setHtmlById(id, html) {
            this.opts.items.forEach(function(item, idx) {
                if ( item.id == id ) this.setHtml(idx, html)
            }.bind(this))
        }

        setHtml(idx, html) {
           var content = this.root.querySelector('.item-' + idx + '.content')
           if ( content ) content.innerHTML = html
        }

        setMenu(opts) {
            this.opts = opts
            this.update()

            this.opts.items.forEach(function(item, idx) {
                this.setHtml( idx, item.content)
                var content = this.root.querySelector('.item-' + idx + '.content')
                if ( content ) {
                    var style = ''
                    if ( item.minHeight ) style += 'min-height: ' + item.minHeight + ';'
                    if ( item.maxHeight ) style += 'max-height: ' + item.maxHeight + ';'
                    content.style.cssText = style
                }
                if ( item.foldable && !item.expand ) this.collapse(idx)
            }.bind(this))
        }

        this.on('mount', function() {
             if ( this.opts.items ) this.setMenu(this.opts)
        })

    </script>
</menu>