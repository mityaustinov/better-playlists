import React, { Component } from 'react'

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

export default PlaylistCounter
