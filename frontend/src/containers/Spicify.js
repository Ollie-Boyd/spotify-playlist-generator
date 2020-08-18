import React, {Component} from 'react';
import Home from '../components/Home';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Login from "../components/Login";



class Spicify extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tracks: null,
            userSongs: [],
            loggedIn: false,
            valence: 0.5, //the 0.5 is just a random default value for when the page loads, feel free to change
            danciness: 0.5, //the 0.5 is just a random default value for when the page loads, feel free to change
            energy: 0.5, //the 0.5 is just a random default value for when the page loads, feel free to change
            emotionApiResponse: {}
        }
        this.setEmotion = this.setEmotion.bind(this)
        this.setSliderValence = this.setSliderValence.bind(this)
        this.setSliderDanciness = this.setSliderDanciness.bind(this)
        this.setSliderEnergy = this.setSliderEnergy.bind(this)
        this.changeLoggedIn = this.changeLoggedIn.bind(this);
        this.filterTracksBasedOnMood = this.filterTracksBasedOnMood.bind(this);
    }

    changeLoggedIn() {
        this.setState({ loggedIn: true })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.loggedIn !== this.state.loggedIn) {
            const url = "http://localhost:8080/songs"

            fetch(url)
            .then(res => res.json())
            .then(userSongs => this.setState({ userSongs: userSongs }))
            .catch(err => console.error)
        }
    };

    checkIfSongIsWithinRange(song, mood) {
        const delta = 0.1;
        const moodKeys = Object.keys(mood);
        for (const key of moodKeys) {
            if (song[key] <= (mood[key] += delta) && song[key] >= (mood[key] -= delta)) {
                return true
            }
        }
    }

    filterTracksBasedOnMood() {

        const mood = {
            valence: this.state.valence,
            danceability: this.state.danciness,
            energy: this.state.energy
        };

        this.setState( { tracks: this.state.userSongs.filter(song => {
            if (this.checkIfSongIsWithinRange(song, mood)) {
                return song
            }
        })})
            
    }

    setEmotion(value){
        this.setState({emotionApiResponse: value})
    }
    setSliderValence(value){
        this.setState({valence: value})
    }
    
    setSliderDanciness(value){
        this.setState({danciness: value})
    }

    setSliderEnergy(value){
        this.setState({energy: value})
    }

    render() {
        return (
            <Router>
                <>
                    <Route exact path="/" component={Login}/>
                    <Route 
                        path="/spicify"
                        render={() => <Home 
                        handleSetTracks={this.filterTracksBasedOnMood}    
                        handleLoggedIn={this.changeLoggedIn}
                        setSliderValence={this.setSliderValence} 
                                    setSliderDanciness={this.setSliderDanciness}
                                    setSliderEnergy={this.setSliderEnergy}
                                    setEmotion={this.setEmotion} 
                                    emotion={this.state.emotionApiResponse.happiness}
                        />} 
                    />
                </>            
            </Router>
        )
    }
}

export default Spicify;