import { Children, type ReactNode } from 'react';
import { useWindowDimensions, View } from 'react-native';

/** Web layout only. Cards keep their original colors, typography and content. */
export function ResponsiveGrid({ children }: { children: ReactNode }) {
  const wide = useWindowDimensions().width >= 900;
  return (
    <View style={{ flexDirection: wide ? 'row' : 'column', flexWrap: 'wrap', gap: 18 }}>
      {Children.toArray(children).map((child, index) => (
        <View key={index} style={{ width: wide ? '48.8%' : '100%', flexGrow: wide ? 1 : 0 }}>
          {child}
        </View>
      ))}
    </View>
  );
}
