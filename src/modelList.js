const naturePackModelNames = [
    "arch1", 
    "arch2", 
    "axe", 
    "ball_tree1", 
    "ball_tree2", 
    "ball_tree3", 
    "ball_tree4", 
    "ball_tree5", 
    "ball_tree6", 
    "branch1", 
    "branch2", 
    "bridge", 
    "brown_tree1", 
    "brown_tree2", 
    "bush1", 
    "bush2", 
    "bush3", 
    "bush4", 
    "camp_fire1", 
    "camp_fire2", 
    "cap_tree1", 
    "cap_tree2", 
    "cap_tree3", 
    "dark_pine_tree1", 
    "dark_pine_tree2", 
    "dark_pine_tree3", 
    "dead_tall_pine_tree1", 
    "dead_tall_pine_tree2", 
    "dead_tree1", 
    "dead_tree2", 
    "dead_tree3", 
    "dead_tree4", 
    "dead_tree5", 
    "fence1", 
    "fence2", 
    "fence3", 
    "flower10", 
    "flower11", 
    "flower1", 
    "flower2", 
    "flower3", 
    "flower4", 
    "flower5", 
    "flower6", 
    "flower7", 
    "flower8", 
    "flower9", 
    "fork_tree1", 
    "fork_tree2", 
    "fork_tree3", 
    "grass10", 
    "grass11", 
    "grass12", 
    "grass13", 
    "grass1", 
    "grass2", 
    "grass3", 
    "grass4", 
    "grass5", 
    "grass6", 
    "grass7", 
    "grass8", 
    "grass9", 
    "house", 
    "huge_rock1", 
    "huge_rock2", 
    "huge_rock3", 
    "indicator", 
    "light_fat_pine_tree1", 
    "light_fat_pine_tree2", 
    "log1", 
    "log2", 
    "log3", 
    "log4", 
    "log5", 
    "log6", 
    "log7", 
    "mine1", 
    "mine2", 
    "mine3", 
    "mushroom10", 
    "mushroom11", 
    "mushroom12", 
    "mushroom13", 
    "mushroom14", 
    "mushroom15", 
    "mushroom16", 
    "mushroom17", 
    "mushroom18", 
    "mushroom19", 
    "mushroom1", 
    "mushroom2", 
    "mushroom3", 
    "mushroom4", 
    "mushroom5", 
    "mushroom6", 
    "mushroom7", 
    "mushroom8", 
    "mushroom9", 
    "pillar1", 
    "pillar2", 
    "pillar3", 
    "rock10", 
    "rock11", 
    "rock12", 
    "rock14", 
    "rock15", 
    "rock16", 
    "rock17", 
    "rock18", 
    "rock19", 
    "rock1", 
    "rock20", 
    "rock21", 
    "rock2", 
    "rock3", 
    "rock4", 
    "rock5", 
    "rock6", 
    "rock7", 
    "rock8", 
    "rock9", 
    "stone_path1", 
    "stone_path2", 
    "street_lamp", 
    "stump1", 
    "stump2", 
    "stump3", 
    "stump4", 
    "stump5", 
    "stump6", 
    "tall_pine_tree1", 
    "tall_pine_tree2", 
    "tall_pine_tree3", 
    "tall_pine_tree4", 
    "tomb1", 
    "tomb2", 
    "tomb3", 
    "tomb4", 
    "wooden_stick1", 
    "wooden_stick2", 
    "wooden_stick3", 
];

const models = [
    {
        name: 'viking_room',
        obj: './resource/viking_room.obj', // located in the models folder on the server
        mtl: './resource/viking_room.mtl',
    },
    {
        name: 'paper_plane',
        obj: './resource/paper+airplane.obj',
    },
    {
        name: 'fighter',
        obj: './resource/rff.obj',
        mtl: './resource/rff.mtl',
    },
    // {
    //     name: 'NaturePack_Part1',
    //     obj: './resource/NaturePack_Part1.obj',
    //     mtl: './resource/NaturePack_Part1.mtl',
    // },
    {
        name: 'arch1',
        obj: './resource/NaturePack/arch1.obj',
        mtl: './resource/NaturePack/arch1.mtl',
    },
    {
        name: 'arch2',
        obj: './resource/NaturePack/arch2.obj',
        mtl: './resource/NaturePack/arch2.mtl',
    },
    {
        name: 'axe',
        obj: './resource/NaturePack/axe.obj',
        mtl: './resource/NaturePack/axe.mtl',
    },
    {
        name: 'ball_tree1',
        obj: './resource/NaturePack/ball_tree1.obj',
        mtl: './resource/NaturePack/ball_tree1.mtl',
    },
    {
        name: 'ball_tree2',
        obj: './resource/NaturePack/ball_tree2.obj',
        mtl: './resource/NaturePack/ball_tree2.mtl',
    },
    {
        name: 'ball_tree3',
        obj: './resource/NaturePack/ball_tree3.obj',
        mtl: './resource/NaturePack/ball_tree3.mtl',
    },
    {
        name: 'ball_tree4',
        obj: './resource/NaturePack/ball_tree4.obj',
        mtl: './resource/NaturePack/ball_tree4.mtl',
    },
    {
        name: 'ball_tree5',
        obj: './resource/NaturePack/ball_tree5.obj',
        mtl: './resource/NaturePack/ball_tree5.mtl',
    },
    {
        name: 'ball_tree6',
        obj: './resource/NaturePack/ball_tree6.obj',
        mtl: './resource/NaturePack/ball_tree6.mtl',
    },
    {
        name: 'branch1',
        obj: './resource/NaturePack/branch1.obj',
        mtl: './resource/NaturePack/branch1.mtl',
    },
    {
        name: 'branch2',
        obj: './resource/NaturePack/branch2.obj',
        mtl: './resource/NaturePack/branch2.mtl',
    },
    {
        name: 'bridge',
        obj: './resource/NaturePack/bridge.obj',
        mtl: './resource/NaturePack/bridge.mtl',
    },
    {
        name: 'brown_tree1',
        obj: './resource/NaturePack/brown_tree1.obj',
        mtl: './resource/NaturePack/brown_tree1.mtl',
    },
    {
        name: 'brown_tree2',
        obj: './resource/NaturePack/brown_tree2.obj',
        mtl: './resource/NaturePack/brown_tree2.mtl',
    },
    {
        name: 'bush1',
        obj: './resource/NaturePack/bush1.obj',
        mtl: './resource/NaturePack/bush1.mtl',
    },
    {
        name: 'bush2',
        obj: './resource/NaturePack/bush2.obj',
        mtl: './resource/NaturePack/bush2.mtl',
    },
    {
        name: 'bush3',
        obj: './resource/NaturePack/bush3.obj',
        mtl: './resource/NaturePack/bush3.mtl',
    },
    {
        name: 'bush4',
        obj: './resource/NaturePack/bush4.obj',
        mtl: './resource/NaturePack/bush4.mtl',
    },
    {
        name: 'camp_fire1',
        obj: './resource/NaturePack/camp_fire1.obj',
        mtl: './resource/NaturePack/camp_fire1.mtl',
    },
    {
        name: 'camp_fire2',
        obj: './resource/NaturePack/camp_fire2.obj',
        mtl: './resource/NaturePack/camp_fire2.mtl',
    },
    {
        name: 'cap_tree1',
        obj: './resource/NaturePack/cap_tree1.obj',
        mtl: './resource/NaturePack/cap_tree1.mtl',
    },
    {
        name: 'cap_tree2',
        obj: './resource/NaturePack/cap_tree2.obj',
        mtl: './resource/NaturePack/cap_tree2.mtl',
    },
    {
        name: 'cap_tree3',
        obj: './resource/NaturePack/cap_tree3.obj',
        mtl: './resource/NaturePack/cap_tree3.mtl',
    },
    {
        name: 'dark_pine_tree1',
        obj: './resource/NaturePack/dark_pine_tree1.obj',
        mtl: './resource/NaturePack/dark_pine_tree1.mtl',
    },
    {
        name: 'dark_pine_tree2',
        obj: './resource/NaturePack/dark_pine_tree2.obj',
        mtl: './resource/NaturePack/dark_pine_tree2.mtl',
    },
    {
        name: 'dark_pine_tree3',
        obj: './resource/NaturePack/dark_pine_tree3.obj',
        mtl: './resource/NaturePack/dark_pine_tree3.mtl',
    },
    {
        name: 'dead_tall_pine_tree1',
        obj: './resource/NaturePack/dead_tall_pine_tree1.obj',
        mtl: './resource/NaturePack/dead_tall_pine_tree1.mtl',
    },
    {
        name: 'dead_tall_pine_tree2',
        obj: './resource/NaturePack/dead_tall_pine_tree2.obj',
        mtl: './resource/NaturePack/dead_tall_pine_tree2.mtl',
    },
    {
        name: 'dead_tree1',
        obj: './resource/NaturePack/dead_tree1.obj',
        mtl: './resource/NaturePack/dead_tree1.mtl',
    },
    {
        name: 'dead_tree2',
        obj: './resource/NaturePack/dead_tree2.obj',
        mtl: './resource/NaturePack/dead_tree2.mtl',
    },
    {
        name: 'dead_tree3',
        obj: './resource/NaturePack/dead_tree3.obj',
        mtl: './resource/NaturePack/dead_tree3.mtl',
    },
    {
        name: 'dead_tree4',
        obj: './resource/NaturePack/dead_tree4.obj',
        mtl: './resource/NaturePack/dead_tree4.mtl',
    },
    {
        name: 'dead_tree5',
        obj: './resource/NaturePack/dead_tree5.obj',
        mtl: './resource/NaturePack/dead_tree5.mtl',
    },
    {
        name: 'fence1',
        obj: './resource/NaturePack/fence1.obj',
        mtl: './resource/NaturePack/fence1.mtl',
    },
    {
        name: 'fence2',
        obj: './resource/NaturePack/fence2.obj',
        mtl: './resource/NaturePack/fence2.mtl',
    },
    {
        name: 'fence3',
        obj: './resource/NaturePack/fence3.obj',
        mtl: './resource/NaturePack/fence3.mtl',
    },
    {
        name: 'flower10',
        obj: './resource/NaturePack/flower10.obj',
        mtl: './resource/NaturePack/flower10.mtl',
    },
    {
        name: 'flower11',
        obj: './resource/NaturePack/flower11.obj',
        mtl: './resource/NaturePack/flower11.mtl',
    },
    {
        name: 'flower1',
        obj: './resource/NaturePack/flower1.obj',
        mtl: './resource/NaturePack/flower1.mtl',
    },
    {
        name: 'flower2',
        obj: './resource/NaturePack/flower2.obj',
        mtl: './resource/NaturePack/flower2.mtl',
    },
    {
        name: 'flower3',
        obj: './resource/NaturePack/flower3.obj',
        mtl: './resource/NaturePack/flower3.mtl',
    },
    {
        name: 'flower4',
        obj: './resource/NaturePack/flower4.obj',
        mtl: './resource/NaturePack/flower4.mtl',
    },
    {
        name: 'flower5',
        obj: './resource/NaturePack/flower5.obj',
        mtl: './resource/NaturePack/flower5.mtl',
    },
    {
        name: 'flower6',
        obj: './resource/NaturePack/flower6.obj',
        mtl: './resource/NaturePack/flower6.mtl',
    },
    {
        name: 'flower7',
        obj: './resource/NaturePack/flower7.obj',
        mtl: './resource/NaturePack/flower7.mtl',
    },
    {
        name: 'flower8',
        obj: './resource/NaturePack/flower8.obj',
        mtl: './resource/NaturePack/flower8.mtl',
    },
    {
        name: 'flower9',
        obj: './resource/NaturePack/flower9.obj',
        mtl: './resource/NaturePack/flower9.mtl',
    },
    {
        name: 'fork_tree1',
        obj: './resource/NaturePack/fork_tree1.obj',
        mtl: './resource/NaturePack/fork_tree1.mtl',
    },
    {
        name: 'fork_tree2',
        obj: './resource/NaturePack/fork_tree2.obj',
        mtl: './resource/NaturePack/fork_tree2.mtl',
    },
    {
        name: 'fork_tree3',
        obj: './resource/NaturePack/fork_tree3.obj',
        mtl: './resource/NaturePack/fork_tree3.mtl',
    },
    {
        name: 'grass10',
        obj: './resource/NaturePack/grass10.obj',
        mtl: './resource/NaturePack/grass10.mtl',
    },
    {
        name: 'grass11',
        obj: './resource/NaturePack/grass11.obj',
        mtl: './resource/NaturePack/grass11.mtl',
    },
    {
        name: 'grass12',
        obj: './resource/NaturePack/grass12.obj',
        mtl: './resource/NaturePack/grass12.mtl',
    },
    {
        name: 'grass13',
        obj: './resource/NaturePack/grass13.obj',
        mtl: './resource/NaturePack/grass13.mtl',
    },
    {
        name: 'grass1',
        obj: './resource/NaturePack/grass1.obj',
        mtl: './resource/NaturePack/grass1.mtl',
    },
    {
        name: 'grass2',
        obj: './resource/NaturePack/grass2.obj',
        mtl: './resource/NaturePack/grass2.mtl',
    },
    {
        name: 'grass3',
        obj: './resource/NaturePack/grass3.obj',
        mtl: './resource/NaturePack/grass3.mtl',
    },
    {
        name: 'grass4',
        obj: './resource/NaturePack/grass4.obj',
        mtl: './resource/NaturePack/grass4.mtl',
    },
    {
        name: 'grass5',
        obj: './resource/NaturePack/grass5.obj',
        mtl: './resource/NaturePack/grass5.mtl',
    },
    {
        name: 'grass6',
        obj: './resource/NaturePack/grass6.obj',
        mtl: './resource/NaturePack/grass6.mtl',
    },
    {
        name: 'grass7',
        obj: './resource/NaturePack/grass7.obj',
        mtl: './resource/NaturePack/grass7.mtl',
    },
    {
        name: 'grass8',
        obj: './resource/NaturePack/grass8.obj',
        mtl: './resource/NaturePack/grass8.mtl',
    },
    {
        name: 'grass9',
        obj: './resource/NaturePack/grass9.obj',
        mtl: './resource/NaturePack/grass9.mtl',
    },
    {
        name: 'house',
        obj: './resource/NaturePack/house.obj',
        mtl: './resource/NaturePack/house.mtl',
    },
    {
        name: 'huge_rock1',
        obj: './resource/NaturePack/huge_rock1.obj',
        mtl: './resource/NaturePack/huge_rock1.mtl',
    },
    {
        name: 'huge_rock2',
        obj: './resource/NaturePack/huge_rock2.obj',
        mtl: './resource/NaturePack/huge_rock2.mtl',
    },
    {
        name: 'huge_rock3',
        obj: './resource/NaturePack/huge_rock3.obj',
        mtl: './resource/NaturePack/huge_rock3.mtl',
    },
    {
        name: 'indicator',
        obj: './resource/NaturePack/indicator.obj',
        mtl: './resource/NaturePack/indicator.mtl',
    },
    {
        name: 'light_fat_pine_tree1',
        obj: './resource/NaturePack/light_fat_pine_tree1.obj',
        mtl: './resource/NaturePack/light_fat_pine_tree1.mtl',
    },
    {
        name: 'light_fat_pine_tree2',
        obj: './resource/NaturePack/light_fat_pine_tree2.obj',
        mtl: './resource/NaturePack/light_fat_pine_tree2.mtl',
    },
    {
        name: 'log1',
        obj: './resource/NaturePack/log1.obj',
        mtl: './resource/NaturePack/log1.mtl',
    },
    {
        name: 'log2',
        obj: './resource/NaturePack/log2.obj',
        mtl: './resource/NaturePack/log2.mtl',
    },
    {
        name: 'log3',
        obj: './resource/NaturePack/log3.obj',
        mtl: './resource/NaturePack/log3.mtl',
    },
    {
        name: 'log4',
        obj: './resource/NaturePack/log4.obj',
        mtl: './resource/NaturePack/log4.mtl',
    },
    {
        name: 'log5',
        obj: './resource/NaturePack/log5.obj',
        mtl: './resource/NaturePack/log5.mtl',
    },
    {
        name: 'log6',
        obj: './resource/NaturePack/log6.obj',
        mtl: './resource/NaturePack/log6.mtl',
    },
    {
        name: 'log7',
        obj: './resource/NaturePack/log7.obj',
        mtl: './resource/NaturePack/log7.mtl',
    },
    {
        name: 'mine1',
        obj: './resource/NaturePack/mine1.obj',
        mtl: './resource/NaturePack/mine1.mtl',
    },
    {
        name: 'mine2',
        obj: './resource/NaturePack/mine2.obj',
        mtl: './resource/NaturePack/mine2.mtl',
    },
    {
        name: 'mine3',
        obj: './resource/NaturePack/mine3.obj',
        mtl: './resource/NaturePack/mine3.mtl',
    },
    {
        name: 'mushroom10',
        obj: './resource/NaturePack/mushroom10.obj',
        mtl: './resource/NaturePack/mushroom10.mtl',
    },
    {
        name: 'mushroom11',
        obj: './resource/NaturePack/mushroom11.obj',
        mtl: './resource/NaturePack/mushroom11.mtl',
    },
    {
        name: 'mushroom12',
        obj: './resource/NaturePack/mushroom12.obj',
        mtl: './resource/NaturePack/mushroom12.mtl',
    },
    {
        name: 'mushroom13',
        obj: './resource/NaturePack/mushroom13.obj',
        mtl: './resource/NaturePack/mushroom13.mtl',
    },
    {
        name: 'mushroom14',
        obj: './resource/NaturePack/mushroom14.obj',
        mtl: './resource/NaturePack/mushroom14.mtl',
    },
    {
        name: 'mushroom15',
        obj: './resource/NaturePack/mushroom15.obj',
        mtl: './resource/NaturePack/mushroom15.mtl',
    },
    {
        name: 'mushroom16',
        obj: './resource/NaturePack/mushroom16.obj',
        mtl: './resource/NaturePack/mushroom16.mtl',
    },
    {
        name: 'mushroom17',
        obj: './resource/NaturePack/mushroom17.obj',
        mtl: './resource/NaturePack/mushroom17.mtl',
    },
    {
        name: 'mushroom18',
        obj: './resource/NaturePack/mushroom18.obj',
        mtl: './resource/NaturePack/mushroom18.mtl',
    },
    {
        name: 'mushroom19',
        obj: './resource/NaturePack/mushroom19.obj',
        mtl: './resource/NaturePack/mushroom19.mtl',
    },
    {
        name: 'mushroom1',
        obj: './resource/NaturePack/mushroom1.obj',
        mtl: './resource/NaturePack/mushroom1.mtl',
    },
    {
        name: 'mushroom2',
        obj: './resource/NaturePack/mushroom2.obj',
        mtl: './resource/NaturePack/mushroom2.mtl',
    },
    {
        name: 'mushroom3',
        obj: './resource/NaturePack/mushroom3.obj',
        mtl: './resource/NaturePack/mushroom3.mtl',
    },
    {
        name: 'mushroom4',
        obj: './resource/NaturePack/mushroom4.obj',
        mtl: './resource/NaturePack/mushroom4.mtl',
    },
    {
        name: 'mushroom5',
        obj: './resource/NaturePack/mushroom5.obj',
        mtl: './resource/NaturePack/mushroom5.mtl',
    },
    {
        name: 'mushroom6',
        obj: './resource/NaturePack/mushroom6.obj',
        mtl: './resource/NaturePack/mushroom6.mtl',
    },
    {
        name: 'mushroom7',
        obj: './resource/NaturePack/mushroom7.obj',
        mtl: './resource/NaturePack/mushroom7.mtl',
    },
    {
        name: 'mushroom8',
        obj: './resource/NaturePack/mushroom8.obj',
        mtl: './resource/NaturePack/mushroom8.mtl',
    },
    {
        name: 'mushroom9',
        obj: './resource/NaturePack/mushroom9.obj',
        mtl: './resource/NaturePack/mushroom9.mtl',
    },
    {
        name: 'pillar1',
        obj: './resource/NaturePack/pillar1.obj',
        mtl: './resource/NaturePack/pillar1.mtl',
    },
    {
        name: 'pillar2',
        obj: './resource/NaturePack/pillar2.obj',
        mtl: './resource/NaturePack/pillar2.mtl',
    },
    {
        name: 'pillar3',
        obj: './resource/NaturePack/pillar3.obj',
        mtl: './resource/NaturePack/pillar3.mtl',
    },
    {
        name: 'rock10',
        obj: './resource/NaturePack/rock10.obj',
        mtl: './resource/NaturePack/rock10.mtl',
    },
    {
        name: 'rock11',
        obj: './resource/NaturePack/rock11.obj',
        mtl: './resource/NaturePack/rock11.mtl',
    },
    {
        name: 'rock12',
        obj: './resource/NaturePack/rock12.obj',
        mtl: './resource/NaturePack/rock12.mtl',
    },
    {
        name: 'rock14',
        obj: './resource/NaturePack/rock14.obj',
        mtl: './resource/NaturePack/rock14.mtl',
    },
    {
        name: 'rock15',
        obj: './resource/NaturePack/rock15.obj',
        mtl: './resource/NaturePack/rock15.mtl',
    },
    {
        name: 'rock16',
        obj: './resource/NaturePack/rock16.obj',
        mtl: './resource/NaturePack/rock16.mtl',
    },
    {
        name: 'rock17',
        obj: './resource/NaturePack/rock17.obj',
        mtl: './resource/NaturePack/rock17.mtl',
    },
    {
        name: 'rock18',
        obj: './resource/NaturePack/rock18.obj',
        mtl: './resource/NaturePack/rock18.mtl',
    },
    {
        name: 'rock19',
        obj: './resource/NaturePack/rock19.obj',
        mtl: './resource/NaturePack/rock19.mtl',
    },
    {
        name: 'rock1',
        obj: './resource/NaturePack/rock1.obj',
        mtl: './resource/NaturePack/rock1.mtl',
    },
    {
        name: 'rock20',
        obj: './resource/NaturePack/rock20.obj',
        mtl: './resource/NaturePack/rock20.mtl',
    },
    {
        name: 'rock21',
        obj: './resource/NaturePack/rock21.obj',
        mtl: './resource/NaturePack/rock21.mtl',
    },
    {
        name: 'rock2',
        obj: './resource/NaturePack/rock2.obj',
        mtl: './resource/NaturePack/rock2.mtl',
    },
    {
        name: 'rock3',
        obj: './resource/NaturePack/rock3.obj',
        mtl: './resource/NaturePack/rock3.mtl',
    },
    {
        name: 'rock4',
        obj: './resource/NaturePack/rock4.obj',
        mtl: './resource/NaturePack/rock4.mtl',
    },
    {
        name: 'rock5',
        obj: './resource/NaturePack/rock5.obj',
        mtl: './resource/NaturePack/rock5.mtl',
    },
    {
        name: 'rock6',
        obj: './resource/NaturePack/rock6.obj',
        mtl: './resource/NaturePack/rock6.mtl',
    },
    {
        name: 'rock7',
        obj: './resource/NaturePack/rock7.obj',
        mtl: './resource/NaturePack/rock7.mtl',
    },
    {
        name: 'rock8',
        obj: './resource/NaturePack/rock8.obj',
        mtl: './resource/NaturePack/rock8.mtl',
    },
    {
        name: 'rock9',
        obj: './resource/NaturePack/rock9.obj',
        mtl: './resource/NaturePack/rock9.mtl',
    },
    {
        name: 'stone_path1',
        obj: './resource/NaturePack/stone_path1.obj',
        mtl: './resource/NaturePack/stone_path1.mtl',
    },
    {
        name: 'stone_path2',
        obj: './resource/NaturePack/stone_path2.obj',
        mtl: './resource/NaturePack/stone_path2.mtl',
    },
    {
        name: 'street_lamp',
        obj: './resource/NaturePack/street_lamp.obj',
        mtl: './resource/NaturePack/street_lamp.mtl',
    },
    {
        name: 'stump1',
        obj: './resource/NaturePack/stump1.obj',
        mtl: './resource/NaturePack/stump1.mtl',
    },
    {
        name: 'stump2',
        obj: './resource/NaturePack/stump2.obj',
        mtl: './resource/NaturePack/stump2.mtl',
    },
    {
        name: 'stump3',
        obj: './resource/NaturePack/stump3.obj',
        mtl: './resource/NaturePack/stump3.mtl',
    },
    {
        name: 'stump4',
        obj: './resource/NaturePack/stump4.obj',
        mtl: './resource/NaturePack/stump4.mtl',
    },
    {
        name: 'stump5',
        obj: './resource/NaturePack/stump5.obj',
        mtl: './resource/NaturePack/stump5.mtl',
    },
    {
        name: 'stump6',
        obj: './resource/NaturePack/stump6.obj',
        mtl: './resource/NaturePack/stump6.mtl',
    },
    {
        name: 'tall_pine_tree1',
        obj: './resource/NaturePack/tall_pine_tree1.obj',
        mtl: './resource/NaturePack/tall_pine_tree1.mtl',
    },
    {
        name: 'tall_pine_tree2',
        obj: './resource/NaturePack/tall_pine_tree2.obj',
        mtl: './resource/NaturePack/tall_pine_tree2.mtl',
    },
    {
        name: 'tall_pine_tree3',
        obj: './resource/NaturePack/tall_pine_tree3.obj',
        mtl: './resource/NaturePack/tall_pine_tree3.mtl',
    },
    {
        name: 'tall_pine_tree4',
        obj: './resource/NaturePack/tall_pine_tree4.obj',
        mtl: './resource/NaturePack/tall_pine_tree4.mtl',
    },
    {
        name: 'tomb1',
        obj: './resource/NaturePack/tomb1.obj',
        mtl: './resource/NaturePack/tomb1.mtl',
    },
    {
        name: 'tomb2',
        obj: './resource/NaturePack/tomb2.obj',
        mtl: './resource/NaturePack/tomb2.mtl',
    },
    {
        name: 'tomb3',
        obj: './resource/NaturePack/tomb3.obj',
        mtl: './resource/NaturePack/tomb3.mtl',
    },
    {
        name: 'tomb4',
        obj: './resource/NaturePack/tomb4.obj',
        mtl: './resource/NaturePack/tomb4.mtl',
    },
    {
        name: 'wooden_stick1',
        obj: './resource/NaturePack/wooden_stick1.obj',
        mtl: './resource/NaturePack/wooden_stick1.mtl',
    },
    {
        name: 'wooden_stick2',
        obj: './resource/NaturePack/wooden_stick2.obj',
        mtl: './resource/NaturePack/wooden_stick2.mtl',
    },
    {
        name: 'wooden_stick3',
        obj: './resource/NaturePack/wooden_stick3.obj',
        mtl: './resource/NaturePack/wooden_stick3.mtl',
    },
];

export {models, naturePackModelNames}