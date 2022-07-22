import { ExcelViewModel } from "src/app/model/ExcelViewModel.model";
import { eightitem } from "../eightitems/eightitems.component";
import { fiveitem } from "../fiveitems/fiveitems.component";
import { fouritem } from "../fouritems/fouritems.component";
import { oneitem } from "../oneitems/oneitems.component";
import { sevenitem } from "../sevenitems/sevenitems.component";
import { sixitem } from "../sixitems/sixitems.component";
import { threeitem } from "../threeitems/threeitems.component";
import { twoitem } from "../twoitems/twoitems.component";

export class exportexcel {

    result: any[] = [];
    arrlength: number;
    constructor() {
        this.result = JSON.parse(localStorage.getItem("chartData"));
        this.arrlength = this.result.length;
       // console.log('Exp',18,this.result);
    }

    itemreport() : any[]{
        var itemlist: any[][] = [];
        for (let d = 0; d < this.arrlength; d++) {
            var list: any[] = [];
            for (let c = 0; c < this.result[d][1].length; c++) {
                let item: string = '';
                let itemData: string = '';
                //let item1 = [];
                for (var i = 0; i <= d; i++)
                    item += this.result[d][2][c][i]+ ',';
                    itemData += this.result[d][2][c][i]+ ',';
                    //item1.push(this.result[d][2][c][i]);
                if (d == 0) {
                    let reachData = (this.result[d][1][c]* 100).toFixed(1);
                    const p: oneitem = {
                        //reach: (this.result[d][1][c]* 100).toFixed(2).toString()+'%',
                        reach: parseFloat(reachData),
                        frequency: parseFloat(this.result[d][3][c].toFixed(2)),
                        item: item.substring(0, item.length - 1)
                    }
                    list.push(p);
                } else if (d == 1) {
                    var comma = item.split(',');
                    let reachData = (this.result[d][1][c]* 100).toFixed(1);
                    let freqReach = (parseFloat(this.result[d][3][c].toFixed(2)) / parseFloat(reachData) * 100).toFixed(2);
                    let arr = [];
                    arr.push(itemlist[0].filter(x => x.item === this.result[1][2][c][0])[0].reach);
                    arr.push(itemlist[0].filter(x => x.item === this.result[1][2][c][1])[0].reach);
                    let ireach = Math.max(...arr);
                    const p: twoitem = {
                        //reach: (this.result[d][1][c]* 100),//,.toFixed(2).toString()+'%',
                        reach: parseFloat(reachData),
                        //frequency: this.result[d][3][c],
                        frequency: parseFloat(this.result[d][3][c].toFixed(2)),
                        freqreach: parseFloat(freqReach),
                        item: item.substring(0, item.length - 1),
                        item1: comma[0], //item.substring(0, item.length - 1),
                        item2: comma[1], 
                        incremental_reach1: ireach, //(itemlist[0].filter(x => x.item === this.result[1][2][c][0])[0].reach),
                        //incremental_reach2: ((this.result[d][1][c]* 100) - (itemlist[0].filter(x => x.item === this.result[1][2][c][0])[0].reach.split('%')[0])).toFixed(2).toString()+'%'
                        //incremental_reach2: ((this.result[d][1][c]* 100) - (itemlist[0].filter(x => x.item === this.result[1][2][c][0])[0].reach[0]))
                        incremental_reach2: parseFloat(((this.result[d][1][c]* 100)-ireach).toFixed(1)), //(itemlist[0].filter(x => x.item === this.result[1][2][c][0])[0].reach)).toFixed(1))
                    }
                    list.push(p);
                    
                } else if (d == 2) {
                    let Ilist = item.substring(0, item.length-1).split(",");
                    var pitem = this.removeValue(item, Ilist[Ilist.length-1], ',');
                    let inc = itemlist[1].filter(x => x.item === pitem.substring(0, pitem.length-1));
                    let reachData = (this.result[d][1][c]* 100).toFixed(1);
                    var comma = item.split(',');
                    let freqReach = (parseFloat(this.result[d][3][c].toFixed(2)) / parseFloat(reachData) * 100).toFixed(2);
                   
                    const p: threeitem = {
                        //reach: (this.result[d][1][c]* 100),//.toFixed(2).toString()+'%',
                        reach: parseFloat(reachData),
                        //frequency: this.result[d][3][c],
                        frequency: parseFloat(this.result[d][3][c].toFixed(2)),
                        freqreach: parseFloat(freqReach),
                        item: item.substring(0, item.length - 1),
                        item1: comma[0],
                        item2: comma[1],
                        item3: comma[2],
                        incremental_reach1: (inc[0].incremental_reach1),
                        incremental_reach2: (inc[0].incremental_reach2),
                        //incremental_reach3: ((this.result[d][1][c]*100) - (Number(inc[0].incremental_reach1.split('%')[0]) + 
                        //Number(inc[0].incremental_reach2.split('%')[0]))),//.toFixed(2).toString()+'%',
                        incremental_reach3: parseFloat(((this.result[d][1][c]*100) - (Number(inc[0].incremental_reach1) + 
                        Number(inc[0].incremental_reach2))).toFixed(1)),
                        //.toFixed(2).toString()+'%',
                    }
                    list.push(p);
                } else if (d == 3) {
                    var Ilist = item.substring(0, item.length - 1).split(",");
                    var pitem = this.removeValue(item, Ilist[Ilist.length -1], ',');
                    let inc = itemlist[2].filter(x => x.item === pitem.substring(0, pitem.length - 1));
                    var comma = item.split(',');
                    // console.log(97,pitem.substring(0, pitem.length - 1));
                    // console.log(98, itemlist[2]);
                    
                    if (inc.length == 0) {
                        let cu = itemlist[0].filter(x => x.item === Ilist[0])[0] ? itemlist[0].filter(x => x.item === Ilist[0])[0].reach : "NA";
                        let cv = itemlist[1].filter(x => x.item === (Ilist[0]+','+Ilist[1]))[0] ? itemlist[1].filter(x => x.item === (Ilist[0]+','+Ilist[1]))[0].incremental_reach2 : "NA";
                        let cx = itemlist[2].filter(x => x.item === (Ilist[0]+','+Ilist[1]+','+Ilist[2]))[0] ? itemlist[2].filter(x => x.item === (Ilist[0]+','+Ilist[1]+','+Ilist[2]))[0].incremental_reach3 : "NA";
                        let reachData = (this.result[d][1][c]* 100).toFixed(1);
                        let freqReach = (parseFloat(this.result[d][3][c].toFixed(2)) / parseFloat(reachData) * 100).toFixed(2);
                        const p: fouritem = {
                            //reach: (this.result[d][1][c]* 100),//.toFixed(2).toString()+'%',
                            reach: parseFloat(reachData),
                            //frequency: this.result[d][3][c],
                            frequency: parseFloat(this.result[d][3][c].toFixed(2)),
                            freqreach: parseFloat(freqReach),
                            item: item.substring(0, item.length - 1),
                            item1: comma[0],
                            item2: comma[1],
                            item3: comma[2],
                            item4: comma[3],
                            incremental_reach1: cu,
                            incremental_reach2: cv, 
                            incremental_reach3: cx,
                            incremental_reach4: "NA",
                        }
                        list.push(p);
                    }else if(inc.length > 0){
                        let reachData = (this.result[d][1][c]* 100).toFixed(1);
                        let freqReach = (parseFloat(this.result[d][3][c].toFixed(2)) / parseFloat(reachData) * 100).toFixed(2);
                    const p: fouritem = {
                        //reach: (this.result[d][1][c]* 100),//.toFixed(2).toString()+'%',
                        reach: parseFloat(reachData),
                        //frequency: this.result[d][3][c],
                        frequency: parseFloat(this.result[d][3][c].toFixed(2)),
                        freqreach: parseFloat(freqReach),
                        item: item.substring(0, item.length - 1),
                        item1: comma[0],
                        item2: comma[1],
                        item3: comma[2],
                        item4: comma[3],
                        incremental_reach1: inc[0].incremental_reach1,
                        incremental_reach2: inc[0].incremental_reach2,
                        incremental_reach3: inc[0].incremental_reach3,
                        //incremental_reach4: ((this.result[d][1][c] * 100) - (Number(inc[0].incremental_reach1.split('%')[0]) + 
                        //Number(inc[0].incremental_reach2.split('%')[0]) + Number(inc[0].incremental_reach3.split('%')[0]))),//,.toFixed(2).toString()+'%'
                        incremental_reach4: parseFloat(((this.result[d][1][c] * 100)- (Number(inc[0].incremental_reach1) + 
                        Number(inc[0].incremental_reach2) + Number(inc[0].incremental_reach3))).toFixed(1)),
                    }
                    list.push(p);
                }
                } else if (d == 4) {
                    var Ilist = item.substring(0, item.length - 1).split(",")
                    var pitem = this.removeValue(item, Ilist[Ilist.length -1], ',');
                    let inc = itemlist[3].filter(x => x.item === pitem.substring(0, pitem.length - 1));
                    var comma = item.split(',');
                   
                    if (inc.length == 0) {
                        let cu = itemlist[0].filter(x => x.item === Ilist[0])[0] ? itemlist[0].filter(x => x.item ===  Ilist[0])[0].reach : "NA";
                        let cv = itemlist[1].filter(x => x.item === Ilist[0]+','+Ilist[1])[0] ? itemlist[1].filter(x => x.item ===  Ilist[0]+','+Ilist[1])[0].incremental_reach2 : "NA";
                        let cw = itemlist[2].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2])[0] ? itemlist[2].filter(x => x.item ===  Ilist[0]+','+Ilist[1]+','+Ilist[2])[0].incremental_reach3 : "NA";
                        let cx = itemlist[3].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3])[0] ? itemlist[3].filter(x => x.item ===  Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3])[0].incremental_reach4 : "NA";
                        let reachData = (this.result[d][1][c]* 100).toFixed(2);
                        let freqReach = (parseFloat(this.result[d][3][c].toFixed(2)) / parseFloat(reachData) * 100).toFixed(2);
                        const p: fiveitem = {
                            //reach: (this.result[d][1][c]* 100),//.toFixed(2).toString()+'%',
                            reach: parseFloat(reachData),
                            //frequency: this.result[d][3][c],
                            frequency: parseFloat(this.result[d][3][c].toFixed(2)),
                            freqreach: parseFloat(freqReach),
                            item: item.substring(0, item.length - 1),
                            item1: comma[0],
                            item2: comma[1],
                            item3: comma[2],
                            item4: comma[3],
                            item5: comma[4],
                            incremental_reach1: cu,
                            incremental_reach2: cv,
                            incremental_reach3: cw,
                            incremental_reach4: cx,
                            incremental_reach5: "NA"
                        }
                        list.push(p);
                    }else if(inc.length > 0){
                        let reachData = (this.result[d][1][c]* 100).toFixed(1);
                        let freqReach = (parseFloat(this.result[d][3][c].toFixed(2)) / parseFloat(reachData) * 100).toFixed(2);
                    const p: fiveitem = {
                        reach: parseFloat(reachData),//(this.result[d][1][c]* 100),//.toFixed(2).toString()+'%',
                        //frequency: this.result[d][3][c],
                        frequency: parseFloat(this.result[d][3][c].toFixed(1)),
                        freqreach: parseFloat(freqReach),
                        item: item.substring(0, item.length - 1),
                        item1: comma[0],
                        item2: comma[1],
                        item3: comma[2],
                        item4: comma[3],
                        item5: comma[4],
                        incremental_reach1: inc[0].incremental_reach1,
                        incremental_reach2: inc[0].incremental_reach2,
                        incremental_reach3: inc[0].incremental_reach3,
                        incremental_reach4: inc[0].incremental_reach4,
                        // incremental_reach5: ((this.result[d][1][c]*100) - (Number(inc[0].incremental_reach1.split('%')[0]) + Number(inc[0].incremental_reach2.
                        // split('%')[0]) + Number(inc[0].incremental_reach3.split('%')[0]) + Number(inc[0].incremental_reach4.split('%')[0]))),//.toFixed(2).toString()+'%'
                        incremental_reach5: parseFloat(((this.result[d][1][c]*100)-(Number(inc[0].incremental_reach1) + Number(inc[0].incremental_reach2) + Number(inc[0].incremental_reach3) + Number(inc[0].incremental_reach4))).toFixed(1))
                    }
                    list.push(p);
                }
                } else if (d == 5) {
                    var Ilist = item.substring(0, item.length - 1).split(",")
                    var pitem = this.removeValue(item, Ilist[Ilist.length -1], ',');
                    let inc = itemlist[4].filter(x => x.item === pitem.substring(0, pitem.length - 1));
                    var comma = item.split(',');
                    if (inc.length == 0) {
                        let cu = itemlist[0].filter(x => x.item === Ilist[0])[0] ? itemlist[0].filter(x => x.item === Ilist[0])[0].reach : "NA";
                        let cv = itemlist[1].filter(x => x.item === Ilist[0]+','+Ilist[1])[0] ? itemlist[1].filter(x => x.item === Ilist[0]+','+Ilist[1])[0].incremental_reach2 : "NA";
                        let cw = itemlist[2].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2])[0] ? itemlist[2].filter(x => x.item ===Ilist[0]+','+Ilist[1]+','+Ilist[2])[0].incremental_reach3 : "NA";
                        let cx = itemlist[3].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3])[0] ? itemlist[3].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3])[0].incremental_reach4 : "NA";
                        let cy = itemlist[4].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3]+','+Ilist[4])[0] ? itemlist[4].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3]+','+Ilist[4])[0].incremental_reach5 : "NA";
                        let reachData = (this.result[d][1][c]* 100).toFixed(1);
                        let freqReach = (parseFloat(this.result[d][3][c].toFixed(2)) / parseFloat(reachData) * 100).toFixed(2);
                        const p: sixitem = {
                            reach: parseFloat(reachData), //(this.result[d][1][c]* 100),//.toFixed(2).toString()+'%',
                            //frequency: this.result[d][3][c],
                            frequency: parseFloat(this.result[d][3][c].toFixed(2)),
                            freqreach: parseFloat(freqReach),
                            item: item.substring(0, item.length - 1),
                            item1: comma[0],
                            item2: comma[1],
                            item3: comma[2],
                            item4: comma[3],
                            item5: comma[4],
                            item6: comma[5],
                            incremental_reach1: cu,
                            incremental_reach2: cv,
                            incremental_reach3: cw,
                            incremental_reach4: cx,
                            incremental_reach5: cy,
                            incremental_reach6: "NA"
                        }
                        list.push(p);
                    }
                    else if(inc.length > 0){
                        let reachData = (this.result[d][1][c]* 100).toFixed(1);
                        let freqReach = (parseFloat(this.result[d][3][c].toFixed(2)) / parseFloat(reachData) * 100).toFixed(2);
                    const p: sixitem = {
                        reach: parseFloat(reachData), //(this.result[d][1][c]* 100),//.toFixed(2).toString()+'%',
                        //frequency: this.result[d][3][c],
                        frequency: parseFloat(this.result[d][3][c].toFixed(2)),
                        freqreach: parseFloat(freqReach),
                        item: item.substring(0, item.length - 1),
                        item1: comma[0],
                        item2: comma[1],
                        item3: comma[2],
                        item4: comma[3],
                        item5: comma[4],
                        item6: comma[5],
                        incremental_reach1: inc[0].incremental_reach1,
                        incremental_reach2: inc[0].incremental_reach2,
                        incremental_reach3: inc[0].incremental_reach3,
                        incremental_reach4: inc[0].incremental_reach4,
                        incremental_reach5: inc[0].incremental_reach5,
                        // incremental_reach6: ((this.result[d][1][c]*100) - (Number(inc[0].incremental_reach1.split('%')[0]) + Number(inc[0].
                        // incremental_reach2.split('%')[0]) + Number(inc[0].incremental_reach3.split('%')[0]) + Number(inc[0].incremental_reach4
                        // .split('%')[0]) + Number(inc[0].incremental_reach5.split('%')[0]))),//.toFixed(2).toString()+'%'
                        incremental_reach6: parseFloat(((this.result[d][1][c]*100) - (Number(inc[0].incremental_reach1) + Number(inc[0].
                        incremental_reach2) + Number(inc[0].incremental_reach3) + Number(inc[0].incremental_reach4
                        ) + Number(inc[0].incremental_reach5))).toFixed(1)), //.toString()+'%'
                    }
                    list.push(p);
                }
                } else if (d == 6) {
                    var Ilist = item.substring(0, item.length - 1).split(",")
                    var pitem = this.removeValue(item, Ilist[Ilist.length -1], ',');
                    let inc = itemlist[5].filter(x => x.item === pitem.substring(0, pitem.length - 1));
                    if (inc.length == 0) {
                        let cu = itemlist[0].filter(x => x.item === Ilist[0])[0] ? itemlist[0].filter(x => x.item === Ilist[0])[0].reach : "NA";
                        let cv = itemlist[1].filter(x => x.item === Ilist[0]+','+Ilist[1])[0] ? itemlist[1].filter(x => x.item === Ilist[0]+','+Ilist[1])[0].incremental_reach2 : "NA";
                        let cw = itemlist[2].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2])[0] ? itemlist[2].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2])[0].incremental_reach3 : "NA";
                        let cx = itemlist[3].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3])[0] ? itemlist[3].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3])[0].incremental_reach4 : "NA";
                        let cy = itemlist[4].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3]+','+Ilist[4])[0] ? itemlist[4].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3]+','+Ilist[4])[0].incremental_reach5 : "NA";
                        let cz = itemlist[5].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3]+','+Ilist[4]+','+Ilist[5])[0] ? itemlist[5].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3]+','+Ilist[4]+','+Ilist[5])[0].incremental_reach6 : "NA";
                        
                        let reachData = (this.result[d][1][c]* 100).toFixed(2);
                        let freqReach = (parseFloat(this.result[d][3][c].toFixed(2)) / parseFloat(reachData) * 100).toFixed(2);
                        const p: sevenitem = {
                            reach: parseFloat(reachData), //(this.result[d][1][c]* 100),//.toFixed(2).toString()+'%',
                            //frequency: this.result[d][3][c],
                            frequency: parseFloat(this.result[d][3][c].toFixed(2)),
                            freqreach: parseFloat(freqReach),
                            item: item.substring(0, item.length - 1),
                            incremental_reach1: cu,
                            incremental_reach2: cv,
                            incremental_reach3: cw,
                            incremental_reach4: cx,
                            incremental_reach5: cy,
                            incremental_reach6: cz,
                            incremental_reach7: "NA"
                        }
                        list.push(p);
                    }
                    else if(inc != null){
                        let reachData = (this.result[d][1][c]* 100).toFixed(1);
                        let freqReach = (parseFloat(this.result[d][3][c].toFixed(2)) / parseFloat(reachData) * 100).toFixed(2);
                    const p: sevenitem = {
                        reach: parseFloat(reachData), //(this.result[d][1][c]* 100),//.toFixed(2).toString()+'%',
                        //frequency: this.result[d][3][c],
                        frequency: parseFloat(this.result[d][3][c].toFixed(2)),
                        freqreach: parseFloat(freqReach),
                        item: item.substring(0, item.length - 1),
                        incremental_reach1: inc[0].incremental_reach1,
                        incremental_reach2: inc[0].incremental_reach2,
                        incremental_reach3: inc[0].incremental_reach3,
                        incremental_reach4: inc[0].incremental_reach4,
                        incremental_reach5: inc[0].incremental_reach5,
                        incremental_reach6: inc[0].incremental_reach6,
                        // incremental_reach7: ((this.result[d][1][c] *100) - (Number(inc[0].incremental_reach1.split('%')[0]) + 
                        // Number(inc[0].incremental_reach2.split('%')[0]) + Number(inc[0].incremental_reach3.split('%')[0]) + 
                        // Number(inc[0].incremental_reach4.split('%')[0]) + Number(inc[0].incremental_reach5.split('%')[0]) + 
                        // Number(inc[0].incremental_reach6.split('%')[0]))),//.toFixed(2).toString()+'%'
                        incremental_reach7: parseFloat(((this.result[d][1][c] *100) - (Number(inc[0].incremental_reach1) + 
                        Number(inc[0].incremental_reach2) + Number(inc[0].incremental_reach3) + 
                        Number(inc[0].incremental_reach4) + Number(inc[0].incremental_reach5) + 
                        Number(inc[0].incremental_reach6))).toFixed(1)), 
                        //.toFixed(2).toString()+'%'
                    }
                    list.push(p);
                }
                } else if (d == 7) {
                    var Ilist = item.substring(0, item.length - 1).split(",")
                    var pitem = this.removeValue(item, Ilist[Ilist.length -1], ',');
                    let inc = itemlist[6].filter(x => x.item === pitem.substring(0, pitem.length - 1));
                    if (inc.length == 0) {
                        let cu = itemlist[0].filter(x => x.item === Ilist[0])[0] ? itemlist[0].filter(x => x.item === Ilist[0])[0].reach : "NA";
                        let cv = itemlist[1].filter(x => x.item === Ilist[0]+','+Ilist[1])[0] ? itemlist[1].filter(x => x.item === Ilist[0]+','+Ilist[1])[0].incremental_reach2 : "NA";
                        let cw = itemlist[2].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2])[0] ? itemlist[2].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2])[0].incremental_reach3 : "NA";
                        let cx = itemlist[3].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3])[0] ? itemlist[3].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3])[0].incremental_reach4 : "NA";
                        let cy = itemlist[4].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3]+','+Ilist[4])[0] ? itemlist[4].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3]+','+Ilist[4])[0].incremental_reach5 : "NA";
                        let cz = itemlist[5].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3]+','+Ilist[4]+','+Ilist[5])[0] ? itemlist[5].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3]+','+Ilist[4]+','+Ilist[5])[0].incremental_reach6 : "NA";
                        let caa = itemlist[6].filter(x => x.item ===Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3]+','+Ilist[4]+','+Ilist[5]+Ilist[6])[0] ? itemlist[6].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3]+','+Ilist[4]+','+Ilist[5]+','+Ilist[6])[0].incremental_reach7 : "NA";
                        let reachData = (this.result[d][1][c]* 100).toFixed(1);
                        let freqReach = (parseFloat(this.result[d][3][c].toFixed(2)) / parseFloat(reachData) * 100).toFixed(2);
                        const p: eightitem = {
                            reach: parseFloat(reachData), //(this.result[d][1][c]* 100),//.toFixed(2).toString()+'%',
                            //frequency: this.result[d][3][c],
                            frequency: parseFloat(this.result[d][3][c].toFixed(2)),
                            freqreach: parseFloat(freqReach),
                            item: item.substring(0, item.length - 1),
                            incremental_reach1: cu,
                            incremental_reach2: cv,
                            incremental_reach3: cw,
                            incremental_reach4: cx,
                            incremental_reach5: cy,
                            incremental_reach6: cz,
                            incremental_reach7: caa,
                            incremental_reach8: "NA"
                        }
                        list.push(p);
                    }
                    else if(inc.length > 0){
                        let reachData = (this.result[d][1][c]* 100).toFixed(1);
                        let freqReach = (parseFloat(this.result[d][3][c].toFixed(2)) / parseFloat(reachData) * 100).toFixed(2);
                    const p: eightitem = {
                        reach: parseFloat(reachData), //(this.result[d][1][c]* 100),//.toFixed(2).toString()+'%',
                        frequency: parseFloat(this.result[d][3][c].toFixed(2)),
                        freqreach: parseFloat(freqReach),
                        item: item.substring(0, item.length - 1),
                        incremental_reach1: inc[0].incremental_reach1,
                        incremental_reach2: inc[0].incremental_reach2,
                        incremental_reach3: inc[0].incremental_reach3,
                        incremental_reach4: inc[0].incremental_reach4,
                        incremental_reach5: inc[0].incremental_reach5,
                        incremental_reach6: inc[0].incremental_reach6,
                        incremental_reach7: inc[0].incremental_reach7,
                        // incremental_reach8: ((this.result[d][1][c]*100) - (Number(inc[0].incremental_reach1.split('%')[0]) + Number(inc[0].incremental_reach2.split('%')[0])
                        //  + Number(inc[0].incremental_reach3.split('%')[0]) + Number(inc[0].incremental_reach4.split('%')[0]) + Number(inc[0].incremental_reach5.split('%')[0])
                        //   + Number(inc[0].incremental_reach6.split('%')[0]) + Number(inc[0].incremental_reach7.split('%')[0]))),//.toFixed(2).toString()+'%'
                        incremental_reach8: ((this.result[d][1][c]*100) - (Number(inc[0].incremental_reach1[0]) + Number(inc[0].incremental_reach2[0])
                        + Number(inc[0].incremental_reach3) + Number(inc[0].incremental_reach4[0]) + Number(inc[0].incremental_reach5[0])
                        + Number(inc[0].incremental_reach6[0]) + Number(inc[0].incremental_reach7[0]))),//.toFixed(2).toString()+'%'
                    }
                    list.push(p);
                    }
                }
            }
            itemlist.push(list);
            //console.log(371,itemlist[1]);
        }
        
        return itemlist;
    }

    removeValue(list: any, value: any, separator: any) {
        separator = separator || ",";
        var values = list.split(separator);
        for (var i = 0; i < values.length; i++) {
            if (values[i] == value) {
                values.splice(i, 1);
                return values.join(separator);
            }
        }
        return list;
    }

    showitem() : any[]{
        return this.itemreport();
    }

}


//********************  New Code  *****************************/
// import { ExcelViewModel } from "src/app/model/ExcelViewModel.model";
// import { eightitem } from "../eightitems/eightitems.component";
// import { fiveitem } from "../fiveitems/fiveitems.component";
// import { fouritem } from "../fouritems/fouritems.component";
// import { oneitem } from "../oneitems/oneitems.component";
// import { sevenitem } from "../sevenitems/sevenitems.component";
// import { sixitem } from "../sixitems/sixitems.component";
// import { threeitem } from "../threeitems/threeitems.component";
// import { twoitem } from "../twoitems/twoitems.component";

// export class exportexcel {

//     result: any[] = [];
//     arrlength: number;
//     constructor() {
//         this.result = JSON.parse(localStorage.getItem("chartData"));
//         this.arrlength = this.result.length;
//     }

//     itemreport() : any[]{
//         var itemlist: any[][] = [];
//         for (let d = 0; d < this.arrlength; d++) {
//             var list: any[] = [];
//             for (let c = 0; c < this.result[d][1].length; c++) {
//                 let item: string = '';
//                 for (var i = 0; i <= d; i++)
//                     item += this.result[d][2][c][i] + ',';
//                 if (d == 0) {
//                     const p: oneitem = {
//                         reach: (this.result[d][1][c]* 100).toFixed(2).toString()+'%',
//                         frequency: this.result[d][3][c],
//                         item: item.substring(0, item.length - 1)
//                     }
//                     list.push(p);
                   
//                 } else if (d == 1) {
//                     const p: twoitem = {
//                         reach: (this.result[d][1][c]* 100).toFixed(2).toString()+'%',
//                         frequency: this.result[d][3][c],
//                         item: item.substring(0, item.length - 1),
//                         incremental_reach1: (itemlist[0].filter(x => x.item === this.result[1][2][c][0])[0].reach),
//                         incremental_reach2: ((this.result[d][1][c]* 100) - (itemlist[0].filter(x => x.item === this.result[1][2][c][0])[0].reach.split('%')
//                         [0])).toFixed(2).toString()+'%'
//                     }
//                     list.push(p);
//                 } else if (d == 2) {
//                     let Ilist = item.substring(0, item.length - 1).split(",")
//                     var pitem = this.removeValue(item, Ilist[Ilist.length -1], ',');
//                     let inc = itemlist[1].filter(x => x.item === pitem.substring(0, pitem.length - 1));
//                     const p: threeitem = {
//                         reach: (this.result[d][1][c]* 100).toFixed(2).toString()+'%',
//                         frequency: this.result[d][3][c],
//                         item: item.substring(0, item.length - 1),
//                         incremental_reach1: (inc[0].incremental_reach1),
//                         incremental_reach2: (inc[0].incremental_reach2),
//                         incremental_reach3: ((this.result[d][1][c]*100) - (Number(inc[0].incremental_reach1.split('%')[0]) + 
//                         Number(inc[0].incremental_reach2.split('%')[0]))).toFixed(2).toString()+'%',
//                     }
//                     list.push(p);
//                 } else if (d == 3) {
//                     var Ilist = item.substring(0, item.length - 1).split(",")
//                     var pitem = this.removeValue(item, Ilist[Ilist.length -1], ',');
//                     let inc = itemlist[2].filter(x => x.item === pitem.substring(0, pitem.length - 1));
//                     if (inc.length == 0) {
//                         let cu = itemlist[0].filter(x => x.item === Ilist[0])[0] ? itemlist[0].filter(x => x.item === Ilist[0])[0].reach : "NA";
//                         let cv = itemlist[1].filter(x => x.item === (Ilist[0]+','+Ilist[1]))[0] ? itemlist[1].filter(x => x.item === (Ilist[0]+','+Ilist[1]))[0].incremental_reach2 : "NA";
//                         let cx = itemlist[2].filter(x => x.item === (Ilist[0]+','+Ilist[1]+','+Ilist[2]))[0] ? itemlist[2].filter(x => x.item === (Ilist[0]+','+Ilist[1]+','+Ilist[2]))[0].incremental_reach3 : "NA";
//                         const p: fouritem = {
//                             reach: (this.result[d][1][c]* 100).toFixed(2).toString()+'%',
//                             frequency: this.result[d][3][c],
//                             item: item.substring(0, item.length - 1),
//                             incremental_reach1: cu,
//                             incremental_reach2: cv,
//                             incremental_reach3: cx,
//                             incremental_reach4: "NA"
//                         }
//                         list.push(p);
//                     }else if(inc.length > 0){
//                     const p: fouritem = {
//                         reach: (this.result[d][1][c]* 100).toFixed(2).toString()+'%',
//                         frequency: this.result[d][3][c],
//                         item: item.substring(0, item.length - 1),
//                         incremental_reach1: inc[0].incremental_reach1,
//                         incremental_reach2: inc[0].incremental_reach2,
//                         incremental_reach3: inc[0].incremental_reach3,
//                         incremental_reach4: ((this.result[d][1][c] * 100)- (Number(inc[0].incremental_reach1.split('%')[0]) + 
//                         Number(inc[0].incremental_reach2.split('%')[0]) + Number(inc[0].incremental_reach3.split('%')[0]))).toFixed(2).toString()+'%'
//                     }
//                     list.push(p);
//                 }
//                 } else if (d == 4) {
//                     var Ilist = item.substring(0, item.length - 1).split(",")
//                     var pitem = this.removeValue(item, Ilist[Ilist.length -1], ',');
//                     let inc = itemlist[3].filter(x => x.item === pitem.substring(0, pitem.length - 1));
//                     if (inc.length == 0) {
//                         let cu = itemlist[0].filter(x => x.item === Ilist[0])[0] ? itemlist[0].filter(x => x.item ===  Ilist[0])[0].reach : "NA";
//                         let cv = itemlist[1].filter(x => x.item === Ilist[0]+','+Ilist[1])[0] ? itemlist[1].filter(x => x.item ===  Ilist[0]+','+Ilist[1])[0].incremental_reach2 : "NA";
//                         let cw = itemlist[2].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2])[0] ? itemlist[2].filter(x => x.item ===  Ilist[0]+','+Ilist[1]+','+Ilist[2])[0].incremental_reach3 : "NA";
//                         let cx = itemlist[3].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3])[0] ? itemlist[3].filter(x => x.item ===  Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3])[0].incremental_reach4 : "NA";
//                         const p: fiveitem = {
//                             reach: (this.result[d][1][c]* 100).toFixed(2).toString()+'%',
//                             frequency: this.result[d][3][c],
//                             item: item.substring(0, item.length - 1),
//                             incremental_reach1: cu,
//                             incremental_reach2: cv,
//                             incremental_reach3: cw,
//                             incremental_reach4: cx,
//                             incremental_reach5: "NA"
//                         }
//                         list.push(p);
//                     }else if(inc.length > 0){
//                     const p: fiveitem = {
//                         reach: (this.result[d][1][c]* 100).toFixed(2).toString()+'%',
//                         frequency: this.result[d][3][c],
//                         item: item.substring(0, item.length - 1),
//                         incremental_reach1: inc[0].incremental_reach1,
//                         incremental_reach2: inc[0].incremental_reach2,
//                         incremental_reach3: inc[0].incremental_reach3,
//                         incremental_reach4: inc[0].incremental_reach4,
//                         incremental_reach5: ((this.result[d][1][c]*100) - (Number(inc[0].incremental_reach1.split('%')[0]) + Number(inc[0].incremental_reach2.
//                         split('%')[0]) + Number(inc[0].incremental_reach3.split('%')[0]) + Number(inc[0].incremental_reach4.split('%')[0]))).toFixed(2).toString()+'%'
//                     }
//                     list.push(p);
//                 }
//                 } else if (d == 5) {
//                     var Ilist = item.substring(0, item.length - 1).split(",")
//                     var pitem = this.removeValue(item, Ilist[Ilist.length -1], ',');
//                     let inc = itemlist[4].filter(x => x.item === pitem.substring(0, pitem.length - 1));
//                     if (inc.length == 0) {
//                         let cu = itemlist[0].filter(x => x.item === Ilist[0])[0] ? itemlist[0].filter(x => x.item === Ilist[0])[0].reach : "NA";
//                         let cv = itemlist[1].filter(x => x.item === Ilist[0]+','+Ilist[1])[0] ? itemlist[1].filter(x => x.item === Ilist[0]+','+Ilist[1])[0].incremental_reach2 : "NA";
//                         let cw = itemlist[2].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2])[0] ? itemlist[2].filter(x => x.item ===Ilist[0]+','+Ilist[1]+','+Ilist[2])[0].incremental_reach3 : "NA";
//                         let cx = itemlist[3].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3])[0] ? itemlist[3].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3])[0].incremental_reach4 : "NA";
//                         let cy = itemlist[4].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3]+','+Ilist[4])[0] ? itemlist[4].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3]+','+Ilist[4])[0].incremental_reach5 : "NA";
//                         const p: sixitem = {
//                             reach: (this.result[d][1][c]* 100).toFixed(2).toString()+'%',
//                             frequency: this.result[d][3][c],
//                             item: item.substring(0, item.length - 1),
//                             incremental_reach1: cu,
//                             incremental_reach2: cv,
//                             incremental_reach3: cw,
//                             incremental_reach4: cx,
//                             incremental_reach5: cy,
//                             incremental_reach6: "NA"
//                         }
//                         list.push(p);
//                     }
//                     else if(inc.length > 0){
//                     const p: sixitem = {
//                         reach: (this.result[d][1][c]* 100).toFixed(2).toString()+'%',
//                         frequency: this.result[d][3][c],
//                         item: item.substring(0, item.length - 1),
//                         incremental_reach1: inc[0].incremental_reach1,
//                         incremental_reach2: inc[0].incremental_reach2,
//                         incremental_reach3: inc[0].incremental_reach3,
//                         incremental_reach4: inc[0].incremental_reach4,
//                         incremental_reach5: inc[0].incremental_reach5,
//                         incremental_reach6: ((this.result[d][1][c]*100) - (Number(inc[0].incremental_reach1.split('%')[0]) + Number(inc[0].
//                         incremental_reach2.split('%')[0]) + Number(inc[0].incremental_reach3.split('%')[0]) + Number(inc[0].incremental_reach4
//                         .split('%')[0]) + Number(inc[0].incremental_reach5.split('%')[0]))).toFixed(2).toString()+'%'
//                     }
//                     list.push(p);
//                 }
//                 } else if (d == 6) {
//                     var Ilist = item.substring(0, item.length - 1).split(",")
//                     var pitem = this.removeValue(item, Ilist[Ilist.length -1], ',');
//                     let inc = itemlist[5].filter(x => x.item === pitem.substring(0, pitem.length - 1));
//                     if (inc.length == 0) {
//                         let cu = itemlist[0].filter(x => x.item === Ilist[0])[0] ? itemlist[0].filter(x => x.item === Ilist[0])[0].reach : "NA";
//                         let cv = itemlist[1].filter(x => x.item === Ilist[0]+','+Ilist[1])[0] ? itemlist[1].filter(x => x.item === Ilist[0]+','+Ilist[1])[0].incremental_reach2 : "NA";
//                         let cw = itemlist[2].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2])[0] ? itemlist[2].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2])[0].incremental_reach3 : "NA";
//                         let cx = itemlist[3].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3])[0] ? itemlist[3].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3])[0].incremental_reach4 : "NA";
//                         let cy = itemlist[4].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3]+','+Ilist[4])[0] ? itemlist[4].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3]+','+Ilist[4])[0].incremental_reach5 : "NA";
//                         let cz = itemlist[5].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3]+','+Ilist[4]+','+Ilist[5])[0] ? itemlist[5].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3]+','+Ilist[4]+','+Ilist[5])[0].incremental_reach6 : "NA";
//                         const p: sevenitem = {
//                             reach: (this.result[d][1][c]* 100).toFixed(2).toString()+'%',
//                             frequency: this.result[d][3][c],
//                             item: item.substring(0, item.length - 1),
//                             incremental_reach1: cu,
//                             incremental_reach2: cv,
//                             incremental_reach3: cw,
//                             incremental_reach4: cx,
//                             incremental_reach5: cy,
//                             incremental_reach6: cz,
//                             incremental_reach7: "NA"
//                         }
//                         list.push(p);

//                     }
//                     else if(inc != null){
//                     const p: sevenitem = {
//                         reach: (this.result[d][1][c]* 100).toFixed(2).toString()+'%',
//                         frequency: this.result[d][3][c],
//                         item: item.substring(0, item.length - 1),
//                         incremental_reach1: inc[0].incremental_reach1,
//                         incremental_reach2: inc[0].incremental_reach2,
//                         incremental_reach3: inc[0].incremental_reach3,
//                         incremental_reach4: inc[0].incremental_reach4,
//                         incremental_reach5: inc[0].incremental_reach5,
//                         incremental_reach6: inc[0].incremental_reach6,
//                         incremental_reach7: ((this.result[d][1][c] *100) - (Number(inc[0].incremental_reach1.split('%')[0]) + 
//                         Number(inc[0].incremental_reach2.split('%')[0]) + Number(inc[0].incremental_reach3.split('%')[0]) + 
//                         Number(inc[0].incremental_reach4.split('%')[0]) + Number(inc[0].incremental_reach5.split('%')[0]) + 
//                         Number(inc[0].incremental_reach6.split('%')[0]))).toFixed(2).toString()+'%'
//                     }
//                     list.push(p);
     
//                 }
//                 } else if (d == 7) {
//                     var Ilist = item.substring(0, item.length - 1).split(",")
//                     var pitem = this.removeValue(item, Ilist[Ilist.length -1], ',');
//                     let inc = itemlist[6].filter(x => x.item === pitem.substring(0, pitem.length - 1));
//                     if (inc.length == 0) {
//                         let cu = itemlist[0].filter(x => x.item === Ilist[0])[0] ? itemlist[0].filter(x => x.item === Ilist[0])[0].reach : "NA";
//                         let cv = itemlist[1].filter(x => x.item === Ilist[0]+','+Ilist[1])[0] ? itemlist[1].filter(x => x.item === Ilist[0]+','+Ilist[1])[0].incremental_reach2 : "NA";
//                         let cw = itemlist[2].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2])[0] ? itemlist[2].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2])[0].incremental_reach3 : "NA";
//                         let cx = itemlist[3].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3])[0] ? itemlist[3].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3])[0].incremental_reach4 : "NA";
//                         let cy = itemlist[4].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3]+','+Ilist[4])[0] ? itemlist[4].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3]+','+Ilist[4])[0].incremental_reach5 : "NA";
//                         let cz = itemlist[5].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3]+','+Ilist[4]+','+Ilist[5])[0] ? itemlist[5].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3]+','+Ilist[4]+','+Ilist[5])[0].incremental_reach6 : "NA";
//                         let caa = itemlist[6].filter(x => x.item ===Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3]+','+Ilist[4]+','+Ilist[5]+Ilist[6])[0] ? itemlist[6].filter(x => x.item === Ilist[0]+','+Ilist[1]+','+Ilist[2]+','+Ilist[3]+','+Ilist[4]+','+Ilist[5]+','+Ilist[6])[0].incremental_reach7 : "NA";
//                         const p: eightitem = {
//                             reach: (this.result[d][1][c]* 100).toFixed(2).toString()+'%',
//                             frequency: this.result[d][3][c],
//                             item: item.substring(0, item.length - 1),
//                             incremental_reach1: cu,
//                             incremental_reach2: cv,
//                             incremental_reach3: cw,
//                             incremental_reach4: cx,
//                             incremental_reach5: cy,
//                             incremental_reach6: cz,
//                             incremental_reach7: caa,
//                             incremental_reach8: "NA"
//                         }
//                         list.push(p);
    
//                     }
//                     else if(inc.length > 0){
//                     const p: eightitem = {
//                         reach: (this.result[d][1][c]* 100).toFixed(2).toString()+'%',
//                         frequency: this.result[d][3][c],
//                         item: item.substring(0, item.length - 1),
//                         incremental_reach1: inc[0].incremental_reach1,
//                         incremental_reach2: inc[0].incremental_reach2,
//                         incremental_reach3: inc[0].incremental_reach3,
//                         incremental_reach4: inc[0].incremental_reach4,
//                         incremental_reach5: inc[0].incremental_reach5,
//                         incremental_reach6: inc[0].incremental_reach6,
//                         incremental_reach7: inc[0].incremental_reach7,
//                         incremental_reach8: ((this.result[d][1][c]*100) - (Number(inc[0].incremental_reach1.split('%')[0]) + Number(inc[0].incremental_reach2.split('%')[0])
//                          + Number(inc[0].incremental_reach3.split('%')[0]) + Number(inc[0].incremental_reach4.split('%')[0]) + Number(inc[0].incremental_reach5.split('%')[0])
//                           + Number(inc[0].incremental_reach6.split('%')[0]) + Number(inc[0].incremental_reach7.split('%')[0]))).toFixed(2).toString()+'%'
//                     }
//                     list.push(p);
//                     }
//                 }
//             }
//             itemlist.push(list);
//         }
//         return itemlist;
//     }

//     removeValue(list: any, value: any, separator: any) {
//         separator = separator || ",";
//         var values = list.split(separator);
//         for (var i = 0; i < values.length; i++) {
//             if (values[i] == value) {
//                 values.splice(i, 1);
//                 return values.join(separator);
//             }
//         }
//         return list;
//     }

//     showitem() : any[]{
//         return this.itemreport();
//     }

// }