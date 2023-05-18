import React, { useState, useEffect } from 'react';
import { getAuth, signOut, updateProfile } from 'firebase/auth';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { Link, useNavigate } from 'react-router-dom';
import 'styles/ProfilePage.scss';
import { FaPen } from 'react-icons/fa';

const ProfilePage = ({ userObj, setUserObj }) => {
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userObj) {
      setUsername(userObj.displayName);
      setAvatar(userObj.photoURL);
    }
  }, [userObj]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSaveUsername = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      await updateProfile(currentUser, { displayName: username });
      setUserObj({ ...userObj, displayName: username });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setIsUploading(true);
      const storage = getStorage();
      const file = e.target.files[0];
      console.log('Selected file:', file);
      const filename = `${Date.now()}_${file.name}`;
      const fileRef = ref(storage, `images/${filename}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on('state_changed', (snapshot) => {
      }, (error) => {
        console.error(error);
        setIsUploading(false);
      }, async () => {
        const downloadURL = await getDownloadURL(fileRef);
        setAvatar(downloadURL);

        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) {
          await updateProfile(currentUser, { photoURL: downloadURL });
          setUserObj({ ...userObj, photoURL: downloadURL });
        }

        setIsUploading(false);
      });
    }
  };

  const handleLogOut = async () => {
    await signOut(getAuth());
    navigate('/');
  };

  return (
    <>
    <div className="profile_edit_page">
      <h2>프로필 설정</h2>
      <div className="profile_image">
        <label className='blind'>UserProfileImage</label>
        <img src={avatar} alt="Profile" />
        <label htmlFor="file-uploader" className="profile_uploader"> <FaPen/></label>
        <input id="file-uploader" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }}
        />
        {isUploading && <p style={{color: '#fff'}}>업로드 중입니다.</p>}
      </div>
      <div className="edit_name">
        <label className='blind'>UserName</label>
        <input type="text" value={username} onChange={handleUsernameChange} placeholder="프로필 이름" />
        <Link to="/">
          <button onClick={handleSaveUsername}>저장</button>
        </Link>
      </div>
      <button onClick={handleLogOut} className='logout'>로그아웃
      </button>
      {/* <div className='profile_bg'></div> */}
    </div>
    </>

  );
};

export default ProfilePage;

