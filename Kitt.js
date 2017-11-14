// ==UserScript==
// @name         Kitt
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  Get more kittens!
// @author       Stig
// @match        http://bloodrizer.ru/games/kittens/
// @grant        none
// ==/UserScript==
//version x,y,z : x = I feel finished, y = new function added, z = bug fixes
window.onload = function () {
    setTimeout(function(){
        initElements();
        console.log("Kitt is enabled");
        createUI();
        kittARMIntervalId = setInterval(kittARM, 5000);
        kitt = {
            usefurs: true,
            bonfireUpgrade: true
        };

    },4000);
};


function toggleBonfireUpgrade(){
    if(document.getElementById("bonfireUpgrade").style.textDecoration != "line-through"){ //its enabled, disable it
        document.getElementById("bonfireUpgrade").style.textDecoration ="line-through";
        kitt.bonfireUpgrade=false;
        console.log("Kitt will no longer upgrade at bonfire");
    }
    else {
        kitt.bonfireUpgrade=true;
        document.getElementById("bonfireUpgrade").style.textDecoration = "";
        console.log("Kitt will now upgrade at bonfire");
    }
}

function bonfireUpgrade(){
    if(kitt.bonfireUpgrade == true){
        var lists = document.getElementsByClassName("bldGroupContainer")[0].childNodes[0].childNodes[0].childNodes; //left and right side
        start:
        for(i=0;i<lists.length;i++){
            console.log("i" + i);
            for(j=0;j<lists[i].childNodes.length;j++){
                console.log("j" + j);
                if(lists[i].childNodes[j].classList.contains("disabled")){ //fix so I dont have disgusting empty if's
                }
                else{
                    //we dont want to press Gather Catnip, Refine Catnip, Smelter
                    var current = lists[i].childNodes[j].childNodes[0].childNodes[0].innerHTML.split("(")[0];

                    if(current=="Gather catnip" || current =="Refine catnip" || current =="Smelter ") {
                    }
                    else{
                        eventFire(lists[i].childNodes[j],'click');
                        console.log("Kitt decided to upgrade " + lists[i].childNodes[j].childNodes[0].childNodes[0].innerHTML.split("(")[0]);
                        break start;
                    }

                }
            }
        }
    }
}

function toggleResourceManagement(){
    if(document.getElementById("KittARM").style.textDecoration != "line-through"){ //its enabled, disable it
        document.getElementById("KittARM").style.textDecoration ="line-through";
        clearInterval(kittARMIntervalId);
        console.log("Kitt will no longer manage your resources");
    }
    else { //there should be no kittARMIntervalId here.

        kittARMIntervalId = setInterval(kittARM, 5000);
        document.getElementById("KittARM").style.textDecoration = "";
        console.log("Kitt will now manage your resources");
    }
}

function toggleFurSaving(){
    if(document.getElementById("KittSaveFur").style.textDecoration != "line-through"){ //its enabled, disable it
        document.getElementById("KittSaveFur").style.textDecoration ="line-through";
        kitt.usefurs = false;
        console.log("Kitt will no longer craft using furs");
    }
    else { //there should be no kittARMIntervalId here.

        kitt.usefurs = true;
        document.getElementById("KittSaveFur").style.textDecoration = "";
        console.log("Kitt will now craft using furs");
    }

}
function createUI(){
    var c = document.createElement("div");
    c.id = "Kitt";
    c.style.width = "250px";
    c.style.top = "20px";
    c.style.position = "absolute";
    c.style.right = "0";
    c.style.border = "1px solid #C76743";
    c.style.padding = "0 0 0 5px";

    var newARMDiv = document.createElement("div");
    newARMDiv.id = "KittARM";
    newARMDiv.onclick = function(){toggleResourceManagement();};
    var t = document.createTextNode("Auto Resource Management");
    newARMDiv.appendChild(t);
    c.appendChild(newARMDiv);

    var newSaveFurDiv = document.createElement("div");
    newSaveFurDiv.id = "KittSaveFur";
    newSaveFurDiv.onclick = function(){toggleFurSaving();};
    t = document.createTextNode("Fur Crafting");
    newSaveFurDiv.appendChild(t);
    c.appendChild(newSaveFurDiv);

    var newUpgradeDiv = document.createElement("div");
    newUpgradeDiv.id = "bonfireUpgrade";
    newUpgradeDiv.onclick = function(){toggleBonfireUpgrade();};
    t = document.createTextNode("Auto Bonfire Upgrade");
    newUpgradeDiv.appendChild(t);
    c.appendChild(newUpgradeDiv);



    document.getElementById("game").appendChild(c);

    var nodes = document.getElementById('Kitt').childNodes;
    for(var i=0; i<nodes.length; i++) {
        nodes[i].onmouseover = function(){this.style.color = "#565655"; this.style.cursor = "pointer";};
        nodes[i].onmouseout = function(){this.style.color = "#DCDCDC";};
    }

    console.log("Kitt UI has been enabled");
}







function eventFire(el, etype){
    if (el.fireEvent) {
        el.fireEvent('on' + etype);
    } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
    }
}

function craftLimit(res,resLimit){ //takes 2 inputs: res(7432.2) and resLimit(15K) and returns true of res is >= 95% of resLimit
    //there's probably higher limits than K, so update this upon need
    //first convert from prefixed state

    var ress = [res.match(/[a-zA-Z]+|[0-9]+[.]*[0-9]*/g), resLimit.match(/[a-zA-Z]+|[0-9]+[.]*[0-9]*/g)];
    for(i=0;i < ress.length; i++){
        switch(ress[i][1]) { //switches on the suffix
            case "K":
                ress[i][0] = parseFloat(ress[i][0]) * 1000;
                break;
            case "M":
                ress[i][0] = parseFloat(ress[i][0]) * 1000000;
                break;
            default:
                ress[i][0] = parseFloat(ress[i][0]);
                break;
        }
    }
    if(ress[0][0] >= ress[1][0] * 0.95) return true; //if res is at least 95% of resLimit then we craft
    else return false;
}

function initElements() {
    //these look disgusting :)
    resTable = document.getElementsByClassName("resTable")[0];
    catnip = resTable.getElementsByClassName("resourceRow")[0].getElementsByClassName("resAmount")[0].innerHTML; //"50K" etc
    catnipLimit = resTable.getElementsByClassName("resourceRow")[0].getElementsByClassName("maxRes")[0].innerHTML.split("/")[1]; //"/50K" etc
    wood = resTable.getElementsByClassName("resourceRow")[1].getElementsByClassName("resAmount")[0].innerHTML;
    woodLimit = resTable.getElementsByClassName("resourceRow")[1].getElementsByClassName("maxRes")[0].innerHTML.split("/")[1]; //"/50K" etc
    minerals = resTable.getElementsByClassName("resourceRow")[2].getElementsByClassName("resAmount")[0].innerHTML;
    mineralsLimit = resTable.getElementsByClassName("resourceRow")[2].getElementsByClassName("maxRes")[0].innerHTML.split("/")[1]; //"/50K" etc
    iron = resTable.getElementsByClassName("resourceRow")[4].getElementsByClassName("resAmount")[0].innerHTML;
    ironLimit = resTable.getElementsByClassName("resourceRow")[4].getElementsByClassName("maxRes")[0].innerHTML.split("/")[1]; //"/50K" etc
    catpower = resTable.getElementsByClassName("resourceRow")[10].getElementsByClassName("resAmount")[0].innerHTML;
    catpowerLimit = resTable.getElementsByClassName("resourceRow")[10].getElementsByClassName("maxRes")[0].innerHTML.split("/")[1]; //"/50K" etc

    craftTable = document.getElementsByClassName("craftTable")[0];
    craftWood = craftTable.getElementsByClassName("resourceRow")[0].getElementsByTagName("a")[2]; //from catnip
    craftBeam = craftTable.getElementsByClassName("resourceRow")[1].getElementsByTagName("a")[0]; //from wood
    craftSlab = craftTable.getElementsByClassName("resourceRow")[2].getElementsByTagName("a")[0]; //from minerals
    craftPlate = craftTable.getElementsByClassName("resourceRow")[3].getElementsByTagName("a")[0]; //from iron
}

function kittARM() {
    initElements();
    bonfireUpgrade();
    if(craftLimit(catnip,catnipLimit)) {
        eventFire(craftWood,'click');
        console.log("Kitt crafted some wood");
    }
    if(craftLimit(wood,woodLimit)) {
        eventFire(craftBeam,'click');
        console.log("Kitt crafted some beams");
    }
    if(craftLimit(minerals,mineralsLimit)) {
        eventFire(craftSlab,'click');
        console.log("Kitt crafted some slabs");
    }
    if(craftLimit(iron,ironLimit)) {
        eventFire(craftPlate,'click');
        console.log("Kitt crafted some plates");
    }
    if(craftLimit(catpower,catpowerLimit)){
        eventFire(document.getElementById("fastHuntContainer").getElementsByTagName("a")[0],'click');
        console.log("Kitt sent some hunters");
        if(kitt.usefurs == true){
            setTimeout(eventFire(craftTable.getElementsByClassName("resourceRow")[13].getElementsByTagName("a")[3], 'click'),1000);
            console.log("Kitt crafted some parchment");
        }
    }
}


