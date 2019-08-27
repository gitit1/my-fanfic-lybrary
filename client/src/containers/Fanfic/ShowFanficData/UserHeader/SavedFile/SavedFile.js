import React from 'react';

const SavedFile = (props) => {
    const {fileName,savedAs,FandomName} = props.fanfic;
    return(
        <div className='SavedFile'>
        {fileName && 
            <React.Fragment>
                <span>Saved on server:</span>
                {savedAs.split(',').map(method=>(
                    <a  target='_blank' rel="noopener noreferrer" 
                        href={`http://myfanficlybrary.tk/fandoms/${FandomName.toLowerCase()}/fanfics/${fileName}.${method}`}>{method} </a>
                ))}
            </React.Fragment>
            
            }      
      </div>
    )
};

export default SavedFile;