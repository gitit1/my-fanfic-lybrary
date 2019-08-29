import React,{Component} from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as actions from '../../../../../store/actions';

import GetFanficData from "../helpers/GetFanficData/GetFanficData";
import UrlForSearch from './components/urlForSearch'
import Button from '../../../../../components/UI/Button/Button';

import './style/managefanfics.scss';


class AddNewFanficAutomatic extends Component{
    state = {
      url:'',
      loadingFlag:true,
      showData:false,
      msg:'',
      showUserData:false,
      showSaveButton:false,
      userData:{
        Follow:false,
        Favorite:false,
        status: null,
        chapter:0,
        toggleChapter:false
      }
    }

    getFanficData = () => {
        const {url} = this.state;
        this.setState({loadingFlag:true,showData:false});

        if(url===''){
          this.setState({msg:'please enter an url'})
        }else{
          this.setState({msg:''})

          const {fandomName} = this.props;

          this.props.onGetFanficData('automatic',fandomName,url).then(()=>{
            !this.props.fanfic 
              ? this.setState({loadingFlag:false,msg:'This is Acceptable URL',showSaveButton:false}) 
              : this.setState({loadingFlag:false,showData:true,showSaveButton:true});    
          });
      }
    } 

    saveFanficData = (save)=>{
      console.log('saveFanficData')
      console.log('save',save)
      const {url} = this.state
      const {fandomName,fanfic,switches} = this.props
      if(save){
          this.setState({showData:true,showUserData:true})
          this.props.onSaveFanficDataToDB(fandomName,fanfic,switches.save,url,false).then((res=>{
              let msg = <p>Saved Fanfic to DB</p>
              this.setState({msg,showSaveButton:false})
          }))
      }else{
          let msg = <p>Didn't save fanfic</p>
          this.setState({showData:false,msg})   
      }
    }

    inputChangedHandler = (event,type)=>{
      if(type==='url'){
        this.setState({url:event.target.value})
      }else{
        this.setState({
          form:{
            ...this.state.form,
            [type]:event.target.value
          }
        })
      }
    }

    markStatusHandler = async (fanficId,author,fanficTitle,source,statusType,event) =>{
      const {userData} = this.state;
      const {userEmail,fandomName} = this.props;
      let newStatus = '',chapterNum =0,flag=false;
      switch (statusType) {
        case 'Finished':
            newStatus = (userData.status!==null && userData.status==='Finished') ? 'Need to Read' : 'Finished';
            await this.props.onStatusHandler(userEmail,fandomName,fanficId,author,fanficTitle,source,statusType,newStatus);
            flag=true;
            break;
        case 'In Progress':
            if(event.key === 'Enter') {
                chapterNum = event.target.value;
                newStatus = 'In Progress';
                await this.props.onStatusHandler(userEmail,fandomName,fanficId,author,fanficTitle,source,statusType,newStatus,chapterNum);
                flag=true;
            }
            break;
        case 'Need to Read':
            break;
        default:
            break;
      }
      if(flag){
        this.setState({
          userData:{
            ...userData,
            status:newStatus,
            chapter:chapterNum,
            toggleChpter:false
          }       
        })
      }
    }

    markAsHandler = (fanficId,author,fanficTitle,source,markType) =>{
      const {userData} = this.state;
      const {userEmail,fandomName} = this.props;

      this.props.onMarkHandler(userEmail,fandomName,fanficId,author,fanficTitle,markType,source,!userData[markType])
      this.setState({      
        userData:{
          ...userData,
          [markType]:!userData[markType]
        }
      })
    }

    inputChapterHandler = (id) =>{
        const {userData} = this.state;
        this.setState({
          userData:{
            ...userData,
            toggleChpter:!userData.toggleChapter
          }
        })
    }

    render(){
      const {url,loadingFlag,showData,showUserData,userData,showSaveButton,msg} = this.state;
      const {size,loading,fanfic,similarFanfic} = this.props;
      //TODO: CHECK IF FANFIC ALREADY EXIST
      return(            
            <div className='addNewFanfic_container'>
              <UrlForSearch url={url} inputChanged={this.inputChangedHandler}/>
              <br/>
              <Button clicked={this.getFanficData}>Show Data</Button>
              <br/>
              <GetFanficData loading={loading} loadingFlag={loadingFlag} showData={showData} similarFanfic={similarFanfic} showSaveButton={showSaveButton}
                             fanfic={fanfic} size={size} showUserData={showUserData} userData={userData} markAs={this.markAsHandler} 
                             markStatus={this.markStatusHandler} toggleChapterB={this.inputChapterHandler} saveFanficData={this.saveFanficData} msg={msg}
                             />
            </div>


      )
  }
}

const mapStateToProps = state =>{
  return{
    //   fandoms:        state.fandoms.fandoms,
      fanfic:               state.downloader.fanfic,
      similarFanfic:        state.downloader.similarFanfic,
      loading:              state.downloader.loading,
      userEmail:            state.auth.user.email,
      size:                 state.screenSize.size
  };   
}

const mapDispatchedToProps = dispatch =>{
  return{
      onGetFanficData:        (type,fandomName,url)                                                             =>  dispatch(actions.getDataOfFanfic(type,fandomName,url)),
      onSaveFanficDataToDB:   (fandomName,fanfic,download,url,image)                                            =>  dispatch(actions.saveDataOfFanficToDB(fandomName,fanfic,download,url,image)),
      onMarkHandler:          (userEmail,fandomName,fanficId,author,fanficTitle,source,markType,mark)           =>  dispatch(actions.addFanficToUserMarks(userEmail,fandomName,fanficId,author,fanficTitle,source,markType,mark)),
      onStatusHandler:        (userEmail,fandomName,fanficId,author,fanficTitle,source,statusType,status,data)  =>  dispatch(actions.addFanficToUserStatus(userEmail,fandomName,fanficId,author,fanficTitle,source,statusType,status,data)),
  };
}

export default connect(mapStateToProps,mapDispatchedToProps)(withRouter(AddNewFanficAutomatic));

// TODO: add checkbox for image fanfic doanload