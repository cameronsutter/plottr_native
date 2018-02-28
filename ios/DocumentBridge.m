//
//  DocumentBridge.m
//  plottr_native
//
//  Created by Cameron Sutter on 2/27/18.
//  Copyright © 2018 C Louis S. All rights reserved.
//

#import <Foundation/Foundation.h>

#import <React/RCTBridge.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTRootView.h>
//#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(DocumentViewController, NSObject)

RCT_EXTERN_METHOD(updateDocument:(NSString *)fileName data:(NSString *)data)

RCT_EXTERN_METHOD(closeDocument:(NSString *)fileName)

@end
