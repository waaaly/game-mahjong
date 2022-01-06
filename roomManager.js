function RoomManager(){
    this.data = [];
    this.size = 0;
}
RoomManager.prototype.add = function (data){
    let set = new Set(this.data)
    set.add(data)
    this.data = Array.from(set)
    this.size  = this.data.length
}

RoomManager.prototype.delete = function (data){
    let set = new Set(this.data)
    set.delete(data)
    this.data = Array.from(set)
    this.size  = this.data.length
}

RoomManager.prototype.findRoom = function (name){
    let len = this.data.length;
    while(len --){
        if(this.data[len].name === name){
            return this.data[len]
        }
    }
    return null
}

RoomManager.prototype.has = function (data){
    return this.data.has(data)
}

RoomManager.prototype.length = function (){
    return this.size
}
module.exports = new RoomManager()