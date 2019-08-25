const mongoose = require('../../../config/mongoose');
const func = require('../helpers/generalFunctions');
const UpdatesModal = require('../../../models/Updates');

exports.saveFanficToDB = (fandomName,fanfic) =>{
    // console.log(clc.bgGreenBright('[ao3 controller] saveFanfficToDB()',fandomName));   
    return new Promise(async function(resolve, reject) {
        let status = (fanfic.Status==='new'||fanfic.Status==='updated') ? true : false;
        mongoose.dbFanfics.collection(fandomName).findOne({FanficID: fanfic["FanficID"] }, async function(err, dbFanfic) {
            if (err) { 
                func.delay(1000).then(async () => reject(false))
                return reject()
            }
            let isExist = (dbFanfic===null) ? false : true;
            if(!isExist){
                mongoose.dbFanfics.collection(fandomName).insertOne(fanfic, async function (error, response) {
                    await func.delay(1000).then(async () => {
                        status && await saveUpdatesToDB(fandomName,fanfic)
                        resolve(true)
                    })
                }); 
                               
            }else{ 
                mongoose.dbFanfics.collection(fandomName).updateOne({ 'FanficID': fanfic["FanficID"]},{$set: fanfic}, async function (error, response) {
                    await func.delay(1000).then(async () => {
                        status && await saveUpdatesToDB(fandomName,fanfic)
                        resolve(true)
                    })
                })
            }
        });
    });
}

const saveUpdatesToDB = (fandomName,fanfic) =>{
    console.log('***************************************saveUpdatesToDB');
    console.log('fanfic.LastUpdateOfFic:',fanfic.LastUpdateOfFic);
    let fanficDate = new Date(new Date(fanfic.LastUpdateOfFic).setHours(0,0,0,0)).getTime();
    console.log('fanficDate:',fanficDate);


    return new Promise(async function(resolve, reject) {
        UpdatesModal.findOne({Date: fanficDate}, async function(err, dbUpdate) {
            if (err) { 
                console.log('---error')
                func.delay(1000).then(async () => reject(false))
                return reject()
            }
            let isExist = (dbUpdate===null) ? false : true;
            if(!isExist){
                console.log('---date not exist')
                let type = fanfic.Status==='new' ? 'New' : 'Updated';
    
                let update= {
                    'Date':fanficDate,
                    'Fandom':[
                        {
                            'FandomName': fandomName,
                            [type]:1,
                            FanficsIds:[
                                {
                                    'FanficID':fanfic.FanficID,
                                    'Status':fanfic.Status,
                                    'StatusDetails':fanfic.StatusDetails
                                }
                            ]
                        }
                    ]
                }

                const fandomData = new UpdatesModal(update);
                await fandomData.save();
                resolve();
            }else{ 
                console.log('---date exist')
                UpdatesModal.findOne({ 'Date': fanficDate, 'Fandom.FandomName': fandomName }, async function(err, dbUpdate) {
                    if (err) { 
                        console.log('---date exist error')
                        func.delay(1000).then(async () => reject(false))
                        return reject()
                    }
                    let isExist = (dbUpdate===null) ? false : true;
                    if(!isExist){
                        console.log('---date exist  - fandom dont exist')
                        let type = fanfic.Status==='new' ? 'New' : 'Updated';

                        await UpdatesModal.updateOne({'Date': fanficDate},
                        {   $push: { 'Fandom': {'FandomName':fandomName,[type]:1, 
                            'FanficsIds':[{'FanficID':fanfic.FanficID,'Status':fanfic.Status,'StatusDetails':fanfic.StatusDetails}]} }
                        });
                        resolve()
                    }else{
                        console.log('---date exist  - fandom  exist')
                        let type = fanfic.Status==='new' ? 'Fandom.$.New' : 'Fandom.$.Updated';
                        await UpdatesModal.updateOne({ 'Date': fanficDate, 'Fandom.FandomName': fandomName },
                        {   $inc: { [type]:1} , 
                            $push: {'Fandom.$.FanficsIds':[{'FanficID':fanfic.FanficID,'Status':fanfic.Status,'StatusDetails':fanfic.StatusDetails}]}
                        },
                        (err, result) => {
                            if(err){
                            console.log(clc.red('Error in save update',err))
                            reject()
                            };                           
                            resolve()
                         });
                    }
                    
                })
            }
        });

    });
}