//
//  ReactNativeEventEmitter.swift
//  plottr_native
//
//  Created by Cameron Sutter on 2/28/18.
//  Copyright © 2018 C Louis S. All rights reserved.
//
//  ReactNativeEventEmitter.swift
//

import Foundation
import React

@objc(ReactNativeEventEmitter)
open class ReactNativeEventEmitter: RCTEventEmitter {

  override init() {
    super.init()
    EventEmitter.sharedInstance.registerEventEmitter(eventEmitter: self)
  }

  /// Base overide for RCTEventEmitter.
  ///
  /// - Returns: all supported events
  @objc open override func supportedEvents() -> [String] {
    return EventEmitter.sharedInstance.allEvents
  }

}
