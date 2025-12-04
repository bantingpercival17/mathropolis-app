
npm run build
npx cap copy android
npx cap run android



# First option to build a Mobile Application
npm run build
npx cap copy
cd android
./gradlew assembleDebug

#Second option is on android studio
npx cap open android

# Add on android/app/src/main/AndroidManifest.xml

<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />