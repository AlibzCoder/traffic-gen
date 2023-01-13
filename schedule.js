export default class Schedule {
    constructor (conf,transferCallback){
        this.CONF = conf;
        this.transferCallback = transferCallback;
    }

    start() {
        this.closed = false;
        this.run();
    }

    run(){
        if(!this.closed){
            this.recalculate();

            if (this.transferCallback instanceof Function){
                this.transferCallback(this.rndTransSize,this.eachTransSpeed);
            }

            setTimeout(()=>this.run(),(this.rndTransTime + this.rndGapTime) * 1000) // to miliseconds;
        }
    }

    end(){
        this.closed = true;
    }

    recalculate(){
        const {
            TransmissionsTimeRange,//  45,90 minutes
            TransmissionsSizeRange,//  128,192 megabytes
            TransmissionsGapTimeRange // 120,180 minutes
        } = this.CONF;
        this.rndTransTime = this.rand(TransmissionsTimeRange[0],TransmissionsTimeRange[1]) * 60;// in seconds
        this.rndGapTime = this.rand(TransmissionsGapTimeRange[0],TransmissionsGapTimeRange[1]) * 60; // in seconds
        this.rndTransSize = this.mb2b(this.rand(TransmissionsSizeRange[0],TransmissionsSizeRange[1])) // in bytes;
        this.eachTransSpeed = this.rndTransSize / this.rndTransTime; // bytes per second
    }

    mb2b(mb){
        return mb * 1024 * 1024;
    }

    rand(min, max) {
        return Math.random() * (max - min) + min;
    }
}