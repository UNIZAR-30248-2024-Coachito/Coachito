import React, { useState } from 'react';
import AuthForm from '@/components/AuthForm';
import {
  SignUpWithPasswordCredentials,
  SignInWithPasswordCredentials,
} from '@supabase/supabase-js';
import { Alert } from 'react-native';
import { supabase } from '@/api/supabaseClient';

export default function LogIn() {
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (credentials: SignUpWithPasswordCredentials) => {
    if (!('email' in credentials)) return;
    setLoading(true);
    const { email, password, options } = credentials;
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options,
    });

    if (error) Alert.alert(error.message);

    console.log(data);
    setLoading(false);
  };

  const handleLogIn = async (credentials: SignInWithPasswordCredentials) => {
    if (!('email' in credentials)) return;
    setLoading(true);
    const { email, password } = credentials;
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) Alert.alert(error.message);

    console.log(data);
    setLoading(false);
  };
  return (
    <AuthForm loading={loading} onSignUp={handleSignUp} onLogin={handleLogIn} />
  );
}
