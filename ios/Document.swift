//
//  Document.swift
//  plottr_native
//
//  Created by Cameron Sutter on 2/9/18.
//  Copyright © 2018 C Louis S. All rights reserved.
//

import UIKit

class PlottrDocument: UIDocument {

  var stringData = ""

  func stringContents() -> String {
    return stringData
  }

  func updateStringContents(data: String) {
    stringData = data
  }

  // save
  override func contents(forType typeName: String) throws -> Any {
    return stringData.data(using: .utf8)!
  }

  // read
  override func load(fromContents contents: Any, ofType typeName: String?) throws {
    stringData = String(data: contents as! Data, encoding: .utf8)!
  }
}


