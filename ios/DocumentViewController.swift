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

  override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated)

    // Access the document
    document?.open(completionHandler: { (success) in
      if success {
        // Display the content of the document
        // debug
//        let jsCodeLocation = URL(string: "http://localhost:8081/index.bundle?platform=ios")

        // release
        let jsCodeLocation = URL(string: "main.jsbundle")

        let initialData:NSDictionary = [
          "documentURL": (self.document?.fileURL)!.absoluteString,
          "data": self.document?.stringContents() ?? "",
        ]

        self.document?.close(completionHandler: nil)

        let rootView = RCTRootView(
          bundleURL: jsCodeLocation,
          moduleName: "plottr_native",
          initialProperties: initialData as! [AnyHashable : Any],
          launchOptions: nil
        )
        let vc = UIViewController()
        vc.view = rootView
        self.present(vc, animated: true, completion: nil)
      } else {
        // Make sure to handle the failed import appropriately, e.g., by presenting an error message to the user.
      }
    })
  }

  // MARK React Native methods

  @objc func updateDocument(_ fileName: String, data: String) -> Void {
    print("saving!!")
    document?.updateStringContents(data: data)
    document?.save(to: (document?.fileURL)!, for: UIDocumentSaveOperation.forOverwriting, completionHandler: nil)
  }

  @objc func closeDocument(_ fileName: String) -> Void {
    print("closing!! \(document?.fileURL.absoluteString ?? "no document")")
    let url = URL(fileURLWithPath: fileName)
    document = PlottrDocument(fileURL: url)
    print("with doc \(document?.fileURL.absoluteString ?? "no document")")
    performSegue(withIdentifier: "backToDocBrowser", sender: nil)

//    document?.close(completionHandler: { (success) in
//      print("now closed!!")
////      let vc = UIViewController()
////      vc.view = UIView()
////      self.present(vc, animated: true, completion: nil)
//      self.performSegue(withIdentifier: "backToDocBrowser", sender: nil)
//    })
  }
}

