import React from "react";
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import Palette from "../App Data/Palette";
const dimensions = Dimensions.get("window");
export default class LoadingScreen extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {loadingText:'', currentPhase:0};
    }
    initialTextPhase()
    {
        this.setState({loadingText:'Loading', currentPhase:0});
        this.startTextAnimation();
    }
    startTextAnimation()
    {
        let interval = setInterval(()=>
        {
            if (this.state.currentPhase != 3)
            {
                switch (this.state.currentPhase)
                {
                    case 0:
                        this.setState({loadingText:'Loading.', currentPhase:1});
                        break;
                    case 1:
                        this.setState({loadingText:'Loading..', currentPhase:2});
                        break;
                    case 2:
                        this.setState({loadingText:'Loading...', currentPhase:3});
                        break;
                    default:
                        this.setState({loadingText:'Loading', currentPhase:0});
                        break;
                }
            }
            else
            {
                this.setState({loadingText:'Loading', currentPhase:0});
            }
        }, 1000);
    }
    componentDidMount()
    {
        this.initialTextPhase();
    }
    render()
    {
        return (
            <View style={styles.container}>
            <Text style={styles.loadingText}>{this.state.loadingText}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:
    {
        flex:1,
        backgroundColor:Palette.Color5,
    },
    loadingText:
    {
        textAlign:'center',
        fontWeight:'600',
        fontSize:30,
        marginTop:dimensions.height/2 - 30,
        color:'white'
    }
})