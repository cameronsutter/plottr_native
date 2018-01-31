[https://facebook.github.io/react-native/docs/running-on-device.html]
[https://help.apple.com/xcode/mac/current/#/dev2539d985f]

1. Info.plist -> App Transport Security -> localhost -> NO
1. Product -> Scheme -> Edit Scheme -> Release
1. AppDelegate.m -> uncomment/comment out jsCodeLocation lines
1. Change Scheme Destination to Generic iOS Device
1. Build
1. Product -> Archive
1. Organizer -> Verify, Upload
