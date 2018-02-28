//
//  ReactNativeEventEmitter.m
//  plottr_native
//
//  Created by Cameron Sutter on 2/28/18.
//  Copyright © 2018 C Louis S. All rights reserved.
//
//  ReactNativeEventEmitter.m
// See: http://facebook.github.io/react-native/releases/0.43/docs/native-modules-ios.html#exporting-swift
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(ReactNativeEventEmitter, RCTEventEmitter)

RCT_EXTERN_METHOD(supportedEvents)

@end
