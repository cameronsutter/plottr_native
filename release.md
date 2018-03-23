[https://facebook.github.io/react-native/docs/running-on-device.html]
[https://help.apple.com/xcode/mac/current/#/dev2539d985f]

1. Info.plist -> App Transport Security -> localhost -> NO
1. Product -> Scheme -> plottr_native_RELEASE
1. DocumentViewController.swift -> uncomment/comment out jsCodeLocation lines
1. Change Scheme Destination to Generic iOS Device
1. Build
1. Product -> Archive
1. Organizer -> Validate, Upload


Change back after release:
1. Change Scheme Destination to iPhone 8
1. DocumentViewController.swift -> uncomment/comment
1. Product -> Scheme -> plottr_native
1. Info.plist -> App Transport Security -> localhost -> YES
