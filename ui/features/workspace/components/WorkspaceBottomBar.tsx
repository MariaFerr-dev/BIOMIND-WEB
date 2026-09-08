import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { ComponentProps } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const biomindLogo = require('../../../assets/images/biomind-logo.png');

export type BottomBarIconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type BottomBarTab = {
  id: string;
  icon: BottomBarIconName;
};

export type SideSubmenuItem = {
  id: string;
  icon: BottomBarIconName;
  label: string;
};

type BottomBarTone = {
  activeIcon: string;
  activePill: string;
  centerGradient: [string, string, string, string];
  centerShadow: string;
  inactiveIcon: string;
};

type WorkspaceBottomBarProps = {
  activeTab: string;
  bottomInset: number;
  centerIcon?: BottomBarIconName;
  centerTabId?: string;
  sideSubmenu?: {
    activeId: string;
    items: SideSubmenuItem[];
    onPress: (id: string) => void;
    parentId: string;
  };
  tabs: BottomBarTab[];
  tone?: BottomBarTone;
  onCenterPress: () => void;
  onTabPress: (id: string) => void;
};

const BAR_HEIGHT = 70;
const CENTER_BTN = 70;
const CENTER_RING = 16; // grosor del "gap" entre botón y curva
const BAR_RADIUS = (CENTER_BTN / 4) + CENTER_RING; // radio de las esquinas de la barra
const CURVE_DEPTH = 40; // qué tan profunda es la curva
const CURVE_WIDTH = CENTER_BTN + CENTER_RING * 5; // ancho total de la curva (botón + gap + margen extra para suavizar)
const defaultTone: BottomBarTone = {
  activeIcon: '#2FC4B1',
  activePill: '#2FC4B1',
  centerGradient: ['#B4EFE9', '#2FC4B1', '#2FC4B1', '#117C72'],
  centerShadow: '#2FC4B1',
  inactiveIcon: '#8AA69C',
};

export function WorkspaceBottomBar({
  activeTab,
  bottomInset,
  centerIcon = 'star-outline',
  centerTabId = 'asistente',
  sideSubmenu,
  tabs,
  tone = defaultTone,
  onCenterPress,
  onTabPress,
}: WorkspaceBottomBarProps) {
  const leftTabs = tabs.slice(0, 2);
  const rightTabs = tabs.slice(2, 4);
  const isCenterActive = activeTab === centerTabId;
  const { width } = useWindowDimensions();
  const showSideBar = Platform.OS === 'web' && width >= 760;
  const allTabs = [
    ...leftTabs,
    { id: centerTabId, icon: centerIcon },
    ...rightTabs,
  ];

  if (showSideBar) {
    return (
      <View style={[styles.sideBar, { borderColor: `${tone.activePill}33`, shadowColor: tone.centerShadow }]}>
        <View style={styles.sideHeader}>
          <View style={styles.sideBrandRow}>
            <Image source={biomindLogo} resizeMode="contain" style={styles.sideLogo} />
            <Text style={[styles.sideBrand, { color: tone.activeIcon }]}>BIOMIND</Text>
          </View>
        </View>

        <View style={styles.sideNav}>
          {allTabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <View key={tab.id}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={tabLabels[tab.id] || tab.id}
                  accessibilityState={{ selected: active }}
                  onPress={() => (tab.id === centerTabId ? onCenterPress() : onTabPress(tab.id))}
                  style={[
                    styles.sideTab,
                    active && {
                      backgroundColor: `${tone.activePill}18`,
                      borderColor: `${tone.activePill}55`,
                    },
                  ]}
                >
                <View style={[styles.sideIcon, { backgroundColor: `${tone.activePill}12` }, active && { backgroundColor: tone.activePill }]}>
                    <MaterialCommunityIcons
                      name={tab.icon}
                      size={21}
                      color={active ? '#FFFFFF' : tone.inactiveIcon}
                    />
                  </View>
                  <Text style={[styles.sideText, { color: active ? tone.activeIcon : tone.inactiveIcon }]}>
                    {tabLabels[tab.id] || tab.id}
                  </Text>
                </Pressable>

                {active && sideSubmenu?.parentId === tab.id ? (
                  <View style={styles.sideSubmenu}>
                    {sideSubmenu.items.map((item) => {
                      const subActive = sideSubmenu.activeId === item.id;
                      return (
                        <Pressable
                          key={item.id}
                          accessibilityRole="button"
                          accessibilityLabel={item.label}
                          accessibilityState={{ selected: subActive }}
                          onPress={() => sideSubmenu.onPress(item.id)}
                          style={[styles.sideSubmenuItem, subActive && { backgroundColor: `${tone.activePill}12` }]}
                        >
                          <MaterialCommunityIcons
                            name={item.icon}
                            size={15}
                            color={subActive ? tone.activeIcon : tone.inactiveIcon}
                          />
                          <Text style={[styles.sideSubmenuText, { color: subActive ? tone.activeIcon : tone.inactiveIcon }]}>
                            {item.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, { bottom: Math.max(bottomInset, 12) - 40 }]}>
      {/* Sombra verde suave debajo de la barra */}
      <View style={styles.shadow} />

      {/* Barra con hueco SVG */}
      <BarWithCutout />

      {/* Iconos sobre la barra */}
      <View style={styles.tabRow}>
        {leftTabs.map((tab) => (
          <TabButton
            key={tab.id}
            active={activeTab === tab.id}
            icon={tab.icon}
            tone={tone}
            onPress={() => onTabPress(tab.id)}
          />
        ))}

        {/* Espacio para el botón central */}
        <View style={styles.centerSpace} />

        {rightTabs.map((tab) => (
          <TabButton
            key={tab.id}
            active={activeTab === tab.id}
            icon={tab.icon}
            tone={tone}
            onPress={() => onTabPress(tab.id)}
          />
        ))}
      </View>

      {/* Botón central flotante con brillo */}
      <Pressable
        onPress={onCenterPress}
        style={styles.centerButtonWrap}
      >
        <LinearGradient
          colors={tone.centerGradient}
          locations={[0, 0.25, 0.55, 1]}
          start={{ x: 0.45, y: 0 }}
          end={{ x: 0.7, y: 1 }}
          style={[
            styles.centerButton,
            { shadowColor: tone.centerShadow },
            isCenterActive && styles.centerButtonActive,
          ]}
        >
          {/* Reflejo interno superior */}
          <MaterialCommunityIcons name={centerIcon} size={26} color="#FFF" />
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const tabLabels: Record<string, string> = {
  academico: 'Académico',
  aprendices: 'Aprendices',
  asistente: 'Asistente',
  historial: 'Bitácoras',
  inicio: 'Inicio',
  perfil: 'Perfil',
  proyectos: 'Proyectos',
  seguimiento: 'Seguimiento',
  trimestres: 'Trimestres',
  usuarios: 'Usuarios',
};

/**
 * Barra con hueco circular SVG.
 * Usamos un Path con curvas cúbicas Bezier para el mordisco suave.
 * El ancho se toma del estilo del wrapper (left/right 18px).
 */
function BarWithCutout() {
  // Ancho aproximado de la barra en pantalla
  // (se escala con width: '100%' en el SVG)
  const W = 400; // viewBox width — no importa el valor real, SVG escala
  const H = BAR_HEIGHT;
  const R = BAR_RADIUS;
  const cx = W / 2;
  const holeR = CURVE_WIDTH / 2; // radio del hueco = ancho total de la curva / 2

  // Puntos donde la curva toca la parte superior de la barra
  const leftEdge = cx - holeR;
  const rightEdge = cx + holeR;

  const path = [
    // esquina superior izquierda
    `M ${R} 0`,

    // top line hasta antes de la curva
    `L ${leftEdge} 0`,

    // curva izquierda del notch
    `C ${leftEdge + 40} 0, ${cx - 40} ${CURVE_DEPTH}, ${cx} ${CURVE_DEPTH}`,

    // curva derecha del notch
    `C ${cx + 40} ${CURVE_DEPTH}, ${rightEdge - 40} 0, ${rightEdge} 0`,

    // top line hasta esquina derecha
    `L ${W - R} 0`,

    // esquina superior derecha
    `Q ${W} 0 ${W} ${R}`,

    // lado derecho
    `L ${W} ${H - R}`,

    // esquina inferior derecha
    `Q ${W} ${H} ${W - R} ${H}`,

    // bottom
    `L ${R} ${H}`,

    // esquina inferior izquierda
    `Q 0 ${H} 0 ${H - R}`,

    // lado izquierdo
    `L 0 ${R}`,

    // esquina superior izquierda
    `Q 0 0 ${R} 0`,

    `Z`,
  ].join(' ');

  return (
    <Svg
      width="100%"
      height={BAR_HEIGHT}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={styles.barSvg}
    >
      <Path d={path} fill="#ffffff" />
    </Svg>
  );
}

function TabButton({
  active,
  icon,
  tone,
  onPress,
}: {
  active: boolean;
  icon: BottomBarIconName;
  tone: BottomBarTone;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.tabButton}>
      <MaterialCommunityIcons
        name={icon}
        size={24}
        color={active ? tone.activeIcon : tone.inactiveIcon}
      />
      {active ? <View style={[styles.activePill, { backgroundColor: tone.activePill }]} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sideBar: {
    position: 'absolute',
    left: 30,
    top: 30,
    bottom: 30,
    width: 238,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderColor: '#E2EFEA',
    borderWidth: 1,
    padding: 22,
    shadowColor: '#0B5F55',
    shadowOpacity: 0.1,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 16 },
    elevation: 12,
    zIndex: 20,
  },
  sideHeader: {
    gap: 3,
    marginBottom: 30,
  },
  sideBrandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  sideLogo: {
    height: 38,
    width: 38,
  },
  sideBrand: {
    color: '#117C72',
    fontFamily: 'PoppinsSemiBold',
    fontSize: 26,
    letterSpacing: 0,
  },
  sideCaption: {
    color: '#8AA69C',
    fontFamily: 'PoppinsRegular',
    fontSize: 12,
  },
  sideNav: {
    gap: 8,
  },
  sideSubmenu: {
    borderLeftColor: '#E8EEE9',
    borderLeftWidth: 1,
    gap: 3,
    marginLeft: 30,
    marginTop: 7,
    paddingLeft: 11,
  },
  sideSubmenuItem: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
    minHeight: 34,
    paddingHorizontal: 9,
  },
  sideSubmenuText: {
    flex: 1,
    fontFamily: 'PoppinsMedium',
    fontSize: 11,
    lineHeight: 14,
  },
  sideTab: {
    alignItems: 'center',
    borderColor: 'transparent',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 56,
    paddingHorizontal: 12,
  },
  sideIcon: {
    alignItems: 'center',
    backgroundColor: '#F3FAF7',
    borderRadius: 13,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  sideText: {
    flex: 1,
    fontFamily: 'PoppinsSemiBold',
    fontSize: 13,
  },
  wrapper: {
    position: 'absolute',
    left: 18,
    right: 18,
  },

  shadow: {
    position: 'absolute',
    left: 12,
    right: 12,
    top: 22,
    height: 65,
    borderRadius: 34,
    backgroundColor: 'Transparent',
    opacity: 0.45,
  },

  barSvg: {
    // La barra SVG ocupa su espacio natural
  },
  centerGlow: {
    position: 'absolute',
    width: CENTER_BTN + 20,
    height: CENTER_BTN + 20,
    borderRadius: (CENTER_BTN + 20) / 2,
    backgroundColor: '#2FC4B1',
    opacity: 0.25,
  },

  // Fila de tabs encima del SVG, alineada con la barra
  tabRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },

  centerSpace: {
    width: CENTER_BTN + 20,
  },

  activePill: {
    marginTop: 4,
    width: 16,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#2FC4B1',
  },

  centerButtonWrap: {
    position: 'absolute',
    top: -(CENTER_BTN / 3) - CENTER_RING,
    alignSelf: 'center',
    borderRadius: (CENTER_BTN / 2) + CENTER_RING,
  },

  centerButton: {
    width: CENTER_BTN,
    height: CENTER_BTN,
    borderRadius: CENTER_BTN / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',

    shadowColor: '#2FC4B1',
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 18,
  },

  centerButtonActive: {
    transform: [{ scale: 1.06 }],
  },
});
