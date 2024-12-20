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

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options,
      });

      if (error) {
        Alert.alert('Error al registrar', error.message);
        return;
      }

      Alert.alert(
        'Registro exitoso',
        'Revisa tu correo para confirmar tu cuenta.'
      );
    } catch (error) {
      console.error('Error inesperado al registrar:', error);
      Alert.alert('Ocurrió un error inesperado al registrar');
    } finally {
      setLoading(false);
    }
  };

  const handleLogIn = async (credentials: SignInWithPasswordCredentials) => {
    if (!('email' in credentials)) return;
    setLoading(true);
    const { email, password } = credentials;

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert('Error al iniciar sesión', error.message);
        return;
      }
    } catch (error) {
      console.error('Error inesperado al iniciar sesión:', error);
      Alert.alert('Ocurrió un error inesperado al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm loading={loading} onSignUp={handleSignUp} onLogin={handleLogIn} />
  );
}
