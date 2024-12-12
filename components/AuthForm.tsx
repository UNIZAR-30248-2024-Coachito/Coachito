import React, { useContext, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import type {
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
} from '@supabase/supabase-js';
import { VStack } from './ui/vstack';
import {
  CircleUserRound,
  AtSignIcon,
  LockKeyhole,
  UserRoundPlus,
  UserRound,
} from 'lucide-react-native';
import { Input, InputField, InputIcon, InputSlot } from './ui/input';
import { EyeIcon, EyeOffIcon } from './ui/icon';
import { Text } from './ui/text';
import { Button } from './ui/button';
import { HStack } from './ui/hstack';
import { ThemeContext } from '@/context/ThemeContext';
import { supabase } from '@/api/supabaseClient';
import PopupBaseModal from './shared/PopupBaseModal';

interface AuthFormProps {
  onSignUp: (credentials: SignUpWithPasswordCredentials) => void;
  onLogin: (credentials: SignInWithPasswordCredentials) => void;
  loading: boolean;
}

export default function AuthForm({
  onSignUp,
  onLogin,
  loading,
}: AuthFormProps) {
  const { colorMode } = useContext(ThemeContext);
  const [mode, setMode] = useState<'login' | 'signUp'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPopUpUpModalVisible, setIsPopUpUpModalVisible] = useState(false);

  const handlePasswordState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };

  const handlePasswordConfirmState = () => {
    setShowConfirmPassword((showState) => {
      return !showState;
    });
  };

  const handleSubmit = () => {
    if (mode === 'login') {
      onLogin({ email, password });
    } else {
      if (password !== confirmPassword) {
        Alert.alert('', 'Las contraseñas no coinciden');
        return;
      }
      onSignUp({ email, password, options: { data: { username } } });
    }
  };

  const resetInputs = () => {
    setUsername('');
    setEmail('');
    setPassword('');
  };

  const componentsPopUpModal: React.ReactNode[] = [
    <Text
      key="1"
      className="text-xl font-bold text-center text-typography-0 mb-4"
    >
      Se le enviará un correo para restablecer la contraseña
    </Text>,
    <Input key="2" className="mb-4">
      <InputSlot className="pl-3">
        <InputIcon as={AtSignIcon} />
      </InputSlot>
      <InputField
        value={email}
        onChangeText={setEmail}
        placeholder="Correo"
        autoCapitalize="none"
        keyboardType="email-address"
      />
    </Input>,
    <Button
      key="3"
      className="bg-blue-500 rounded-lg mb-4"
      onPress={() => {
        supabase.auth.resetPasswordForEmail(email);
        Alert.alert('', 'Correo enviado');
      }}
    >
      <Text className="text-white">Restablecer contraseña</Text>
    </Button>,
    <Button
      key="4"
      className="bg-tertiary-500 rounded-lg"
      onPress={() => {
        setIsPopUpUpModalVisible(false);
      }}
    >
      <Text className="text-white">Cancelar</Text>
    </Button>,
  ];

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <VStack className="p-4 gap-4 flex-1 justify-center items-center">
            {mode === 'signUp' ? (
              <>
                <UserRoundPlus
                  color={`${colorMode === 'light' ? 'black' : 'white'}`}
                  size={100}
                />
                <Text className="text-2xl font-bold mb-4 text-typography-0">
                  Registro
                </Text>
              </>
            ) : (
              <>
                <UserRound
                  color={`${colorMode === 'light' ? 'black' : 'white'}`}
                  size={100}
                />
                <Text className="text-2xl font-bold mb-4 text-typography-0">
                  Inicio de sesión
                </Text>
              </>
            )}
            {mode === 'signUp' && (
              <Input>
                <InputSlot className="pl-3">
                  <InputIcon as={CircleUserRound} />
                </InputSlot>
                <InputField
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Nombre de usuario"
                />
              </Input>
            )}
            <Input>
              <InputSlot className="pl-3">
                <InputIcon as={AtSignIcon} />
              </InputSlot>
              <InputField
                value={email}
                onChangeText={setEmail}
                placeholder="Correo"
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </Input>

            <Input>
              <InputSlot className="pl-3">
                <InputIcon as={LockKeyhole} />
              </InputSlot>
              <InputField
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChangeText={setPassword}
                placeholder="Contraseña"
                autoCapitalize="none"
              />
              <InputSlot className="p-2" onPress={handlePasswordState}>
                <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
              </InputSlot>
            </Input>

            {mode === 'signUp' && (
              <Input>
                <InputSlot className="pl-3">
                  <InputIcon as={LockKeyhole} />
                </InputSlot>
                <InputField
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Repetir la contraseña"
                  autoCapitalize="none"
                />
                <InputSlot className="p-2" onPress={handlePasswordConfirmState}>
                  <InputIcon as={showConfirmPassword ? EyeIcon : EyeOffIcon} />
                </InputSlot>
              </Input>
            )}

            <Button
              onPress={handleSubmit}
              isDisabled={loading || !email || !password}
              className={`${loading || !email || !password ? 'w-full bg-gray-400 rounded-lg' : 'w-full bg-blue-500 rounded-lg'}`}
            >
              <Text className="text-white">
                {mode === 'login' ? 'Iniciar sesión' : 'Registrarse'}
              </Text>
            </Button>

            <HStack className="mt-4 items-center">
              <Text className="text-typography-0">
                {mode === 'login'
                  ? '¿No tiene cuenta?'
                  : '¿Ya tiene una cuenta?'}
              </Text>
              <Button
                onPress={() => {
                  setMode(mode === 'login' ? 'signUp' : 'login');
                  resetInputs();
                }}
                className="bg-transparent"
              >
                <Text className="text-blue-500" underline>
                  {mode === 'login' ? 'Registrarse' : 'Iniciar sesión'}
                </Text>
              </Button>
            </HStack>
            {mode === 'login' && (
              <VStack className="mt-4 items-center">
                <Text className="text-typography-0">
                  ¿Ha olvidado su contraseña?
                </Text>
                <Button
                  onPress={() => {
                    setEmail('');
                    setIsPopUpUpModalVisible(true);
                  }}
                  className="bg-transparent"
                >
                  <Text className="text-blue-500" underline>
                    Restablecer contraseña
                  </Text>
                </Button>
              </VStack>
            )}

            <PopupBaseModal
              components={componentsPopUpModal}
              isVisible={isPopUpUpModalVisible}
              setIsModalVisible={setIsPopUpUpModalVisible}
            />
          </VStack>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
