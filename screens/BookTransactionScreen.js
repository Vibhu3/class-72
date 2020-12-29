import React from 'react';
import { StyleSheet, Text, View,TouchableOpacity,Image,TextInput,KeyboardAvoidingView, Alert } from 'react-native';
import * as Permissions from 'expo-permissions';
import {BarCodeScanner} from 'expo-barcode-scanner'
import * as firebase from 'firebase'
import db from '../config.js'
export default class TransactionScreen extends React.Component{
    constructor(){
        super();
        this.state={
            hasCameraPermissions:null,
            scanned:false,
            scannedBookId:'',
            scannedStudentId:'',
            buttonState:'normal',
            transactionMessage:''
        }
    }
    getCameraPermissions=async(Id)=>{
        console.log("getPermission")
        const {status}=await Permissions.askAsync(Permissions.CAMERA)
        this.setState({
            hasCameraPermissions:status==='granted',
            buttonState:Id,
            scanned:false
        })
    }
    handleBarCodeScanned=async=({type,data})=>{
        const{buttonState}=this.state
        if(buttonState==="BookId"){
            this.setState({
                scanned:true,
                scannedBookId:data,
                buttonState:'normal'
            })
        } else if(buttonState==="StudentId"){
            this.setState({
                scanned:true,
                scannedStudentId:data,
                buttonState:'normal'
            })
        }
        
    }
    handleTransaction=async()=>{
   console.log("in handletransactions")
var transactionMessage;
db.collection("books").doc(this.state.scannedBookId).get()
.then((doc)=>{
    console.log(doc.data())
    var book=doc.data()
    if(book.bookAvailability){
        this.initiateBookIssue()
        transactionMessage="bookIssue";
        Alert.alert(transactionMessage)
    }
    else{
        this.initiateBookReturn();
        transactionMessage="bookReturn";
        Alert.alert(transactionMessage)

    }
})
this.setState({
    transactionMessage:transactionMessage
})
    }


    initiateBookIssue=async()=>{
        console.log("in book issue")
        db.collection("transactions").add({
            'studentId':this.state.scannedStudentId,
            'bookId':this.state.scannedBookId,
            'date':firebase.firestore.Timestamp.now().toDate(),
'transactionType':"issue"
        })
        db.collection("books").doc(
            this.state.scannedBookId).update({'bookAvailability':false
        })
        db.collection("students").doc(this.state.scannedStudentId).update
        ({'numberOfBooksIssued':firebase.firestore.FieldValue.increment(1)})

        Alert.alert("bookissued")
        this.setState({
            scannedBookId:'',
            scannedStudentId:''
        })

    }

    initiateBookReturn=async()=>{
        console.log("in book return")
        db.collection("transactions").add({
            'studentId':this.state.scannedStudentId,
            'bookId':this.state.scannedBookId,
            'date':firebase.firestore.Timestamp.now().toDate(),
'transactionType':"return"
        })
        db.collection("books").doc(
            this.state.scannedBookId).update({'bookAvailability':true
        })
        db.collection("students").doc(this.state.scannedStudentId).update
        ({'numberOfBooksIssued':firebase.firestore.FieldValue.increment(-1)})

        Alert.alert("bookreturn")
        this.setState({
            scannedBookId:'',
            scannedStudentId:''
        })

    }
    render(){
        const hasCameraPermissions=this.state.hasCameraPermissions;
 const scanned=this.state.scanned;
 const buttonState=this.state.buttonState;
 if(buttonState!=='normal'&&hasCameraPermissions){

 return(
     <BarCodeScanner
     onBarCodeScanned={scanned?undefined:this.handleBarCodeScanned}
     style={StyleSheet.absoluteFillObject}/>
 )
 }else if(buttonState==='normal'){
        return(

            <KeyboardAvoidingView style={styles.container}>
                <View>
                    <Image 
                    source={require("../assets/booklogo.jpg")}
                    style={{width:200,height:200}}/>
                    <Text style={{textAlign:'center',fontSize:30}}willy></Text>
                </View>
                <View style={styles.inputView}>
                    <TextInput
                    style={styles.inputBox}
                    placeholder="BookId"
                    onChangeText={text=>this.setState({scannedBookId:text})}
                    value={this.state.scannedBookId}/>
                    <TouchableOpacity
                    style={styles.scanButton}
                    onPress={()=>{
                        this.getCameraPermissions("BookId")
                    }}>
                        <Text style={styles.buttonText}>
                            scan
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.inputView}>
                    <TextInput
                    style={styles.inputBox}
                    placeholder="studentId"
                    onChangeText={text=>this.setState({scannedStudentId:text})}
                    value={this.state.scannedStudentId}/>
                    <TouchableOpacity

                    style={styles.scanButton}
                    onPress={()=>{
                        this.getCameraPermissions("StudentId")

                    }}>
                        <Text style={styles.buttonText}>
                            scan
                        </Text>
                    </TouchableOpacity>
                </View>
           <TouchableOpacity

           style={styles.submitButton}
           onPress={async()=>{this.handleTransaction()}}>

               <Text style={styles.submitButtontext}>
                   submit
               </Text>
           </TouchableOpacity>
            </KeyboardAvoidingView>
        )
    }
}
}
const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    displayText:{fontSize:15,textDecorationLine:'underline'},
    scanButton:{
        backgroundColor:'#2169f3',
        padding:10,
        margin:10
    },
    buttonText:{fontSize:15,
    textAlign:'center',
marginTop:10
},
inputView:{
    flexDirection:'row',
    margin:20,
},
inputBox:{
    width:200,
    height:40,
    borderWidth:1.5,
    borderRightWidth:0,
    fontSize:20
},
    scanButton:{
        backgroundColor:'#66bb6a',
        width:50,
        borderWidth:1.5,
        borderLeftWidth:0
    },
    submitButton:{
        backgroundColor:'#fbc020',width:100,height:50
    },
    submitButtontext:{padding:10,textAlign:'center',fontSize:20,fontWeight:'bold',color:'white'}


})
