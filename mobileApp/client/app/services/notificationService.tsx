import * as Notifications from 'expo-notifications';

// Call this once on app startup (in your root component or app entry)
export const requestNotificationPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    console.warn('Notification permission not granted');
  }
};

// Controls how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,  // the pop-up that appears at the top of the screen
    shouldShowList: true,    // whether it appears in the notification centre/tray
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const sendZoneNotification = async (zoneName: string) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: zoneName === 'Outside Safe Zones'
        ? '⚠️ Zone Alert'
        : '📍 Zone Updated',
      body: zoneName === 'Outside Safe Zones'
        ? 'You have left all safe zones.'
        : `You are now in: ${zoneName}`,
      sound: true,
    },
    trigger: null, // null = deliver immediately
  });
};