import React, { Component } from 'react';
import './App.css';

let playlistDefaultStyle = {
    display: 'inline-block',
    boxSizing: 'border-box',
    outline: "1px solid silver",
    padding: "20px"
};

let fakeServerData = {
    user: {
        name: "Mitya",
        playlists: [
            {
                name: 'Starred',
                songs: [
                    {name: 'Always', duration: 2340},
                    {name: 'Dark Necessities', duration: 3030},
                    {name: 'The Mechanism', duration: 2380},
                    {name: 'Always', duration: 1930},
                    {name: 'New Lands', duration: 2710}
                ]
            },
            {
                name: 'Morcheeba',
                songs: [
                    {name: 'Charango', duration: 2340},
                    {name: 'Blood Like Lemonade', duration: 3030},
                    {name: 'The Great London Traffic Warden Massacre', duration: 2380},
                    {name: 'Rome wasn\'t built in a day', duration: 1930},
                    {name: 'Even though', duration: 2710}
                ]
            },
            {
                name: 'The Beatles',
                songs: [
                    {name: 'Hey Jude', duration: 2340},
                    {name: 'I Wanna Hold Your Hand', duration: 3030},
                    {name: 'Paperback Writer', duration: 2380},
                    {name: 'Ob-la-di Ob-la-da', duration: 1930},
                    {name: 'Penny Lane', duration: 2710}
                ]
            },
            {
                name: 'Prodigy',
                songs: [
                    {name: 'Smack My Bitch Up', duration: 2340},
                    {name: 'Firestarter', duration: 3030},
                    {name: 'Breathe', duration: 2380},
                    {name: 'Wolrd\'s On Fire', duration: 1930},
                    {name: 'No Army Man', duration: 2710}
                ]
            }
        ]
    }
};

class PlaylistCounter extends Component {
    render() {
        let playlistAmountLabel = null;
        if (this.props.playlists.length != 1) {
            playlistAmountLabel = 'playlists';
        } else {
            playlistAmountLabel = 'playlist';
        }

        return (
            <div style={{width:'40%', display: 'inline-block'}}>
                <h2 style={{color:'#555'}}>{this.props.playlists && this.props.playlists.length} {playlistAmountLabel}</h2>
            </div>
        );
    }
}

class HoursCounter extends Component {
    render() {
        let allSongs = this.props.playlists.reduce((songs, eachPlaylist) => {
            return songs.concat(eachPlaylist.songs)
        }, []);

        let totalDuration = allSongs.reduce((sum, eachSong) => {
            let calculation = Math.round((sum + eachSong.duration)/60);
            //return Math.round(calculation);
            return calculation;
        }, 0);

        let durationLabel = null;
        if (totalDuration != 1) {
            durationLabel = 'minutes';
        } else {
            durationLabel = 'minute';
        };

        return (
            <div style={{width:'40%', display: 'inline-block'}}>
                <h2 style={{color:'#555'}}>
                    {totalDuration} {durationLabel}
                </h2>
            </div>
        );
    }
}

class Filter extends Component {
    render() {
        return (
            <div style={{marginBottom:"20px"}}>
                <input type="search" />
            </div>
        );
    }
}

class Playlist extends Component {
    render() {
        return (
            <div style={{...playlistDefaultStyle, width: "25%"}}>
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
    constructor () {
        super();
        this.state = {serverData: {}}
    }
    componentDidMount () {
        setTimeout (() => {
            this.setState({serverData: fakeServerData});
        }, 1000);
    }
    render() {
        return (
            <div className="App">
                {this.state.serverData.user
                    ?
                        <div>
                            <h1>
                                {this.state.serverData.user.name}&rsquo;s playlist
                            </h1>
                            <PlaylistCounter playlists={
                                this.state.serverData.user.playlists}/>
                            <HoursCounter playlists={
                                this.state.serverData.user.playlists} />
                            <Filter/>
                            <Playlist/>
                            <Playlist/>
                            <Playlist/>
                            <Playlist/>
                        </div>
                    :
                    <h1>Loading...</h1>
                }
            </div>
        );
    }
}

export default App;
