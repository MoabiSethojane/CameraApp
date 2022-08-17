import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, SafeAreaView, Image } from 'react-native';
import { useEffect, useRef,useState } from 'react';
import{Camera} from 'expo-camera'
import{shareAsync} from 'expo-sharing'
import * as MediaLibrary from 'expo-media-library'
export default function App() {
  let cameraRef = useRef();
  // state to check whether we have camera permission
  const[hasCameraPermission,setHasCameraPermission]=useState();
  const[hasMediaLibraryPermission,setHasMediaLibraryPermission]=useState();
// Setup state to have diiferent views depending on whether the picture was taken or not
// photo variable is will store the picture that i have just took
// useState to ckeck is there is  a photo 
const[photo, setPhoto]= useState();

  // use useEffect to check for permission
useEffect(()=>{
(async()=>{
// request for camera permission
const cameraPermission = await Camera.requestCameraPermissionsAsync();
const mediaLibraryPermission=await MediaLibrary.requestPermissionsAsync();
// get the status of what the user has granted 
setHasCameraPermission(cameraPermission.status==="granted");
setHasMediaLibraryPermission(mediaLibraryPermission.status==="granted");

})();
},[]);
// check if isAccessMediaLocationEnable is enabled and evaluate it as a string not boolean
if(hasCameraPermission===undefined){
  // if it is undefined request for permission
  return <Text>Requesting permission..</Text>
  // and if you are not granted permission you have to prompt the user enable the permission for you

}else if (!hasCameraPermission){
  return<Text>Permission for camera not granted. Please change this in settings</Text>
}
// defined take picture function and its gonna be async function because taking picture is async action
let takePic= async()=>{
  // set options 
  let options ={
  // quality 1 is the highest quality
  quality:1,
  base64:true,
  exif:false
  };
// extra information about the picture
let newPhoto = await cameraRef.current.takePictureAsync(options);
setPhoto(newPhoto);

};
if(photo){
  let sharePic=()=>{
    // use shareAsync function to allow us to share the photo
    // and then discard the photo and take user to take another photo
shareAsync(photo.uri).then(()=>{
  setPhoto(undefined)
})
  };
  let savePhoto=()=>{
    // saving the picture to the media library
MediaLibrary.saveToLibraryAsync(photo.uri).then(()=>{
// after saving the picture discard so that the user can take another photo
setPhoto(undefined)
});
  };
  return(
<SafeAreaView style={styles.container}>
  <Image style ={styles.preview} source={{uri: "data:image/jpg;base64,"+ photo.base64 }}/>
{/* this button will call share pictuter that will open a share dilog */}
<Button title="share" onPress={sharePic}/>
{/* check is there is media permission and if there is permission show save button and if there are no photo the save button will not show */}
{hasMediaLibraryPermission ?<Button title="save" onPress={savePhoto}/>: undefined}
{/* discard button will allow us to remove or delete a picture and take us back to the camera */}
<Button title="Discard" onPress={()=>setPhoto(undefined)}/>
</SafeAreaView>
  );
}
  return (
    // reference to the camera to allow our camera to take pictures
    <Camera style={styles.container} ref={cameraRef}>
    {/* in the screen we will have the button that will allow us to take a picture */}
      <View style={styles.buttonContainer}>
      {/* on press will call takePic function */}
        <Button title="Take Pic" onPress={takePic}></Button>
      </View>
      <StatusBar style="auto" />
    </Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer:{
    backgroundColor:"#fff",
    alignSelf:'flex-end'
  },
  preview:{
   alignSelf:"stretch",
   flex:1 
  }
});
