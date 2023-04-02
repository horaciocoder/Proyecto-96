import React, {useState} from "react";
import {View, StyleSheet, Text, TouchableOpacity, Image, ScrollView, Dimensions, TextInput} from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import Palette from '../App Data/Palette';
import auth from '../config/firebase-auth-config';
import { sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword } from "@firebase/auth";

const dimensions = Dimensions.get("screen");
export default class SignInScreen extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {showPassword:false, email:"", password:""};
    }
    setEmail(e)
    {
        this.setState({email:e})
    }
    setPassword(p)
    {
        this.setState({password:p})
    }
    throwError = (error) =>
    {
        Toast.show({position:'top', text1:error, type:'error'});
    }

    throwFirebaseError = (error) =>
    {
        switch (error)
        {
            case "Firebase: Error (auth/wrong-password).":
                {
                    this.throwError("Your password is not correct!");
                }
            break;
            case "Firebase: Error (auth/invalid-email).":
                {
                    this.throwError("Email syntaxis is not valid!");
                }
            case "Firebase: Error (auth/user-not-found).":
                {
                    this.throwError("Email is not valid!");
                }
            break;
            case "Firebase: Error (auth/network-request-failed).":
                {
                this.throwError("Please verify your internet connection...");
                }
            break;
            case "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).":
                {
                    this.throwError("Please reset your password...");
                }

        }
    }

    checkCredentials = () =>
    {
        var email = this.state.email;
        var password = this.state.password;
        if (email.length > 0)
        {
            if (password.length >= 8)
            {
                signInWithEmailAndPassword(auth, email, password).then((loggedUser)=>{var filter = loggedUser.user.emailVerified; if (filter){var user = loggedUser.user; this.props.navigation.navigate("Home", {id:loggedUser.user.id})}else{this.throwError("Your email is not verified, verify it and try again...");sendEmailVerification(loggedUser.user);}}).catch((err)=>{console.log(err.message); this.throwFirebaseError(err.message)});
            }
            else
            {
                if (password.length > 0)
                {
                this.throwError("Password length must be at least 8 characters...");
                }
                else
                {
                    this.throwError("Please introduce your password...");
                }
            }
        }
        else
        {
            this.throwError("Please introduce your email...");
        }
    }
    resetPassword(e)
    {
        sendPasswordResetEmail(auth, e).then(()=>{Toast.show({position:'top', text1:"Check your email", text2:"You've been sent a password reset email...", type:'success'})}).catch((error)=>{this.throwError("Make sure your email is written correctly...")});
    }
    render()
    {
        return (
            <ScrollView>
            <View style={styles.screenContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>SociaPics</Text>
                    <Text style={styles.subtitle}>Sign In</Text>
                    <TextInput style={styles.input} placeholder="email" placeholderTextColor={'#666666'} onChangeText={(data)=>{this.setEmail(data)}}/>
                    <TextInput style={styles.input} placeholder="password" placeholderTextColor={'#666666'} onChangeText={(data)=>{this.setPassword(data)}} secureTextEntry={!this.state.showPassword ? true:false}/>
                    <TouchableOpacity style={styles.showPasswordButton} onPress={()=>{this.setState({showPassword:!this.state.showPassword})}}><Ionicons name={!this.state.showPassword ? "eye-outline":"eye-off-outline"} color={"black"} size={RFValue(25)}></Ionicons></TouchableOpacity>
                    <Text style={styles.text}>Don't have an account? <TouchableOpacity onPress={()=>{this.props.navigation.navigate("SignUp")}}><Text style={styles.link}>Sign Up</Text></TouchableOpacity></Text>
                    <Text style={styles.text}><TouchableOpacity onPress={()=>this.resetPassword(this.state.email)}><Text style={styles.link}>Forgot your Password?</Text></TouchableOpacity></Text>
                    <TouchableOpacity style={styles.signUpButton} onPress={()=>{this.checkCredentials()}}>Sign In</TouchableOpacity>
                    <Toast/>
                </View>
            </View>
        </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    screenContainer:
    {
        padding:25,
        flex:1,
        backgroundColor:Palette.Color4,
        minHeight:dimensions.height
    },
    subtitle:
    {
        fontSize:RFValue(30),
        color:Palette.Color3,
        textAlign:'center',
        marginTop:25,
        fontFamily:"Axiforma",
        marginBottom:25
    },
    titleContainer:
    {
        flex:1,
    },
    title:
    {
        fontSize:RFValue(50),
        color:Palette.Color3,
        textAlign:'center',
        marginTop:25,
        fontFamily:"Axiforma",
    },
    input:
    {
        width:dimensions.width / 5 * 4,
        backgroundColor:'white',
        alignSelf:'center',
        paddingLeft:RFValue(10),
        fontSize:RFValue(15),
        height:RFValue(40),
        marginTop:RFValue(10),
        marginBottom:50,
        fontFamily:'Axiforma',
        borderColor:'black',
        borderWidth:5,
        borderRadius:RFValue(5),
    },
    dateInput:
    {
        width:dimensions.width / 5,
        backgroundColor:'white',
        alignSelf:'center',
        paddingLeft:RFValue(10),
        fontSize:RFValue(15),
        height:RFValue(40),
        marginBottom:50,
        fontFamily:'Axiforma',
        borderColor:'black',
        borderWidth:5,
        borderRadius:RFValue(5),
    },
    showPasswordButton:
    {
        marginTop:-145,
        alignSelf:'flex-end',
        marginRight:175
    },
    signUpButton:
    {
        backgroundColor:'white',
        fontSize:RFValue(25),
        fontFamily:'Axiforma',
        width:dimensions.width / 5,
        textAlign:'center',
        alignSelf:'center',
        borderColor:'black',
        borderWidth:RFValue(2.5),
        borderRadius:RFValue(5)
    },
    resendEmailButton:
    {
        backgroundColor:'white',
        fontSize:RFValue(20),
        fontFamily:'Axiforma',
        width:dimensions.width / 5,
        textAlign:'center',
        alignSelf:'center',
        borderColor:'black',
        borderWidth:RFValue(2.5),
        borderRadius:RFValue(5)
    },
    text:
    {
        fontSize:RFValue(20),
        color:'white',
        textAlign:'center',
        fontFamily:'Axiforma',
        marginBottom:50,
        marginTop:50
    },
    profilePicture:
    {
        width:300,
        height:300,
        borderRadius: 100,
        alignSelf:'center',
    },
    profilePictureBorder:
    {
        width:"100%",
        height:"100%",
        border:"10px solid black",
        borderRadius: 100,
        alignSelf:'center',
    },
    profilePictureInner:
    {
        position:'absolute',
        width:'250px',
        height:'250px',
        alignSelf:'center',
        marginTop:10,
    },
    usernameInput:
    {
        width:dimensions.width / 5 * 2,
        backgroundColor:'white',
        alignSelf:'center',
        paddingLeft:RFValue(10),
        fontSize:RFValue(15),
        height:RFValue(40),
        marginTop:RFValue(10),
        marginBottom:50,
        fontFamily:'Axiforma',
        borderColor:'black',
        borderWidth:5,
        borderRadius:RFValue(5),
    },
    tableView:
    {
       left:-125,
       top:0
    },
    column1:
    {
        position:'absolute',
        left:dimensions.width / 8,
        top:0
    },
    column2:
    {
        position:'absolute',
        left:dimensions.width * (3/8)
    },
    column3:
    {
        position:'absolute',
        left:dimensions.width * (5/8)
    },
    column4:
    {
        position:'absolute',
        left:dimensions.width - (dimensions.width / 8)
    },
    profileSelection:
    {
        
    },
    picSelectionImg:
    {
        width:175,
        height:175,
        backgroundColor:'lightgray',
        marginBottom:75,
        borderRadius:50,
        borderColor:'black',
        borderWidth:5,
    },
    colorInput:
    {
        alignSelf:'center',
        marginBottom:50,
        height:200,
        width:500
    },
    link:
    {
        color:'deepskyblue',
        textDecorationLine:'underline'
    }
})