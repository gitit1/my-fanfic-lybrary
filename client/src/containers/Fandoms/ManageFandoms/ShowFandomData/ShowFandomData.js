import React from 'react';
import classes from './ShowFandomData.module.css';
import Button from '../../../../components/UI/Button/Button';
import {Link} from 'react-router-dom'


const ShowFandomData = (props) => {
    return(
        <React.Fragment>
                <div className={classes.Fandoms}>
                  { props.fandoms.map(fandom=>(
                      <div className={classes.Fandom} key={fandom.FandomName}>
                          <section className={classes.ImageSection}>
                              {
                                  fandom.Image_Name !== '' 
                                  ? <Link to='/'>
                                        <img src={`/images/fandoms/${fandom.FandomName}/${fandom.Image_Name}`} alt={fandom.FandomName}/>
                                    </Link> 
                                  
                                  : <Link to='/'>
                                        <img src={`/images/fandoms/nophoto.png`} alt={fandom.FandomName} className={classes.NoImage}/> 
                                    </Link>
                              }
                          </section>
                          <section className={classes.DataSection}>
                            <h3>
                                <Link to='/'>
                                    {fandom.FandomName}
                                </Link>
                            </h3>         
                            <p><span>Search Keys: </span>{fandom.SearchKeys}</p>           
                            <p><span>Auto Save: </span>{fandom.AutoSave==='true' ? 'Yes' : 'No'}</p> 
                            {fandom.AutoSave==='true' ? <p><span>Auto Save Types: </span>{fandom.SaveMethod}</p>  : null}  

                            <div className={classes.ButtonsSection}>
                                <Button clicked={() => props.editFandom(fandom)}>Edit</Button>
                                <Button clicked={() => props.deleteFandom(fandom.id,fandom.FandomName)}>Delete</Button>
                            </div>       
                          </section>

                          {/* <div className={classes.Clear}></div>   */}
                      </div>
                  ))}
                  <div className={[classes.Dummy,classes.Fandom].join(' ')}></div>
                  <div className={[classes.Dummy,classes.Fandom].join(' ')}></div>
                 </div>
        </React.Fragment>  
    )
};

export default ShowFandomData;