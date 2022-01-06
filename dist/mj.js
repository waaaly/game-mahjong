
import { Button, Space } from "antd"
import React, { useEffect, useState, useRef, useLayoutEffect, useCallback } from "react"
import './mj/mj.scss'

export default function MJ(props) {
    const RuleBEG = {
        "bump": ["111", "222", "333", "444", "555", "666", "777", "888", "999"],
        "eat": ["123", "234", "345", "456", "567", "678", "789"],
        "gang": ["1111", "2222", "3333", "4444", "5555", "6666", "7777", "8888", "9999"]
    }
    const [people, setPeople] = useState({
        "1p": { jokers: [], fJoker: [], wind: "东" },
        "2p": { jokers: [], fJoker: [], wind: "南" },
        "3p": { jokers: [], fJoker: [], wind: "西" },
        "4p": { jokers: [], fJoker: [], wind: "北" },
        "5p": { jokers: [], fJoker: [], wind: "" },
        "6p": { jokers: [], fJoker: [], wind: "" },
    })
    const curPeopleTouch = useRef('2p')
    const curPeoplePlay = useRef('1p')
    const curTouchOrPlay = useRef(true)
    const autoPlayTouch = useRef(false)
    //play 进行仲 pause 暂停 stop 结束
    const gameStatus = useRef("play")
    const [touchOrPlay, setTouchOrPlay] = useState(false)
    const [canEat, setCanEat] = useState(false)
    const [canBump, setCanBump] = useState(false)
    const [canGang, setCanGang] = useState(false)
    const [canHu, setCanHu] = useState(false)
    function getJokers() {
        let jokers = {
            "tong": [
                { id: "MJ_TONG_1", joker: 1, type: 1, img: require("./mj/image/tong_1.jpg") },
                { id: "MJ_TONG_2", joker: 2, type: 1, img: require("./mj/image/tong_2.jpg") },
                { id: "MJ_TONG_3", joker: 3, type: 1, img: require("./mj/image/tong_3.jpg") },
                { id: "MJ_TONG_4", joker: 4, type: 1, img: require("./mj/image/tong_4.jpg") },
                { id: "MJ_TONG_5", joker: 5, type: 1, img: require("./mj/image/tong_5.jpg") },
                { id: "MJ_TONG_6", joker: 6, type: 1, img: require("./mj/image/tong_6.jpg") },
                { id: "MJ_TONG_7", joker: 7, type: 1, img: require("./mj/image/tong_7.jpg") },
                { id: "MJ_TONG_8", joker: 8, type: 1, img: require("./mj/image/tong_8.jpg") },
                { id: "MJ_TONG_9", joker: 9, type: 1, img: require("./mj/image/tong_9.jpg") },
            ],
            "suo": [
                { id: "MJ_SUO_1", joker: 1, type: 2, img: require("./mj/image/suo_1.jpg") },
                { id: "MJ_SUO_2", joker: 2, type: 2, img: require("./mj/image/suo_2.jpg") },
                { id: "MJ_SUO_3", joker: 3, type: 2, img: require("./mj/image/suo_3.jpg") },
                { id: "MJ_SUO_4", joker: 4, type: 2, img: require("./mj/image/suo_4.jpg") },
                { id: "MJ_SUO_5", joker: 5, type: 2, img: require("./mj/image/suo_5.jpg") },
                { id: "MJ_SUO_6", joker: 6, type: 2, img: require("./mj/image/suo_6.jpg") },
                { id: "MJ_SUO_7", joker: 7, type: 2, img: require("./mj/image/suo_7.jpg") },
                { id: "MJ_SUO_8", joker: 8, type: 2, img: require("./mj/image/suo_8.jpg") },
                { id: "MJ_SUO_9", joker: 9, type: 2, img: require("./mj/image/suo_9.jpg") },
            ],
            "wan": [
                { id: "MJ_WAN_1", joker: 1, type: 3, img: require("./mj/image/wang_1.jpg") },
                { id: "MJ_WAN_2", joker: 2, type: 3, img: require("./mj/image/wang_2.jpg") },
                { id: "MJ_WAN_3", joker: 3, type: 3, img: require("./mj/image/wang_3.jpg") },
                { id: "MJ_WAN_4", joker: 4, type: 3, img: require("./mj/image/wang_4.jpg") },
                { id: "MJ_WAN_5", joker: 5, type: 3, img: require("./mj/image/wang_5.jpg") },
                { id: "MJ_WAN_6", joker: 6, type: 3, img: require("./mj/image/wang_6.jpg") },
                { id: "MJ_WAN_7", joker: 7, type: 3, img: require("./mj/image/wang_7.jpg") },
                { id: "MJ_WAN_8", joker: 8, type: 3, img: require("./mj/image/wang_8.jpg") },
                { id: "MJ_WAN_9", joker: 9, type: 3, img: require("./mj/image/wang_9.jpg") },
            ],
            "fan": [
                { id: "MJ_FAN_1", joker: 1, type: 4, img: require("./mj/image/fan_1.jpg") },
                { id: "MJ_FAN_2", joker: 2, type: 4, img: require("./mj/image/fan_2.jpg") },
                { id: "MJ_FAN_3", joker: 3, type: 4, img: require("./mj/image/fan_3.jpg") },
                { id: "MJ_FAN_4", joker: 4, type: 4, img: require("./mj/image/fan_4.jpg") },
                { id: "MJ_FAN_5", joker: 5, type: 4, img: require("./mj/image/fan_5.jpg") },
                { id: "MJ_FAN_6", joker: 6, type: 4, img: require("./mj/image/fan_6.jpg") },
                { id: "MJ_FAN_7", joker: 7, type: 4, img: require("./mj/image/fan_7.jpg") },
            ],
        }
        let allJoker = []
        Object.keys(jokers).forEach((item, index) => {
            jokers[item].map((jo, joi) => {
                allJoker.push(jo)
                allJoker.push(jo)
                allJoker.push(jo)
                allJoker.push(jo)
            })
        })
        return allJoker
    }
    const [jokers, setJokers] = useState(getJokers().sort(
        function randomsort(a, b) {
            return Math.random() > .5 ? -1 : 1;
        }
    ))

    const deal = () => {
        setJokers(getJokers().sort(
            function randomsort(a, b) {
                return Math.random() > .5 ? -1 : 1;
            }
        ))
        people["1p"].jokers = []
        people["2p"].jokers = []
        people["3p"].jokers = []
        people["4p"].jokers = []
        people["5p"].jokers = []
        people["6p"].jokers = []
        let jokerIndex = 0
        for (let i = 0; i < 3; i++) {
            people["1p"].jokers.push(jokers[jokerIndex])
            people["1p"].jokers.push(jokers[jokerIndex++])
            people["1p"].jokers.push(jokers[jokerIndex++])
            people["1p"].jokers.push(jokers[jokerIndex++])
            people["2p"].jokers.push(jokers[jokerIndex++])
            people["2p"].jokers.push(jokers[jokerIndex++])
            people["2p"].jokers.push(jokers[jokerIndex++])
            people["2p"].jokers.push(jokers[jokerIndex++])
            people["3p"].jokers.push(jokers[jokerIndex++])
            people["3p"].jokers.push(jokers[jokerIndex++])
            people["3p"].jokers.push(jokers[jokerIndex++])
            people["3p"].jokers.push(jokers[jokerIndex++])
            people["4p"].jokers.push(jokers[jokerIndex++])
            people["4p"].jokers.push(jokers[jokerIndex++])
            people["4p"].jokers.push(jokers[jokerIndex++])
            people["4p"].jokers.push(jokers[jokerIndex++])
        }
        people["1p"].jokers.push(jokers[jokerIndex++])
        people["1p"].jokers.push(jokers[jokerIndex++])
        people["2p"].jokers.push(jokers[jokerIndex++])
        people["3p"].jokers.push(jokers[jokerIndex++])
        people["4p"].jokers.push(jokers[jokerIndex++])
        for (let i = 0; i < 83; i++) {
            people["6p"].jokers.push(jokers[jokerIndex++])
        }
        setPeople({ ...tools.sortJoker(people) })
    }

    const BuildWall = (props) => {
        // console.log("BuildWall", props.joker)
        let bJoker = props.joker
        let bJokers1 = []
        let bJokers2 = []
        let bJokers3 = []
        let bJokers4 = []
        if (bJoker.length >= 34) {
            bJokers1 = bJoker.slice(0, 34)
        } else {
            bJokers1 = bJoker.slice(0, 34)
        }
        if (bJoker.length >= 68) {
            bJokers2 = bJoker.slice(34, 68)
        } else {
            bJokers2 = bJoker.slice(34, 68)
        }
        if (bJoker.length >= 102) {
            bJokers3 = bJoker.slice(68, 102)
        } else {
            bJokers3 = bJoker.slice(68, 102)
        }
        if (bJoker.length >= 136) {
            bJokers4 = bJoker.slice(102, 136)
        } else {
            bJokers4 = bJoker.slice(102, 136)
        }
        return (
            <div className="mj-bw-content">
                <div className="mj-bw-top">
                    {bJokers1.length > 0 && bJokers1.map((item, index) => {
                        if (index % 2 === 1) return null
                        return (
                            <div key={index}>
                                <div className="mj-joker-box2 mj-joker-box-back vertical-text">
                                    {/* <img src={item.img} style={{ width: 45, height: 65 }} /> */}
                                </div>
                                {bJokers1[index + 1] &&
                                    <div className="mj-joker-box2 mj-joker-box-back vertical-text mj-bw-margin">
                                        {/* <img src={item.img} style={{ width: 45, height: 65 }} /> */}
                                    </div>
                                }
                            </div>
                        )
                    })}
                </div>
                <div className="mj-bw-right">
                    {bJokers2.length > 0 && bJokers2.map((item, index) => {
                        if (index % 2 === 1) return null
                        return (
                            <div key={index} className="mj-bw-right-content">
                                <div className="mj-bw-rbox mj-joker-box-back vertical-text">
                                    {/* <img src={item.img} style={{ width: 45, height: 65, rotate: 90 }} /> */}
                                </div>
                                {bJokers2[index + 1] &&
                                    <div className="mj-bw-rbox mj-joker-box-back vertical-text mj-bw-margin">
                                        {/* <img src={item.img} style={{ width: 45, height: 65, rotate: 90 }} /> */}
                                    </div>
                                }
                            </div>
                        )
                    })}
                </div>
                <div className="mj-bw-bottom">
                    {bJokers3.length > 0 && bJokers3.map((item, index) => {
                        if (index % 2 === 1) return null
                        return (
                            <div key={index}>
                                <div className="mj-joker-box2 mj-joker-box-back vertical-text">
                                    {/* <img src={item.img} style={{ width: 45, height: 65 }} /> */}
                                </div>
                                {bJokers3[index + 1] &&
                                    <div className="mj-joker-box2 mj-joker-box-back vertical-text mj-bw-margin">
                                        {/* <img src={item.img} style={{ width: 45, height: 65 }} /> */}
                                    </div>
                                }
                            </div>
                        )
                    })}
                </div>
                <div className="mj-bw-left">
                    {bJokers4.length > 0 && bJokers4.map((item, index) => {
                        if (index % 2 === 1) return null
                        return (
                            <div key={index} className="mj-bw-right-content">
                                <div className="mj-bw-rbox mj-joker-box-back vertical-text">
                                    {/* <img src={item.img} style={{ width: 45, height: 65, rotate: 90 }} /> */}
                                </div>
                                {bJokers4[index + 1] &&
                                    <div className="mj-bw-rbox mj-joker-box-back vertical-text mj-bw-margin">
                                        {/* <img src={item.img} style={{ width: 45, height: 65, rotate: 90 }} /> */}
                                    </div>
                                }
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    const touchJoker = (cp) => {
        if (!tools.checkStatus("play")) return
        let joker = people["6p"].jokers.pop()
        people[cp].jokers.push(joker)
        curPeopleTouch.current = tools.getNextCp(cp)
        curTouchOrPlay.current = true
        setPeople({ ...people })
        setTouchOrPlay(false)
    }

    const playcard = (cp, index = 0) => {
        if (!tools.checkStatus("play")) return
        let item = people[cp].jokers[index]
        if (checkJoker(cp, item)) {
            return
        }
        people["5p"].jokers.push(item)
        people[cp].jokers.splice(index, 1)

        curPeoplePlay.current = tools.getNextCp(cp)
        curTouchOrPlay.current = false
        setPeople({ ...tools.sortJoker(people) })
        setTouchOrPlay(true)
    }

    const checkJoker = (cp, item) => {
        if (curPeoplePlay.current === '1p') return false
        console.log("1p...", people["1p"].jokers, "出的牌", cp, item)
        tools.checkBumpJoker(people["1p"].jokers, item)
        function checkEatJoker() {

        }
        return false
    }

    const Init = () => {
        people["6p"].jokers = jokers
        setPeople({ ...people })
    }

    const tools = {
        getNextCp: (cp) => {
            let st = Number(cp.substr(0, 1))
            if (st < 4) {
                st++
            } else {
                st = 1
            }
            return st + "p"
        },
        sortJoker: (people) => {
            people['1p'].jokers = people['1p'].jokers.sort((a, b) => {
                if (a.type === b.type) {
                    return a.joker - b.joker
                } else {
                    return a.type - b.type
                }
            })
            return people
        },
        checkStatus: (s) => {
            if (s === gameStatus.current) {
                return true
            } else {
                console.log("不在" + s + "状态")
                return false
            }
        },
        onCancelStatus: () => {
            gameStatus.current = "play"
            setCanBump(false)
            setCanEat(false)
            setCanGang(false)
            setCanHu(false)
        },
        checkBumpJoker: (arr, item) => {
            let i = ""
            let rule = RuleBEG["bump"]
            arr.forEach((i, ai) => {
                if (arr[ai].type === item.type && arr[ai + 1]?.type === item.type) {
                    let si = String(arr[ai].joker) + String(arr[ai + 1]?.joker) + String(item.joker)
                    rule.forEach((r) => {
                        if (r === si) {
                            setCanBump(true)
                            gameStatus.current = "stop"
                        }
                    })
                }
            })
        },
        bumpJoker: () => {
            console.log("peng")
        },
    }

    const autoPlay = () => {
        // autoPlayTouch.current = true
        let t = setInterval(() => {
            touchJoker(curPeopleTouch.current)
            let s = setTimeout(() => {
                playcard(curPeoplePlay.current)
                setTouchOrPlay(true)
                clearTimeout(s)
                if (curPeopleTouch.current === "1p") {
                    clearInterval(t)
                }
            }, 500)
        }, 2000);
    }

    useEffect(() => {
        // deal()
        Init()
    }, [])
    return (
        <div className="relative" >
            <Space>
                <Button onClick={deal}>发牌</Button>
                <Button disabled={autoPlayTouch.current || curTouchOrPlay.current} onClick={() => touchJoker(curPeopleTouch.current)}>摸牌</Button>
                <Button disabled={autoPlayTouch.current || !curTouchOrPlay.current} onClick={() => playcard(curPeoplePlay.current)}>打牌</Button>
            </Space>
            <div className="mj-content">
                <div className="mj-area-1">
                    {people['3p'].jokers.map((item, index) => {
                        return (
                            <div key={index} className="mj-joker-box2 mj-joker-box-back vertical-text">
                                {/* <img src={item.img} style={{ width: 45, height: 65 }} /> */}
                                {item.joker + "-" + item.type}
                            </div>
                        )
                    })}
                </div>
                <div className="mj-area-2">
                    <Space size={0}>
                        <div className="mj-area-2-left">
                            {people['2p'].jokers.map((item, index) => {
                                return (
                                    <div key={index} className="mj-joker-box-lr">
                                        <Space size={0}>
                                            <div className="mj-joker-box-lr-l"></div>
                                            <div className="mj-joker-box-lr-r">{item.joker + "-" + item.type}</div>
                                        </Space>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="mj-area-2-right">
                            <div style={{ minWidth: 20 }}>
                                {people['4p'].jokers.map((item, index) => {
                                    return (
                                        <div key={index} className="mj-joker-box-lr">
                                            <Space size={0}>
                                                <div className="mj-joker-box-lr-r"></div>
                                                <div className="mj-joker-box-lr-l">{item.joker + "-" + item.type}</div>
                                            </Space>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </Space>
                </div>
                <div className="mj-area-3">
                    {people['1p'].jokers.map((item, index) => {
                        return (
                            <div key={index} className="mj-joker-box" onClick={() => !touchOrPlay && curPeoplePlay.current === '1p' && playcard(curPeoplePlay.current, index)}>
                                <img src={item.img} className="" style={{ width: 45, height: 65 }} />
                            </div>
                        )
                    })}
                </div>
                <div className="mj-area-4">
                    <BuildWall joker={people['6p'].jokers} />
                </div>
                <div className="mj-area-5">
                    {people['5p'].jokers.map((item, index) => {
                        return (
                            <div key={index} className="mj-joker-box3">
                                <img src={item.img} className="" style={{ width: 45, height: 65 }} />
                            </div>
                        )
                    })}
                </div>
                <div className="mj-area-6">
                    <Space>
                        <Button onClick={() => {
                            if (gameStatus.current !== "play") return
                            touchOrPlay && touchJoker(curPeopleTouch.current)
                            !touchOrPlay && playcard(curPeoplePlay.current)
                        }}>{touchOrPlay ? "摸牌" : "打牌"}</Button>
                        <Button onClick={tools.bumpJoker} disabled={!canBump}>碰</Button>
                        <Button disabled={!canEat}>吃</Button>
                        <Button disabled={!canGang}>杠</Button>
                        <Button disabled={!canHu}>胡</Button>
                        <Button onClick={tools.onCancelStatus} disabled={!canBump}>取消</Button>
                    </Space>
                </div>
            </div>
        </div >
    )
}
