import React,{Component} from 'react';
import classes from './AddNewFandom.module.css';
import Input from '../../../../components/UI/Input/Input';
import Button from '../../../../components/UI/Button/Button';
import {updateObject} from '../../../../shared/utility';
import ImageUpload from '../../../../components/ImageUpload/ImageUpload'


class AddNewFandom extends Component{
    
    formRef = React.createRef();
    
    state ={
        fandomForm:{
            fandom_Name: {
                    label: 'Fandom Name:',
                    elementType: 'input', 
                    elementConfig:{
                        type: 'text',
                        placeholder: 'Fandom Name'
                    },
                    value:'',
                    validation: {
                        required: true
                    },
                    valid:false,
                    touched:false,
                    visible: true
            },
            search_Key: {
                label: 'Search Key:',
                elementType:'input', 
                elementConfig:{
                    type: 'text',
                    placeholder: 'Search Key'
                },
                value:'',
                validation: {
                    required: true
                },
                valid:false,
                touched:false,
                visible: true
            },
            auto_Save: {
                label: 'Save Fanfics Automatic to Server?',
                elementType:'select', 
                elementConfig:{
                    options: [{value: false,displayValue: 'No'},
                              {value: true,displayValue: 'Yes'}
                              ]
                },
                value:'no',
                validation:{},
                valid: true,
                visible: true
            },
            save_Method: {
                label: 'Save Methods:',
                elementType:'checkbox', 
                elementConfig:{
                    options: [{value: 'azw3',displayValue: 'AZW3',checked: false},
                              {value: 'epub' ,displayValue: 'ePub',checked: false},
                              {value: 'mobi' ,displayValue: 'Mobi',checked: false},
                              {value: 'pdf' ,displayValue: 'PDF',checked: false},
                              {value: 'html' ,displayValue: 'Html',checked: false}]
                },
                value:'',
                validation:{},
                valid: true,
                visible: false
            }
        },
        formIsValid:false
    }

    sendFandomToServerHandler = ( event ) => {
        event.preventDefault();
        let saveType = []
        this.state.fandomForm['save_Method'].elementConfig.options.map(type=>{
            type.checked && saveType.push(type.value)
        })

        const fandom = {
            "Fandom_Name": this.state.fandomForm['fandom_Name'].value,
            "Search_Keys":this.state.fandomForm['search_Key'].value,
            "Auto_Save":this.state.fandomForm['auto_Save'].value,
            "Save_Method": saveType,
            "Fanfics_in_Fandom": 0,
            "On_Going_Fanfics": 0,
            "Complete_fanfics": 0,
            "Saved_fanfics": 0,
            "Fandom_Folder_Assets": `assets/Fandoms/${this.state.fandomForm['fandom_Name'].value}`,
            "Last_Update": new Date().getTime()
        }
        const form = this.formRef.current;
        console.log(form)
        console.log(fandom)
        //this.props.onOrderBurger(order,this.props.token);

    }

    checkValidity = (value,rules) =>{
        let isValid = true;
    
        if(rules.required){
            isValid = value.trim() !== '' && isValid;
        }
    
        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid
        }
    
        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid
        }
        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value) && isValid
        }
    
        if (rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid
        }
        return isValid;
    }

    inputCheckedHandler = (event)=>{
        let options = []
        this.state.fandomForm['save_Method'].elementConfig.options.map(function(check) {
            if(check.value === event.target.value){
                options.push({
                    ...check,
                    checked: event.target.checked
                })
            }else{
                options.push({
                    ...check
                })
            }
        });

        const updatedFormElement = updateObject(this.state.fandomForm['save_Method'],{
            elementConfig:{
                options:options
            }
        });
        const updatedFandomForm = updateObject(this.state.fandomForm,{
            ['save_Method']:updatedFormElement
        })

        this.setState({fandomForm: updatedFandomForm});
    }

    inputChangedHandler = (event,inputIdentifier) =>{

        const updatedFormElement = updateObject(this.state.fandomForm[inputIdentifier],{
            value: event.target.value,
            valid: this.checkValidity(event.target.value, this.state.fandomForm[inputIdentifier].validation),
            touched: true,
        });
        let updatedFandomForm = null;
        

        if(inputIdentifier==='auto_Save'){
            const updatedFormElement1 = updateObject(this.state.fandomForm['save_Method'],{
                visible: JSON.parse(event.target.value)
            });

            updatedFandomForm = updateObject(this.state.fandomForm,{
                [inputIdentifier]:updatedFormElement,
                ['save_Method']:updatedFormElement1
            })
        }else{
            updatedFandomForm = updateObject(this.state.fandomForm,{
                [inputIdentifier]:updatedFormElement
            })            
        }

        let formIsValid = true;
        for(let inputIdentifier in updatedFandomForm){
            formIsValid = updatedFandomForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({fandomForm: updatedFandomForm, formIsValid: formIsValid});
        
    }

    render(){
        const formElementsArray = [];
        for(let key in this.state.fandomForm){
            formElementsArray.push({
                id:key,
                config: this.state.fandomForm[key]
            })
        }
        let form = (
            <form onSubmit={this.sendFandomToServerHandler}>
                {formElementsArray.map(formElement=>(
                        <Input
                            label={formElement.config.label}
                            key={formElement.id}
                            elementType={formElement.config.elementType} 
                            elementConfig={formElement.config.elementConfig} 
                            value={formElement.config.value} 
                            invalid={!formElement.config.valid}
                            shouldValidate={formElement.config.validation}
                            touched={formElement.config.touched}
                            visible={formElement.config.visible}
                            checked={(event) => this.inputCheckedHandler(event,formElement.id)}
                            changed={(event) => this.inputChangedHandler(event,formElement.id)}/>
                ))}                
                <Button  btnType="Success" disabled={!this.state.formIsValid}>ADD</Button>
            </form>
        );

        return(
            <div>
                <h3>Add New Fandom</h3>
                {form}
                <p>Image</p>
                <ImageUpload ref={this.formRef}/>
            </div>
        );
    }
}


export default AddNewFandom;
