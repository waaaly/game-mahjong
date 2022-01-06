const Card = require('./card')

function Room(params){
    this.name = params.roomName;
    this.playerArr = ['1p','2p','3p','4p'].splice(0,params.size || 4);
    this["5p"] = { id:null, jokers: [], fJoker: [], wind: "" };
    this["6p"] = { id:null, jokers: [], fJoker: [], wind: "" };
    // this["1p"] = { 
    //     id:null, jokers: [], fJoker: [], wind: "东",
    //     seqJoker:[],tripJoker:[],quadJoker:[],
    //     seqTimes:0,tripTimes:0,quadTimes:0 };
    this["2p"] = { id:null, jokers: [], fJoker: [], wind: "南",seqJoker:[],tripJoker:[],quadJoker:[] };
    this["3p"] = { id:null, jokers: [], fJoker: [], wind: "西",seqJoker:[],tripJoker:[],quadJoker:[] };
    this["4p"] = { id:null, jokers: [], fJoker: [], wind: "北",seqJoker:[],tripJoker:[],quadJoker:[] };
    
    this.playerArr.forEach(item=>{
        this[item] = {
            wind:
            item === '1p' && '东' ||
            item === '2p' && '南' ||
            item === '3p' && '西' ||
            item === '4p' && '北' ,
            id:null, jokers: [], fJoker: [], 
            seqJoker:[],tripJoker:[],quadJoker:[],
            seqTimes:0,tripTimes:0,quadTimes:0
        }
    })

    this["1p"].id = params.socketId;

    this.curCard = null;
    this.prevPlayer = null;
    this.curPlayer = '1p';
    this.nextPlayer = '2p';
    this.playerNum = 0;
    this.actionQueue = [];

    this.setPlayerId = (player,id)=>{
        this[player].id = id
    }

    this.clearPlayer = (player)=>{
        this[player] = { 
            id:null, jokers: [], fJoker: [], wind: "",
            seqJoker:[],tripJoker:[],quadJoker:[],
            seqTimes:0,tripTimes:0,quadTimes:0
         };
        this[player].wind = 
        player === "1p" &&  "东" ||
        player === "2p" &&  "南" ||
        player === "3p" &&  "西" ||
        player === "4p" &&  "北" ;
        if(this.playerNum !== 0){
            this.playerNum --
        }
    }

    this.findEmptyIdPlayer = ()=>{
        let player = 0,
            len = 0;

        while(len < this.playerArr.length){
            if(this[this.playerArr[len]].id === null){
                return this.playerArr[len]
            }
            len ++
        }

        return player
    }
}

Room.prototype.join = function (socketId){
    // findroom
    let player = this.findEmptyIdPlayer()
    this.setPlayerId(player,socketId)
    if(this.isFull()){
        this.dealer()
    }
    if(this.playerNum !== this.playerArr.length){
        this.playerNum ++
    }
    return player
}

Room.prototype.leave = function (player){
    this.clearPlayer(player)
}

/**
 * 判断房间是否为空，一个用户都没有
 * @returns bool
 */
Room.prototype.isEmpty = function (){
    let isEmpty = true,
        len = this.playerArr.length;

    while(len --){
        if(this[this.playerArr[len]].id !== null){
            return false
        }
    }

    return isEmpty
}

/**
 * 判断房间是否满员
 * @returns bool
 */
Room.prototype.isFull = function (){
    return Boolean(this.findEmptyIdPlayer()) ? false : true;
}

/**
 * 重新开始
 */
Room.prototype.restart = function(){
    this.playerArr.forEach(item=>{
        this[item] = {
            wind:
            item === '1p' && '东' ||
            item === '2p' && '南' ||
            item === '3p' && '西' ||
            item === '4p' && '北' , jokers: [], fJoker: [], 
            seqJoker:[],tripJoker:[],quadJoker:[],
            seqTimes:0,tripTimes:0,quadTimes:0
        }
    })
    this['5p'] = { id:null, jokers: [], fJoker: [], wind: "" };
    this.dealer()
}
/**
 * 洗牌
 */
Room.prototype.dealer = function (){
    let cardArr = Card.shuffle()
    // 发牌
    this.playerArr.forEach((item,index)=>{
        this[item].jokers = cardArr.splice(0,13)
    })
    this['1p'].jokers.push(cardArr.shift())
    // 整牌
    this.playerArr.forEach((item,index)=>{
        this[item].jokers =  Card.sort(this[item].jokers)
    })
    this['6p'].jokers = cardArr
}

/**
 * 出牌
 */
Room.prototype.removeCard = function(player,card){
    let index = Card.findCard(this[player].jokers,card.key)
    let rCard = this[player].jokers.splice(index,1)

    this['5p'].jokers.push(rCard[0]);
    this.curCard = card;
    this.checkCard(this.playerArr.filter(item=>{
        return item !== player
    }),card)
}

/**
 * 摸牌
 */
Room.prototype.addCard = function(player){
    let aCard = this['6p'].jokers.splice(0,1),
        arr = [...this[player].jokers,...aCard];
    
    //整牌
    this[player].jokers = Card.sort(arr)
   
}
/**
 * 检查玩家手中牌型
 */
Room.prototype.checkCard = function(players,card){
    let cardGroup = {}
    players.forEach(item=>{
        cardGroup = Card.groupByType(this[item].jokers)
        this[item].seqJoker = [];
        this[item].tripJoker = [];
        this[item].quadJoker = [];
        if(item === this.nextPlayer){
            // check sequ
            this[item].seqJoker = Card.sequenceCard(cardGroup,card)
        }
        
        // check trip
        this[item].tripJoker = Card.tripletCard(cardGroup,card)
        // check quad 
        this[item].quadJoker = Card.quadCard(cardGroup,card)
    })
}
/**
 * 自动切换玩家
 */
Room.prototype.changePlayer = function(){
    this.prevPlayer = this.curPlayer;
    this.curPlayer = this.nextPlayer;

    let npIndex = this.playerArr.findIndex(item=>{
        return item === this.nextPlayer
    })
    if(npIndex === this.playerArr.length - 1){
        this.nextPlayer = '1p'
    }else{
        this.nextPlayer = this.playerArr[npIndex + 1]
    }
}
/**
 * 手动设置玩家
 */
Room.prototype.setPlayer = function (player){
    this.prevPlayer = this.prevPlayer;
    this.curPlayer = player;

    let pIndex = this.playerArr.findIndex(item=>{
        return item === player
    })
    if(pIndex === this.playerArr.length - 1){
        this.nextPlayer = '1p'
    }else{
        this.nextPlayer = this.playerArr[pIndex + 1]
    }
}
/**
 * 设置玩家openCard
 */
Room.prototype.setOpenCard = function(player,cardGroup,isSeq){
    let curCard = this['5p'].jokers.pop()
    if(isSeq){
        cardGroup.forEach(item=>{
            let index = Card.findCard(this[player].jokers,item.key)
            // 不要减掉别人打不出来的牌
            if(curCard.key !== item.key){
                this[player].jokers.splice(index,1)
            }
         })
    }else{
        let len = this[player].jokers.length, indexArr = []
        for(let index = 0; index < len; index ++){
            if(this[player].jokers[index].id === curCard.id){
                indexArr.push(index)
            }
        }
        this[player].jokers.splice(indexArr[0],indexArr.length)
    }
    
    this[player].fJoker.push(cardGroup)
    this[player].seqJoker = []
    this[player].tripJoker = []
    this[player].quadJoker = []
}
/**
 * 对客户端操作进行响应
 */
Room.prototype.actionCardHandler = function(){
    
    let cancelPlayer = [],
        seqCardPlayer = null,
        seqCardGroup = [],
        tripCardPlayer = null,
        tripCardGroup = [],
        quadCardPlayer = null,
        quadCardGroup = [];

    this.actionQueue.forEach(item=>{
        switch(item.type){
            case 'cancel' :
                cancelPlayer.push(item.player)
            break;
            case 'seq' :
                seqCardPlayer = (item.player)
                seqCardGroup = item.cardGroup
            break;
            case 'trip' :
                tripCardPlayer = (item.player)
                tripCardGroup = item.cardGroup
            break;
            case 'quad' :
                quadCardPlayer = (item.player)
                quadCardGroup = item.cardGroup
            break;
        }
    })
    
    // 取消操作
    cancelPlayer.forEach(item=>{
        this[item].seqJoker = []
        this[item].tripJoker = []
        this[item].quadJoker = []
    })
    console.log(cancelPlayer,seqCardPlayer,tripCardPlayer,quadCardPlayer)
    // 吃牌
    if(seqCardPlayer && (tripCardPlayer === null && quadCardPlayer === null)){
        console.log('吃',seqCardPlayer)
        this.setOpenCard(seqCardPlayer,seqCardGroup,true)
        this[seqCardPlayer].seqTimes += 1
    }
    // 碰
    if(tripCardPlayer){
        console.log('碰',tripCardPlayer)
        this.setOpenCard(tripCardPlayer,tripCardGroup,false)
        this.setPlayer(tripCardPlayer)
        this[tripCardPlayer].tripTimes += 1
    }
    // 杠
    if(quadCardPlayer){
        console.log('杠',quadCardPlayer)
        this.setOpenCard(quadCardPlayer,quadCardGroup,false)
        this.setPlayer(quadCardPlayer)
        this[quadCardPlayer].quadTimes += 1
    }
    this.actionQueue = []
}
module.exports = Room