
import * as actionTypes from './actionTypes';

export const saveScreenSize = (size,smallSize) =>{
    console.log('[actions: fandom.js] - getFandomsFromDBSuccess')
    return{
        type: actionTypes.SAVE_SCREEN_SIZE,
        size: size,
        smallSize: smallSize
    };
};
