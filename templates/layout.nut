///////////////////////////////////////
// Generated with AMBuilder 1.0
// https://github.com/liquid8d/am-builder
///////////////////////////////////////

//layout configuration
//fe.layout.width = [fe.layout.width]
//fe.layout.height = [fe.layout.height]
fe.layout.preserve_aspect_ratio = [fe.layout.preserve_aspect_ratio]
fe.layout.font = "[fe.layout.font]"
fe.layout.base_rotation = [fe.layout.base_rotation]
fe.layout.toggle_rotation = [fe.layout.toggle_rotation]
fe.layout.page_size = [fe.layout.page_size]

// Stored Object Properties
local props = [props]

// Find correct aspect
function findAspect( ratio ) {
    if ( ratio == 1.77778 ) return "HD (16x9)"
    else if ( ratio == 1.6 ) return "Wide (16x10)"
    else if ( ratio == 1.33333 ) return "Standard (4x3)"
    else if ( ratio == 1.25 ) return "SXGA (5x4)"
    else if ( ratio == 0.625 ) return "Wide Vert (10x16)"
    else if ( ratio == 0.5625 ) return "HD Vert (9x16)"
    else if ( ratio == 0.75 ) return "Standard Vert (3x4)"
    //use default aspect
    print("Unrecognized or missing aspect, using default: [defaultAspect]")
    return "[defaultAspect]"
}

local aspects = [aspects]
local aspect = findAspect( ScreenWidth / ( ScreenHeight * 1.0 ) )
print( "Layout Aspect: " + aspect + "\n ")


// Create AM Objects
[objects]

// Begin Triggers
/*
local triggers = [triggers]

fe.add_transition_callback(this, "on_transition")
fe.add_ticks_callback(this, "on_tick")

function on_transition( ttype, var, ttime ) {
    return false
}

function on_tick( ttime ) {

}
*/