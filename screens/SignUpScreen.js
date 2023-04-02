import React, {useState} from "react";
import {View, StyleSheet, Text, Button, Alert, TextInput, Dimensions, ScrollView, Input, Image} from 'react-native';
import { TouchableOpacity } from "react-native-gesture-handler";
import {RFValue} from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Palette from '../App Data/Palette';
import Toast from 'react-native-toast-message';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword} from "@firebase/auth";
import auth from '../config/firebase-auth-config';
import firestore from "../config/firebase-firestore-config";
import { collection, setDoc, addDoc } from "@firebase/firestore";

const dimensions = Dimensions.get("screen");

const profilePics = [require('../assets/img/signup/profile_1.png'), require('../assets/img/signup/profile_2.png'), 
require('../assets/img/signup/profile_3.png'), require('../assets/img/signup/profile_4.png'),
require('../assets/img/signup/profile_5.png'), require('../assets/img/signup/profile_6.png'),
require('../assets/img/signup/profile_7.png'), require('../assets/img/signup/profile_8.png'),
require('../assets/img/signup/profile_9.png'), require('../assets/img/signup/profile_10.png'),
require('../assets/img/signup/profile_11.png'),require('../assets/img/signup/profile_12.png')];

var profile = {
    username:"",
    birthdate:null,
    profilePic:Math.round(Math.floor(Math.random() * profilePics.length - 1)),
    bgColor:"lightgray",
    email:""
}

var bgColor = "lightgray";

export default function SignUpScreen(props)
{
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signUpScreen = 0, verifyEmailScreen = 1, profileScreen = 2;

    const [actualScreen, setActualScreen] = useState(signUpScreen);

    const [profilePicSelection, setProfilePicSelection] = useState(false);

    const [colorPic, setColorPic] = useState(false);

    if (profile.profilePic < 0)
    {
        profile.profilePic = 0;
    }
    
    const changeProfilePic = (pic) =>
    {
        profile.profilePic = pic - 1;
        setProfilePicSelection(false);
        setColorPic(true);
    }

    const createProfile = () =>
    {
        console.log(profile);
        addDoc(collection(firestore, "Users"), profile).then((id)=>{props.navigation.navigate("Home", {id:id})});
    }

    var user;

    const throwError = (error) =>
    {
        Toast.show({position:'top', text1:error, type:'error'});
    }
    const throwFirebaseError = (error) =>
    {
        console.log(error);
        let newErr = error;
        switch (error)
        {
            case 'Firebase: Error (auth/invalid-email).':
                newErr = 'The email is not valid...';
            break;
            case 'Firebase: Error (auth/email-already-in-use).':
                newErr = 'Email already taken, try with another email...';
            break;
            case 'Firebase: Error (auth/network-request-failed).':
                newErr = 'Please verify your internet connection...';   
            break;
        }
        Toast.show({position:'top', text1:newErr, type:'error'});
    }
    const checkCredentials = () =>
    {
        if (email.length > 0)
        {
            if (password.length >= 8)
            {
                createUserWithEmailAndPassword(auth, email, password).then((newUser)=>{user = newUser.user; sendEmailVerification(user).then(()=>{setActualScreen(verifyEmailScreen)})}).catch((err)=>{throwFirebaseError(err.message)});
            }
            else
            {
                if (password.length > 0)
                {
                throwError("Password length must be at least 8 characters...");
                }
                else
                {
                    throwError("Please introduce your password...");
                }
            }
        }
        else
        {
            throwError("Please introduce your email...");
        }
    }
    if (actualScreen == signUpScreen)
    {
        return (
            <ScrollView>
            <View style={styles.screenContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>SociaPics</Text>
                    <Text style={styles.subtitle}>Sign Up</Text>
                    <TextInput style={styles.input} placeholder="email" placeholderTextColor={'#666666'} onChangeText={(data)=>{setEmail(data)}}/>
                    <TextInput style={styles.input} placeholder="password" placeholderTextColor={'#666666'} onChangeText={(data)=>{setPassword(data)}} secureTextEntry={!showPassword ? true:false}/>
                    <TouchableOpacity style={styles.showPasswordButton} onPress={()=>{setShowPassword(!showPassword)}}><Ionicons name={!showPassword ? "eye-outline":"eye-off-outline"} color={"black"} size={RFValue(25)}></Ionicons></TouchableOpacity>
                    <Text style={styles.text}>Already have an account? <TouchableOpacity onPress={()=>{props.navigation.navigate("SignIn")}}><Text style={styles.link}>Sign In</Text></TouchableOpacity></Text>
                    <TouchableOpacity style={styles.signUpButton} onPress={()=>{checkCredentials()}}>Sign Up</TouchableOpacity>
                    <Toast/>
                </View>
            </View>
        </ScrollView>
        )
    }
    else if (actualScreen == verifyEmailScreen)
    {
        return (
        <View style={styles.screenContainer}>
            <Text style={styles.title}>Verify Your Email</Text>
            <Text style={styles.subtitle}>Check your inbox to verify your email: {email}</Text>
            <Text style={styles.text}>After following the link, click the button below</Text>
            <TouchableOpacity style={styles.resendEmailButton} onPress={()=>{signInWithEmailAndPassword(auth, email, password).then((usr)=>{if (usr.user.emailVerified){setActualScreen(profileScreen)}; if (!usr.user.emailVerified) {throwError("Please verify your email...")}});}}>Verify Email</TouchableOpacity>
            <Toast/>
        </View>
        )
    }
    else if (actualScreen == profileScreen)
    {
        profile.email = email;
        if (profilePicSelection)
        {
            return (
                <View style={styles.screenContainer}>
                    <Text style={styles.subtitle}>Choose your Pic</Text>
                    <View style={styles.tableView}>
                        <View style={styles.column1}>
                            <TouchableOpacity style={styles.profileSelection} onPress={()=>{if (profilePicSelection){changeProfilePic(1)}}}>
                                <Image source={profilePics[0]} style={styles.picSelectionImg}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.profileSelection} onPress={()=>{if (profilePicSelection){changeProfilePic(2)}}}>
                            <Image source={profilePics[1]} style={styles.picSelectionImg}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.profileSelection} onPress={()=>{if (profilePicSelection){changeProfilePic(3)}}}>
                                <Image source={profilePics[2]} style={styles.picSelectionImg}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.column2}>
                            <TouchableOpacity style={styles.profileSelection} onPress={()=>{if (profilePicSelection){changeProfilePic(4)}}}>
                            <Image source={profilePics[3]} style={styles.picSelectionImg}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.profileSelection}>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{if (profilePicSelection){changeProfilePic(5)}}}>
                            <Image source={profilePics[4]} style={styles.picSelectionImg}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.profileSelection} onPress={()=>{if (profilePicSelection){changeProfilePic(6)}}}>
                            <Image source={profilePics[5]} style={styles.picSelectionImg}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.column3}>

                        <TouchableOpacity style={styles.profileSelection} onPress={()=>{if (profilePicSelection){changeProfilePic(7)}}}>
                        <Image source={profilePics[6]} style={styles.picSelectionImg}/>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.profileSelection} onPress={()=>{if (profilePicSelection){changeProfilePic(8)}}}>
                        <Image source={profilePics[7]} style={styles.picSelectionImg}/>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.profileSelection} onPress={()=>{if (profilePicSelection){changeProfilePic(9)}}}>
                        <Image source={profilePics[8]} style={styles.picSelectionImg}/>
                        </TouchableOpacity>

                        </View>
                        <View style={styles.column4}>
                        <TouchableOpacity style={styles.profileSelection} onPress={()=>{if (profilePicSelection){changeProfilePic(10)}}}>
                        <Image source={profilePics[9]} style={styles.picSelectionImg}/>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.profileSelection} onPress={()=>{if (profilePicSelection){changeProfilePic(11)}}}>
                        <Image source={profilePics[10]} style={styles.picSelectionImg}/>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.profileSelection} onPress={()=>{if (profilePicSelection){changeProfilePic(12)}}}>
                        <Image source={profilePics[11]} style={styles.picSelectionImg}/>
                        </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )
        }
        else if (colorPic)
        {
            return (
                <View style={styles.screenContainer}>
                        <Text style={styles.subtitle}>Now choose your profile background</Text>
                        <input onChange={(data)=>{bgColor = data.target.value; profile.bgColor = bgColor;}} type='color' style={styles.colorInput}/>
                        <TouchableOpacity style={styles.signUpButton} onPress={()=>{setColorPic(false)}}>Ok</TouchableOpacity>
                    </View>
            )
        }
        else
        {

        }
        return (
            <ScrollView>
            <View style={styles.screenContainer}>
                <Text style={styles.subtitle}>Let's make your profile</Text>
                <TouchableOpacity onPress={()=>{setProfilePicSelection(true)}}><View style={styles.profilePicture}><View style={styles.profilePictureBorder}><img src={profilePics[profile.profilePic]} style={{position:'absolute',
        width:'300px',
        height:'300px',
        alignSelf:'center',
        marginTop:-10,
        borderRadius:100,
        backgroundColor:bgColor}}/></View></View></TouchableOpacity>
                <TextInput value={profile.username != "" ? profile.username:null} placeholder="username" style={styles.usernameInput} onChange={(data)=>{profile.username = data.target.value}}/>
                <Text style={styles.text}>Birth Date:</Text>
                <input value={profile.birthdate != null ? profile.birthdate:null} type="date" style={styles.dateInput} onChange={(data)=>{profile.birthdate = data.target.value}}/>
                <TouchableOpacity style={styles.signUpButton} onPress={()=>{createProfile();}}>Create</TouchableOpacity>
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
        position:"absolute",
        top:-145,
        right:175
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
    profilePictureClr:
    {
        width:300,
        height:300,
        borderRadius: 100,
        backgroundColor:bgColor,
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