"use client";
import { profileType, ProfileUpdate } from '@/types/profile';
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
type ProfileContextType = {
    profile: profileType | null;
    loading: boolean;
    error: string | null;
    updateProfile: (newProfile: ProfileUpdate) => Promise<ProfileUpdate>;
    refreshProfile: () => void;
    fetchProfile: () => Promise<void>;
};

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Custom hook to use the ProfileContext
export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};

function ProfileProvider({ children }: { children: React.ReactNode }) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch profile data from API
    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/profile');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const profileData = await response.json();
            setProfile(profileData);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            console.error('Error fetching profile:', err);
        } finally {
            setLoading(false);
        }
    };

    // Update profile data
    const updateProfile = async (newProfile: ProfileUpdate) => {
        try {
            setError(null);

            const response = await fetch('/api/profile/update', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProfile),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const updatedProfile = await response.json();
            setProfile(updatedProfile);
            return updatedProfile;
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            console.error('Error updating profile:', err);
            throw err;
        }
    };

    // Refresh profile data
    const refreshProfile = () => {
        fetchProfile();
    };


    // Fetch profile on component mount
    useEffect(() => {
        fetchProfile();
    }, []);

    const value = {
        profile,
        loading,
        error,
        updateProfile,
        refreshProfile,
        fetchProfile,
    };

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
}

export default ProfileProvider;