import React, {Component} from 'react'; 

export default class ShowBtn extends Component{

    state = {
       isActive:false,
       btnTalk: "Profile Outline"
    }
  
    handleShow = ()=>{
        if (this.state.isActive === false){
        this.setState({
            isActive: true,
            btnTalk: "Hide Outline"
        })
    } else {
        this.setState({
            isActive: false, 
            btnTalk: "Profile Outline"
        })
    }
    }
  
    handleHide = () =>{
        this.setState({
            isActive: false
        })
    }
  
     render(){
         return(
             <div>
                <div className="btnDiv">
                <button className="all-btns hide" onClick={this.handleShow}>{this.state.btnTalk}</button>
            </div>
             {this.state.isActive ?             
             <div className="overlay">
                <img id="placeholder" src="/img/white_outline.png" alt="placeholder"/>
            </div> : null }
             </div>
         )
     }
  }