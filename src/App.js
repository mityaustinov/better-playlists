import React, { Component } from 'react'
import queryString from 'query-string'

import PlaylistCounter from './components/PlaylistCounter'
import HoursCounter from './components/HoursCounter'
import Filter from './components/Filter'
import Playlist from './components/Playlist'

import './assets/styles/App.css';

class App extends Component {
    constructor () {
        super();
        this.state = {
            serverData: {},
            filterString: ''
        }
    }

    componentDidMount () {
        let parsed = queryString.parse(window.location.search); // taking access_token from Url
        // console.log(parsed);
        // let token = new URLSearchParams(window.location.search).get('access_token') // another way of taking access_token from Url without queryString plugin
        let accessToken = parsed.access_token;
        console.log(accessToken);

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
                ?
                    this.state.playlists.filter(playlist => {
                        let matchesPlaylist = playlist.name.toLowerCase().includes(
                            this.state.filterString.toLowerCase()
                        )
                        let matchesSong = playlist.songs.filter(song => song.name.toLowerCase()
                            .includes(this.state.filterString.toLowerCase())
                        )
                        return matchesPlaylist || matchesSong.length > 0
                    })
                :
                    []
        return (
            <div className="App">
                {this.state.user
                ?
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
