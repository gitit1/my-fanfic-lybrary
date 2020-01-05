
const mongoose = require('../../../../config/mongoose');
const FandomModal = require('../../../../models/Fandom');
const multer = require('multer');
const fs = require('fs-extra');
const {createFanficObj} = require('../helpers/createFanficObj');
const {saveFanficToDB} = require('../../helpers/saveFanficToDB')
const {fixStringForPath} = require('../../../helpers/fixStringForPath.js');

exports.saveNewFanfic = async (fandomName,req, res) =>{ 
    return await new Promise(async function(resolve, reject) {  
        console.log('[Manually] - saveNewFanfic');

        fandomName = fandomName.replace("%26","&");
        fandomNameLower = fandomName.toLowerCase();
        const pathForDocs = `public/fandoms/${fandomNameLower}/fanfics`;
        

        let storage = multer.diskStorage({
            destination: function (req, file, cb) {
            cb(null, pathForDocs)
            },
            filename: function (req, file, cb) {
            cb(null,   fixStringForPath(file.fieldname))
            }
        });

        let upload = multer({ storage: storage }).any();

        await upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                console.log('Muller Error',res.status(500).json(err));
                resultMessage = 'Error';
                return resultMessage;
            } else if (err) {  
                console.log('Other Error',err);
                resultMessage = 'Other Error';
                return resultMessage;
            }
            
            let fanfic = await createFanficObj(fandomName,req.body);
            

            fanfic['status']            =   'old';
            fanfic['fileName']          =   fixStringForPath(req.body.fileName);
            fanfic['savedAs']           =   req.body.savedAs;
            fanfic['SavedFic']          =   true;
            fanfic['NeedToSaveFlag']    =   false;
        
            console.log('fanfic.Status:',fanfic.Status);
            console.log('fanfic.FanficID:',fanfic.FanficID);
            console.log('fanfic:',fanfic);
            const status = await saveFanficToDB(fandomName,fanfic);
            status && await updateFandomData(fanfic)
            resolve();
        })

    });
}


const updateFandomData = async (fanfic) =>{
    console.log('[Manually] - updateFandomData')
    const fandomName = fanfic.FandomName;
    const isComplete = fanfic.Complete ? `${fanfic.Source}.CompleteFanfics` : `${fanfic.Source}.OnGoingFanfics`
    const sourceFanficsInFandom = `${fanfic.Source}.FanficsInFandom`;
    const sourceSavedFanfics = `${fanfic.Source}.SavedFanfics`;
    await FandomModal.updateOne({ 'FandomName': fandomName },
                                {
                                    $inc: { 'FanficsInFandom':1,
                                            [sourceFanficsInFandom]:1,
                                            [isComplete]:1,
                                            [sourceSavedFanfics]:1
                                          },
                                });

    return null;
}
