//
//  DocumentViewController.swift
//  plottr_native
//
//  Created by Cameron Sutter on 2/9/18.
//  Copyright © 2018 C Louis S. All rights reserved.
//

import UIKit
import React

@objc(DocumentViewController)
class DocumentViewController: UIViewController {

  var document: PlottrDocument?
  var vc: UIViewController?
  static var _sharedInstance: DocumentViewController?

  static func setSharedInstance(instance: DocumentViewController?) {
    DocumentViewController._sharedInstance = instance
  }

  static func sharedInstance() -> DocumentViewController? {
    return _sharedInstance
  }

  override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated)

    vc = UIViewController()

    DocumentViewController._sharedInstance = self

    // Access the document
    document?.open(completionHandler: { (success) in
      if success {
        // Display the content of the document
        // debug
//        let jsCodeLocation = URL(string: "http://localhost:8081/index.bundle?platform=ios")
        let jsCodeLocation = URL(string: "http://192.168.120.166:8081/index.bundle?platform=ios")
//        let jsCodeLocation = URL(string: "http://10.0.138.93:8081/index.bundle?platform=ios")

        // release
//        let jsCodeLocation = URL(string: "main.jsbundle")

        let initialData:NSDictionary = [
          "documentURL": (self.document?.fileURL)!.absoluteString,
          "data": self.document?.stringContents() ?? ""
        ]

        let rootView = RCTRootView(
          bundleURL: jsCodeLocation,
          moduleName: "plottr_native",
          initialProperties: initialData as! [AnyHashable : Any],
          launchOptions: nil
        )
        self.vc?.view = rootView
        self.present(self.vc!, animated: true, completion: nil)
      } else {
        // Make sure to handle the failed import appropriately, e.g., by presenting an error message to the user.
        print("failed import")
      }
    })
  }

  // MARK React Native methods

  @objc func updateDocument(_ data: String) -> Void {
    let docViewController = DocumentViewController._sharedInstance
    let doc = docViewController?.document
    doc?.updateStringContents(data: data)
    docViewController?.document?.save(to: (doc?.fileURL)!, for: UIDocumentSaveOperation.forOverwriting, completionHandler: { (saved) in
    })
  }

  @objc func closeDocument() -> Void {
    print(DocumentViewController._sharedInstance ?? "no shared instance")
    let docViewController = DocumentViewController._sharedInstance

    DispatchQueue.main.async {
      self.vc?.removeFromParentViewController()
      self.dismiss(animated: true, completion: {
        docViewController?.document?.close(completionHandler: nil)
      })
      let appDelegate = UIApplication.shared.delegate as! AppDelegate
      appDelegate.openDocumentBrowser()
    }
  }
}

