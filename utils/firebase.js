import fb from 'firebase'
import RNFetchBlob from 'react-native-fetch-blob'

const config = {
  apiKey: "AIzaSyB9XcNTq3jVa2vGkX43qOV9NKfAibxyz0U",
  authDomain: "rutgers-plus.firebaseapp.com",
  databaseURL: "https://rutgers-plus.firebaseio.com",
  storageBucket: "rutgers-plus.appspot.com",
  messagingSenderId: "57348682090"
}

const app = fb.initializeApp(config)

export const db = app.database()
export const auth = app.auth()
export const storage = app.storage()
export const timestamp = fb.database.ServerValue.TIMESTAMP

export const getUser = (callback) => {
  db.ref('users/' + auth.currentUser.uid).once('value', (snapshot) => {
    callback(snapshot.val())
  })
}

export const uploadPic = (path, ref, callback) => {
  let url = ''
  window.Blob = RNFetchBlob.polyfill.Blob
  window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
  let photoUri = RNFetchBlob.wrap(path)
  Blob.build(photoUri, { type: 'image/png' }).then((blob) => {
    storage.ref(ref).put(blob).then(snapshot => {
      url = snapshot.downloadURL
      callback(url)
    }).catch(e => console.log("STORAGE SAVE", e))
  }).catch(e => console.log("BLOB BUILD", e))
}

export const uploadPics = (paths, refPrefix, callback) => {
  let urls = []
  window.Blob = RNFetchBlob.polyfill.Blob
  window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
  paths.map((path, idx) => {
    let photoUri = RNFetchBlob.wrap(path)
    Blob.build(photoUri, { type: 'image/png' }).then((blob) => {
      storage.ref(`${refPrefix}_${idx}.png`).put(blob).then(snapshot => {
        urls.push(snapshot.downloadURL)
        if (urls.length === paths.length) {
          callback(urls)
        }
      }).catch(e => console.log("STORAGE SAVE", e))
    }).catch(e => console.log("BLOB BUILD", e))
  })
}