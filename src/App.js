import React, { Component } from 'react';
import './App.css';

let fakeServerData = {
    user: {
        name: "User",
        playlists: [
            {
                name: 'The Beatles',

                image: require ('./beatles.jpg'),
                songs: [
                    {name: 'Hey Jude', duration: 2340},
                    {name: 'I Wanna Hold Your Hand', duration: 3030},
                    {name: 'Paperback Writer', duration: 2380},
                    {name: 'Ob-la-di Ob-la-da', duration: 1930},
                    {name: 'Penny Lane', duration: 2710}
                ]
            },
            {
                name: 'Morcheeba',
                image: require ('./morcheeba.jpg'),
                songs: [
                    {name: 'Charango', duration: 2340},
                    {name: 'Blood Like Lemonade', duration: 3030},
                    {name: 'The Great London Traffic Warden Massacre', duration: 2380},
                    {name: 'Rome wasn\'t built in a day', duration: 1930},
                    {name: 'Even though', duration: 2710}
                ]
            },
            {
                name: 'The Prodigy',
                image: require ('./prodigy.jpg'),
                songs: [
                    {name: 'Smack My Bitch Up', duration: 2340},
                    {name: 'Firestarter', duration: 3030},
                    {name: 'Breathe', duration: 2380},
                    {name: 'Wolrd\'s On Fire', duration: 1930},
                    {name: 'No Army Man', duration: 2710}
                ]
            },
            {
                name: 'M.A.V.S.',
                image: require ('./mavs.jpg'),
                songs: [
                    {name: 'Implant', duration: 2340},
                    {name: 'Brigador Theme', duration: 3030},
                    {name: 'A Glowing Light, a Promice', duration: 2380},
                    {name: 'Wavehymnal', duration: 1930},
                    {name: 'Richter', duration: 2710}
                ]
            },
        ]
    }
};

class PlaylistCounter extends Component {
    render() {
        let playlistAmountLabel = null;
        if (this.props.playlists.length !== 1) {
            playlistAmountLabel = 'playlists';
        } else {
            playlistAmountLabel = 'playlist';
        }

        return (
            <div style={{marginRight: '30px', display: 'inline-block'}}>
                <h2>{this.props.playlists && this.props.playlists.length} {playlistAmountLabel}</h2>
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
        if (totalDuration !== 1) {
            durationLabel = 'minutes';
        } else {
            durationLabel = 'minute';
        };

        return (
            <div style={{display: 'inline-block'}}>
                <h2>
                    {totalDuration} {durationLabel}
                </h2>
            </div>
        );
    }
}

class Filter extends Component {
    render() {
        return (
            <div style={{marginBottom:"40px"}}>
                <label for="filter-field">Filter: </label>
                <input className="filter-field" id="filter-field" type="search" />
            </div>
        );
    }
}

class Playlist extends Component {
    render() {
        let playlist = this.props.playlist;
        return (
            <div className="playlist-item">
                <h3>{playlist.name}</h3>
                <img src={playlist.image} alt={playlist.name} />
                <ol>
                    {playlist.songs.map(song =>
                        <li>{song.name}</li>
                    )}
                </ol>
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
                            <div className="playlists">
                                {
                                    this.state.serverData.user.playlists.map(playlist =>
                                    <Playlist playlist={playlist}/>
                                )}
                            </div>
                        </div>
                    :
                    <h1>Loading...</h1>
                }
            </div>
        );
    }
}

export default App;
