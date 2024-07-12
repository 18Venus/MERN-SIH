import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = ({ userId }) => {
    const [profileData, setProfileData] = useState(null);
    const [editUserNameMode, setEditUserNameMode] = useState(false);
    const [editProfileImageMode, setEditProfileImageMode] = useState(false);
    const [newProfileImage, setNewProfileImage] = useState(null);
    const [newUserName, setNewUserName] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/profile/${userId}`);
                setProfileData(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, [userId]);

    const handleEditUserNameClick = () => {
        setEditUserNameMode(true);
        setNewUserName(profileData.userName);
    };

    const handleEditProfileImageClick = () => {
        setEditProfileImageMode(true);
        setNewProfileImage(null);
    };

    const handleCancelEdit = () => {
        setEditUserNameMode(false);
        setEditProfileImageMode(false);
    };

    const handleProfileImageChange = (event) => {
        setNewProfileImage(event.target.files[0]);
    };

    const handleUserNameChange = (event) => {
        setNewUserName(event.target.value);
    };

    const handleSaveUserNameChanges = async () => {
        try {
            const response = await axios.patch(`http://localhost:3000/profile/name/${userId}`, {
                userName: newUserName
            });
            setProfileData(response.data);
            setEditUserNameMode(false);
        } catch (error) {
            console.error('Error updating profile name:', error);
        }
    };

    const handleSaveProfileImageChanges = async () => {
        try {
            const formData = new FormData();
            formData.append('profileImage', newProfileImage);

            const response = await axios.patch(`http://localhost:3000/profile/image/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setProfileData(response.data);
            setEditProfileImageMode(false);
        } catch (error) {
            console.error('Error updating profile image:', error);
        }
    };

    // Constructing image path based on server configuration
    const imagePath = profileData ? `${profileData.profileImage}` : '';

    return (
        <div className="container mx-auto px-5 lg:px-30 py-8">
           
            {profileData ? (
                <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="p-4">
                        <img src={`http://localhost:3000/${profileData.profileImage}`} alt="Profile" className="w-36 h-36 md:w-48 md:h-48 rounded-full object-cover mx-auto" />

                        <h2 className="text-2xl font-bold mt-4 text-center">{profileData.userName}</h2>
                        <h2 className="text-xl mt-4 text-center">Email: {profileData.userEmail}</h2>
                        {!editUserNameMode ? (
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mt-4 rounded block w-full"
                                onClick={handleEditUserNameClick}
                            >
                                Edit Username
                            </button>
                        ) : (
                            <div>
                                <input
                                    type="text"
                                    value={newUserName}
                                    onChange={handleUserNameChange}
                                    className="border border-gray-300 rounded-md px-3 py-2 mt-2 w-full"
                                    placeholder="New Username"
                                />
                                <div className="mt-4">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2"
                                        onClick={handleSaveUserNameChanges}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                        onClick={handleCancelEdit}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                        {!editProfileImageMode ? (
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mt-4 rounded block w-full"
                                onClick={handleEditProfileImageClick}
                            >
                                Edit Profile Image
                            </button>
                        ) : (
                            <div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProfileImageChange}
                                    className="mt-4"
                                />
                                <div className="mt-4">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2"
                                        onClick={handleSaveProfileImageChanges}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                        onClick={handleCancelEdit}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <p>Loading profile...</p>
            )}
        </div>
    );
};

export default Profile;
