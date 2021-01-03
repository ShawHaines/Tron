function Camera(_R, _step)
{
    var camera = new Object();

    camera.phi = Math.PI / 2;
    camera.theta = Math.PI / 2;
    camera.R = _R;
    camera.step = _step;
    camera.Eye = [0, 0, camera.R];
    camera.Target = [0, 0, 0];
    camera.Up = [0, 1, 0];

    camera.moveLeft = function()
    {
        var sin_theta = Math.sin(this.theta);
        var cos_theta = Math.cos(this.theta);
        var sin_phi = Math.sin(this.phi);
        var cos_phi = Math.cos(this.phi);
        var step = this.step;

        this.Eye[0] -= step * sin_theta * sin_phi;
        this.Target[0] -= step * sin_theta * sin_phi;
        this.Eye[2] -= step * sin_theta * cos_phi;
        this.Target[2] -= step * sin_theta * cos_phi;
    }

    camera.moveRight = function()
    {
        var sin_theta = Math.sin(this.theta);
        var cos_theta = Math.cos(this.theta);
        var sin_phi = Math.sin(this.phi);
        var cos_phi = Math.cos(this.phi);
        var step = this.step;

        this.Eye[0] += step * sin_theta * sin_phi;
        this.Target[0] += step * sin_theta * sin_phi;
        this.Eye[2] += step * sin_theta * cos_phi;
        this.Target[2] += step * sin_theta * cos_phi;
    }

    camera.moveForward = function()
    {
        var sin_theta = Math.sin(this.theta);
        var cos_theta = Math.cos(this.theta);
        var sin_phi = Math.sin(this.phi);
        var cos_phi = Math.cos(this.phi);
        var step = this.step;
        
        this.Eye[0] += step * sin_theta * cos_phi;
        this.Target[0] += step * sin_theta * cos_phi;
        this.Eye[2] -= step * sin_theta * sin_phi;
        this.Target[2] -= step * sin_theta * sin_phi;
        this.Eye[1] += step * cos_theta;
        this.Target[1] += step * cos_theta;
    }

    camera.moveBackward = function()
    {
        var sin_theta = Math.sin(this.theta);
        var cos_theta = Math.cos(this.theta);
        var sin_phi = Math.sin(this.phi);
        var cos_phi = Math.cos(this.phi);
        var step = this.step;
        
        this.Eye[0] -= step * sin_theta * cos_phi;
        this.Target[0] -= step * sin_theta * cos_phi;
        this.Eye[2] += step * sin_theta * sin_phi;
        this.Target[2] += step * sin_theta * sin_phi;
        this.Eye[1] -= step * cos_theta;
        this.Target[1] -= step * cos_theta;
    }

    camera.moveUp = function()
    {
        var sin_theta = Math.sin(this.theta);
        var cos_theta = Math.cos(this.theta);
        var sin_phi = Math.sin(this.phi);
        var cos_phi = Math.cos(this.phi);
        var step = this.step;

        this.Eye[0] -= step * cos_theta * cos_phi;
        this.Target[0] -= step * cos_theta * cos_phi;
        this.Eye[2] += step * cos_theta * sin_phi;
        this.Target[2] += step * cos_theta * sin_phi;
        this.Eye[1] += step * sin_theta;
        this.Target[1] += step * sin_theta;
    }

    camera.moveDown = function()
    {
        var sin_theta = Math.sin(this.theta);
        var cos_theta = Math.cos(this.theta);
        var sin_phi = Math.sin(this.phi);
        var cos_phi = Math.cos(this.phi);
        var step = this.step;

        this.Eye[0] += step * cos_theta * cos_phi;
        this.Target[0] += step * cos_theta * cos_phi;
        this.Eye[2] -= step * cos_theta * sin_phi;
        this.Target[2] -= step * cos_theta * sin_phi;
        this.Eye[1] -= step * sin_theta;
        this.Target[1] -= step * sin_theta;
    }

    camera.watchLeft = function()
    {
        this.phi += 0.01;
        this.Target[0] = this.Eye[0] + this.R * Math.sin(this.theta) * Math.cos(this.phi);
        this.Target[1] = this.Eye[1] + this.R * Math.cos(this.theta);
        this.Target[2] = this.Eye[2] - this.R * Math.sin(this.theta) * Math.sin(this.phi);
    }

    camera.watchRight = function()
    {
        this.phi -= 0.01;
        this.Target[0] = this.Eye[0] + this.R * Math.sin(this.theta) * Math.cos(this.phi);
        this.Target[1] = this.Eye[1] + this.R * Math.cos(this.theta);
        this.Target[2] = this.Eye[2] - this.R * Math.sin(this.theta) * Math.sin(this.phi);
    }

    camera.watchUp = function()
    {
        this.theta -= 0.01;
        this.Target[0] = this.Eye[0] + this.R * Math.sin(this.theta) * Math.cos(this.phi);
        this.Target[1] = this.Eye[1] + this.R * Math.cos(this.theta);
        this.Target[2] = this.Eye[2] - this.R * Math.sin(this.theta) * Math.sin(this.phi);
    }
    
    camera.watchDown = function()
    {
        this.theta += 0.01;
        this.Target[0] = this.Eye[0] + this.R * Math.sin(this.theta) * Math.cos(this.phi);
        this.Target[1] = this.Eye[1] + this.R * Math.cos(this.theta);
        this.Target[2] = this.Eye[2] - this.R * Math.sin(this.theta) * Math.sin(this.phi);
    }

    camera.changeWatchDir = function(delta_phi, delta_theta)
    {
        this.theta += delta_theta;
        this.phi += delta_phi;
        this.Target[0] = this.Eye[0] + this.R * Math.sin(this.theta) * Math.cos(this.phi);
        this.Target[1] = this.Eye[1] + this.R * Math.cos(this.theta);
        this.Target[2] = this.Eye[2] - this.R * Math.sin(this.theta) * Math.sin(this.phi);
    }

    return camera;
}

export {Camera};