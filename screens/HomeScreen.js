import React from "react";
import {View, Text, Button, StyleSheet} from 'react-native';
import Palette from "../App Data/Palette";
import { Dimensions } from "react-native";
import { collection, getDoc } from "@firebase/firestore";
import firestore from "../config/firebase-firestore-config";

const dimensions = Dimensions.get("window");

export default class ProfileScreen extends React.Component
{
    constructor(props)
    {
        super(props);
    }
    render()
    {
        return (
            <View style={styles.bg}>
                <Text style={styles.title}>Home</Text>
                <View style={styles.panel}>
                    <Text style={styles.username}>horaciopro</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    bg:
    {
        backgroundColor:Palette.Color4,
        minHeight:dimensions.height
    },
    title:
    {
        color:Palette.Color3,
        fontSize:75,
        textAlign:'center',
        fontFamily:"Axiforma"
    },
    panel:
    {
    backgroundColor:'#A657CC',
        width:dimensions.width / 6,
        height:dimensions.height,
        marginTop:-120
    },
    username:
    {
        color:'white',
        fontFamily:'Axiforma',
        textAlign:'center',
        fontSize:35,
        marginTop:25
    }
})