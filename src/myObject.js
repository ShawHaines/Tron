class myObject {
    constructor() {
        this.drawInfo = {
            uniforms: {
                u_objectColor: [0, 0, 0, 0],
                u_emissiveMaterial: [0, 0, 0],
            },
            bufferInfo: {},
            programInfo: {},
            useMTL: false,
        }
        this.node = {};
    }

}

export { myObject };