import { Button } from "flowbite-react";
import React from "react";
import { AiFillGooglePlusCircle } from "react-icons/ai";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

export default function Oauth() {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.getCustomParameters({ prompt: "select_account" });
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);

      const idToken = await resultsFromGoogle.user.getIdToken();

      const res = await fetch("http://localhost:3000/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          photoUrl: resultsFromGoogle.user.photoURL,
          idToken,
        }),
        credentials: "include",
      });
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (res.ok) {
          dispatch(signInSuccess(data));
          navigate("/");
        } else {
          console.error("Erreur de l'API:", data.message);
        }
      } else {
        const text = await res.text(); // Obtenez le texte brut de la réponse
        console.error("Réponse inattendue du serveur :", text);
      }

      // const data = await res.json();
      // if (res.ok) {
      //   dispatch(signInSuccess(data));
      //   navigate("/");
      // }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Button
      gradientDuoTone="pinkToOrange"
      outline
      type="button"
      onClick={handleGoogleClick}
    >
      <AiFillGooglePlusCircle className="w-6 h-6 mr-2" />
      <span> Continue with Google</span>
    </Button>
  );
}
