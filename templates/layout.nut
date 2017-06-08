///////////////////////////////////////
// Generated with AMBuilder 1.0
// https://github.com/liquid8d/am-builder
///////////////////////////////////////

//layout configuration
fe.layout.width =  [fe.layout.width]
fe.layout.height = [fe.layout.height]
fe.layout.font = "[fe.layout.font]"
fe.layout.base_rotation = [fe.layout.base_rotation]
fe.layout.toggle_rotation = [fe.layout.toggle_rotation]
fe.layout.page_size = [fe.layout.page_size]
fe.layout.preserve_aspect_ratio = [fe.layout.preserve_aspect_ratio]

// Stored Aspects
local aspect = "[defaultAspect]"
local aspects = [aspects]

// Stored Object Properties
local props = [props]

// Create AM Objects
[objects]

local triggers = [triggers]

fe.add_transition_callback(this, "on_transition")
fe.add_ticks_callback(this, "on_tick")

function on_transition( ttype, var, ttime ) {
    return false
}

function on_tick( ttime ) {

}