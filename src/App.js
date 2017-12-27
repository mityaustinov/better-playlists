import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

let playlistDefaultStyle = {
    display: 'inline-block',
    boxSizing: 'border-box',
    outline: "1px solid silver",
    padding: "20px"
};

class Aggregate extends Component {
    render() {
        return (
            <div style={{width:'40%', display: 'inline-block'}}>
                <h2 style={{color:'#555'}}>Number text</h2>
            </div>
        );
    }
}

class Filter extends Component {
    render() {
        return (
            <div>
                <input type="search" />
            </div>
        );
    }
}

class Playlist extends Component {
    render() {
        return (
            <div style={{...playlistDefaultStyle, width: "25%"}}>
                <img />
                <h3>PlaylistName</h3>
                <ul>
                    <li>Song 1</li>
                    <li>Song 2</li>
                    <li>Song 3</li>
                </ul>
            </div>
        );
    }
}

class App extends Component {
    render() {
        return (
            <div className="App">
                <h1>Title</h1>
                <Aggregate/>
                <Aggregate/>
                <Filter/>
                <Playlist/>
                <Playlist/>
                <Playlist/>
                <Playlist/>
            </div>
        );
    }
}

export default App;
