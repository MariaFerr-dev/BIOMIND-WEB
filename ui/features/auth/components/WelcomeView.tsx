import { MaterialIcons } from '@expo/vector-icons';
import { Animated as RNAnimated, Platform, Text, TouchableOpacity, View } from 'react-native';
import { authScreenStyles } from '../styles/authScreen.styles';
import type { WelcomeViewProps } from '../types';

export function WelcomeView({
  onGoLogin,
  onGoRegister,
  onLogoLayout,
  showLogo = true,
  logoOpacity = 1,
}: WelcomeViewProps) {
  return (
    <View style={authScreenStyles.vistaContainer}>
      <Text style={authScreenStyles.panelTitle}>Bienvenid@ a</Text>
      <View
        onLayout={(event) => {
          onLogoLayout?.(event.nativeEvent.layout.y);
        }}>
        <RNAnimated.Text
          style={[
            authScreenStyles.panelTitle,
            {
              fontSize: 52,
              marginTop: 1.5,
              opacity: showLogo ? logoOpacity : 0,
            },
          ]}>
          BIOMIND
        </RNAnimated.Text>
      </View>
      <Text style={[authScreenStyles.saludo, Platform.OS === 'web' ? { fontSize: 17, lineHeight: 26, marginTop: 9 } : { fontSize: 16, marginTop: 9 }]}>
        {Platform.OS === 'web'
          ? 'Un espacio para aprender, registrar tus prácticas y avanzar con trazabilidad en biotecnología vegetal.'
          : `Un espacio hecho para ti,\ndonde podrás aprender,\nregistrar tus prácticas y crecer\nen la biotecnología vegetal.`}
      </Text>
      <Text style={[authScreenStyles.saludodos, Platform.OS === 'web' ? { fontSize: 16, lineHeight: 24, marginTop: 10 } : { fontSize: 16, marginTop: 9 }]}>
        {Platform.OS === 'web' ? 'Elige cómo quieres ingresar a BioMind.' : `Disfruta tu proceso y avanza\na tu ritmo.`}
      </Text>

      <TouchableOpacity onPress={onGoLogin} style={authScreenStyles.buttonLogin}>
        <View style={authScreenStyles.buttonContent}>
          <MaterialIcons name="login" size={20} color="#FFF" />
          <Text style={authScreenStyles.buttonTextLogin}>Iniciar sesión</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={onGoRegister} style={authScreenStyles.buttonRegister}>
        <View style={authScreenStyles.buttonContent}>
          <MaterialIcons name="person-add" size={20} color="#2FC4B1" />
          <Text style={authScreenStyles.buttonTextRegister}>Registrarse</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
