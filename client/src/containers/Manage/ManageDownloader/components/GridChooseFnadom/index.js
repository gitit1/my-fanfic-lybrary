import React from 'react';
import ChooseFandom from './chooseFandom'
import { Grid } from '@material-ui/core';

const GridChooseFandom = (props) => (
    <Grid item xs={12}>
        <ChooseFandom fandomSelect={props.fandomSelect} changed={props.inputChange}/>
    </Grid>
);

export default GridChooseFandom;