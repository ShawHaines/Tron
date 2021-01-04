import {myNode} from './myNode.js'
import {m4} from './main.js'


var initNodeSet = function(nodes)
{
    var base_node = new myNode();
    var viking_room_node = new myNode();
    var paper_plane_node = new myNode();
    var NaturePack_Part1_node = new myNode();
    var sun_node = new myNode();
    var customized_light_nodes = [];
    for(var i = 0; i < 5; i++)
    {
        customized_light_nodes.push(new myNode());
    }

    nodes.base_node = base_node;
    nodes.viking_room_node = viking_room_node;
    nodes.paper_plane_node = paper_plane_node;
    nodes.NaturePack_Part1_node = NaturePack_Part1_node;
    nodes.sun_node = sun_node;
    nodes.customized_light_nodes = customized_light_nodes;
};

/** create nodes for objects **/
function setFrameTree(nodes){

    /** Set relationship of the scene graph **/
    nodes.NaturePack_Part1_node.setParent(nodes.base_node);
    nodes.paper_plane_node.setParent(nodes.base_node);
    nodes.viking_room_node.setParent(nodes.base_node);

    /** Set Local Matrix **/
    let world = m4.identity();    
    // Set base node
    // world = m4.identity();
    // world = m4.multiply(world, m4.translation([0, -15, 0]));
    // m4.copy(world, nodes.base_node.localMatrix);
    
    //Set local matrix of sun
    world = m4.identity();
    world = m4.multiply(world, m4.translation([0, 80, 80]));
    m4.copy(world, nodes.sun_node.localMatrix);

    //Set local matrix of customized lights
    world = m4.identity();
    world = m4.multiply(world, m4.translation([0, 80, -80]));
    m4.copy(world, nodes.customized_light_nodes[0].localMatrix);
    
    //Set local matrix of NaturePack_Part1.
    world = m4.identity();
    world = m4.multiply(world, m4.translation([0, 0, 0]));
    m4.scale(world, [10, 10, 10], world);
    m4.copy(world, nodes.NaturePack_Part1_node.localMatrix);
    
    //Set local matrix of viking_room.
    world = m4.identity();
    world = m4.multiply(world, m4.rotationY(-135 * Math.PI / 180));
    world = m4.multiply(world, m4.rotationX(-90 * Math.PI / 180));
    m4.scale(world, [30, 30, 30], world);
    m4.copy(world, nodes.viking_room_node.localMatrix);
    
    //Set local matrix of paper_plane.
    world = m4.identity();
    world = m4.multiply(world, m4.translation([0, 14, 45]));
    world = m4.multiply(world, m4.rotationZ(200 * Math.PI / 180));
    world = m4.multiply(world, m4.rotationY(170 * Math.PI / 180));
    world = m4.multiply(world, m4.rotationX(25 * Math.PI / 180));
    m4.scale(world, [0.02, 0.02, 0.02], world);
    m4.copy(world, nodes.paper_plane_node.localMatrix);
}

export {initNodeSet, setFrameTree}