import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();

exports.getAllUser = functions.https.onCall(async data => {
  let users: admin.auth.UserRecord[] = [];

  function listAllUsers(nextPageToken?: string): Promise<admin.auth.UserRecord[]> {
    return new Promise((resolve, reject) => {
      admin.auth().listUsers(1000, nextPageToken).then(listUsersResult => {
        users = users.concat(listUsersResult.users);
        if (listUsersResult.pageToken) {
          resolve(listAllUsers(listUsersResult.pageToken));
        }else{
          resolve(users);
        }
      }).catch(function(error) {
        console.error(error);
        reject(error);
      });
    })
  }
  return listAllUsers();
});

exports.getUser = functions.https.onCall(data => {
  const { uid } = data;

  if(!uid){
    throw new functions.https.HttpsError('invalid-argument', 'Parameters invalid!');
  }

  return admin.auth().getUser(uid).then(userRecord => {
    return userRecord;
  }).catch(error => {
    console.error(error);
    throw new functions.https.HttpsError('not-found', error);
  });
});

exports.createUser = functions.https.onCall(data => {
  const { uid, email, password, disabled } = data;

  if(!email || !password){
    throw new functions.https.HttpsError('invalid-argument', 'Parameters invalid!');
  }

  return admin.auth().createUser({
    uid: uid,
    email: email,
    password: password,
    disabled: disabled
  }).then(userRecord => {
    const result = {
      status: 'Created',
      msg: `Successfully created new user: ${userRecord.uid}`,
      user: userRecord
    }
    console.log(result);
    return result;
  }).catch(error => {
    console.error(error);
    throw new functions.https.HttpsError('not-found', error);
  });
});

exports.updateUser = functions.https.onCall(data => {
  const { uid, email, password, disabled } = data;

  if(!uid || !email){
    throw new functions.https.HttpsError('invalid-argument', 'Parameters invalid!');
  }

  const updateData: {email: string; disabled: boolean; password?: any;} = {
    email: email,
    disabled: disabled
  };
  if(password){
    updateData.password = password;
  }

  return admin.auth().updateUser(uid, updateData).then(userRecord => {
    const result = {
      status: 'Updated',
      msg: `Successfully updated user: ${userRecord.uid}`
    }
    console.log(result);
    return result;
  }).catch(error => {
    console.error(error);
    throw new functions.https.HttpsError('not-found', error);
  });
});

exports.deleteUser = functions.https.onCall(data => {
  const { uid } = data;

  if(!uid){
    throw new functions.https.HttpsError('invalid-argument', 'Parameters invalid!');
  }

  return admin.auth().deleteUser(uid).then(_ => {
    const result = {
      status: 'Updated',
      msg: `Successfully deleted user: ${uid}`
    }
    console.log(result);
    return result;
  }).catch(error => {
    console.error(error);
    throw new functions.https.HttpsError('not-found', error);
  });
});