import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
    updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

// This is the hook that child components use to get the auth context
export function useAuth() {
    return useContext(AuthContext);
}

// This is the provider component
export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authToken, setAuthToken] = useState(null);

    // create new user with email and password
    async function signup(email, password, firstName, lastName, bvn) {
    try {
    //create user in firebase auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

    // update user credential with display name
        await updateProfile(user, {
            displayName: `${firstName} ${lastName}`
        });

    // create user document in firestore
    await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        email,
        bvn,
        role: "customer", // this is the default role
        createdAt: new Date(),
        accountNumber: generateAccountNumber(),
        balance: 0
    });
    
    return userCredential;
    } catch (error) {
    throw error;
    }
    }

    // sign in user with email and password

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    // sign in with Google
    async function signInWithGoogle() {
        try {
            const provider =  new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // check if user documents exists
            const userDoc = await getDoc(doc(db, "users", user.uid));

            if (!userDoc.exists()) {
                // first time login, create user document
                const names = user.displayName ? user.displayName.split(" ") : ["", ""];
                const firstName = names[0] || "";
                const lastName = names.slice(1).join(" ") || "";

                await setDoc(doc(db, "users", user.uid), {
                    firstName,
                    lastName,
                    email: user.email,
                    role: "customer",
                    createdAt: new Date(),
                    accountNumber: generateAccountNumber(),
                    balance: 0
                });
            }
            return result;
        } catch (error) {
            throw error;
        }
    }
    // sign in with Facebook
    async function signInWithFacebook() {
        try {
            const provider = new FacebookAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // check if user document exists
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (!userDoc.exists()) {
                // first time facebook login, create user document
                const names = user.displayName ? user.displayName.split(" ") : ["", ""];
                const firstName = names[0] || "";
                const lastName = names.slice(1).join(" ") || "";

                await setDoc(doc(db, "users", user.id), {
                    firstName,
                    lastName,
                    email: user.email,
                    role: "customer",
                    createdAt: new Date(),
                    accountNumber: generateAccountNumber(),
                    balance: 0
                });
            }

            return result;
        } catch (error) {
            throw error;
        }
    }

    // log out
    function logout() {
        setAuthToken(null);
        return signOut(auth);
    }

    // reset password
    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email);
    }

    // get the id token for API calls
    async function getIdToken() {
        if (!currentUser) return null;
        try {
            const token = await currentUser.getIdToken();
            setAuthToken(token);
            return token;
        } catch (error) {
            console.error("Error getting token:", error);
            return null;
        }  
    }

    // helper function to generate account number
    function generateAccountNumber() {
        return Math.floor(1000000000 + Math.random() * 9000000000).toString();
    }

    // check if user has a specific role
    function hasRole(role) {
        return userRole === role;
    }

    // load user data from firestore
    async function loadUserData(uid) {
        try {
            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setUserRole(userData.role);
                return userData;
            }
            return null;
        } catch (error) {
            console.error("Error loading user data:", error);
            return null;
        }
    }
    // Observer auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (user) {
                await loadUserData(user.uid);
                await getIdToken();
            } else {
                setUserRole(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userRole,
        authToken,
        signup,
        login,
        logout,
        resetPassword,
        getIdToken,
        signInWithGoogle,
        signInWithFacebook,
        hasRole
    };
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
    }
