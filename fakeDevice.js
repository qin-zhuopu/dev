class PressureGauge {
    constructor(initialPressure = 0) {
        this.pressure = initialPressure;
    }
}
class PressureSimulator {
    constructor(minPressure = 19, maxPressure = 21, step = 0.1, direction = 1, device = new PressureGauge()) {
        device.pressure = minPressure;
        this.device = device

        this.minPressure = minPressure;
        this.maxPressure = maxPressure;
        this.step = step;
        this.direction = direction; // 现在 direction 可以是 1 或 -1
    }

    next() {
        this.device.pressure += this.step * this.direction;
        if (this.maxPressure < this.device.pressure) {
            this.device.pressure = this.minPressure;
        } else if (this.device.pressure < this.minPressure) {
            this.device.pressure = this.minPressure;
            this.direction = 1;
        }
        return this.device;
    }
}

class Valve {
    constructor(targetOpeningState = 0, openingPosition = 0) {
        this.targetOpeningState = targetOpeningState;
        this.openingPosition = openingPosition;
    }
}
class ValveSimulator {
    constructor(device = new Valve()) {
        this.device = device
    }
    next() {
        this.device.openingPosition = this.device.targetOpeningState ? 100 : 0;
        return this.device;
    }
}
class GatewaySimulator {
    constructor() {
        this.s = {}

        this.s["套压表"] = new PressureSimulator(19, 21)
        this.s["油压表"] = new PressureSimulator(14, 20)
        this.s["管压表"] = new PressureSimulator(9, 11)
        this.s["流量阀"] = new ValveSimulator()
    }

    subNext() {
        const keys = Object.keys(this.s);
        keys.forEach(key => {
            console.log(key, this.s[key].next());
        });
    }

    next() {
        //自动关井
        console.log(this.s["油压表"].device.pressure)
        if (this.s["油压表"].device.pressure < 15) {
            this.s["流量阀"].device.targetOpeningState = 0
        }

        if (this.s["流量阀"].device.openingPosition > 0) {
            this.s["油压表"].direction = -1
        } else {
            this.s["油压表"].direction = 1
        }

        this.subNext()
    }
}
gs = new GatewaySimulator();

gs.next()

gs.s["流量阀"].device.targetOpeningState = 1