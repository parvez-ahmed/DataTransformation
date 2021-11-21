const fs = require('fs');
const moment = require("moment");

function start() {
    const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    const result = findSubset(data);
    const sortedResult = sort(result);
    fs.writeFileSync( "resultset.json", JSON.stringify(sortedResult))
}

function findSubset(clicks) {
    let ipMapper = {};
    let result = [];
    for (let click of clicks) {
        const date = moment(click.timestamp, 'DD/MM/YYYY hh:mm:ss');
        if (!ipMapper[click.ip]) {
            ipMapper[click.ip] = {
                counter: 1,
                day: {
                    [date.format("DD/MM/YYYY")]: {
                        [date.get("hour")]: makeDataObject(click)
                    }
                }
            }
        } else {
            ipMapper[click.ip].counter++;
            if (ipMapper[click.ip]["day"][date.format("DD/MM/YYYY")]) {
                const dayObject = ipMapper[click.ip]["day"][date.format("DD/MM/YYYY")];
                if (dayObject[date.get("hour")]) {
                    const hourObject = dayObject[date.get("hour")];
                    if (click.amount > hourObject.amount || (click.amount == hourObject.amount && date.diff(moment(hourObject.timestamp, 'DD/MM/YYYY hh:mm:ss')) > 0)) {
                        dayObject[date.get("hour")] = makeDataObject(click);
                    }
                } else {
                    dayObject[date.get("hour")] = makeDataObject(click)
                }
            } else {
                ipMapper[click.ip]["day"][date.format("DD/MM/YYYY")] = {
                    [date.get("hour")]: makeDataObject(click)
                }
            }
        }
    }
    for (let ipkey in ipMapper) {
        if (ipMapper[ipkey].counter <= 10) {
            for (let dayKey in ipMapper[ipkey]["day"]){
                for(let hourKey in ipMapper[ipkey]["day"][dayKey]){
                    result.push({ip:ipkey,...ipMapper[ipkey]["day"][dayKey][hourKey]});
                }
            }
        }
    }
    return result;
}


function sort(data){
    if(data.length <= 0 ) return [];
    if(data.length == 1) return data;
    let mid = Math.floor(data.length/2);
    return merge(sort(data.slice(0,mid)),sort(data.slice(mid)));  
}

function merge(arr1,arr2){
    let pointer1 = 0;
    let pointer2 = 0;
    let mergeArray = [];
    while(pointer1 < arr1.length && pointer2 < arr2.length){
        let date1 = moment(arr1[pointer1].timestamp, 'DD/MM/YYYY hh:mm:ss');
        let date2 = moment(arr2[pointer2].timestamp, 'DD/MM/YYYY hh:mm:ss');
        if(date1.diff(date2) < 0){
            mergeArray.push(arr1[pointer1]);
            pointer1++;
        }else{
            mergeArray.push(arr2[pointer2]);
            pointer2++;
        }
    }
    while(pointer1 < arr1.length){
        mergeArray.push(arr1[pointer1]);
        pointer1++;
    }
    while(pointer2 < arr2.length){
        mergeArray.push(arr2[pointer2]);
        pointer2++;
    }
    return mergeArray;
}


function makeDataObject(click) {
    return { timestamp: click.timestamp, amount: click.amount }
};


start()