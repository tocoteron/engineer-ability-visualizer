import { useState, useEffect } from "react";
import firebase from "../firebase";

export default function useUser() {
  const [user, setUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    const f = async () => {
      firebase.auth.onAuthStateChanged((user) => {
        if (user) {
          setUser(user);
        } else {
          setUser(null);
        }
      });
    };
    f();
  });

  const create = async (email: string, password: string) => {
    const credential = await firebase.create(email, password);
    setUser(credential.user);
  };

  const login = async (email: string, password: string) => {
    const credential = await firebase.login(email, password);
    setUser(credential.user);
  };

  const logout = async () => {
    await firebase.logout();
    setUser(null);
  };

  return { user, create, login, logout };
}