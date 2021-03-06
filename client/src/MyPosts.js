import React, { Component } from 'react';
import { Link } from 'react-router'
import request from 'superagent';
import NoteEdit from './NoteEdit';
import NavigationBar from './NavigationBar'
import SearchBar from './SearchBar'

var MyPosts = React.createClass ({
  getInitialState() {
      return {
          notes: [''], filterText: ''
      }
  },
  delete(id){
    var self = this;
    request
     .get('/api/delete/'+id)
     .set('Accept', 'application/json')
     .end(function(err, res) {
       console.log('After API call')
       if (err || !res.ok) {
         console.log('Oh no! error', err);
       } else {
         ;
       }
     });
     var notes = this.state.notes.filter(note => note.postId !== id)
     this.setState({notes})
  },
  componentDidMount() {
    var self = this;
    request
     .get('/api/userposts/'+this.props.routeParams.userId)
     .set('Accept', 'application/json')
     .end(function(err, res) {
       if (err || !res.ok) {
         console.log('Oh no! error', err);
       } else {
         self.setState({notes: res.body.userPosts});
       }
     });
  },
  eachNote(note) {
      return (<NoteEdit key={note.postId}
                    id={note.postId}
                    post={note}
                    onDelete={this.delete}
                    userId={this.props.routeParams.userId}>
                {note.postPic}
              </NoteEdit>)
  },
  handleUserInput(filterText) {
    this.setState({
      filterText: filterText,
    });
  },
  render(){
    var myfeedlink = "/user/"+this.props.routeParams.userId
    var mypostslink = "/myposts/"+this.props.routeParams.userId
    var explorelink = "/explore/"+this.props.routeParams.userId
    var addcontentlink = "/add/"+this.props.routeParams.userId
    var filteredNotes = []
    this.state.notes.forEach((note) => {
      var notevar = "" + note.postTitle
      if (notevar.toLowerCase().indexOf(this.state.filterText.toLowerCase()) === -1) {
        return;
      }
      else {
        filteredNotes.push(note);
      }
    });
    return (
      <div>
      <NavigationBar
          explorelink={explorelink}
          myfeedlink={myfeedlink}
          mypostslink={mypostslink}
          addcontentlink={addcontentlink}
          activepagename={"MyPost"}
          username = {this.props.routeParams.userId}/>
          {this.state.notes.length ?
            <div>
            <br />
            <SearchBar
              filterText={this.state.filterText}
              onUserInput={this.handleUserInput}
            />
            <div className="wrapper">
            <div className="columns">
            <div className='board'>
                   {filteredNotes.map(this.eachNote)}
            </div>
            </div>
            </div>
            </div>
            :
            <h2>Looks like you have not uploaded anything yet.
            <Link to={`/add/${this.props.routeParams.userId}`}> Click here to upload your first post</Link></h2>
          }

    </div>
    )
  }
})

export default MyPosts;
