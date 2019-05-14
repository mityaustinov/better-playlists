import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string'

// let fakeServerData = {
//     user: {
//         name: "Mitya",
//         playlists: [
//             {
//                 name: 'The Beatles',
//                 image: require ('./beatles.jpg'),
//                 songs: [
//                     {name: 'Hey Jude', duration: 234},
//                     {name: 'I Wanna Hold Your Hand', duration: 303},
//                     {name: 'Paperback Writer', duration: 238},
//                     {name: 'Ob-la-di Ob-la-da', duration: 193},
//                     {name: 'Penny Lane', duration: 271}
//                 ]
//             },
//             {
//                 name: 'Morcheeba',
//                 image: require ('./morcheeba.jpg'),
//                 songs: [
//                     {name: 'Charango', duration: 234},
//                     {name: 'Blood Like Lemonade', duration: 303},
//                     {name: 'The Great London Traffic Warden Massacre', duration: 238},
//                     {name: 'Rome wasn\'t built in a day', duration: 193},
//                     {name: 'Even though', duration: 271}
//                 ]
//             },
//             {
//                 name: 'The Prodigy',
//                 image: require ('./prodigy.jpg'),
//                 songs: [
//                     {name: 'Smack My Bitch Up', duration: 234},
//                     {name: 'Firestarter', duration: 303},
//                     {name: 'Breathe', duration: 238},
//                     {name: 'Wolrd\'s On Fire', duration: 193},
//                     {name: 'No Army Man', duration: 271}
//                 ]
//             },
//             {
//                 name: 'M.A.V.S.',
//                 image: require ('./mavs.jpg'),
//                 songs: [
//                     {name: 'Implant', duration: 234},
//                     {name: 'Brigador Theme', duration: 303},
//                     {name: 'A Glowing Light, a Promice', duration: 238},
//                     {name: 'Wavehymnal', duration: 193},
//                     {name: 'Richter', duration: 271}
//                 ]
//             },
//         ]
//     }
// };

class PlaylistCounter extends Component {
    render() {
        let playlistAmountLabel = null;
        if (this.props.playlists.length !== 1) {
            playlistAmountLabel = 'playlists';
        } else {
            playlistAmountLabel = 'playlist';
        }

        return (
            <div style={{display: 'inline-block'}}>
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
           return sum + eachSong.duration
        }, 0)

        return (
            <div style={{width: "40%", display: 'inline-block'}}>
                <h2>{(totalDuration/3600).toFixed(1)} hours</h2>
            </div>
        );
    }
}

class Filter extends Component {
    render() {
        return (
            <div className="filter">
                <input type="search" placeholder="Filter" onKeyUp={event =>
                    this.props.onTextChange(event.target.value)} />
            </div>
        );
    }
}

class Playlist extends Component {
    render() {
        let playlist = this.props.playlist;
        return (
            <div className="playlist-item">
                <img src={playlist.imageUrl} alt={playlist.name} />
                <h3>{playlist.name}</h3>
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
        this.state = {
            serverData: {},
            filterString: ''
        }
    }
    componentDidMount () {
        // setTimeout (() => {
        //     this.setState({serverData: fakeServerData});
        // }, 500);
        //setTimeout (() => {
        //    this.setState({filterString: ''});
        //}, 3000);
        let parsed = queryString.parse(window.location.search); // taking access_token from Url
        console.log(parsed);
        // let token = new URLSearchParams(window.location.search).get('access_token') // another way of taking access_token from Url without queryString plugin
        let accessToken = parsed.access_token;
        console.log(accessToken);

        //const proxyUrl = 'https://cors-anywhere-mitya.herokuapp.com/' //proxy Url to fix CORS problem
        const apiUrlMe = 'https://api.spotify.com/v1/me' //Spotify API User
        const apiUrlPlaylists = 'https://api.spotify.com/v1/me/playlists' //Spotify API Url Playlists

        if (!accessToken)
            return

        fetch(apiUrlMe, {
            headers: {'Authorization': 'Bearer ' + accessToken}
        })
        .then(response => response.json())
        .then(data => this.setState({
            user: {
                name: data.display_name
            }
        }))

        fetch(apiUrlPlaylists, {
            headers: {'Authorization': 'Bearer ' + accessToken}
        })
        .then(response => response.json())
        .then(playlistData => {
            let playlists = playlistData.items
            let trackDataPromises = playlists.map(playlist => {
                let responsePromise = fetch(playlist.tracks.href, {
                    headers: {'Authorization': 'Bearer ' + accessToken}
                })
                let trackDataPromise = responsePromise
                    .then(response => response.json())
                return trackDataPromise
            })
            let allTracksDataPromises =
                Promise.all(trackDataPromises)
            let playlistsPromise = allTracksDataPromises.then(trackDatas => {
                trackDatas.forEach((trackData, i) =>{
                    playlists[i].trackDatas = trackData.items
                    .map(item => item.track)
                    .map(trackData => ({
                        name: trackData.name,
                        duration: trackData.duration_ms / 1000
                    }))
                })
                return playlists
            })
            return playlistsPromise
        })

        .then(playlists => this.setState({
            playlists: playlists.map(item => {
                // console.log(item.trackDatas)
                if(item.images.length > 0){
                    return {
                        imageUrl: item.images[0].url,
                        name: item.name,
                        songs: item.trackDatas.slice(0,5)
                    }
                }
                else {
                    return {
                        name: item.name,
                        songs: item.trackDatas.slice(0,5)
                    }
                }
            })
        }))
    }
    render() {
        let playlistsToRender =
            this.state.user &&
            this.state.playlists
                ? this.state.playlists.filter(playlist =>
                playlist.name.toLowerCase().includes(
                    this.state.filterString.toLowerCase())
                )
                : []
        return (
            <div className="App">
                {this.state.user ?
                    <div>
                        <h1>
                            {this.state.user.name}&rsquo;s playlists
                        </h1>
                        <PlaylistCounter playlists={playlistsToRender}/>
                        <HoursCounter playlists={playlistsToRender} />
                        <Filter onTextChange={text => this.setState({filterString: text})} />
                        <div className="playlists">
                            {
                                playlistsToRender.map(playlist =>
                                    <Playlist playlist={playlist}/>
                                )
                            }
                        </div>
                    </div>
                :
                    <button onClick={() => {
                            window.location = window.location.href.includes('localhost')
                                ? 'http://localhost:8888/login'
                                : 'https://better-playlists-mitya-backend.herokuapp.com/login'
                        }}
                    >Sign in with Spotify</button>
                }
            </div>
        );
    }
}

export default App;
