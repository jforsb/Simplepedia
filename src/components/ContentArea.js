/*
Jade Forsberg HW 5 simplepedia to server
  Used code examples from Professor Andrews
  ContentArea.js

  This governs the actual content displayed by the App.

  This component manages the data and coordiantes the views.
*/

import React, { Component } from 'react';

import Article from './Article.js';
import IndexBar from './IndexBar.js';
import Editor from './Editor.js';
//declare the server location
const SERVER = 'http://basin.cs.middlebury.edu:3042'

class ContentArea extends Component{
  constructor(props){
    super(props);
    this.state={
      mode: 'view',
      currentArticle: null

    };

      fetch(SERVER + '/articles/')
      .then((response)=>{
        if (response.ok){
          return response.json();
        }
      })
      .then((data)=>{
        this.setState({collection: data}) //set the collection to the servers data
      });

}

  /*
  This function handles the result of the editor resigning control.
  */
  handleEditorReturn(newArticle){
    if (newArticle){ // not a cancel
      if (this.state.currentArticle){ // this is a replacement, remove the old article
          //get the id of the article we're interested in
          let editedArticleID = this.state.currentArticle._id;
          let editedArticle = Object.assign({}, this.state.currentArticle, {title:newArticle.title, extract:newArticle.extract, edited: newArticle.edited} );
          const articleStr = JSON.stringify(editedArticle);
          const request = new Request(
            SERVER + "/articles/" + editedArticleID,
            {
              method:'PUT', //replace the old one
              body: articleStr,
              headers: new Headers({'Content-type': 'application/json'})
            }
          );

          fetch(request)
          .then((response)=>{
            if (response.ok){
              return response.json();
            }
          })
          .then((newArticle)=>{
            const newCollection = this.state.collection.map((article)=>{
            if (article._id === editedArticle._id){
              return newArticle;
            }
            return article;
          });
          //update the collection and current article
          this.setState({currentArticle: editedArticle, collection: newCollection});
          });
      }

      //add a new article
      let addArticle = Object.assign({}, newArticle, {title:newArticle.title, extract:newArticle.extract, edited: newArticle.edited} );
      const articleStr = JSON.stringify(addArticle);
      const request = new Request(
        SERVER + "/articles/" ,
        {
          method:'POST', //add new article
          body: articleStr,
          headers: new Headers({'Content-type': 'application/json'})
        }
      );

      fetch(request)
      .then((response)=>{
        if (response.ok){

          return response.json();
        }
      })
      .then((newArticle)=>{
        const newCollection = this.state.collection.map((article)=>{
        if (article._id === addArticle._id){
          return newArticle;
        }
        return article;
      });
      //update the collection and current article
      this.setState({currentArticle: addArticle, collection: newCollection});
      });
    }
    // switch to the browsing view
    this.setState({mode:'view'});
  }

//delete the old article
handleDelete(oldArticle){
    console.log(oldArticle);
      const request = new Request(
        SERVER + "/articles/" + oldArticle._id, //find id of old article so we can delete it
        {
          method:'DELETE', //delete old article
          headers: new Headers({'Content-type': 'application/json'})
        }
      );
      fetch(request)
      .then((response)=>{
        if (response.ok){
          return response.json();
        }
      })
      .then((article)=>{
        const newCollection = this.state.collection.filter((article)=>{
        if (article._id !== oldArticle._id){
          return article;
        }
        return article;
      });

      this.setState({currentArticle: null, collection: newCollection});
      });
}


  render(){
    let indexBar = (<h2>Loading...</h2>);
    if(this.state.collection){
      if (this.state.mode === 'view'){
      // create the IndexBar
        indexBar = (<IndexBar collection={this.state.collection} currentArticle={this.state.currentArticle} select={(article)=>this.setState({currentArticle:article})}/>);

      // create the article
      // Note that the insertion of Article is conditional on having
      // a current article available
        let article ;
        if (this.state.currentArticle){
          article = (<div>
          <Article article={this.state.currentArticle}/>
          <input type="button" value="Edit article" onClick={()=>this.setState({mode:'edit'})} />
          <input type="button" value="Delete article" onClick={()=>this.handleDelete(this.state.currentArticle)} />
          </div>);
        }else{
          article = (<div></div>);
        }

      return (
        <div >
        <input type="button" value="Add article" onClick={()=>this.setState({mode:'edit', currentArticle:null})} />
          {indexBar}
          {article}
        </div>
      );

    }else{
      return (
        <Editor article={this.state.currentArticle} complete={(newArticle)=>{this.handleEditorReturn(newArticle)}} handleDelete={(oldArticle)=>{this.handleEditorReturn(oldArticle)}}/>
      )
    }

  } else{
    return null;
  }
  }
}


export default ContentArea;
