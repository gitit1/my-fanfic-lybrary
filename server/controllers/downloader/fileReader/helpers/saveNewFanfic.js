
const FandomModal = require('../../../../models/Fandom');
const multer = require('multer');
const { fixStringForPath } = require('../../../helpers/fixStringForPath.js');

const funcs = require('../../helpers/index');

exports.saveNewFanfic = async (fandomName, fileName, req, res) => {
    return await new Promise(async function (resolve, reject) {
        console.log('[FileReader] - saveNewFanfic');
        console.log('fileName', fileName);

        fandomName = fandomName.replace("%26", "&");
        fandomNameLower = fandomName.toLowerCase();
        const pathForDocs = `public/fandoms/${fandomNameLower}/fanfics`;
        const tempPath = `public/temp-files`;

        let storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, pathForDocs)
            },
            filename: function (req, file, cb) {
                cb(null, fixStringForPath(file.fieldname))
            }
        });

        let upload = multer({ storage: storage }).any();

        await upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                console.log('Muller Error', res.status(500).json(err));
                resultMessage = 'Error';
                return resultMessage;
            } else if (err) {
                console.log('Other Error', err);
                resultMessage = 'Other Error';
                return resultMessage;
            }
            let fanfic = await funcs.createFanficObj(fandomName, req.body);
            const newFileName = fixStringForPath(req.body.fileName);
            
            fanfic['status'] = 'old';
            fanfic['fileName'] = newFileName;
            fanfic['savedAs'] = req.body.savedAs;
            fanfic['SavedFic'] = true;
            fanfic['NeedToSaveFlag'] = false;

            await funcs.saveFileToServer(`${tempPath}/${fileName}`, `${pathForDocs}/${newFileName}.${fileName.split('.')[1]}`)

            const fandomData = await FandomModal.find({ 'FandomName': fandomName }, function (err, fandoms) { if (err) { throw err; } });
            const status = await funcs.saveFanficToDB(fandomName, fanfic, fandomData[0].Collection);
            status && await funcs.updateFandomDataInDB(fanfic)
            resolve();
        })

    });
}