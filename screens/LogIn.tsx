import React, { useState } from 'react';
import AuthForm from '@/components/AuthForm';
import {
  SignUpWithPasswordCredentials,
  SignInWithPasswordCredentials,
} from '@supabase/supabase-js';
import { Alert } from 'react-native';
import supabaseClient, {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
} from '@/api/supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // Importamos AxiosError para el manejo adecuado del error

export default function LogIn() {
  const [loading, setLoading] = useState(false);

  // Función para registrar un usuario
  const handleSignUp = async (credentials: SignUpWithPasswordCredentials) => {
    if (!('email' in credentials)) return;
    setLoading(true);
    const { email, password, options } = credentials;

    try {
      // Solicitud POST para registrar un usuario
      const { data } = await supabaseClient.post('/../../auth/v1/signup', {
        email,
        password,
        ...options,
      });

      console.log('Usuario registrado:', data);
      // Aquí puedes realizar cualquier acción después del registro, como redirigir o mostrar un mensaje
    } catch (error) {
      // Manejamos los errores correctamente
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Error al registrar';
        Alert.alert(message);
      } else {
        Alert.alert('Error en la conexión');
      }
    }

    setLoading(false);
  };

  // Función para iniciar sesión
  const handleLogIn = async (credentials: SignInWithPasswordCredentials) => {
    if (!('email' in credentials)) return;
    setLoading(true);
    const { email, password } = credentials;

    try {
      // Solicitud POST para obtener el token de sesión
      const { data } = await axios.post(
        `${SUPABASE_URL}/auth/v1/token`,
        {
          email,
          password,
          grant_type: 'password', // Asegúrate de incluir el parámetro 'grant_type' para el flujo de contraseña
        },
        {
          headers: {
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`, // Añadimos la anon key en los headers
            'Content-Type': 'application/json', // Tipo de contenido correcto
          },
        }
      );

      if (data && data.access_token) {
        await AsyncStorage.setItem('access_token', data.access_token);
        console.log('JWT guardado:', data.access_token);
        Alert.alert('Inicio de sesión exitoso');
      } else {
        Alert.alert('Error al iniciar sesión');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || 'Error al iniciar sesión';
        Alert.alert(message);
      } else {
        Alert.alert('Error en la conexión');
      }
    }

    setLoading(false);
  };

  return (
    <AuthForm loading={loading} onSignUp={handleSignUp} onLogin={handleLogIn} />
  );
}
