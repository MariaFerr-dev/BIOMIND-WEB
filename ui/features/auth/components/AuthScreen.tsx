import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated as RNAnimated, Easing, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import InicioIllustration from '../../../assets/images/inicio.svg';
import IngresoIllustration from '../../../assets/images/ingreso.svg';
import { authScreenStyles } from '../styles/authScreen.styles';
import type {
  AuthAlert,
  AuthView,
  PendingVerification,
  ShowAuthAlertInput,
} from '../types';
import { AuthAlertStack } from './AuthAlertStack';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { VerifyEmailForm } from './VerifyEmailForm';
import { WelcomeView } from './WelcomeView';

const biomindLogo = require('../../../assets/images/biomind-logo.png');

export function AuthScreen() {
  const viewport = useWindowDimensions();
  const height = viewport.height;
  const width = Math.min(viewport.width, 1280);
  const desktop = Platform.OS === 'web' && viewport.width >= 900;
  const router = useRouter();
  const [vista, setVista] = useState<AuthView>('bienvenida');
  const [welcomeLogoY, setWelcomeLogoY] = useState<number | null>(null);
  const [pendingVerification, setPendingVerification] = useState<PendingVerification | null>(null);
  const [prefilledEmail, setPrefilledEmail] = useState('');
  const [alerts, setAlerts] = useState<AuthAlert[]>([]);
  const introHasPlayed = useRef(false);
  const alertTimeouts = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const [fontsLoaded] = useFonts({
    SulphurPoint: require('../../../assets/fonts/SulphurPoint-Light.ttf'),
    SulphurPointBold: require('../../../assets/fonts/SulphurPoint-Bold.ttf'),
    PoppinsRegular: require('../../../assets/fonts/Poppins-Regular.ttf'),
    PoppinsMedium: require('../../../assets/fonts/Poppins/Poppins-Medium.ttf'),
    PoppinsSemiBold: require('../../../assets/fonts/Poppins/Poppins-SemiBold.ttf'),
  });

  const imageIOpacity = useRef(new RNAnimated.Value(1)).current;
  const imageSOpacity = useRef(new RNAnimated.Value(0)).current;
  const titleTranslateY = useRef(new RNAnimated.Value(0)).current;
  const titleOpacity = useRef(new RNAnimated.Value(1)).current;
  const titleScale = useRef(new RNAnimated.Value(1)).current;
  const welcomeLogoOpacity = useRef(new RNAnimated.Value(0)).current;
  const panelTranslateY = useRef(new RNAnimated.Value(height)).current;
  const panelOpacity = useRef(new RNAnimated.Value(0)).current;
  const cardHeight = useRef(new RNAnimated.Value(height * 0.54)).current;
  const lastViewport = useRef({ height, desktop });

  const heights: Record<AuthView, number> = {
    bienvenida: height * 0.54,
    login: height * 0.58,
    register: height * 0.9,
    verify: height * 0.64,
  };

  useEffect(() => {
    if (lastViewport.current.height !== height || lastViewport.current.desktop !== desktop) {
      cardHeight.setValue(heights[vista]);
      lastViewport.current = { height, desktop };
    }
  }, [cardHeight, desktop, height, heights, vista]);

  const dismissAlert = (id: string) => {
    const timeoutId = alertTimeouts.current[id];

    if (timeoutId) {
      clearTimeout(timeoutId);
      delete alertTimeouts.current[id];
    }

    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const showAlert = ({ durationMs = 4200, ...input }: ShowAuthAlertInput) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    setAlerts((prev) => [...prev, { id, ...input }]);
    alertTimeouts.current[id] = setTimeout(() => dismissAlert(id), durationMs);
  };

  useEffect(() => {
    return () => {
      Object.values(alertTimeouts.current).forEach(clearTimeout);
    };
  }, []);

  const cambiarVista = (nueva: AuthView) => {
    if (desktop) {
      setVista(nueva);
      return;
    }

    RNAnimated.timing(cardHeight, {
      toValue: height * 0.15,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setVista(nueva);
      RNAnimated.timing(cardHeight, {
        toValue: heights[nueva],
        duration: 400,
        useNativeDriver: false,
      }).start();
    });
  };

  useEffect(() => {
    if (welcomeLogoY === null || introHasPlayed.current) {
      return;
    }

    const initialLogoTop = 100;
    const initialLogoSize = 67;
    const targetLogoSize = 52;
    const finalCardTop = height - heights.bienvenida;
    const finalLogoTop = finalCardTop + welcomeLogoY + 13;
    const logoTravelDistance = finalLogoTop - initialLogoTop;
    let isCancelled = false;

    titleTranslateY.setValue(0);
    titleOpacity.setValue(1);
    titleScale.setValue(1);
    welcomeLogoOpacity.setValue(0);
    imageIOpacity.setValue(1);
    imageSOpacity.setValue(0);
    panelTranslateY.setValue(height);
    panelOpacity.setValue(0);

    const startTimer = setTimeout(() => {
      if (isCancelled) {
        return;
      }

      introHasPlayed.current = true;

      RNAnimated.parallel([
        RNAnimated.timing(titleTranslateY, {
          toValue: logoTravelDistance,
          duration: 2400,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        RNAnimated.timing(titleScale, {
          toValue: targetLogoSize / initialLogoSize,
          duration: 2600,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        RNAnimated.sequence([
          RNAnimated.delay(2400),
          RNAnimated.timing(titleOpacity, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
        RNAnimated.sequence([
          RNAnimated.delay(2400),
          RNAnimated.timing(welcomeLogoOpacity, {
            toValue: 1,
            duration: 420,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
        RNAnimated.timing(imageIOpacity, {
          toValue: 0,
          duration: 2800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        RNAnimated.sequence([
          RNAnimated.delay(300),
          RNAnimated.timing(imageSOpacity, {
            toValue: 1,
            duration: 1500,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
        RNAnimated.timing(panelTranslateY, {
          toValue: 0,
          duration: 1500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        RNAnimated.timing(panelOpacity, {
          toValue: 1,
          duration: 1300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }, 500);

    return () => {
      isCancelled = true;
      clearTimeout(startTimer);
    };
  }, [
    heights.bienvenida,
    imageIOpacity,
    imageSOpacity,
    panelOpacity,
    panelTranslateY,
    titleOpacity,
    titleScale,
    titleTranslateY,
    welcomeLogoOpacity,
    welcomeLogoY,
  ]);

  const handleAuthenticated = () => {
    router.replace('/dashboard/dashboard');
  };

  const handleRegistered = (pending: PendingVerification) => {
    setPendingVerification(pending);
    setPrefilledEmail(pending.correo);
    cambiarVista('verify');
  };

  const handleRequiresVerification = (pending: PendingVerification) => {
    setPendingVerification(pending);
    setPrefilledEmail(pending.correo);
    cambiarVista('verify');
  };

  const handleReadyToLogin = (correo: string) => {
    setPrefilledEmail(correo);
    setPendingVerification(null);
    cambiarVista('login');
  };

  const handleVerificationBack = () => {
    if (pendingVerification?.correo) {
      setPrefilledEmail(pendingVerification.correo);
    }

    setPendingVerification(null);
    cambiarVista('login');
  };

  if (!fontsLoaded) {
    return null;
  }

  if (desktop) {
    return (
      <View style={webStyles.page}>
        <AuthAlertStack alerts={alerts} onDismiss={dismissAlert} />
        <View style={webStyles.shell}>
          <View style={webStyles.art}>
            <IngresoIllustration width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
          </View>

          <ScrollView style={webStyles.formPane} contentContainerStyle={webStyles.formScroll}>
            <View style={webStyles.formHeader}>
              <a href="/" style={{ color: '#117C72', fontFamily: 'SulphurPointBold', textDecoration: 'none', fontSize: 15 }}>Volver al inicio</a>
              <View style={webStyles.headerBrandWrap}>
                <Image source={biomindLogo} resizeMode="contain" style={webStyles.headerLogo} />
              </View>
            </View>

            <View style={[webStyles.form, vista === 'register' ? webStyles.registerForm : null]}>
              {vista === 'bienvenida' && <WelcomeView onGoLogin={() => cambiarVista('login')} onGoRegister={() => cambiarVista('register')} />}
              {vista === 'login' && <LoginForm onBack={() => cambiarVista('bienvenida')} onGoRegister={() => cambiarVista('register')} onAuthenticated={handleAuthenticated} onRequiresVerification={handleRequiresVerification} showAlert={showAlert} initialEmail={prefilledEmail} />}
              {vista === 'register' && <RegisterForm onBack={() => cambiarVista('bienvenida')} onGoLogin={() => cambiarVista('login')} onRegistered={handleRegistered} showAlert={showAlert} />}
              {vista === 'verify' && <VerifyEmailForm pendingVerification={pendingVerification} onBack={handleVerificationBack} onAuthenticated={handleAuthenticated} onReadyToLogin={handleReadyToLogin} showAlert={showAlert} />}
            </View>

            <View style={webStyles.formFooter}>
              <Text style={webStyles.footerText}>Laboratorio, aprendizaje y trazabilidad para cada rol de BioMind.</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }

  return (
    <View style={authScreenStyles.container}>
      <AuthAlertStack alerts={alerts} onDismiss={dismissAlert} />

      <RNAnimated.View style={[authScreenStyles.imageI, { width, height: height * 0.85, opacity: imageIOpacity }]}>
        <InicioIllustration width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
      </RNAnimated.View>
      <RNAnimated.View style={[authScreenStyles.imageS, { width, height: height * 0.59, opacity: imageSOpacity }]}>
        <IngresoIllustration width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
      </RNAnimated.View>
      <RNAnimated.Text
        style={[
          authScreenStyles.logoText,
          {
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslateY }, { scale: titleScale }],
          },
        ]}>
        BIOMIND
      </RNAnimated.Text>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
        style={authScreenStyles.keyboardAvoider}>
        <RNAnimated.View
          style={[
            authScreenStyles.panelWrapper,
            {
              opacity: panelOpacity,
              transform: [{ translateY: panelTranslateY }],
            },
          ]}>
        <RNAnimated.View style={[authScreenStyles.card, { height: cardHeight }]}>
          {vista === 'bienvenida' && (
            <WelcomeView
              onGoLogin={() => cambiarVista('login')}
              onGoRegister={() => cambiarVista('register')}
              onLogoLayout={setWelcomeLogoY}
              showLogo
              logoOpacity={welcomeLogoOpacity}
            />
          )}

          {vista === 'login' && (
            <LoginForm
              onBack={() => cambiarVista('bienvenida')}
              onGoRegister={() => cambiarVista('register')}
              onAuthenticated={handleAuthenticated}
              onRequiresVerification={handleRequiresVerification}
              showAlert={showAlert}
              initialEmail={prefilledEmail}
            />
          )}

          {vista === 'register' && (
            <RegisterForm
              onBack={() => cambiarVista('bienvenida')}
              onGoLogin={() => cambiarVista('login')}
              onRegistered={handleRegistered}
              showAlert={showAlert}
            />
          )}

          {vista === 'verify' && (
            <VerifyEmailForm
              pendingVerification={pendingVerification}
              onBack={handleVerificationBack}
              onAuthenticated={handleAuthenticated}
              onReadyToLogin={handleReadyToLogin}
              showAlert={showAlert}
            />
          )}
        </RNAnimated.View>
      </RNAnimated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const webStyles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F1FAF6', padding: 28 },
  shell: {
    flex: 1,
    width: '100%',
    maxWidth: 1180,
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#075D55',
    shadowOpacity: 0.14,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 18 },
  },
  art: {
    width: '48%',
    minWidth: 0,
    backgroundColor: '#D7F4EA',
    overflow: 'hidden',
  },
  formPane: { flex: 1, minWidth: 0, backgroundColor: '#FBFFFD' },
  formScroll: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 42,
    paddingHorizontal: 54,
    gap: 32,
  },
  formHeader: {
    width: '100%',
    maxWidth: 500,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerBrandWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerLogo: {
    height: 34,
    width: 34,
  },
  form: { width: '100%', maxWidth: 440, alignSelf: 'center', minHeight: 0 },
  registerForm: { maxWidth: 500 },
  formFooter: { width: '100%', maxWidth: 500, alignItems: 'center' },
  footerText: { color: '#66847C', fontFamily: 'PoppinsRegular', fontSize: 14, lineHeight: 21, textAlign: 'center' },
});
