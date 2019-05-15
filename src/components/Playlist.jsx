import React, { Component } from 'react'
import placeholder from '../assets/images/placeholder.png';

class Playlist extends Component {
    render() {
        let playlist = this.props.playlist;
        return (
            <div className="playlist-item">
                {playlist.imageUrl
                    ? <img src={playlist.imageUrl} alt={playlist.name} />
                    : <img src={placeholder} alt={playlist.name} />
                }
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

export default Playlist
