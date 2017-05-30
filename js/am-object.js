function AMObject() {
    this.id = 0
    this.label = ''
    this.locked = false
    this.type = ''
    this.el = null
    this.values = {}
    this.aspect_values = {}
    this.props = {
        x: { label: 'x', type: 'number', default: 0, size: 4 },
        y: { label: 'y', type: 'number', default: 0, size: 4 },
        width: { label: 'width', type: 'number', default: 100, size: 4 },
        height: { label: 'height', type: 'number', default: 100, size: 4 },
        visible: { label: 'visible', type: 'bool', default: true },
        rotation: { label: 'rotation', type: 'range', default: 0, min: 0, max: 359 },
        zorder: { label: 'zorder', type: 'number', default: -1, min: -1, max: 99, size: 2 }
    }
    Object.keys(this.props).forEach(function(key) {
        this.values[key] = this.props[key].default
    }.bind(this))
}
