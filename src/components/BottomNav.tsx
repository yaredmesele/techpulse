import { StyleSheet, View as RNView, TouchableOpacity, Text } from 'react-native';
import { Home, Grid, Bookmark, User } from 'lucide-react';
import { View } from '../types';
import { useTheme } from '../context/ThemeContext';

interface BottomNavProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export default function BottomNav({ currentView, onViewChange }: BottomNavProps) {
  const { colors, isDark } = useTheme();
  
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'category', label: 'Category', icon: Grid },
    { id: 'saved', label: 'Saved', icon: Bookmark },
    { id: 'profile', label: 'Profile', icon: User },
  ] as const;

  return (
    <RNView style={[styles.nav, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          onPress={() => onViewChange(tab.id as View)}
          style={styles.tab}
        >
          <RNView style={[
            styles.iconContainer,
            currentView === tab.id && { backgroundColor: `${colors.primary}15` }
          ]}>
            <tab.icon 
              size={22} 
              color={currentView === tab.id ? colors.primary : colors.textSecondary} 
            />
          </RNView>
          <Text style={[
            styles.label,
            { color: currentView === tab.id ? colors.primary : colors.textSecondary }
          ]}>
            {tab.label}
          </Text>
          {currentView === tab.id && (
            <RNView style={[styles.indicator, { backgroundColor: colors.primary }]} />
          )}
        </TouchableOpacity>
      ))}
    </RNView>
  );
}

const styles = StyleSheet.create({
  nav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  tab: {
    alignItems: 'center',
    position: 'relative',
  },
  iconContainer: {
    padding: 8,
    borderRadius: 12,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  indicator: {
    position: 'absolute',
    top: -4,
    width: 4,
    height: 4,
    borderRadius: 2,
  }
});

