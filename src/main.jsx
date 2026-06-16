import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import Dashboard from "./Dashboard.jsx";
import { supabase, fetchData } from "./data.js";
import "./styles.css";

function App() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setLoading(false);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchData(user).then((d) => {
      setData(d);
      setLoading(false);
    });
  }, [user]);

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#14110D", color:"#F2EBDD", fontFamily:"sans-serif" }}>
      Loading…
    </div>
  );

  if (!user) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContt:"center", height:"100vh", background:"#14110D", color:"#F2EBDD", fontFamily:"sans-serif", gap:"16px" }}>
      <div style={{ fontSize:"28px", fontWeight:"700" }}>Moodbase</div>
      <button onClick={() => supabase.auth.signInWithOAuth({ provider:"google", options:{ redirectTo: window.location.href } })}
        style={{ background:"#C8552A", color:"#fff", border:"none", padding:"12px 24px", borderRadius:"10px", fontSize:"15px", cursor:"pointer" }}>
        Sign in with Google
      </button>
    </div>
  );

  if (!data) return null;

  return (
    <Dashboard
      projects={data.projects}
      tags={data.tags}
      saves={data.saves}
      signature={data.SIGNATURE}
    />
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode><App /></React.StrictMode>
);
